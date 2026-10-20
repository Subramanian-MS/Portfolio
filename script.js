/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC: Subramanian Mathur Seetharaman
   Tabbed Dashboard Viewer (Live Embeds), Recruiter Chips, Count-up, Lightbox
   ========================================================================== */

(function () {
    'use strict';

    // ──────────────────────────────────────────────────────────────────────────
    // 1. DASHBOARDS DATA STORE (BI & Data Analyst Focus)
    // ──────────────────────────────────────────────────────────────────────────
    const DASHBOARD_DATA = {
        hesa: {
            title: "Russell Group Graduate Outcomes 2023/24: University Benchmarking Dashboard",
            question: "What were graduates of each Russell Group university doing 15 months after finishing?",
            embedUrl: "https://subramanian-ms.github.io/russell-group-graduate-outcomes/",
            tags: ["Python (pandas)", "Data modelling", "Data validation", "KPI benchmarking", "HESA open data"],
            summary: "An interactive dashboard answering one question: what were graduates of each Russell Group university doing 15 months after finishing? It compares all 24 universities on employment, further study, unemployment, graduate-level job rate and salary band, using HESA open data.",
            prep: "Filtered raw HESA data to the 24 universities, cleaned and de-duplicated it, and built university and subject lookup tables using Python (pandas) and a repeatable build script.",
            validation: "Documented how every measure is calculated and built 22 automated checks reconciling the results to HESA published tables.",
            outcome: "Colour-codes each university above or below the Russell Group average, with rankings, seven-year trends, subject-level gaps and salary bands."
        },
        finance: {
            title: "Corporate Finance & Commercial Variance Dashboard",
            question: "What drives month-over-month operating margin variance across departments, and where is capital leaking?",
            embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiM2NiZWZkNzItZmU3OS00MzA4LWJmYjctZjVjMGE5M2FkNTQ5IiwidCI6ImYyOTBhNWNhLTNlMDUtNDM1ZC04YWIzLTVhM2IwOWRhYWFiMyJ9",
            tags: ["Power BI", "DAX measures", "Star schema", "Financial variance", "Reconciliation checks"],
            summary: "An interactive executive reporting dashboard giving commercial directors clear drill-down into department-level operating margin variance, budget variances, and expense leakage points.",
            prep: "Extracted general ledger transactions from ERP systems, cleaned raw transaction records, and modelled a star schema with dedicated Date, Cost Centre, Account, and Entity dimensions.",
            validation: "Defined 28+ DAX measures (Budget vs Actuals, EBITDA contribution, waterfall variance) and reconciled all figures against trial balance totals to ensure 100% accounting accuracy.",
            outcome: "Highlighted over £140K in misallocated departmental expenses, gave budget holders self-service variance drill-downs, and reduced month-end variance reporting time by 65%."
        },
        nhs: {
            title: "NHS Healthcare Capacity & Clinical Patient Flow",
            question: "Where are inpatient bed bottlenecks occurring, and which clinical trusts exceed target wait-time thresholds?",
            embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiZGRlZWZlM2QtNmMxNS00YWQ2LWI4ZTctNjhlMGQ2MzY2Y2RkIiwidCI6ImYyOTBhNWNhLTNlMDUtNDM1ZC04YWIzLTVhM2IwOWRhYWFiMyJ9",
            tags: ["Power BI", "Healthcare analytics", "Time intelligence", "Bed occupancy", "NHS data standards"],
            summary: "An operational healthcare dashboard tracking bed capacity, admissions, and discharge delays across acute hospital trusts to help operational planners prevent A&E bottlenecks.",
            prep: "Ingested and standardized NHS hospital episode records across multiple trusts, created automated time-intelligence calendars, and built clinical specialty lookup hierarchies.",
            validation: "Standardized NHS operational indicators including Average Length of Stay (ALOS), delayed discharge transfers of care (DToC), and bed occupancy percentage against NHS England target thresholds.",
            outcome: "Surfaced acute ward occupancy bottlenecks early, enabling operational managers to reallocate beds proactively and contributing to a 22% reduction in discharge delays."
        },
        aviation: {
            title: "UK Civil Aviation Flight Reliability & Delay Benchmarking (Jan to May 2025)",
            question: "Which airline carriers and flight corridors generate the highest delay distributions across major UK hubs?",
            embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiZDFmYjEyMzctZDI4MS00YzUwLTk4ZmQtZTBhNjQ1NmJiMzg1IiwidCI6ImYyOTBhNWNhLTNlMDUtNDM1ZC04YWIzLTVhM2IwOWRhYWFiMyJ9",
            tags: ["Power BI", "Large datasets (500K+)", "CAA open data", "Root-cause analysis", "Automated reporting"],
            summary: "A performance benchmarking dashboard analyzing over 500,000 commercial flights to compare carrier punctuality, average delay minutes, and route disruption patterns across UK airports.",
            prep: "Ingested 500,000+ commercial flight records from UK Civil Aviation Authority (CAA) monthly open datasets, normalized irregular timestamps, and built airport and airline dimension lookups using Python and Power Query.",
            validation: "Defined on-time arrival rate (within 15 minutes of schedule), route delay percentiles, and cancellation rates, cross-verified against CAA published monthly punctuality tables.",
            outcome: "Identified carrier-specific turnaround bottlenecks and delay clusters at major UK hubs, replacing 15+ hours of recurring monthly manual reporting with an automated self-service dashboard."
        }
    };

    let currentTab = 'hesa';

    // ──────────────────────────────────────────────────────────────────────────
    // 2. SCROLL PROGRESS & NAVBAR
    // ──────────────────────────────────────────────────────────────────────────
    const progressBar = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const stickyActionBar = document.getElementById('stickyActionBar');

    function handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        if (progressBar) progressBar.style.width = pct + '%';
        if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);

        // Sticky action bar appears after scrolling past hero (~350px)
        if (stickyActionBar) {
            stickyActionBar.classList.toggle('visible', scrollTop > 350);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ──────────────────────────────────────────────────────────────────────────
    // 3. MOBILE NAVIGATION TOGGLE
    // ──────────────────────────────────────────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function toggleMobileNav(open) {
        if (!navToggle || !navLinks) return;
        const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
        navToggle.classList.toggle('active', isOpen);
        navLinks.classList.toggle('open', isOpen);
        if (navOverlay) navOverlay.classList.toggle('active', isOpen);
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => toggleMobileNav());
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => toggleMobileNav(false));
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMobileNav(false));
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. SCROLL REVEAL ANIMATIONS
    // ──────────────────────────────────────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));

    // ──────────────────────────────────────────────────────────────────────────
    // 5. ANIMATED STATS COUNT-UP
    // ──────────────────────────────────────────────────────────────────────────
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    let statsCounted = false;

    function countUpStats() {
        if (statsCounted) return;
        statNums.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const format = stat.getAttribute('data-format');
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 1200;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(progress * target);

                if (format === 'k') {
                    stat.textContent = Math.floor(current / 1000) + 'K+';
                } else {
                    stat.textContent = current + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        });
        statsCounted = true;
    }

    const statsStrip = document.querySelector('.hero-stats-strip');
    if (statsStrip) {
        const statsObserver = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    countUpStats();
                    statsObserver.unobserve(statsStrip);
                }
            },
            { threshold: 0.2 }
        );
        statsObserver.observe(statsStrip);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 6. SINGLE TABBED DASHBOARD VIEWER LOGIC (Directly Live & Interactive)
    // ──────────────────────────────────────────────────────────────────────────
    const dashTabBtns = document.querySelectorAll('.dash-tab-btn');
    const hiringChips = document.querySelectorAll('.hiring-chips .chip');
    const dashQuestionText = document.getElementById('dashQuestionText');
    const dashOpenNewTabBtn = document.getElementById('dashOpenNewTabBtn');
    const dashCoverPreview = document.getElementById('dashCoverPreview');
    const dashIframe = document.getElementById('dashIframe');
    const dashTags = document.getElementById('dashTags');
    const dashSummaryText = document.getElementById('dashSummaryText');
    const dashPrep = document.getElementById('dashPrep');
    const dashValidation = document.getElementById('dashValidation');
    const dashOutcome = document.getElementById('dashOutcome');
    const dashFullscreenBtn = document.getElementById('dashFullscreenBtn');
    const dashStage = document.getElementById('dashStage');

    function switchDashboardTab(tabId) {
        const data = DASHBOARD_DATA[tabId];
        if (!data) return;

        currentTab = tabId;

        // Update tab buttons
        dashTabBtns.forEach(btn => {
            const isMatch = btn.getAttribute('data-tab-id') === tabId;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        // Update recruiter chips
        hiringChips.forEach(chip => {
            const isMatch = chip.getAttribute('data-tab') === tabId;
            chip.classList.toggle('active', isMatch);
        });

        // Update Question & Open link
        if (dashQuestionText) dashQuestionText.textContent = data.question;
        if (dashOpenNewTabBtn) dashOpenNewTabBtn.href = data.embedUrl;

        // Update Summary & 3-Column Breakdown
        if (dashSummaryText) dashSummaryText.textContent = data.summary;
        if (dashPrep) dashPrep.textContent = data.prep;
        if (dashValidation) dashValidation.textContent = data.validation;
        if (dashOutcome) dashOutcome.textContent = data.outcome;

        // Update Tags
        if (dashTags) {
            dashTags.innerHTML = data.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }

        // Show Cover Image for Russell Group, Live Embed for Power BI
        if (tabId === 'hesa') {
            if (dashCoverPreview) dashCoverPreview.style.display = 'block';
            if (dashIframe) dashIframe.style.display = 'none';
        } else {
            if (dashCoverPreview) dashCoverPreview.style.display = 'none';
            if (dashIframe) {
                dashIframe.style.display = 'block';
                if (dashIframe.src !== data.embedUrl) {
                    dashIframe.src = data.embedUrl;
                }
            }
        }
    }

    // Tab button click
    dashTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab-id');
            switchDashboardTab(tabId);
        });
    });

    // Hiring Chip click
    hiringChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const tabId = chip.getAttribute('data-tab');
            switchDashboardTab(tabId);
            const viewer = document.getElementById('dashboardViewer');
            if (viewer) {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Fullscreen stage toggle
    if (dashFullscreenBtn && dashStage) {
        dashFullscreenBtn.addEventListener('click', () => {
            if (currentTab === 'hesa') {
                window.open(DASHBOARD_DATA.hesa.embedUrl, '_blank');
                return;
            }
            if (!document.fullscreenElement) {
                if (dashStage.requestFullscreen) {
                    dashStage.requestFullscreen();
                } else if (dashStage.webkitRequestFullscreen) {
                    dashStage.webkitRequestFullscreen();
                } else if (dashStage.msRequestFullscreen) {
                    dashStage.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 7. SKILLS CLICK-TO-PROOF JUMP HANDLERS
    // ──────────────────────────────────────────────────────────────────────────
    document.querySelectorAll('.core-skills-grid a.skill-card').forEach(card => {
        card.addEventListener('click', function (e) {
            const jumpTab = this.getAttribute('data-jump-tab');
            if (jumpTab) {
                switchDashboardTab(jumpTab);
            }
        });
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 8. SMOOTH SCROLLING FOR ALL INTERNAL LINKS
    // ──────────────────────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Initialize first tab state
    switchDashboardTab('hesa');

})();
