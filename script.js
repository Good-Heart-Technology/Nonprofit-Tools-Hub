// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Core elements used across the site
    const navItems = document.querySelectorAll('.nav-item');
    const contentFrame = document.getElementById('content-frame');
    const welcomeScreen = document.getElementById('welcome-screen');
    const homeLink = document.querySelector('.home-link');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

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
            // Let the default link behavior handle it
            return;
        }

        // For embedded tools, prevent default and handle normally
        e.preventDefault();
        
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Update display and load URL
        welcomeScreen.style.display = 'none';
        contentFrame.style.display = 'block';
        contentFrame.setAttribute('allow', 'clipboard-read; clipboard-write');
        contentFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-popups-to-escape-sandbox');
        contentFrame.src = navItem.getAttribute('data-url');
    };

    // Handle home link clicks
    const handleHomeClick = (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        contentFrame.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        contentFrame.src = '';
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
        sidebar.classList.toggle('mobile-visible');
        
        // Toggle icon between hamburger and X
        const icon = hamburgerMenu.querySelector('i');
        
        // Always remove both classes first, then add the correct one
        icon.classList.remove('fa-bars');
        icon.classList.remove('fa-times');
        
        if (sidebar.classList.contains('mobile-visible')) {
            icon.classList.add('fa-times');
        } else {
            icon.classList.add('fa-bars');
        }
    };
    
    // Close the mobile menu
    const closeMobileMenu = () => {
        sidebar.classList.remove('mobile-visible');
        const icon = hamburgerMenu.querySelector('i');
        icon.classList.remove('fa-times');
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

    // Event Listeners for desktop
    toggleButton.addEventListener('click', handleSidebarToggle);
    sidebar.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);
    
    // Event Listeners for navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            handleNavItemClick(e);
            
            // On mobile, also close the sidebar
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Home link handling
    homeLink.addEventListener('click', function(e) {
        handleHomeClick(e);
        
        // On mobile, also close the sidebar
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
    
    // Mobile menu button handling
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('mobile-visible') &&
            !sidebar.contains(e.target) && 
            !hamburgerMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}); 