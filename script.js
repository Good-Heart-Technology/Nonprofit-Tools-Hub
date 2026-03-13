// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Core elements used across the site
    const navItems = document.querySelectorAll('.nav-item');
    const contentFrame = document.getElementById('content-frame');
    const welcomeScreen = document.getElementById('welcome-screen');
    const homeLink = document.querySelector('.home-link');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');

    // ==============================
    // DEEP LINKING
    // ==============================

    const getToolFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tool') || null;
    };

    const updateUrl = (slug) => {
        const url = new URL(window.location);
        if (slug) {
            url.searchParams.set('tool', slug);
        } else {
            url.searchParams.delete('tool');
        }
        window.history.pushState({ tool: slug }, '', url.toString());
    };

    const showToolBySlug = (slug) => {
        const navItem = Array.from(navItems).find(n => n.getAttribute('data-slug') === slug);
        if (!navItem || navItem.getAttribute('target') === '_blank') return false;

        navItems.forEach(nav => {
            nav.classList.remove('active');
            nav.removeAttribute('aria-current');
        });
        navItem.classList.add('active');
        navItem.setAttribute('aria-current', 'page');

        welcomeScreen.style.display = 'none';
        contentFrame.style.display = 'block';
        contentFrame.setAttribute('allow', 'clipboard-read; clipboard-write');
        contentFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-popups-to-escape-sandbox');
        contentFrame.src = navItem.getAttribute('data-url');
        return true;
    };

    const showWelcome = () => {
        navItems.forEach(nav => {
            nav.classList.remove('active');
            nav.removeAttribute('aria-current');
        });
        contentFrame.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        contentFrame.src = '';
    };

    const syncFromUrl = () => {
        const slug = getToolFromUrl();
        if (slug) {
            showToolBySlug(slug);
        } else {
            showWelcome();
        }
    };

    // ==============================
    // DESKTOP FUNCTIONALITY
    // ==============================

    // Check if sidebar has scrollable content
    const updateScrollIndicator = () => {
        const hasScroll = sidebar.scrollHeight > sidebar.clientHeight;
        sidebar.classList.toggle('has-scroll', hasScroll && sidebar.scrollTop < sidebar.scrollHeight - sidebar.clientHeight);
    };

    // Update tooltip position based on sidebar state
    const updateTooltipPosition = () => {
        const isCollapsed = sidebar.classList.contains('collapsed');
        document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '60px' : '320px');
    };

    // Handle navigation item clicks
    const handleNavItemClick = (e) => {
        const navItem = e.target.closest('.nav-item');
        if (!navItem) return;

        // Check if this is an external link (has target="_blank")
        if (navItem.getAttribute('target') === '_blank') {
            return;
        }

        e.preventDefault();

        const slug = navItem.getAttribute('data-slug');
        if (slug) {
            updateUrl(slug);
            showToolBySlug(slug);
        }
    };

    // Handle home link clicks
    const handleHomeClick = (e) => {
        e.preventDefault();
        updateUrl(null);
        showWelcome();
    };

    // Handle sidebar toggle for desktop
    const handleSidebarToggle = () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        updateTooltipPosition();
    };

    // ==============================
    // MOBILE FUNCTIONALITY
    // ==============================

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        const isOpen = sidebar.classList.contains('mobile-sidebar-visible');
        sidebar.classList.toggle('mobile-sidebar-visible');
        mobileMenuButton.classList.toggle('active');
        mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));

        const icon = mobileMenuButton.querySelector('i');
        if (sidebar.classList.contains('mobile-sidebar-visible')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            mobileMenuButton.setAttribute('aria-label', 'Close navigation menu');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            mobileMenuButton.setAttribute('aria-label', 'Open navigation menu');
        }
    };

    // Close the mobile menu
    const closeMobileMenu = () => {
        if (!sidebar.classList.contains('mobile-sidebar-visible')) return;
        sidebar.classList.remove('mobile-sidebar-visible');
        mobileMenuButton.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'Open navigation menu');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    };

    // ==============================
    // INITIALIZATION
    // ==============================

    // Restore sidebar state for desktop
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }

    // Set initial states
    updateTooltipPosition();
    updateScrollIndicator();

    // Deep linking: sync from URL on load and popstate
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);

    // Event Listeners for desktop
    toggleButton.addEventListener('click', handleSidebarToggle);
    toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSidebarToggle();
        }
    });
    sidebar.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);

    // Event Listeners for navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            handleNavItemClick(e);
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Home link handling
    homeLink.addEventListener('click', function(e) {
        handleHomeClick(e);
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });

    // Mobile menu button handling
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('mobile-sidebar-visible') &&
            !sidebar.contains(e.target) &&
            !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-sidebar-visible')) {
            closeMobileMenu();
        }
    });
});
