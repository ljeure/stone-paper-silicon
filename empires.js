// Largest Empires in History - People-Years Ranking
// Data sourced from "People-years ranking of historical polities" (PDF)
// Metric: people-years = duration (years) × average population (millions) / 1000 → billions

const empiresData = [
    // === TOP 5 EXEMPLAR (v0.1) - exact computed values from PDF ===
    {
        rank: 1,
        name: 'Qing Dynasty',
        startYear: 1644,
        endYear: 1912,
        durationYears: 268,
        avgPopMid: 291.67,
        peopleYearsBMid: 78.17,
        region: 'asia',
        snapshotYears: '1700 (100-150), ~1800 (300), 1850 (450)',
        uncertaintyNote: 'High uncertainty: combines one Avakov/Maddison-derived 1700 range with two narrative values from the Qing article.',
        entityId: 'qing'
    },
    {
        rank: 2,
        name: "People's Republic of China",
        startYear: 1950,
        endYear: 2025,
        durationYears: 75,
        avgPopMid: 1040.50,
        peopleYearsBMid: 78.04,
        region: 'asia',
        snapshotYears: '1950, 1975, 2000, 2025',
        uncertaintyNote: 'Modern-country series uses 4 snapshot points from US Census Bureau IDB-based table.',
        entityId: 'prc'
    },
    {
        rank: 3,
        name: 'Republic of India',
        startYear: 1950,
        endYear: 2025,
        durationYears: 75,
        avgPopMid: 847.79,
        peopleYearsBMid: 63.58,
        region: 'asia',
        snapshotYears: '1950, 1975, 2000, 2025',
        uncertaintyNote: 'Uses present-day India series (4 snapshots); does not split Pakistan/Bangladesh pre-1947.',
        entityId: null
    },
    {
        rank: 4,
        name: 'British Empire',
        startYear: 1800,
        endYear: 1947,
        durationYears: 147,
        avgPopMid: 303.46,
        peopleYearsBMid: 44.61,
        region: 'europe-middle-east',
        snapshotYears: '1814, 1901, 1925',
        uncertaintyNote: 'Empire start year (1800) is a modeling convention; end year is India independence (1947).',
        entityId: null
    },
    {
        rank: 5,
        name: 'Ming Dynasty',
        startYear: 1368,
        endYear: 1644,
        durationYears: 276,
        avgPopMid: 116.67,
        peopleYearsBMid: 32.20,
        region: 'asia',
        snapshotYears: '1393, 1500, 1600',
        uncertaintyNote: 'Uses 3 population points from the Ming dynasty article infobox.',
        entityId: 'ming'
    },

    // === APPENDIX CANDIDATES - estimated from historical sources ===
    {
        rank: 6,
        name: 'Roman Empire',
        startYear: -27,
        endYear: 476,
        durationYears: 503,
        avgPopMid: 55.0,
        peopleYearsBMid: 27.67,
        region: 'europe-middle-east',
        snapshotYears: '~14 CE (45M), ~117 CE (70M), ~300 CE (50M)',
        uncertaintyNote: 'Estimates vary widely; peak ~70M under Trajan.',
        entityId: 'roman-empire'
    },
    {
        rank: 7,
        name: 'Tang Dynasty',
        startYear: 618,
        endYear: 907,
        durationYears: 289,
        avgPopMid: 60.0,
        peopleYearsBMid: 17.34,
        region: 'asia',
        snapshotYears: '~700 (45M), ~750 (75M), ~850 (60M)',
        uncertaintyNote: 'Census data exists but coverage uncertain; An Lushan rebellion caused major population decline.',
        entityId: 'tang'
    },
    {
        rank: 8,
        name: 'Ottoman Empire',
        startYear: 1299,
        endYear: 1922,
        durationYears: 623,
        avgPopMid: 25.0,
        peopleYearsBMid: 15.58,
        region: 'europe-middle-east',
        snapshotYears: '~1500 (12M), ~1700 (25M), ~1900 (38M)',
        uncertaintyNote: 'Long duration but moderate population; significant territorial variation over time.',
        entityId: 'ottoman'
    },
    {
        rank: 9,
        name: 'Song Dynasty',
        startYear: 960,
        endYear: 1279,
        durationYears: 319,
        avgPopMid: 80.0,
        peopleYearsBMid: 25.52,
        region: 'asia',
        snapshotYears: '~1000 (60M), ~1100 (100M), ~1200 (80M)',
        uncertaintyNote: 'Includes both Northern and Southern Song; census data relatively good for this period.',
        entityId: 'song'
    },
    {
        rank: 10,
        name: 'Byzantine Empire',
        startYear: 330,
        endYear: 1453,
        durationYears: 1123,
        avgPopMid: 12.0,
        peopleYearsBMid: 13.48,
        region: 'europe-middle-east',
        snapshotYears: '~500 (26M), ~800 (7M), ~1100 (10M)',
        uncertaintyNote: 'Very long duration but declining territory and population; high uncertainty on early figures.',
        entityId: 'byzantine'
    },
    {
        rank: 11,
        name: 'Mughal Empire',
        startYear: 1526,
        endYear: 1857,
        durationYears: 331,
        avgPopMid: 110.0,
        peopleYearsBMid: 36.41,
        region: 'asia',
        snapshotYears: '~1600 (100M), ~1700 (160M), ~1800 (70M decline)',
        uncertaintyNote: 'Peak population under Aurangzeb; rapid decline after 1707.',
        entityId: null
    },
    {
        rank: 12,
        name: 'Abbasid Caliphate',
        startYear: 750,
        endYear: 1258,
        durationYears: 508,
        avgPopMid: 30.0,
        peopleYearsBMid: 15.24,
        region: 'europe-middle-east',
        snapshotYears: '~800 (33M), ~1000 (30M), ~1200 (27M)',
        uncertaintyNote: 'Territory and effective control shrank over time; population estimates rough.',
        entityId: 'abbasid'
    },
    {
        rank: 13,
        name: 'Mongol Empire',
        startYear: 1206,
        endYear: 1368,
        durationYears: 162,
        avgPopMid: 100.0,
        peopleYearsBMid: 16.20,
        region: 'asia',
        snapshotYears: '~1227 (60M), ~1279 (110M), ~1300 (130M)',
        uncertaintyNote: 'Largest contiguous land empire; population mainly from conquered sedentary peoples.',
        entityId: 'mongol'
    },
    {
        rank: 14,
        name: 'Umayyad Caliphate',
        startYear: 661,
        endYear: 750,
        durationYears: 89,
        avgPopMid: 62.0,
        peopleYearsBMid: 5.52,
        region: 'europe-middle-east',
        snapshotYears: '~700 (62M)',
        uncertaintyNote: 'Short duration but vast territory from Spain to Central Asia.',
        entityId: 'umayyad'
    },
    {
        rank: 15,
        name: 'Yuan Dynasty',
        startYear: 1271,
        endYear: 1368,
        durationYears: 97,
        avgPopMid: 85.0,
        peopleYearsBMid: 8.25,
        region: 'asia',
        snapshotYears: '~1290 (75M), ~1340 (87M), ~1360 (90M)',
        uncertaintyNote: 'Mongol-led dynasty; plague and famine reduced population before end.',
        entityId: 'yuan'
    },
    {
        rank: 16,
        name: 'Achaemenid Empire',
        startYear: -550,
        endYear: -330,
        durationYears: 220,
        avgPopMid: 35.0,
        peopleYearsBMid: 7.70,
        region: 'europe-middle-east',
        snapshotYears: '~480 BCE (50M at peak)',
        uncertaintyNote: 'First Persian Empire; population at peak may have been ~44% of world population.',
        entityId: 'achaemenid'
    },
    {
        rank: 17,
        name: 'Macedonian Empire',
        startYear: -336,
        endYear: -323,
        durationYears: 13,
        avgPopMid: 40.0,
        peopleYearsBMid: 0.52,
        region: 'europe-middle-east',
        snapshotYears: '~323 BCE (est. 40M)',
        uncertaintyNote: 'Extremely short duration under Alexander; vast territory but brief.',
        entityId: 'macedon'
    },
    {
        rank: 18,
        name: 'Sasanian Empire',
        startYear: 224,
        endYear: 651,
        durationYears: 427,
        avgPopMid: 20.0,
        peopleYearsBMid: 8.54,
        region: 'europe-middle-east',
        snapshotYears: '~400 (17M), ~600 (22M)',
        uncertaintyNote: 'Last pre-Islamic Persian empire; moderate but stable population.',
        entityId: 'sasanian'
    },
    {
        rank: 19,
        name: 'Parthian Empire',
        startYear: -247,
        endYear: 224,
        durationYears: 471,
        avgPopMid: 12.0,
        peopleYearsBMid: 5.65,
        region: 'europe-middle-east',
        snapshotYears: '~1 CE (est. 12M)',
        uncertaintyNote: 'Long-lasting Iranian empire; sparse population data.',
        entityId: 'parthia'
    },
    {
        rank: 20,
        name: 'Seleucid Empire',
        startYear: -312,
        endYear: -63,
        durationYears: 249,
        avgPopMid: 20.0,
        peopleYearsBMid: 4.98,
        region: 'europe-middle-east',
        snapshotYears: '~300 BCE (30M), ~200 BCE (15M), ~100 BCE (10M)',
        uncertaintyNote: 'Hellenistic successor state; steadily lost territory.',
        entityId: 'seleucid'
    }
];

