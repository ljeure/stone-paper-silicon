// World History Timeline Application

class TimelineApp {
    constructor() {
        this.currentFilter = 'all';
        this.useExperienceScale = true;
        this.zoomLevel = 0.5;
        this.minYear = -300000;  // Full human history
        this.maxYear = 2026;
        this.selectedEvent = null;
        this.timelineWidth = 2500;
        this.searchQuery = '';
        this.activeTagFilters = [];
        this.wasDragging = false;
        this.draggedEvent = null;
        this.dragStartY = 0;
        this.userFilters = {}; // { "Luke": true, "Jia": true, "Default": true } — populated dynamically
        this.panMoved = false; // true while a drag-pan is in progress, so a click-create can be suppressed
        this.collapsedRegions = new Set(this.loadCollapsedRegions()); // region ids minimized on the left

        this.init();
    }

    async init() {
        console.log('Initializing timeline...');
        await loadData();
        initializeTimelineData(); // Ensure categories are set before rendering
        console.log('Data loaded. Events:', timelineData.events.length);

        // Prompt for display name on first visit
        const username = promptForUsername();
        this.updateNameButton(username);

        this.quiz = new HistoryQuiz();
        this.bindEvents();
        this.initTagUI();
        await this.loadUserFilter();
        this.render();
        this.renderQuizHistory();
        console.log('Render complete');

        // Show server mode indicator
        if (isServerMode) {
            this.showToast('Connected - changes auto-save');
        }
    }

    bindEvents() {
        // View tabs
        document.querySelectorAll('.view-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleTabSwitch(e));
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Scale toggle
        document.getElementById('experienceScale').addEventListener('change', (e) => {
            this.useExperienceScale = e.target.checked;
            this.render();
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.5));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.67));

        // Zoom slider (logarithmic: 0–100 maps to 0.5–10)
        document.getElementById('zoomSlider').addEventListener('input', (e) => {
            this.zoomLevel = this.sliderToZoom(parseFloat(e.target.value));
            this.render();
        });

        // Panel close
        document.getElementById('closePanel').addEventListener('click', () => this.closeDetailPanel());

        // Show all regions (visible only when something is minimized)
        document.getElementById('showAllRegionsBtn').addEventListener('click', () => this.showAllRegions());

        // Add event modal
        document.getElementById('addEventBtn').addEventListener('click', () => this.openAddEventModal());
        document.getElementById('cancelAddEvent').addEventListener('click', () => this.closeAddEventModal());
        document.getElementById('addEventForm').addEventListener('submit', (e) => this.handleAddEvent(e));

        // Add reference modal
        document.getElementById('addReference').addEventListener('click', () => this.openAddReferenceModal());
        document.getElementById('cancelAddReference').addEventListener('click', () => this.closeAddReferenceModal());
        document.getElementById('addReferenceForm').addEventListener('submit', (e) => this.handleAddReference(e));

        // Category color preview
        document.getElementById('eventCategorySelect').addEventListener('change', (e) => {
            this.updateCategoryColorPreview(e.target.value);
        });

        // Save all event edits
        document.getElementById('saveEventEditsBtn').addEventListener('click', () => this.saveEventEdits());

        // Delete event
        document.getElementById('deleteEventBtn').addEventListener('click', () => this.deleteEvent());

