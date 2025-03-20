// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const contentFrame = document.getElementById('content-frame');
const welcomeScreen = document.getElementById('welcome-screen');
const homeLink = document.querySelector('.home-link');
const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('.toggle-sidebar');

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

// Event Handlers
const handleNavItemHover = (e) => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
};

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

const handleHomeClick = (e) => {
    e.preventDefault();
    navItems.forEach(nav => nav.classList.remove('active'));
    contentFrame.style.display = 'none';
    welcomeScreen.style.display = 'flex';
    contentFrame.src = '';
};

const handleSidebarToggle = () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    updateTooltipPosition();
};

// Mobile hamburger menu toggle
const handleMobileMenuToggle = () => {
    sidebar.classList.toggle('mobile-visible');
    const icon = document.querySelector('.hamburger-menu i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
};

// Initialize
const initializeApp = () => {
    // Restore sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
    updateTooltipPosition();
    updateScrollIndicator();

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('mouseenter', handleNavItemHover);
        item.addEventListener('click', handleNavItemClick);
    });

    homeLink.addEventListener('click', handleHomeClick);
    toggleButton.addEventListener('click', handleSidebarToggle);
    sidebar.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);

    // Set up hamburger menu for mobile
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', handleMobileMenuToggle);
    }

    // Mobile: Close sidebar when a navigation item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-visible');
                const icon = document.querySelector('.hamburger-menu i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Return to home screen when logo/title is clicked
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Show welcome screen, hide iframe
        welcomeScreen.style.display = 'flex';
        contentFrame.style.display = 'none';
        contentFrame.src = '';
        
        // On mobile, also hide the sidebar if it's open
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-visible');
            const icon = document.querySelector('.hamburger-menu i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Check if sidebar needs scroll indicator
    function checkScroll() {
        if (sidebar.scrollHeight > sidebar.clientHeight) {
            sidebar.classList.add('has-scroll');
        } else {
            sidebar.classList.remove('has-scroll');
        }
    }
    
    // Initial check
    checkScroll();
    
    // Listen for resize events
    window.addEventListener('resize', checkScroll);
    
    // Listen for body clicks to close mobile sidebar
    document.body.addEventListener('click', function(e) {
        // Close mobile sidebar when clicking outside of it
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !hamburgerMenu.contains(e.target) && 
            sidebar.classList.contains('mobile-visible')) {
            sidebar.classList.remove('mobile-visible');
            const icon = document.querySelector('.hamburger-menu i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 