// Sort by people-years descending (re-rank based on actual values)
empiresData.sort((a, b) => b.peopleYearsBMid - a.peopleYearsBMid);
empiresData.forEach((e, i) => e.rank = i + 1);

class EmpiresPage {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            this.refresh();
            return;
        }
        this.initialized = true;
        this.render();
    }

    refresh() {
        this.render();
    }

    formatYear(year) {
        if (year < 0) return `${Math.abs(year)} BCE`;
        return `${year} CE`;
    }

    formatNumber(num) {
        return num.toFixed(2);
    }

    getEntityMatch(empire) {
        if (empire.entityId) {
            return getEntityById(empire.entityId);
        }
        return null;
    }

    hasTimelineEvent(empire) {
        const entity = this.getEntityMatch(empire);
        if (!entity) return false;
        return timelineData.events.some(e =>
            e.entityIds && e.entityIds.includes(entity.id) && e.isEntity
        );
    }

    createEntityForEmpire(empire) {
        const id = slugify(empire.name);

        if (getEntityById(id)) {
            this.showToast(`Entity "${empire.name}" already exists`);
            this.render();
            return;
        }

        const newEntity = {
            id: id,
            name: empire.name,
            type: 'state',
            year: empire.startYear,
            endYear: empire.endYear,
            region: empire.region,
            description: `${empire.name} (${this.formatYear(empire.startYear)} - ${this.formatYear(empire.endYear)}). People-years: ${this.formatNumber(empire.peopleYearsBMid)}B. ${empire.uncertaintyNote}`,
            userAdded: true
        };

        timelineData.entities.push(newEntity);

        const newEvent = {
            id: `entity-${id}`,
            title: empire.name,
            year: empire.startYear,
            endYear: empire.endYear,
            entityIds: [id],
            category: 'state',
            entityType: 'state',
            region: empire.region,
            description: newEntity.description,
            isEntity: true,
            userAdded: true
        };

        timelineData.events.push(newEvent);
        saveData();

        // Update the empire's entityId for future reference
        empire.entityId = id;

        this.showToast(`Created "${empire.name}" entity and added to timeline!`);
        if (window.app) window.app.render();
        this.render();
    }

    showToast(message) {
        const existing = document.querySelector('.empires-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'empires-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    render() {
        const container = document.getElementById('empiresList');
        if (!container) return;

        container.innerHTML = '';

        empiresData.forEach(empire => {
            const entity = this.getEntityMatch(empire);
            const hasEvent = this.hasTimelineEvent(empire);
            const isLinked = !!entity;

            const card = document.createElement('div');
            card.className = `empire-card ${isLinked ? 'linked' : 'unlinked'}`;

            const rankBadge = document.createElement('div');
            rankBadge.className = 'empire-rank';
            rankBadge.textContent = `#${empire.rank}`;

            const info = document.createElement('div');
            info.className = 'empire-info';

            const nameRow = document.createElement('div');
            nameRow.className = 'empire-name-row';

            const name = document.createElement('h3');
            name.className = 'empire-name';
            name.textContent = empire.name;

            const badge = document.createElement('span');
            if (isLinked) {
                badge.className = 'empire-badge linked-badge';
                badge.textContent = 'On Timeline';
            } else {
                badge.className = 'empire-badge unlinked-badge';
                badge.textContent = 'Not on Timeline';
            }

            nameRow.appendChild(name);
            nameRow.appendChild(badge);

            const dates = document.createElement('div');
            dates.className = 'empire-dates-line';
            dates.textContent = `${this.formatYear(empire.startYear)} \u2013 ${this.formatYear(empire.endYear)} (${empire.durationYears} years)`;

            const stats = document.createElement('div');
            stats.className = 'empire-stats';

            const pyStat = document.createElement('div');
            pyStat.className = 'empire-stat';
            pyStat.innerHTML = `<span class="stat-value">${this.formatNumber(empire.peopleYearsBMid)}B</span><span class="stat-label">people-years</span>`;

            const popStat = document.createElement('div');
            popStat.className = 'empire-stat';
            popStat.innerHTML = `<span class="stat-value">${empire.avgPopMid.toFixed(1)}M</span><span class="stat-label">avg. population</span>`;

            stats.appendChild(pyStat);
            stats.appendChild(popStat);

            const note = document.createElement('div');
            note.className = 'empire-note';
            note.textContent = empire.uncertaintyNote;

            info.appendChild(nameRow);
            info.appendChild(dates);
            info.appendChild(stats);
            info.appendChild(note);

            const actions = document.createElement('div');
            actions.className = 'empire-actions-col';

            if (!isLinked) {
                const createBtn = document.createElement('button');
                createBtn.className = 'empire-create-btn';
                createBtn.textContent = 'Add to Timeline';
                createBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.createEntityForEmpire(empire);
                });
                actions.appendChild(createBtn);
            } else if (isLinked && hasEvent) {
                const viewBtn = document.createElement('button');
                viewBtn.className = 'empire-view-btn';
                viewBtn.textContent = 'View on Timeline';
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Switch to timeline tab and scroll to entity
                    const timelineTab = document.querySelector('.view-tab[data-view="timeline"]');
                    if (timelineTab) {
                        timelineTab.click();
                        setTimeout(() => {
                            const eventEl = document.querySelector(`[data-event-id="entity-${entity.id}"]`);
                            if (eventEl) {
                                eventEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                eventEl.classList.add('highlight-flash');
                                setTimeout(() => eventEl.classList.remove('highlight-flash'), 2000);
                            }
                        }, 300);
                    }
                });
                actions.appendChild(viewBtn);
            }

            card.appendChild(rankBadge);
            card.appendChild(info);
            card.appendChild(actions);

            container.appendChild(card);
        });
    }
}

let empiresPage;
function initEmpiresPage() {
    if (!empiresPage) {
        empiresPage = new EmpiresPage();
    }
    empiresPage.init();
}
