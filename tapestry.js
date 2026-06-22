// Art Tapestry — a continuous-time timeline of art Luke has consumed.
// Mirrors the World History Timeline: horizontal time axis, 5 region lanes, zoom.
// Regions collapse to a condensed dot-strip (overview) and expand to tiles on click.
// Book series (Discworld, Narnia…) collapse into one chip that expands to members.
// Self-contained; reads art-data.json.

(function () {
    'use strict';

    const REGIONS = [
        { id: 'europe-middle-east', name: 'Europe & Middle East' },
        { id: 'asia', name: 'Asia' },
        { id: 'subsaharan-africa', name: 'Sub-Saharan Africa' },
        { id: 'americas', name: 'The Americas' },
        { id: 'pacific', name: 'Pacific' },
    ];

    const MEDIA = [
        { id: 'book', label: 'Books', icon: '📖' },
        { id: 'film', label: 'Film', icon: '🎬' },
        { id: 'music', label: 'Music', icon: '🎵' },
        { id: 'painting', label: 'Paintings', icon: '🎨' },
        { id: 'architecture', label: 'Architecture', icon: '🏛' },
        { id: 'food', label: 'Food', icon: '🍜' },
    ];

    // Layout constants
    const BASE_WIDTH = 2600;   // track px at zoom 1
    const LABEL_COL = 140;     // region-label gutter width
    const ROW_H = 22;          // px per stacked row in an expanded lane
    const LANE_PAD = 14;       // vertical padding inside an expanded lane
    const STRIP_H = 38;        // collapsed lane height
    const ZOOM_MIN = 0.4, ZOOM_MAX = 16;
    const GAMMA = 0.42;        // <1 spreads recent years out (origin mode)

    const state = {
        mode: 'origin',
        active: new Set(MEDIA.map(m => m.id)),
        items: [],
        zoom: 1,
        minYear: -1000,
        maxYear: 2026,
        gamma: GAMMA,
        expanded: new Set(),        // region ids currently expanded to tiles
        expandedSeries: new Set(),  // "regionId|series" keys expanded to members
    };

    let initialized = false;

    // ---------- helpers ----------
    function regionName(id) { const r = REGIONS.find(r => r.id === id); return r ? r.name : 'Unknown'; }
    function fmtYear(y) { if (y == null) return '—'; return y < 0 ? Math.abs(y) + ' BCE' : String(y); }
    function stars(n) { return n ? '★'.repeat(n) + '☆'.repeat(5 - n) : ''; }
    function itemYear(it) { return state.mode === 'origin' ? it.originYear : it.consumedYear; }
    function visibleItems() { return state.items.filter(i => state.active.has(i.medium) && i.originRegion); }
    function esc(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function iconOf(m) { return (MEDIA.find(x => x.id === m) || {}).icon || '•'; }

    function seriesOf(it) {
        if (it.medium !== 'book') return null;
        const m = (it.title || '').match(/\(([^,)]+?),?\s*#\d+/);
        return m ? m[1].trim() : null;
    }
    function cleanTitle(it) {
        return (it.title || '').replace(/\s*\([^)]*#\d+[^)]*\)\s*$/, '').trim() || it.title || '';
    }

    // year -> x within the track. Origin mode compresses deep past via gamma.
    function yearToX(year) {
        const track = BASE_WIDTH * state.zoom;
        const span = state.maxYear - state.minYear || 1;
        let t = (state.maxYear - year) / span;
        t = Math.max(0, Math.min(1, t));
        return track * (1 - Math.pow(t, state.gamma));
    }

    // ---------- zoom ----------
    function sliderToZoom(v) { return ZOOM_MIN * Math.pow(ZOOM_MAX / ZOOM_MIN, v / 100); }
    function zoomToSlider(z) { return 100 * Math.log(z / ZOOM_MIN) / Math.log(ZOOM_MAX / ZOOM_MIN); }
    function setZoom(z, anchorRatio) {
        const c = document.getElementById('tapContainer');
        const vw = c ? c.clientWidth : 0;
        const before = c ? c.scrollLeft : 0;
        const oldTrack = BASE_WIDTH * state.zoom;
        const anchorTrackX = before - LABEL_COL + (anchorRatio != null ? anchorRatio * vw : vw / 2);
        state.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
        const slider = document.getElementById('tapZoomSlider');
        if (slider) slider.value = zoomToSlider(state.zoom);
        render();
        if (c) {
            const newTrack = BASE_WIDTH * state.zoom;
            const ratio = oldTrack ? anchorTrackX / oldTrack : 0;
            c.scrollLeft = LABEL_COL + ratio * newTrack - (anchorRatio != null ? anchorRatio * vw : vw / 2);
        }
    }
    function fitToWidth() {
        const c = document.getElementById('tapContainer');
        const target = c ? (c.clientWidth - LABEL_COL) / BASE_WIDTH : 1;
        state.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, target));
        const slider = document.getElementById('tapZoomSlider');
        if (slider) slider.value = zoomToSlider(state.zoom);
        render();
        if (c) c.scrollLeft = 0;
    }

    // ---------- bounds per mode ----------
    function recomputeBounds(items) {
        const ys = items.map(itemYear).filter(y => y != null);
        if (state.mode === 'consumed') {
            state.minYear = ys.length ? Math.min(...ys) - 1 : 2013;
            state.maxYear = ys.length ? Math.max(...ys) : 2026;
            state.gamma = 1;
        } else {
            const dmin = ys.length ? Math.min(...ys) : -1000;
            state.minYear = Math.min(-1000, Math.floor(dmin / 500) * 500);
            state.maxYear = 2026;
            state.gamma = GAMMA;
        }
    }

    // ---------- greedy row packing for generic nodes {x,w} ----------
    function packRows(nodes) {
        nodes.sort((a, b) => a.x - b.x);
        const rowEnds = [];
        nodes.forEach(n => {
            let r = 0;
            for (; r < rowEnds.length; r++) if (n.x >= rowEnds[r] + 4) break;
            n.row = r;
            rowEnds[r] = n.x + n.w;
        });
        return rowEnds.length || 1;
    }

    // build the render-nodes for one expanded region (series grouped)
    function nodesForRegion(regionId, laneItems) {
        const bySeries = {};
        const standalone = [];
        laneItems.forEach(it => {
            const s = seriesOf(it);
            if (s) (bySeries[s] = bySeries[s] || []).push(it); else standalone.push(it);
        });
        const nodes = [];
        Object.keys(bySeries).forEach(s => {
            const members = bySeries[s];
            const key = regionId + '|' + s;
            if (members.length < 2 || state.expandedSeries.has(key)) {
                members.forEach(it => nodes.push({ type: 'item', it }));
            } else {
                const yr = Math.min(...members.map(m => itemYear(m)).filter(y => y != null));
                nodes.push({ type: 'series', series: s, members, key, year: isFinite(yr) ? yr : null });
            }
        });
        standalone.forEach(it => nodes.push({ type: 'item', it }));
        // attach x + width estimate
        nodes.forEach(n => {
            const yr = n.type === 'series' ? n.year : itemYear(n.it);
            n.x = yearToX(yr);
            if (n.type === 'series') n.w = Math.min(240, Math.max(80, n.series.length * 6 + 56));
            else n.w = Math.min(220, Math.max(60, cleanTitle(n.it).length * 6 + 30));
        });
        return nodes;
    }

    // ---------- scale markers (built into the sticky axis) ----------
    function axisMarkersHtml() {
        let candidates;
        if (state.mode === 'consumed') {
            candidates = [];
            for (let y = Math.ceil(state.minYear); y <= state.maxYear; y++) candidates.push(y);
        } else {
            candidates = [-1000, -500, -200, 1, 250, 500, 750, 1000, 1250, 1500, 1600, 1700, 1800, 1850, 1900, 1925, 1950, 1975, 2000, 2010, 2020, 2025];
            if (state.zoom > 2) candidates.push(-750, -250, 1100, 1350, 1550, 1650, 1750, 1825, 1875, 1910, 1935, 1960, 1985, 1995, 2005, 2015);
            if (state.zoom > 5) for (let y = 1900; y <= 2026; y += 5) candidates.push(y);
        }
        candidates = [...new Set(candidates)].filter(y => y >= state.minYear && y <= state.maxYear).sort((a, b) => a - b);
        let html = '', lastX = -999;
        const minGap = 60;
        candidates.forEach(y => {
            const x = yearToX(y);
            if (x - lastX < minGap) return;
            lastX = x;
            html += `<div class="tap-scale-marker" style="left:${x}px"><span>${fmtYear(y)}</span></div>`;
        });
        return html;
    }

    // ---------- main render ----------
    function render() {
        const content = document.getElementById('tapContent');
        if (!content) return;
        const items = visibleItems();
        recomputeBounds(items);

        const track = BASE_WIDTH * state.zoom;
        const fullW = LABEL_COL + track;
        const dated = items.filter(i => itemYear(i) != null);
        const undated = items.filter(i => itemYear(i) == null);

        let html = '';

        // --- sticky axis row ---
        html += `<div class="tap-axis">`
            + `<div class="tap-axis-corner">Year →</div>`
            + `<div class="tap-axis-track" style="width:${track}px">${axisMarkersHtml()}</div>`
            + `</div>`;

        // --- region lanes ---
        let totalShown = 0;
        REGIONS.forEach((region, ri) => {
            const laneItems = dated.filter(i => i.originRegion === region.id);
            totalShown += laneItems.length;
            const isOpen = state.expanded.has(region.id);
            const caret = isOpen ? '▾' : '▸';

            html += `<div class="tap-lane tap-region-${ri + 1} ${isOpen ? 'tap-open' : 'tap-collapsed'}">`;
            html += `<div class="tap-lane-label" data-region="${region.id}" role="button" title="Click to ${isOpen ? 'collapse' : 'expand'}">`
                + `<span class="tap-caret">${caret}</span> ${region.name}`
                + `<span class="tap-lane-count">${laneItems.length}</span></div>`;

            if (!isOpen) {
                // condensed strip: one tick per item
                html += `<div class="tap-lane-track tap-strip" style="width:${track}px;height:${STRIP_H}px">`;
                laneItems.forEach(it => {
                    const x = yearToX(itemYear(it));
                    html += `<span class="tap-tick tap-m-${it.medium}" style="left:${x}px" data-id="${it.id}" `
                        + `title="${esc(cleanTitle(it))} — ${fmtYear(it.originYear)}${it.originCountry ? ', ' + it.originCountry : ''}"></span>`;
                });
                html += `</div>`;
            } else {
                // expanded tiles, series grouped
                const nodes = nodesForRegion(region.id, laneItems);
                const rows = packRows(nodes);
                const h = Math.max(STRIP_H, rows * ROW_H + LANE_PAD);
                html += `<div class="tap-lane-track" style="width:${track}px;height:${h}px">`;
                nodes.forEach(n => {
                    const top = n.row * ROW_H + 6;
                    if (n.type === 'series') {
                        html += `<div class="tap-ev tap-series" style="left:${n.x}px;top:${top}px" data-series="${esc(n.key)}" `
                            + `title="${esc(n.series)} — ${n.members.length} books (click to expand)">`
                            + `<span class="tap-ev-dot"></span><span class="tap-ev-label">📚 ${esc(n.series)}</span>`
                            + `<span class="tap-series-count">${n.members.length}</span></div>`;
                    } else {
                        const it = n.it;
                        const ratingCls = it.medium === 'book' && it.rating ? ' tap-r' + it.rating : '';
                        html += `<div class="tap-ev tap-m-${it.medium}${ratingCls}${it.needsReview ? ' tap-review' : ''}" `
                            + `style="left:${n.x}px;top:${top}px" data-id="${it.id}" `
                            + `title="${esc(cleanTitle(it))} — ${fmtYear(it.originYear)}${it.originCountry ? ', ' + it.originCountry : ''}">`
                            + `<span class="tap-ev-dot"></span><span class="tap-ev-label">${iconOf(it.medium)} ${esc(cleanTitle(it))}</span></div>`;
                    }
                });
                html += `</div>`;
            }
            html += `</div>`;
        });

        content.style.width = fullW + 'px';
        content.innerHTML = html;

        // undated tray
        const tray = document.getElementById('tapUndatedTray');
        if (tray) {
            if (undated.length) {
                tray.style.display = 'block';
                let t = `<div class="tap-undated-head">Undated (${undated.length}) — ${state.mode === 'origin' ? 'no creation year' : 'no date experienced'}</div><div class="tap-undated-chips">`;
                undated.slice(0, 200).forEach(it => {
                    t += `<span class="tap-ev tap-m-${it.medium} tap-undated-chip" data-id="${it.id}">${iconOf(it.medium)} ${esc(cleanTitle(it))}</span>`;
                });
                if (undated.length > 200) t += `<span class="tap-more">+${undated.length - 200} more</span>`;
                tray.innerHTML = t + `</div>`;
            } else tray.style.display = 'none';
        }

        // stats
        const stats = document.getElementById('tapStats');
        if (stats) {
            const openN = state.expanded.size;
            stats.innerHTML = `<strong>${totalShown}</strong> shown`
                + ` · ${openN ? openN + ' region' + (openN > 1 ? 's' : '') + ' expanded' : 'overview — click a region to expand'}`
                + (undated.length ? ` · <span class="tap-muted">${undated.length} undated below</span>` : '');
        }

        wireContent();
    }

    function wireContent() {
        const content = document.getElementById('tapContent');
        // region expand/collapse
        content.querySelectorAll('.tap-lane-label').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.region;
                if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
                render();
            });
        });
        // series expand
        content.querySelectorAll('.tap-series').forEach(el => {
            el.addEventListener('click', e => {
                e.stopPropagation();
                state.expandedSeries.add(el.dataset.series);
                render();
            });
        });
        // item detail (tiles + ticks)
        content.querySelectorAll('.tap-ev[data-id], .tap-tick[data-id]').forEach(el => {
            el.addEventListener('click', e => { e.stopPropagation(); showDetail(el.dataset.id); });
        });
        const tray = document.getElementById('tapUndatedTray');
        if (tray) tray.querySelectorAll('.tap-ev[data-id]').forEach(el =>
            el.addEventListener('click', () => showDetail(el.dataset.id)));
    }

    // ---------- detail panel ----------
    function showDetail(id) {
        const it = state.items.find(i => i.id === id);
        if (!it) return;
        const panel = document.getElementById('tapDetail');
        const body = document.getElementById('tapDetailBody');
        let h = `<div class="tap-detail-title">${iconOf(it.medium)} ${esc(cleanTitle(it))}</div>`;
        const meta = [];
        if (it.creator) meta.push(esc(it.creator));
        const s = seriesOf(it);
        if (s) meta.push(esc(s) + ' series');
        meta.push(it.medium.charAt(0).toUpperCase() + it.medium.slice(1));
        h += `<div class="tap-detail-meta">${meta.join(' · ')}</div>`;
        h += `<table class="tap-detail-table">`;
        h += `<tr><td>Origin</td><td>${esc(it.originCountry) || '—'} · ${regionName(it.originRegion)}</td></tr>`;
        h += `<tr><td>Made</td><td>${fmtYear(it.originYear)}</td></tr>`;
        h += `<tr><td>Experienced</td><td>${it.consumedYear != null ? it.consumedYear : '—'}</td></tr>`;
        if (it.rating) h += `<tr><td>My rating</td><td class="tap-stars">${stars(it.rating)}</td></tr>`;
        h += `</table>`;
        if (it.note) h += `<div class="tap-detail-note">${esc(it.note).replace(/&lt;br\s*\/?&gt;/gi, '\n')}</div>`;
        if (it.needsReview) h += `<div class="tap-detail-flag">⚠ Auto-enriched — may need review</div>`;
        body.innerHTML = h;
        panel.style.display = 'block';
    }

    // ---------- controls ----------
    function buildControls() {
        const wrap = document.getElementById('tapMediumFilters');
        if (wrap && !wrap.children.length) {
            const counts = {};
            state.items.forEach(i => { counts[i.medium] = (counts[i.medium] || 0) + 1; });
            const allIds = MEDIA.map(m => m.id);
            function refresh() {
                const allActive = allIds.every(id => state.active.has(id));
                wrap.querySelectorAll('.tap-filter-btn').forEach(b => {
                    const id = b.dataset.medium;
                    b.classList.toggle('active', id === '__all' ? allActive : state.active.has(id));
                });
                render();
            }
            const allBtn = document.createElement('button');
            allBtn.className = 'tap-filter-btn tap-fm-all';
            allBtn.dataset.medium = '__all';
            allBtn.innerHTML = `All<span class="tap-filter-count">${state.items.length}</span>`;
            allBtn.addEventListener('click', () => { state.active = new Set(allIds); refresh(); });
            wrap.appendChild(allBtn);
            MEDIA.forEach(m => {
                const n = counts[m.id] || 0;
                const btn = document.createElement('button');
                btn.className = 'tap-filter-btn tap-fm-' + m.id + (n === 0 ? ' tap-empty' : '');
                btn.dataset.medium = m.id;
                btn.innerHTML = `${m.icon} ${m.label}<span class="tap-filter-count">${n}</span>`;
                btn.addEventListener('click', () => {
                    if (n === 0) return;
                    const onlyThis = state.active.size === 1 && state.active.has(m.id);
                    state.active = onlyThis ? new Set(allIds) : new Set([m.id]);
                    refresh();
                });
                wrap.appendChild(btn);
            });
            refresh();
        }

        // expand-all / collapse-all
        const ea = document.getElementById('tapExpandAll');
        if (ea) ea.addEventListener('click', () => {
            if (state.expanded.size === REGIONS.length) state.expanded.clear();
            else state.expanded = new Set(REGIONS.map(r => r.id));
            ea.textContent = state.expanded.size === REGIONS.length ? 'Collapse all' : 'Expand all';
            render();
        });

        // mode toggle
        document.querySelectorAll('#tapModeToggle .tap-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.mode = btn.dataset.mode;
                document.querySelectorAll('#tapModeToggle .tap-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                fitToWidth();
            });
        });

        // zoom
        const zi = document.getElementById('tapZoomIn'), zo = document.getElementById('tapZoomOut');
        const zr = document.getElementById('tapZoomReset'), zs = document.getElementById('tapZoomSlider');
        if (zi) zi.addEventListener('click', () => setZoom(state.zoom * 1.5));
        if (zo) zo.addEventListener('click', () => setZoom(state.zoom * 0.67));
        if (zr) zr.addEventListener('click', fitToWidth);
        if (zs) zs.addEventListener('input', e => setZoom(sliderToZoom(parseFloat(e.target.value))));

        const c = document.getElementById('tapContainer');
        if (c) {
            c.addEventListener('wheel', e => {
                if (!(e.ctrlKey || e.metaKey)) return;
                e.preventDefault();
                const rect = c.getBoundingClientRect();
                setZoom(state.zoom * (e.deltaY > 0 ? 0.9 : 1.1), (e.clientX - rect.left) / rect.width);
            }, { passive: false });
            // drag to pan (ignore clicks on interactive marks)
            let dragging = false, sx = 0, sy = 0, sl = 0, st = 0, moved = false;
            c.addEventListener('mousedown', e => {
                if (e.target.closest('.tap-ev, .tap-tick, .tap-lane-label')) return;
                dragging = true; moved = false; sx = e.pageX; sy = e.pageY; sl = c.scrollLeft; st = c.scrollTop;
                c.classList.add('tap-grabbing');
            });
            window.addEventListener('mousemove', e => {
                if (!dragging) return;
                c.scrollLeft = sl - (e.pageX - sx);
                c.scrollTop = st - (e.pageY - sy);
                if (Math.abs(e.pageX - sx) + Math.abs(e.pageY - sy) > 3) moved = true;
            });
            window.addEventListener('mouseup', () => { dragging = false; c.classList.remove('tap-grabbing'); });
        }

        const close = document.getElementById('tapDetailClose');
        if (close) close.addEventListener('click', () => { document.getElementById('tapDetail').style.display = 'none'; });
    }

    function init() {
        if (initialized) return;
        initialized = true;
        fetch('art-data.json', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                state.items = data.items || [];
                window.__TAP = state;
                buildControls();
                fitToWidth(); // start zoomed out: whole history, all continents, condensed
            })
            .catch(err => {
                const c = document.getElementById('tapContent');
                if (c) c.innerHTML = `<div class="tap-error">Could not load art-data.json — ${err}</div>`;
            });
    }

    function wireTab() {
        const tab = document.querySelector('.view-tab[data-view="tapestry"]');
        if (tab) tab.addEventListener('click', init);
        const view = document.getElementById('tapestryView');
        if (view && view.classList.contains('active')) init();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireTab);
    else wireTab();
})();