        // Export/Import/Sample CSV
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
        document.getElementById('sampleCsvBtn').addEventListener('click', () => this.downloadSampleCsv());

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
            if (this.searchQuery) {
                // Exclude always-visible periods from the zoom-fit calculation,
                // otherwise they'd stretch the range to cover all of history.
                const matches = this.getFilteredEvents(false);
                this.zoomToFitEvents(matches);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            if (e.key === 'Escape') {
                this.closeDetailPanel();
                this.closeAddEventModal();
                this.closeAddReferenceModal();
            }
        });

        // Click outside modals to close
        document.getElementById('addEventModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeAddEventModal();
        });
        document.getElementById('addReferenceModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeAddReferenceModal();
        });

        // Quiz events
        document.getElementById('startQuizBtn').addEventListener('click', () => this.startQuiz());
        document.getElementById('quizNextBtn').addEventListener('click', () => this.showNextQuestion());
        document.getElementById('quizRetryBtn').addEventListener('click', () => this.startQuiz());

        // Takeaway events
        document.getElementById('addTakeawayBtn').addEventListener('click', () => this.addTakeaway());
        document.getElementById('takeawayInput').addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') this.addTakeaway();
        });

        // User filter dropdown
        document.getElementById('userFilterBtn').addEventListener('click', () => {
            const menu = document.getElementById('userFilterMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.user-filter-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                document.getElementById('userFilterMenu').style.display = 'none';
            }
        });

        // Join event button
        document.getElementById('joinEventBtn').addEventListener('click', () => this.joinEvent());

        // Change name button
        document.getElementById('changeNameBtn').addEventListener('click', () => this.changeName());

        // Setup drag scroll
        this.setupDragScroll();
    }

    updateNameButton(name) {
        const btn = document.getElementById('changeNameBtn');
        if (btn) {
            btn.textContent = 'Change username';
        }
    }

    changeName() {
        const current = getUsername() || '';
        const newName = prompt('Enter your display name:', current);
        if (newName !== null && newName.trim()) {
            setUsername(newName.trim());
            this.updateNameButton(newName.trim());
            this.showToast(`Name changed to "${newName.trim()}"`);
        }
    }

    initTagUI() {
        // Populate tag checkboxes in Add Event modal
        const newEventTags = document.getElementById('newEventTags');
        if (newEventTags) {
            newEventTags.innerHTML = SUB_TAGS.map(tag =>
                `<label class="tag-checkbox-label">
                    <input type="checkbox" value="${tag.id}">
                    <span class="tag-checkbox-icon">${tag.icon}</span> ${tag.name}
                </label>`
            ).join('');
        }

        // Populate tag filter bar
        this.renderTagFilterBar();
    }

    renderTagFilterBar() {
        const bar = document.getElementById('tagFilterBar');
        if (!bar) return;
        bar.innerHTML = SUB_TAGS.map(tag => {
            const active = this.activeTagFilters.includes(tag.id) ? ' active' : '';
            return `<button class="tag-filter-btn${active}" data-tag="${tag.id}" title="${tag.name}">
                <span class="tag-filter-icon">${tag.icon}</span> ${tag.name}
            </button>`;
        }).join('');

        bar.querySelectorAll('.tag-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tagId = btn.dataset.tag;
                const idx = this.activeTagFilters.indexOf(tagId);
                if (idx >= 0) {
                    this.activeTagFilters.splice(idx, 1);
                } else {
                    this.activeTagFilters.push(tagId);
                }
                this.renderTagFilterBar();
                this.render();
            });
        });
    }

    getSelectedNewEventTags() {
        const checkboxes = document.querySelectorAll('#newEventTags input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    renderEventTagsInDetail(event) {
        const section = document.getElementById('eventTagsSection');
        const display = document.getElementById('eventTagsDisplay');
        const edit = document.getElementById('eventTagsEdit');

        const tags = event.tags || [];

        // Always show the section for editing
        section.style.display = 'block';

        // Show current tag chips
        if (tags.length > 0) {
            display.innerHTML = tags.map(tagId => {
                const tag = SUB_TAGS.find(t => t.id === tagId);
                return tag ? `<span class="tag-chip">${tag.icon} ${tag.name}</span>` : '';
            }).join('');
        } else {
            display.innerHTML = '<span class="no-tags">No tags</span>';
        }

        // Show edit checkboxes
        edit.innerHTML = SUB_TAGS.map(tag => {
            const checked = tags.includes(tag.id) ? ' checked' : '';
            return `<label class="tag-checkbox-label">
                <input type="checkbox" value="${tag.id}"${checked} data-event-tag="true">
                <span class="tag-checkbox-icon">${tag.icon}</span> ${tag.name}
            </label>`;
        }).join('');

        // Update tags on change
        edit.querySelectorAll('input[data-event-tag]').forEach(cb => {
            cb.addEventListener('change', () => {
                if (!this.selectedEvent) return;
                const selected = Array.from(edit.querySelectorAll('input[data-event-tag]:checked')).map(c => c.value);
                this.selectedEvent.tags = selected;
                // Update display chips
                this.renderEventTagsInDetail(this.selectedEvent);
            });
        });
    }

    syncScaleScroll() {
        const container = document.querySelector('.timeline-container');
        const scale = document.getElementById('timelineScale');
        if (container && scale) {
            scale.scrollLeft = container.scrollLeft;
        }
    }

    setupDragScroll() {
        const container = document.querySelector('.timeline-container');
        const scale = document.getElementById('timelineScale');

        // Sync horizontal scroll of scale with timeline container
        if (container && scale) {
            container.addEventListener('scroll', () => {
                scale.scrollLeft = container.scrollLeft;
            });
        }

        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('timeline-event')) return;
            isDown = true;
            this.panMoved = false;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(x - startX) > 4) this.panMoved = true;
            container.scrollLeft = scrollLeft - walk;
            this.syncScaleScroll();
        });

        container.style.cursor = 'grab';

        // Mouse wheel zoom
        container.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                this.zoom(zoomFactor);
            }
        }, { passive: false });

        // Pinch-to-zoom on touch devices
        let lastPinchDist = 0;
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                lastPinchDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                if (lastPinchDist > 0) {
                    const scale = dist / lastPinchDist;
                    this.zoom(scale);
                }
                lastPinchDist = dist;
            }
        }, { passive: false });

        container.addEventListener('touchend', () => {
            lastPinchDist = 0;
        }, { passive: true });
    }

    handleTabSwitch(e) {
        const view = e.target.dataset.view;

        // Update tab buttons
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');

        // Update view content
        document.querySelectorAll('.view-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${view}View`).classList.add('active');

        // Initialize views when switching
        if (view === 'map') {
            initMap();
        } else if (view === 'quiz') {
            this.initQuizView();
        } else if (view === 'takeaways') {
            this.initTakeawaysView();
        }
    }

    handleFilterClick(e) {
        const category = e.target.dataset.category;

        if (category === 'all') {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            this.currentFilter = 'all';
        } else {
            document.querySelector('.filter-btn[data-category="all"]').classList.remove('active');
            e.target.classList.toggle('active');

            const activeFilters = Array.from(document.querySelectorAll('.filter-btn.active'))
                .map(btn => btn.dataset.category)
                .filter(cat => cat !== 'all');

            if (activeFilters.length === 0) {
                document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
                this.currentFilter = 'all';
            } else {
                this.currentFilter = activeFilters;
            }
        }

        this.render();
    }

    // Logarithmic zoom slider mapping: slider 0–100 <-> zoom 0.5–10
    sliderToZoom(sliderVal) {
        // 0 -> 0.5, 50 -> ~2.2, 100 -> 10
        const minZoom = 0.5, maxZoom = 10;
        const t = sliderVal / 100;
        return minZoom * Math.pow(maxZoom / minZoom, t);
    }

    zoomToSlider(zoomVal) {
        const minZoom = 0.5, maxZoom = 10;
        return 100 * Math.log(zoomVal / minZoom) / Math.log(maxZoom / minZoom);
    }

    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(10, this.zoomLevel));
        document.getElementById('zoomSlider').value = this.zoomToSlider(this.zoomLevel);
        this.render();
    }

    zoomToFitEvents(events) {
        if (!events.length) return;
        const years = events.flatMap(e => [e.year, e.endYear || e.year]);
        const minY = Math.min(...years);
        const maxY = Math.max(...years);
        const container = document.querySelector('.timeline-container');
        const containerW = container.clientWidth - 120; // minus region label width

        // Measure positions at zoom=1 so the math works for both linear
        // and experience-scale layouts (yearToPosition is non-linear in
        // experience mode, so year-range math gives the wrong center).
        const prevZoom = this.zoomLevel;
        this.zoomLevel = 1;
        const minPos1 = this.yearToPosition(minY);
        const maxPos1 = this.yearToPosition(maxY);
        this.zoomLevel = prevZoom;

        const span1 = Math.max(maxPos1 - minPos1, 40);
        const padding1 = span1 * 0.1 + 40;
        const targetSpan1 = span1 + padding1 * 2;

        const neededZoom = containerW / targetSpan1;
        this.zoomLevel = Math.max(0.5, Math.min(10, neededZoom));
        document.getElementById('zoomSlider').value = this.zoomToSlider(this.zoomLevel);
        this.render();

        // Scroll to center on the midpoint of the matched range (in pixel space)
        const midPos1 = (minPos1 + maxPos1) / 2;
        const centerX = midPos1 * this.zoomLevel;
        container.scrollLeft = centerX - containerW / 2;
        this.syncScaleScroll();
    }

    resetZoom() {
        this.zoomLevel = 0.5;
        document.getElementById('zoomSlider').value = 0;
        this.render();
    }

    yearToPosition(year) {
        const width = this.timelineWidth * this.zoomLevel;

        if (this.useExperienceScale) {
            const markers = timelineData.experienceScale.markers;
            let lower = markers[0];
            let upper = markers[markers.length - 1];

            for (let i = 0; i < markers.length - 1; i++) {
                if (year >= markers[i].year && year <= markers[i + 1].year) {
                    lower = markers[i];
                    upper = markers[i + 1];
                    break;
                }
            }

            if (year < markers[0].year) return 0;
            if (year > markers[markers.length - 1].year) return width;

            const yearProgress = (year - lower.year) / (upper.year - lower.year);
            const experienceProgress = lower.experience + yearProgress * (upper.experience - lower.experience);
            const minExp = markers[0].experience;
            const maxExp = markers[markers.length - 1].experience;
            return ((experienceProgress - minExp) / (maxExp - minExp)) * width;
        } else {
            const range = this.maxYear - this.minYear;
            return ((year - this.minYear) / range) * width;
        }
    }

    // Inverse of yearToPosition: convert a pixel X (relative to a region-timeline) back to a year.
    positionToYear(px) {
        const width = this.timelineWidth * this.zoomLevel;
        const x = Math.max(0, Math.min(width, px));

        if (this.useExperienceScale) {
            const markers = timelineData.experienceScale.markers;
            const minExp = markers[0].experience;
            const maxExp = markers[markers.length - 1].experience;
            const targetExp = minExp + (x / width) * (maxExp - minExp);

            let lower = markers[0];
            let upper = markers[markers.length - 1];
            for (let i = 0; i < markers.length - 1; i++) {
                if (targetExp >= markers[i].experience && targetExp <= markers[i + 1].experience) {
                    lower = markers[i];
                    upper = markers[i + 1];
                    break;
                }
            }
            const expProgress = (targetExp - lower.experience) / (upper.experience - lower.experience);
            return lower.year + expProgress * (upper.year - lower.year);
        } else {
            const range = this.maxYear - this.minYear;
            return this.minYear + (x / width) * range;
        }
    }

    // Round a raw year to a "nice" value scaled to its magnitude, so click-to-create
    // pre-fills clean numbers (e.g. -10000, 1900) rather than -9847 or 1903.
    roundYear(year) {
        const abs = Math.abs(year);
        let step;
        if (abs >= 10000) step = 1000;
        else if (abs >= 2000) step = 100;
        else if (abs >= 200) step = 10;
        else step = 1;
        return Math.round(year / step) * step;
    }

    getFilteredEvents(includePeriods = true) {
        const isPeriod = (e) => e.category === 'period' || e.entityType === 'period';
        const periods = timelineData.events.filter(isPeriod);
        let events = timelineData.events.filter(e => !isPeriod(e));

        // Apply search filter
        if (this.searchQuery) {
            events = events.filter(e => {
                const searchText = `${e.title} ${e.description || ''} ${e.category} ${e.subcategory || ''} ${e.region || ''}`.toLowerCase();
                return searchText.includes(this.searchQuery);
            });
        }

        if (this.currentFilter !== 'all') {
            const filters = Array.isArray(this.currentFilter) ? this.currentFilter : [this.currentFilter];
            events = events.filter(e => {
                return filters.some(f => {
                    // Periods are handled separately and always shown
                    if (f === 'period') {
                        return false;
                    }
                    if (f === 'state') {
                        return e.category === 'state' || e.entityType === 'state';
                    }
                    if (f === 'religion') {
                        return e.category === 'religion' || e.entityType === 'religion';
                    }
                    if (f === 'culture') {
                        return e.category === 'culture' || e.entityType === 'culture';
                    }
                    if (f === 'event') {
                        return e.category === 'event';
                    }
                    // Direct category match for any other filters
                    return e.category === f;
                });
            });
        }

        // Apply user filter (by actual user names)
        const allChecked = Object.values(this.userFilters).every(v => v);
        if (!allChecked && Object.keys(this.userFilters).length > 0) {
            events = events.filter(e => {
                const creator = e.createdBy || 'Default';
                return this.userFilters[creator] === true;
            });
        }

        // Apply tag filter
        if (this.activeTagFilters.length > 0) {
            events = events.filter(e => {
                if (!e.tags || e.tags.length === 0) return false;
                return this.activeTagFilters.some(tag => e.tags.includes(tag));
            });
        }

        // Re-add periods so they stay visible regardless of search/filters
        if (includePeriods) {
            events = [...periods, ...events];
        }

        // Filter to visible year range
        events = events.filter(e => {
            const endYear = e.endYear || e.year;
            return endYear >= this.minYear && e.year <= this.maxYear;
        });

        return events;
    }

    render() {
        this.renderScaleMarkers();
        this.renderRegionTimeline();
        this.updateStats();
        this.syncScaleScroll();
    }

    updateStats() {
        const events = this.getFilteredEvents();
        const countEl = document.getElementById('eventCount');
        const rangeEl = document.getElementById('timeRange');

        countEl.textContent = `${events.length} event${events.length !== 1 ? 's' : ''}`;

        if (events.length > 0) {
            const years = events.map(e => e.year);
            const endYears = events.map(e => e.endYear || e.year);
            const minYear = Math.max(this.minYear, Math.min(...years));
            const maxYear = Math.min(this.maxYear, Math.max(...endYears));
            rangeEl.textContent = `${this.formatYear(minYear)} to ${this.formatYear(maxYear)}`;
        } else {
            rangeEl.textContent = '';
        }
    }

    renderScaleMarkers() {
        const container = document.querySelector('.scale-markers');
        container.innerHTML = '';

        const width = this.timelineWidth * this.zoomLevel;
        container.style.width = `${width}px`;

        // Key milestone years (major markers placed first)
        const majorMarkers = [
            { year: -300000, label: '300,000 BCE', major: true },
            { year: -100000, label: '100,000 BCE', major: true },
            { year: -10000, label: '10,000 BCE', major: true },
            { year: -3000, label: '3000 BCE', major: true },
            { year: -1000, label: '1000 BCE', major: true },
            { year: 0, label: '1 CE', major: true },
            { year: 1000, label: '1000', major: true },
            { year: 1500, label: '1500', major: true },
            { year: 1900, label: '1900', major: true },
            { year: 2000, label: '2000', major: true },
            { year: 2026, label: '2026', major: true },
        ];

        const minorMarkers = [
            { year: -50000, label: '50,000 BCE', major: false },
            { year: -6000, label: '6000 BCE', major: false },
            { year: -2000, label: '2000 BCE', major: false },
            { year: -500, label: '500 BCE', major: false },
            { year: 500, label: '500', major: false },
            { year: 1300, label: '1300', major: false },
            { year: 1700, label: '1700', major: false },
            { year: 1800, label: '1800', major: false },
        ];

        // Add more detailed markers based on zoom level tiers
        const addMarker = (year, markers) => {
            if (!markers.find(m => m.year === year)) {
                const label = year < 0 ? `${Math.abs(year)} BCE` : `${year}`;
                markers.push({ year, label, major: false });
            }
        };

        if (this.zoomLevel > 1.5) {
            for (let year = -3000; year <= 2000; year += 500) addMarker(year, minorMarkers);
        }
        if (this.zoomLevel > 3) {
            for (let year = -1000; year <= 2000; year += 100) addMarker(year, minorMarkers);
        }
        if (this.zoomLevel > 6) {
            for (let year = -500; year <= 2000; year += 50) addMarker(year, minorMarkers);
        }
        if (this.zoomLevel > 10) {
            for (let year = -500; year <= 2000; year += 25) addMarker(year, minorMarkers);
        }

        // Two-pass approach: place major markers first, then fill minor markers in remaining gaps
        const minPixelGap = 80;
        const placedPositions = [];

        // Sort major markers by year
        majorMarkers.sort((a, b) => a.year - b.year);

        // Pass 1: Major markers
        majorMarkers.forEach(marker => {
            if (marker.year >= this.minYear && marker.year <= this.maxYear) {
                const pixelPos = this.yearToPosition(marker.year);
                const canPlace = placedPositions.every(pos => Math.abs(pixelPos - pos) >= minPixelGap);
                if (canPlace) {
                    const div = document.createElement('div');
                    div.className = 'scale-marker major';
                    div.style.left = `${pixelPos}px`;
                    div.innerHTML = `<span>${marker.label}</span>`;
                    container.appendChild(div);
                    placedPositions.push(pixelPos);
                }
            }
        });

        // Sort minor markers by year
        minorMarkers.sort((a, b) => a.year - b.year);

        // Pass 2: Minor markers in remaining gaps
        minorMarkers.forEach(marker => {
            if (marker.year >= this.minYear && marker.year <= this.maxYear) {
                const pixelPos = this.yearToPosition(marker.year);
                const canPlace = placedPositions.every(pos => Math.abs(pixelPos - pos) >= minPixelGap);
                if (canPlace) {
                    const div = document.createElement('div');
                    div.className = 'scale-marker';
                    div.style.left = `${pixelPos}px`;
                    div.innerHTML = `<span>${marker.label}</span>`;
                    container.appendChild(div);
                    placedPositions.push(pixelPos);
                }
            }
        });
    }

    renderRegionTimeline() {
        const container = document.getElementById('timelineContent');
        container.innerHTML = '';

        const width = this.timelineWidth * this.zoomLevel;
        container.style.width = `${width + 120}px`;

        // Toggle the global "Show all regions" button based on what's minimized
        const showAllBtn = document.getElementById('showAllRegionsBtn');
        if (showAllBtn) showAllBtn.style.display = this.collapsedRegions.size > 0 ? 'inline-block' : 'none';

        const events = this.getFilteredEvents();
        console.log('Filtered events:', events.length, 'Year range:', this.minYear, 'to', this.maxYear);

        // Render each region
        REGIONS.forEach((region, regionIndex) => {
            const collapsed = this.collapsedRegions.has(region.id);
            const regionDiv = document.createElement('div');
            regionDiv.className = 'region-section' + (collapsed ? ' collapsed' : '');
            regionDiv.dataset.region = region.id;

            // Get events for this region (needed for the collapsed strip count too)
            const regionEvents = events.filter(e => e.region === region.id);

            // Region label with name + minimize / focus controls
            const labelDiv = document.createElement('div');
            labelDiv.className = 'region-label';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'region-label-name';
            nameSpan.textContent = region.name;
            labelDiv.appendChild(nameSpan);

            const actions = document.createElement('div');
            actions.className = 'region-label-actions';

            // Focus: show only this region (collapse all others). Toggles back to "show all".
            const focusBtn = document.createElement('button');
            focusBtn.className = 'region-action-btn region-focus-btn';
            const isOnlyVisible = !collapsed && this.collapsedRegions.size === REGIONS.length - 1;
            focusBtn.textContent = '◎';
            focusBtn.title = isOnlyVisible ? 'Show all regions' : 'Focus — show only this region';
            focusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isOnlyVisible) this.showAllRegions();
                else this.focusRegion(region.id);
            });
            actions.appendChild(focusBtn);

            // Minimize / expand this region
            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'region-action-btn region-collapse-btn';
            collapseBtn.textContent = collapsed ? '▸' : '▾';
            collapseBtn.title = collapsed ? 'Expand' : 'Minimize';
            collapseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleRegionCollapse(region.id);
            });
            actions.appendChild(collapseBtn);

            labelDiv.appendChild(actions);
            regionDiv.appendChild(labelDiv);

            // Collapsed: show a thin strip instead of the full timeline, click to expand.
            if (collapsed) {
                const strip = document.createElement('div');
                strip.className = 'region-collapsed-strip';
                strip.style.width = `${width}px`;
                strip.textContent = `${regionEvents.length} item${regionEvents.length !== 1 ? 's' : ''} hidden — click to expand`;
                strip.addEventListener('click', () => this.toggleRegionCollapse(region.id));
                regionDiv.appendChild(strip);
                container.appendChild(regionDiv);
                return;
            }

            // Region timeline area
            const timelineArea = document.createElement('div');
            timelineArea.className = 'region-timeline';
            timelineArea.style.width = `${width}px`;
            timelineArea.dataset.region = region.id;

            // Add drop zone functionality
            timelineArea.addEventListener('dragover', (e) => this.handleDragOver(e, region.id));
            timelineArea.addEventListener('drop', (e) => this.handleDrop(e, region.id));

            // Click an empty spot to start creating an event there (Google-Calendar style)
            timelineArea.addEventListener('click', (e) => this.handleTimelineCreateClick(e, region.id, timelineArea));

            console.log(`Region ${region.name}: ${regionEvents.length} events`);

            // Layout events in rows within the region
            const rows = this.layoutEventsInRegion(regionEvents);

            // Set minimum height based on number of rows
            const regionHeight = Math.max(100, rows.length * 35 + 20);
            timelineArea.style.minHeight = `${regionHeight}px`;

            rows.forEach((rowEvents, rowIndex) => {
                // Sort row events by start position to calculate gaps
                const sorted = [...rowEvents].sort((a, b) => a.year - b.year);
                sorted.forEach((event, i) => {
                    // Calculate max label width for external labels (narrow bars and flags)
                    let maxLabelWidth = null;
                    if (i < sorted.length - 1) {
                        const startPos = this.yearToPosition(event.year);
                        const endPos = event.endYear ? this.yearToPosition(event.endYear) : startPos;
                        const rawWidth = endPos - startPos;
                        const hasSpan = event.endYear && event.endYear !== event.year;
                        const isNarrowBar = hasSpan && rawWidth < 80;
                        const isFlag = !hasSpan;

                        // Only constrain external labels (narrow bars and flags)
                        if (isFlag || isNarrowBar) {
                            const nextStart = this.yearToPosition(sorted[i + 1].year);
                            let labelStart;
                            if (isFlag) {
                                // Flag label: css left: 4px from the flag div
                                labelStart = startPos + 4;
                            } else {
                                // Narrow bar label: css left: calc(100% + 4px) from bar div
                                const eventWidth = Math.max(rawWidth, 6);
                                labelStart = startPos + eventWidth + 4;
                            }
                            // Leave 4px margin before the next event's bar
                            maxLabelWidth = Math.max(nextStart - labelStart - 4, 0);
                        }
                    }
                    const eventDiv = this.createEventElement(event, rowIndex, maxLabelWidth);
                    timelineArea.appendChild(eventDiv);
                });
            });

            regionDiv.appendChild(timelineArea);
            container.appendChild(regionDiv);
        });
    }

    layoutEventsInRegion(events) {
        const rows = [];
        const rowAssignments = timelineData.rowAssignments || {};

        // Category order (top to bottom):
        // 1. Periods (background), 2. States, 3. Cultures, 4. Religions, 5. Events
        const categoryOrder = {
            // New entity-type categories
            'period': 0,
            'state': 1,
            'culture': 2,
            'religion': 3,
            'event': 4,
            // Legacy categories for backwards compat
            'era-european': 2,
            'era-chinese': 2,
            'civilizations': 1,
            'science': 4,
            'technology': 4,
            'political': 4,
            'people': 4,
            'books': 4
        };

        const getCategoryOrder = (event) => {
            // Use entityType if available, otherwise fall back to category
            if (event.entityType) {
                return categoryOrder[event.entityType] ?? 99;
            }
            return categoryOrder[event.category] ?? 99;
        };

        // Sort events by category order, then by year
        const sortedEvents = [...events].sort((a, b) => {
            const orderA = getCategoryOrder(a);
            const orderB = getCategoryOrder(b);
            if (orderA !== orderB) return orderA - orderB;
            return a.year - b.year;
        });

        // Group events by their category group for layout
        const categoryGroups = {};
        sortedEvents.forEach(event => {
            const order = getCategoryOrder(event);
            if (!categoryGroups[order]) {
                categoryGroups[order] = [];
            }
            categoryGroups[order].push(event);
        });

        // Layout each category group separately, then combine
        const sortedOrders = Object.keys(categoryGroups).map(Number).sort((a, b) => a - b);

        sortedOrders.forEach(order => {
            const groupEvents = categoryGroups[order];
            const groupStartRow = rows.length;

            // Separate manual and auto events within this group
            const manualEvents = [];
            const autoEvents = [];

            groupEvents.forEach(event => {
                const key = `${event.region}-${event.id}`;
                if (rowAssignments[key] !== undefined) {
                    manualEvents.push({ event, row: rowAssignments[key] });
                } else {
                    autoEvents.push(event);
                }
            });

            // Place manually assigned events first
            manualEvents.forEach(({ event, row }) => {
                while (rows.length <= row) {
                    rows.push([]);
                }
                rows[row].push(event);
            });

            // Auto-layout the rest within this category group
            autoEvents.forEach(event => {
                // Periods (order 0) always go on the first row (row 0) regardless of overlap
                if (order === 0) {
                    if (rows.length === 0) rows.push([]);
                    rows[0].push(event);
                    return;
                }

                const startPos = this.yearToPosition(event.year);
                const endPos = event.endYear ? this.yearToPosition(event.endYear) : startPos;
                const rawWidth = endPos - startPos;
                const hasSpan = event.endYear && event.endYear !== event.year;
                const isFlag = !hasSpan && rawWidth < 80;
                const isNarrowBar = hasSpan && rawWidth < 80;
                const width = (isFlag || isNarrowBar) ? Math.max(event.title.length * 5 + 30, 80) : Math.max(rawWidth, 20);

                let placed = false;

                // Try to fit in existing rows for this category group
                for (let i = groupStartRow; i < rows.length; i++) {
                    const rowEvents = rows[i];
                    const canFit = rowEvents.every(existing => {
                        const existingStart = this.yearToPosition(existing.year);
                        const existingEnd = existing.endYear ? this.yearToPosition(existing.endYear) : existingStart;
                        const existingRawWidth = existingEnd - existingStart;
                        const existingIsFlag = existingRawWidth < 80;
                        const existingWidth = existingIsFlag ? Math.max(existing.title.length * 5 + 30, 80) : Math.max(existingRawWidth, 20);

                        return startPos >= existingStart + existingWidth + 5 ||
                               startPos + width + 5 <= existingStart;
                    });

                    if (canFit) {
                        rows[i].push(event);
                        placed = true;
                        break;
                    }
                }

                if (!placed) {
                    rows.push([event]);
                }
            });
        });

        // Remove empty rows
        return rows.filter(row => row.length > 0);
    }

    createEventElement(event, rowIndex, maxLabelWidth) {
        const div = document.createElement('div');
        const isPeriod = event.endYear && (event.endYear - event.year) > 30;
        const isEra = event.category && event.category.startsWith('era-');

        let categoryClass = event.category;
        if (isEra) {
            categoryClass = event.category;
        }

        const startPos = this.yearToPosition(event.year);
        const endPos = event.endYear ? this.yearToPosition(event.endYear) : startPos;
        const rawWidth = endPos - startPos;
        const hasSpan = event.endYear && event.endYear !== event.year;
        const isFlag = !hasSpan && rawWidth < 80;
        const isNarrowBar = hasSpan && rawWidth < 80;

        div.draggable = true;
        div.dataset.eventId = event.id;
        div.dataset.region = event.region;
        div.style.left = `${startPos}px`;
        div.style.top = `${rowIndex * 32 + 5}px`;

        // Color map for flags and narrow bars
        const flagColorMap = {
            'period': 'var(--period-color)',
            'state': 'var(--state-color)',
            'religion': 'var(--religion-color)',
            'culture': 'var(--culture-color)',
            'event': 'var(--event-color)',
            'people': 'var(--people-color)',
            'political': 'var(--political-color)',
            'technology': 'var(--technology-color)',
            'civilizations': 'var(--civilizations-color)',
            'science': 'var(--science-color)',
            'books': 'var(--books-color)',
            'era-european': 'var(--era-european-color)',
            'era-chinese': 'var(--era-chinese-color)',
        };

        if (isFlag) {
            // Point-in-time event: dot + stem + floating label
            div.className = `timeline-event flag-event ${categoryClass}`;
            div.style.setProperty('--flag-color', flagColorMap[event.category] || 'var(--event-color)');

            const dot = document.createElement('div');
            dot.className = 'flag-dot';
            div.appendChild(dot);

            const stem = document.createElement('div');
            stem.className = 'flag-stem';
            div.appendChild(stem);

            const labelSpan = document.createElement('span');
            labelSpan.className = 'flag-label';
            labelSpan.textContent = event.title;
            if (maxLabelWidth !== null) {
                labelSpan.style.maxWidth = `${maxLabelWidth}px`;
                labelSpan.classList.add('label-clipped');
                if (maxLabelWidth < 20) {
                    labelSpan.classList.add('label-hidden');
                }
            }
            div.appendChild(labelSpan);
        } else if (isNarrowBar) {
            // Time-spanning event too narrow for text inside: bar + external label
            div.className = `timeline-event narrow-bar-event ${categoryClass} ${isPeriod ? 'period' : ''} ${isEra ? 'era' : ''}`;
            const eventWidth = Math.max(rawWidth, 6);
            div.style.width = `${eventWidth}px`;
            div.style.setProperty('--flag-color', flagColorMap[event.category] || 'var(--event-color)');

            const labelSpan = document.createElement('span');
            labelSpan.className = 'narrow-bar-label';
            labelSpan.textContent = event.title;
            if (maxLabelWidth !== null) {
                labelSpan.style.maxWidth = `${maxLabelWidth}px`;
                labelSpan.classList.add('label-clipped');
                if (maxLabelWidth < 20) {
                    labelSpan.classList.add('label-hidden');
                }
            }
            div.appendChild(labelSpan);
        } else {
            div.className = `timeline-event ${categoryClass} ${isPeriod ? 'period' : ''} ${isEra ? 'era' : ''}`;
            const eventWidth = Math.max(rawWidth, isPeriod ? 40 : 20);
            div.style.width = `${eventWidth}px`;

            const labelSpan = document.createElement('span');
            labelSpan.className = 'event-label';
            labelSpan.textContent = event.title;
            div.appendChild(labelSpan);
        }

        // Show first tag icon only on event-category items (not states/religions/cultures/periods)
        if (event.tags && event.tags.length > 0 && !isFlag && event.category === 'event') {
            const firstTag = SUB_TAGS.find(t => t.id === event.tags[0]);
            if (firstTag) {
                const tagIcon = document.createElement('span');
                tagIcon.className = 'event-tag-icon';
                tagIcon.textContent = firstTag.icon;
                div.appendChild(tagIcon);
            }
        }

        // Tooltip with full info
        const tagNames = (event.tags || []).map(t => { const st = SUB_TAGS.find(s => s.id === t); return st ? st.name : t; }).join(', ');
        div.title = `${event.title}\n${this.formatYear(event.year)}${event.endYear ? ' - ' + this.formatYear(event.endYear) : ''}\n${event.description || ''}${tagNames ? '\nTags: ' + tagNames : ''}\n\nDrag to reorder rows`;

        // Drag events for reordering
        div.addEventListener('dragstart', (e) => this.handleDragStart(e, event));
        div.addEventListener('dragend', (e) => this.handleDragEnd(e));

        div.addEventListener('click', (e) => {
            if (!this.wasDragging) {
                this.showEventDetail(event);
            }
        });

        return div;
    }

    handleDragStart(e, event) {
        this.draggedEvent = event;
        this.wasDragging = false;
        e.target.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';

        // Store initial Y position to detect actual dragging
        this.dragStartY = e.clientY;
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
        this.draggedEvent = null;

        // Reset wasDragging after a short delay to allow click event to fire first
        setTimeout(() => {
            this.wasDragging = false;
        }, 100);

        // Clean up all drop indicators and highlights
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        document.querySelectorAll('.region-timeline.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
    }

    handleDragOver(e, regionId) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Detect if actually dragging (moved more than 5px)
        if (Math.abs(e.clientY - this.dragStartY) > 5) {
            this.wasDragging = true;
        }

        // Highlight the target row
        const regionTimeline = e.currentTarget;
        regionTimeline.classList.add('drag-over');

        // Show row indicator
        const rect = regionTimeline.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const targetRow = Math.floor(relativeY / 32);

        // Remove existing indicator
        const existing = regionTimeline.querySelector('.drop-indicator');
        if (existing) existing.remove();

        // Add new indicator
        const indicator = document.createElement('div');
        indicator.className = 'drop-indicator';
        indicator.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            top: ${targetRow * 32}px;
            height: 32px;
            background: rgba(233, 69, 96, 0.15);
            border: 2px dashed var(--primary-color);
            pointer-events: none;
            z-index: 50;
        `;
        regionTimeline.appendChild(indicator);
    }

    handleDrop(e, regionId) {
        e.preventDefault();

        // Clean up indicators
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        document.querySelectorAll('.region-timeline.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });

        if (!this.draggedEvent || !this.wasDragging) return;

        // Calculate which row was dropped on based on Y position
        const regionTimeline = e.currentTarget;
        const rect = regionTimeline.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const targetRow = Math.max(0, Math.floor(relativeY / 32));

        // Save the row assignment for this event
        if (!timelineData.rowAssignments) {
            timelineData.rowAssignments = {};
        }

        const key = `${this.draggedEvent.region}-${this.draggedEvent.id}`;
        timelineData.rowAssignments[key] = targetRow;

        // Save to localStorage
        this.saveRowAssignments();

        // Re-render
        this.render();
        this.showToast(`Moved "${this.draggedEvent.title}" to row ${targetRow + 1}`);
    }

    saveRowAssignments() {
        // Now uses the unified saveData function
        debouncedSave();
    }

    formatYear(year) {
        if (year < 0) {
            return `${Math.abs(year)} BCE`;
        } else if (year === 0) {
            return '1 CE';
        }
        return `${year} CE`;
    }

    showEventDetail(event) {
        this.selectedEvent = event;

        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventYear').value = event.year;
        document.getElementById('eventEndYear').value = event.endYear || '';

        // Set category dropdown and color preview
        const categorySelect = document.getElementById('eventCategorySelect');
        categorySelect.value = event.category || 'event';
        this.updateCategoryColorPreview(event.category || 'event');

        // Set region dropdown
        document.getElementById('eventRegionSelect').value = event.region || 'europe-middle-east';

        document.getElementById('eventDescription').value = event.description || '';

        // Show addedBy / createdBy info
        const addedByEl = document.getElementById('eventAddedBy');
        const creator = event.createdBy || event.addedBy;
        if (creator) {
            addedByEl.textContent = `Added by ${creator}`;
            addedByEl.style.display = 'block';
        } else {
            addedByEl.style.display = 'none';
        }

        // Show/hide Join button
        const joinBtn = document.getElementById('joinEventBtn');
        const username = getUsername();
        if (event.createdBy && username) {
            const sharedWith = event.sharedWith || [];
            if (!sharedWith.includes(username)) {
                joinBtn.style.display = 'block';
            } else {
                joinBtn.style.display = 'none';
            }
        } else {
            joinBtn.style.display = 'none';
        }

        // Show tags only for event-category items
        if (event.category === 'event') {
            this.renderEventTagsInDetail(event);
        } else {
            document.getElementById('eventTagsSection').style.display = 'none';
        }

        document.getElementById('notesInput').value = timelineData.notes[event.id] || '';
        this.renderReferences(event.id);

        document.getElementById('eventDetailPanel').classList.add('open');
    }

    updateCategoryColorPreview(category) {
        const colorMap = {
            // New entity-type colors
            'period': 'var(--period-color)',
            'state': 'var(--state-color)',
            'religion': 'var(--religion-color)',
            'culture': 'var(--culture-color)',
            'event': 'var(--event-color)',
            // Legacy colors
            'people': 'var(--people-color)',
            'political': 'var(--political-color)',
            'technology': 'var(--technology-color)',
            'civilizations': 'var(--civilizations-color)',
            'era-european': 'var(--era-european-color)',
            'era-chinese': 'var(--era-chinese-color)',
            'science': 'var(--science-color)',
            'books': 'var(--books-color)'
        };
        const preview = document.getElementById('categoryColorPreview');
        preview.style.background = colorMap[category] || 'var(--state-color)';
    }

    async saveEventEdits() {
        if (!this.selectedEvent) return;

        this.selectedEvent.title = document.getElementById('eventTitle').value;
        this.selectedEvent.year = parseInt(document.getElementById('eventYear').value);
        const endYear = document.getElementById('eventEndYear').value;
        this.selectedEvent.endYear = endYear ? parseInt(endYear) : null;
        this.selectedEvent.category = document.getElementById('eventCategorySelect').value;
        this.selectedEvent.region = document.getElementById('eventRegionSelect').value;
        this.selectedEvent.description = document.getElementById('eventDescription').value;

        // Save tags from detail panel checkboxes
        const tagCheckboxes = document.querySelectorAll('#eventTagsEdit input[data-event-tag]:checked');
        this.selectedEvent.tags = Array.from(tagCheckboxes).map(cb => cb.value);

        // Save notes
        timelineData.notes[this.selectedEvent.id] = document.getElementById('notesInput').value;

        if (!this.selectedEvent.userAdded) {
            this.selectedEvent.userAdded = true;
        }

        await saveData();
        this.render();
        this.updateCategoryColorPreview(this.selectedEvent.category);
        this.showToast('Saved!');
    }

    async deleteEvent() {
        if (!this.selectedEvent) return;

        const eventTitle = this.selectedEvent.title;
        if (!confirm(`Are you sure you want to delete "${eventTitle}"? This cannot be undone.`)) {
            return;
        }

        // Track deletion so default events don't reappear on reload
        if (!timelineData.deletedIds) timelineData.deletedIds = [];
        if (this.selectedEvent.id != null) {
            timelineData.deletedIds.push(this.selectedEvent.id);
        }

        // Remove from events array
        const index = timelineData.events.findIndex(e => e.id === this.selectedEvent.id);
        if (index > -1) {
            timelineData.events.splice(index, 1);
        }

        // Remove any notes for this event
        delete timelineData.notes[this.selectedEvent.id];

        // Remove any row assignments for this event
        if (timelineData.rowAssignments) {
            const key = `${this.selectedEvent.region}-${this.selectedEvent.id}`;
            delete timelineData.rowAssignments[key];
        }

        await saveData();
        this.closeDetailPanel();
        this.render();
        this.showToast(`"${eventTitle}" deleted`);
    }

    renderReferences(eventId) {
        const list = document.getElementById('referencesList');
        list.innerHTML = '';

        // Find the event to get its entityIds
        const event = timelineData.events.find(e => e.id === eventId);
        const eventEntityIds = event ? (event.entityIds || []) : [];

        // Match references by eventId OR by overlapping entityIds
        const refs = timelineData.references.filter(r => {
            if (r.eventId === eventId) return true;
            if (r.entityIds && r.entityIds.length > 0 && eventEntityIds.length > 0) {
                return r.entityIds.some(eid => eventEntityIds.includes(eid));
            }
            // Also match if the event itself is an entity (e.g., entity-ottoman)
            if (r.entityIds && event && event.isEntity && event.entityIds) {
                return r.entityIds.some(eid => event.entityIds.includes(eid));
            }
            return false;
        });

        refs.forEach(ref => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="ref-info">
                    ${ref.url ? `<a href="${ref.url}" target="_blank" class="ref-title">${ref.title}</a>` : `<span class="ref-title">${ref.title}</span>`}
                    <div class="ref-type">${ref.type}${ref.author ? ' by ' + ref.author : ''}</div>
                </div>
                <span class="ref-status ${ref.status}">${ref.status.replace('-', ' ')}</span>
            `;
            list.appendChild(li);
        });

        if (refs.length === 0) {
            list.innerHTML = '<li style="color: var(--text-muted); text-align: center;">No references yet</li>';
        }
    }

    closeDetailPanel() {
        document.getElementById('eventDetailPanel').classList.remove('open');
        this.selectedEvent = null;
    }

    async saveNotes() {
        if (this.selectedEvent) {
            timelineData.notes[this.selectedEvent.id] = document.getElementById('notesInput').value;
            await saveData();
            this.showToast('Notes saved!');
        }
    }

    openAddEventModal(prefill = null) {
        const form = document.getElementById('addEventForm');
        form.reset();
        if (prefill) {
            if (prefill.year !== undefined && prefill.year !== null) {
                document.getElementById('newEventYear').value = prefill.year;
            }
            if (prefill.endYear !== undefined && prefill.endYear !== null) {
                document.getElementById('newEventEndYear').value = prefill.endYear;
            }
            if (prefill.region) {
                document.getElementById('newEventRegion').value = prefill.region;
            }
        }
        document.getElementById('addEventModal').classList.add('open');
        // Focus the title so the user can just type — start/end/region are already filled.
        const titleInput = document.getElementById('newEventTitle');
        if (titleInput) setTimeout(() => titleInput.focus(), 50);
    }

    closeAddEventModal() {
        document.getElementById('addEventModal').classList.remove('open');
        document.getElementById('addEventForm').reset();
    }

    // Click an empty spot on a region's lane → open Add Event with year + region pre-filled.
    handleTimelineCreateClick(e, regionId, timelineArea) {
        // Ignore clicks that landed on an existing event, and clicks that were really drag-pans.
        if (e.target.closest('.timeline-event')) return;
        if (this.panMoved) return;

        const rect = timelineArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const year = this.roundYear(this.positionToYear(x));
        this.openAddEventModal({ year, endYear: year, region: regionId });
    }

    // ---- Region focus / minimize ----
    loadCollapsedRegions() {
        try {
            const saved = localStorage.getItem('timelineCollapsedRegions');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    saveCollapsedRegions() {
        try {
            localStorage.setItem('timelineCollapsedRegions', JSON.stringify([...this.collapsedRegions]));
        } catch (e) { /* ignore quota / privacy-mode errors */ }
    }

    toggleRegionCollapse(regionId) {
        if (this.collapsedRegions.has(regionId)) this.collapsedRegions.delete(regionId);
        else this.collapsedRegions.add(regionId);
        this.saveCollapsedRegions();
        this.render();
    }

    focusRegion(regionId) {
        this.collapsedRegions = new Set(REGIONS.map(r => r.id).filter(id => id !== regionId));
        this.saveCollapsedRegions();
        this.render();
    }

    showAllRegions() {
        this.collapsedRegions.clear();
        this.saveCollapsedRegions();
        this.render();
    }

    async handleAddEvent(e) {
        e.preventDefault();

        const username = getUsername();
        const newEvent = {
            id: getNextEventId(),
            title: document.getElementById('newEventTitle').value,
            year: parseInt(document.getElementById('newEventYear').value),
            category: document.getElementById('newEventCategory').value,
            region: document.getElementById('newEventRegion').value,
            description: document.getElementById('newEventDescription').value,
            userAdded: true,
            addedBy: username,
            createdBy: username,
            sharedWith: [username]
        };

        const endYear = document.getElementById('newEventEndYear').value;
        if (endYear) {
            newEvent.endYear = parseInt(endYear);
        }

        // Collect tags
        const selectedTags = this.getSelectedNewEventTags();
        if (selectedTags.length > 0) {
            newEvent.tags = selectedTags;
        }

        timelineData.events.push(newEvent);

        // Create reference if source URL was provided
        const sourceUrl = document.getElementById('newEventSourceUrl').value;
        if (sourceUrl) {
            const newRef = {
                id: getNextReferenceId(),
                eventId: newEvent.id,
                title: sourceUrl,
                type: 'other',
                url: sourceUrl,
                status: 'to-read',
                userAdded: true
            };
            timelineData.references.push(newRef);
        }

        await saveData();

        this.closeAddEventModal();
        this.render();
        this.showToast('Event added!');
    }

    openAddReferenceModal() {
        document.getElementById('addReferenceModal').classList.add('open');
    }

    closeAddReferenceModal() {
        document.getElementById('addReferenceModal').classList.remove('open');
        document.getElementById('addReferenceForm').reset();
    }

    async handleAddReference(e) {
        e.preventDefault();

        if (!this.selectedEvent) return;

        const newRef = {
            id: getNextReferenceId(),
            eventId: this.selectedEvent.id,
            title: document.getElementById('refTitle').value,
            type: document.getElementById('refType').value,
            url: document.getElementById('refUrl').value,
            status: document.getElementById('refStatus').value,
            userAdded: true
        };

        timelineData.references.push(newRef);
        await saveData();

        this.closeAddReferenceModal();
        this.renderReferences(this.selectedEvent.id);
        this.showToast('Reference added!');
    }

    // ========================================
    // QUIZ METHODS
    // ========================================

    initQuizView() {
        // Show quiz stats
        const stats = document.getElementById('quizStats');
        const totalEvents = timelineData.events.filter(e => e.category !== 'period' && !e.isPeriod).length;
        const userEvents = timelineData.events.filter(e => e.userAdded).length;
        const totalRefs = timelineData.references.length;
        stats.innerHTML = `
            <div class="quiz-stat">
                <span class="quiz-stat-value">${totalEvents}</span>
                <span class="quiz-stat-label">Events Available</span>
            </div>
            <div class="quiz-stat">
                <span class="quiz-stat-value">${userEvents}</span>
                <span class="quiz-stat-label">Your Events</span>
            </div>
            <div class="quiz-stat">
                <span class="quiz-stat-value">${totalRefs}</span>
                <span class="quiz-stat-label">References</span>
            </div>
        `;
        this.renderQuizHistory();
    }

    startQuiz() {
        const difficulty = document.getElementById('quizDifficulty').value;
        const source = document.getElementById('quizSource').value;
        const count = parseInt(document.getElementById('quizCount').value);

        const generated = this.quiz.generateQuestions(count, difficulty, source);

        if (generated === 0) {
            this.showToast('Not enough data to generate questions. Try adding more events or choosing "All Events".');
            return;
        }

        // Show quiz UI
        document.getElementById('quizWelcome').style.display = 'none';
        document.getElementById('quizResults').style.display = 'none';
        document.getElementById('quizHistory').style.display = 'none';
        document.getElementById('quizCard').style.display = 'block';
        document.getElementById('quizProgress').style.display = 'flex';
        document.getElementById('quizScore').style.display = 'flex';

        this.updateQuizScore();
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const q = this.quiz.getCurrentQuestion();
        if (!q) return;

        document.getElementById('quizQuestionType').textContent = q.type;
        document.getElementById('quizQuestionText').textContent = q.question;
        document.getElementById('quizFeedback').style.display = 'none';

        // Update progress
        const progress = ((this.quiz.currentIndex) / this.quiz.questions.length) * 100;
        document.getElementById('quizProgressFill').style.width = `${progress}%`;
        document.getElementById('quizProgressText').textContent =
            `Question ${this.quiz.currentIndex + 1} of ${this.quiz.questions.length}`;

        // Render answer buttons
        const answersDiv = document.getElementById('quizAnswers');
        answersDiv.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-answer-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => this.handleQuizAnswer(i));
            answersDiv.appendChild(btn);
        });
    }

    handleQuizAnswer(optionIndex) {
        const result = this.quiz.answerQuestion(optionIndex);
        if (!result) return;

        // Mark and disable buttons to prevent double-click
        const buttons = document.querySelectorAll('.quiz-answer-btn');
        const q = this.quiz.getCurrentQuestion();
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            btn.classList.add('answered');
            if (q.options[i].correct) {
                btn.classList.add('correct');
            } else if (i === optionIndex && !result.isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Show feedback
        const feedback = document.getElementById('quizFeedback');
        feedback.style.display = 'block';
        document.getElementById('quizFeedbackText').textContent =
            (result.isCorrect ? 'Correct! ' : 'Incorrect. ') + result.explanation;

        // Update score
        this.updateQuizScore();

        // If last question, change button text
        if (this.quiz.currentIndex >= this.quiz.questions.length - 1) {
            document.getElementById('quizNextBtn').textContent = 'See Results';
        } else {
            document.getElementById('quizNextBtn').textContent = 'Next Question';
        }
    }

    showNextQuestion() {
        if (this.quiz.nextQuestion()) {
            this.showCurrentQuestion();
        } else {
            this.showQuizResults();
        }
    }

    updateQuizScore() {
        document.getElementById('quizScoreValue').textContent = this.quiz.score;
        document.getElementById('quizScoreTotal').textContent = this.quiz.answered;
    }

    async showQuizResults() {
        const results = this.quiz.getResults();

        document.getElementById('quizCard').style.display = 'none';
        document.getElementById('quizProgress').style.display = 'none';
        document.getElementById('quizScore').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';

        const scoreDiv = document.getElementById('quizResultsScore');
        scoreDiv.className = `quiz-results-score ${results.grade}`;
        scoreDiv.innerHTML = `<span class="result-percent">${results.percent}%</span> (${results.score}/${results.total})`;

        const breakdown = document.getElementById('quizResultsBreakdown');
        const correctOnes = results.results.filter(r => r.correct).length;
        const incorrectOnes = results.results.filter(r => !r.correct).length;
        let msg = `You got ${correctOnes} correct and ${incorrectOnes} wrong.`;
        if (results.percent >= 80) msg += ' Excellent work!';
        else if (results.percent >= 50) msg += ' Good effort, keep studying!';
        else msg += ' Keep learning, you\'ll improve!';
        breakdown.textContent = msg;

        // Save quiz history
        await this.saveQuizResult(results);
        this.quiz.isActive = false;
    }

    async saveQuizResult(results) {
        if (!timelineData.quizHistory) timelineData.quizHistory = [];
        timelineData.quizHistory.unshift({
            date: new Date().toISOString(),
            score: results.score,
            total: results.total,
            percent: results.percent,
            difficulty: document.getElementById('quizDifficulty').value,
            source: document.getElementById('quizSource').value
        });
        // Keep last 20
        if (timelineData.quizHistory.length > 20) {
            timelineData.quizHistory = timelineData.quizHistory.slice(0, 20);
        }
        await saveData();
    }

    renderQuizHistory() {
        const list = document.getElementById('quizHistoryList');
        if (!list) return;
        // Don't show history during active quiz
        if (this.quiz && this.quiz.isActive) return;
        const history = timelineData.quizHistory || [];

        if (history.length === 0) {
            list.innerHTML = '<div class="no-quiz-history">No quizzes taken yet</div>';
            return;
        }

        list.innerHTML = history.slice(0, 10).map(h => {
            const date = new Date(h.date);
            const dateStr = date.toLocaleDateString();
            const grade = h.percent >= 80 ? 'excellent' : h.percent >= 50 ? 'good' : 'poor';
            return `
                <div class="quiz-history-item">
                    <span class="quiz-history-date">${dateStr} - ${h.difficulty} (${h.source})</span>
                    <span class="quiz-history-score ${grade}">${h.score}/${h.total} (${h.percent}%)</span>
                </div>
            `;
        }).join('');

        // Show history section when returning to quiz
        document.getElementById('quizHistory').style.display = 'block';
    }

    // ========================================
    // TAKEAWAYS METHODS
    // ========================================

    initTakeawaysView() {
        this.populateEntityDropdown();
        this.renderTakeaways();
    }

    populateEntityDropdown() {
        const select = document.getElementById('takeawayEntitySelect');
        // Keep the first "General" option, clear the rest
        while (select.options.length > 1) select.remove(1);

        // Add entity groups
        const types = { state: 'States', religion: 'Religions', culture: 'Cultures' };
        Object.entries(types).forEach(([type, label]) => {
            const group = document.createElement('optgroup');
            group.label = label;
            timelineData.entities
                .filter(e => e.type === type)
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(entity => {
                    const opt = document.createElement('option');
                    opt.value = entity.id;
                    opt.textContent = entity.name;
                    group.appendChild(opt);
                });
            if (group.children.length > 0) select.appendChild(group);
        });
    }

    async addTakeaway() {
        const input = document.getElementById('takeawayInput');
        const text = input.value.trim();
        if (!text) return;

        const entityId = document.getElementById('takeawayEntitySelect').value;

        if (!timelineData.takeaways) timelineData.takeaways = [];

        const takeaway = {
            id: Date.now(),
            text,
            entityId: entityId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        timelineData.takeaways.unshift(takeaway);
        await saveData();

        input.value = '';
        document.getElementById('takeawayEntitySelect').value = '';
        this.renderTakeaways();
        this.showToast('Takeaway added!');
    }

    renderTakeaways() {
        const list = document.getElementById('takeawaysList');
        if (!list) return;
        const takeaways = timelineData.takeaways || [];

        if (takeaways.length === 0) {
            list.innerHTML = '<div class="no-takeaways">No takeaways yet. Start recording your key insights about history above.</div>';
            return;
        }

        list.innerHTML = takeaways.map(t => {
            const entity = t.entityId ? getEntityById(t.entityId) : null;
            const date = new Date(t.createdAt).toLocaleDateString();
            const entityTag = entity ? `<span class="takeaway-entity-tag">${entity.name}</span>` : '';

            return `
                <div class="takeaway-item" data-id="${t.id}">
                    <div class="takeaway-text">${this.escapeHtml(t.text)}</div>
                    <div class="takeaway-meta">
                        <div>
                            ${entityTag}
                            <span style="margin-left: 8px;">${date}</span>
                        </div>
                        <div class="takeaway-actions">
                            <button class="edit-takeaway" onclick="app.editTakeaway(${t.id})">Edit</button>
                            <button class="delete-takeaway" onclick="app.deleteTakeaway(${t.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    editTakeaway(id) {
        const takeaways = timelineData.takeaways || [];
        const takeaway = takeaways.find(t => t.id === id);
        if (!takeaway) return;

        const item = document.querySelector(`.takeaway-item[data-id="${id}"]`);
        if (!item) return;

        // Replace content with edit form
        item.innerHTML = `
            <textarea class="takeaway-edit-area">${this.escapeHtml(takeaway.text)}</textarea>
            <div class="takeaway-edit-actions">
                <button class="takeaway-cancel-btn" onclick="app.renderTakeaways()">Cancel</button>
                <button class="takeaway-save-btn" onclick="app.saveTakeawayEdit(${id})">Save</button>
            </div>
        `;

        const textarea = item.querySelector('textarea');
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }

    async saveTakeawayEdit(id) {
        const takeaways = timelineData.takeaways || [];
        const takeaway = takeaways.find(t => t.id === id);
        if (!takeaway) return;

        const item = document.querySelector(`.takeaway-item[data-id="${id}"]`);
        if (!item) return;
        const textarea = item.querySelector('textarea');
        if (!textarea) return;
        const newText = textarea.value.trim();

        if (!newText) {
            this.showToast('Takeaway cannot be empty');
            return;
        }

        takeaway.text = newText;
        takeaway.updatedAt = new Date().toISOString();
        await saveData();
        this.renderTakeaways();
        this.showToast('Takeaway updated!');
    }

    async deleteTakeaway(id) {
        const takeaways = timelineData.takeaways || [];
        const index = takeaways.findIndex(t => t.id === id);
        if (index === -1) return;

        takeaways.splice(index, 1);
        await saveData();
        this.renderTakeaways();
        this.showToast('Takeaway deleted');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async joinEvent() {
        if (!this.selectedEvent) return;
        const username = getUsername();
        if (!username) return;

        if (!this.selectedEvent.sharedWith) {
            this.selectedEvent.sharedWith = [];
        }
        if (!this.selectedEvent.sharedWith.includes(username)) {
            this.selectedEvent.sharedWith.push(username);
            this.selectedEvent.userAdded = true;
            await saveData();
            document.getElementById('joinEventBtn').style.display = 'none';
            this.showToast('Joined! This event is now shared with you.');
        }
    }

    async loadUserFilter() {
        try {
            const resp = await fetch('/api/users');
            const data = await resp.json();
            this.populateUserFilter(data.users || []);
        } catch (err) {
            // Offline / no server — populate from local data
            const localUsers = new Set();
            timelineData.events.forEach(e => { if (e.createdBy) localUsers.add(e.createdBy); });
            this.populateUserFilter(Array.from(localUsers));
        }
    }

    populateUserFilter(users) {
        const menu = document.getElementById('userFilterMenu');
        if (!menu) return;

        // Always include "Default" for built-in data without explicit creator
        const allNames = ['Default', ...users.filter(u => u !== 'Default')];

        // Initialize filter state — all checked by default
        this.userFilters = {};
        allNames.forEach(name => { this.userFilters[name] = true; });

        // Build checkbox HTML
        menu.innerHTML = allNames.map(name =>
            `<label class="user-filter-option">
                <input type="checkbox" data-user-filter="${name}" checked> ${name}
            </label>`
        ).join('');

        // Bind change events
        menu.querySelectorAll('input[data-user-filter]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                this.userFilters[e.target.dataset.userFilter] = e.target.checked;
                this.render();
            });
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            z-index: 3000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    downloadSampleCsv() {
        const csv = `title,year,endYear,category,region,description,tags,entityIds,createdBy,sharedWith\nBattle of Hastings,1066,,event,europe-middle-east,Norman conquest of England,war;politics,england,,`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'timeline-sample.csv';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Sample CSV downloaded!');
    }

    async resetLayout() {
        if (confirm('This will reset all row arrangements to auto-layout. Continue?')) {
            timelineData.rowAssignments = {};
            await saveData();
            this.render();
            this.showToast('Layout reset to auto-arrange');
        }
    }

    resetData() {
        if (confirm('This will reset all data to defaults. Your notes and custom events will be lost. Continue?')) {
            clearSavedData();
        }
    }

    csvEscape(value) {
        if (value == null) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    exportData() {
        const events = this.getFilteredEvents();
        const headers = ['title', 'year', 'endYear', 'category', 'region', 'description', 'tags', 'entityIds', 'createdBy', 'sharedWith'];
        const rows = [headers.join(',')];

        events.forEach(e => {
            const row = [
                this.csvEscape(e.title),
                this.csvEscape(e.year),
                this.csvEscape(e.endYear || ''),
                this.csvEscape(e.category || ''),
                this.csvEscape(e.region || ''),
                this.csvEscape(e.description || ''),
                this.csvEscape((e.tags || []).join(';')),
                this.csvEscape((e.entityIds || []).join(';')),
                this.csvEscape(e.createdBy || ''),
                this.csvEscape((e.sharedWith || []).join(';'))
            ];
            rows.push(row.join(','));
        });

        const csv = rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `world-history-timeline-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('CSV exported!');
    }

    parseCSV(text) {
        const rows = [];
        let current = '';
        let inQuotes = false;
        let row = [];

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (inQuotes) {
                if (ch === '"' && text[i + 1] === '"') {
                    current += '"';
                    i++;
                } else if (ch === '"') {
                    inQuotes = false;
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ',') {
                    row.push(current);
                    current = '';
                } else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
                    row.push(current);
                    current = '';
                    if (row.length > 1 || row[0] !== '') rows.push(row);
                    row = [];
                    if (ch === '\r') i++;
                } else {
                    current += ch;
                }
            }
        }
        // Last field/row
        row.push(current);
        if (row.length > 1 || row[0] !== '') rows.push(row);

        return rows;
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const rows = this.parseCSV(event.target.result);
                if (rows.length < 2) {
                    this.showToast('CSV file is empty or has no data rows');
                    return;
                }

                const headers = rows[0].map(h => h.trim().toLowerCase());
                const titleIdx = headers.indexOf('title');
                const yearIdx = headers.indexOf('year');
                if (titleIdx === -1 || yearIdx === -1) {
                    this.showToast('CSV must have "title" and "year" columns');
                    return;
                }

                const username = getUsername();
                let imported = 0;

                for (let i = 1; i < rows.length; i++) {
                    const cols = rows[i];
                    const title = (cols[titleIdx] || '').trim();
                    const year = parseInt(cols[yearIdx]);
                    if (!title || isNaN(year)) continue;

                    const get = (name) => {
                        const idx = headers.indexOf(name);
                        return idx >= 0 && cols[idx] ? cols[idx].trim() : '';
                    };

                    const endYearStr = get('endyear');
                    const newEvent = {
                        id: getNextEventId(),
                        title: title,
                        year: year,
                        endYear: endYearStr ? parseInt(endYearStr) : null,
                        category: get('category') || 'event',
                        region: get('region') || 'europe-middle-east',
                        description: get('description'),
                        tags: get('tags') ? get('tags').split(';').map(t => t.trim()).filter(Boolean) : [],
                        entityIds: get('entityids') ? get('entityids').split(';').map(t => t.trim()).filter(Boolean) : [],
                        createdBy: get('createdby') || username,
                        sharedWith: get('sharedwith') ? get('sharedwith').split(';').map(t => t.trim()).filter(Boolean) : [username],
                        userAdded: true
                    };

                    timelineData.events.push(newEvent);
                    imported++;
                }

                if (imported > 0) {
                    await saveData();
                    this.render();
                    this.showToast(`Imported ${imported} event${imported !== 1 ? 's' : ''} from CSV!`);
                } else {
                    this.showToast('No valid events found in CSV');
                }
            } catch (err) {
                this.showToast('Error importing CSV: invalid format');
                console.error(err);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TimelineApp();
});
