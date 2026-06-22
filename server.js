const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const USER_DATA_FILE = process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'user-data.json')
    : path.join(__dirname, 'user-data.json');

// MIME types for static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.geojson': 'application/geo+json',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
};

// Build sorted index of available GeoJSON snapshot years
const GEOJSON_DIR = path.join(__dirname, 'historical-basemaps', 'geojson');
const snapshotIndex = [];

if (fs.existsSync(GEOJSON_DIR)) {
    const files = fs.readdirSync(GEOJSON_DIR);
    for (const file of files) {
        if (!file.startsWith('world_') || !file.endsWith('.geojson')) continue;
        const base = file.replace('world_', '').replace('.geojson', '');
        let year;
        if (base.startsWith('bc')) {
            year = -parseInt(base.replace('bc', ''), 10);
        } else {
            year = parseInt(base, 10);
        }
        if (!isNaN(year)) {
            snapshotIndex.push({ year, filename: file });
        }
    }
    snapshotIndex.sort((a, b) => a.year - b.year);
    console.log(`Loaded ${snapshotIndex.length} GeoJSON snapshots (${snapshotIndex[0]?.year} to ${snapshotIndex[snapshotIndex.length - 1]?.year})`);
}

// Binary search for nearest snapshot year
function findNearestSnapshot(targetYear) {
    if (snapshotIndex.length === 0) return null;
    let lo = 0, hi = snapshotIndex.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (snapshotIndex[mid].year < targetYear) lo = mid + 1;
        else hi = mid;
    }
    // Check if previous entry is closer
    if (lo > 0) {
        const prev = snapshotIndex[lo - 1];
        const curr = snapshotIndex[lo];
        if (Math.abs(prev.year - targetYear) <= Math.abs(curr.year - targetYear)) {
            return prev;
        }
    }
    return snapshotIndex[lo];
}

// Ensure user-data.json exists
if (!fs.existsSync(USER_DATA_FILE)) {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify({
        events: [],
        references: [],
        notes: {},
        rowAssignments: {}
    }, null, 2));
}

const server = http.createServer((req, res) => {
    // Enable CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API: Get user data
    if (req.method === 'GET' && req.url === '/api/data') {
        try {
            const data = fs.readFileSync(USER_DATA_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read data' }));
        }
        return;
    }

    // API: Save user data
    if (req.method === 'POST' && req.url === '/api/data') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(USER_DATA_FILE, JSON.stringify(data, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                console.log(`[${new Date().toLocaleTimeString()}] Data saved`);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // API: Get distinct user names from saved data
    if (req.method === 'GET' && req.url === '/api/users') {
        try {
            const raw = fs.readFileSync(USER_DATA_FILE, 'utf8');
            const data = JSON.parse(raw);
            const users = new Set();
            (data.events || []).forEach(e => { if (e.createdBy) users.add(e.createdBy); });
            (data.entities || []).forEach(e => { if (e.createdBy) users.add(e.createdBy); });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ users: Array.from(users) }));
        } catch (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ users: [] }));
        }
        return;
    }

    // API: List available snapshot years for prefetch
    if (req.method === 'GET' && req.url === '/api/map/snapshots') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ years: snapshotIndex.map(s => s.year) }));
        return;
    }

    // API: Get historical map data for a year
    if (req.method === 'GET' && req.url.match(/^\/api\/map\/-?\d+$/)) {
        const targetYear = parseInt(req.url.split('/').pop(), 10);
        const snapshot = findNearestSnapshot(targetYear);
        if (!snapshot) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No map data available' }));
            return;
        }
        const geoPath = path.join(GEOJSON_DIR, snapshot.filename);
        fs.readFile(geoPath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read map data' }));
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/geo+json',
                    'Cache-Control': 'public, max-age=86400',
                    'X-Snapshot-Year': String(snapshot.year)
                });
                res.end(content);
            }
        });
        return;
    }

    // Serve static files (strip query string, e.g. cache-busting ?v=4)
    let urlPath = req.url.split('?')[0];
    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           World History Timeline Server                    ║
╠════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                  ║
║  Data file: user-data.json                                 ║
║                                                            ║
║  All changes auto-save to user-data.json                   ║
║  Press Ctrl+C to stop                                      ║
╚════════════════════════════════════════════════════════════╝
`);
});
