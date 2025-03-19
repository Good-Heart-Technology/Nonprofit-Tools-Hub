// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const contentFrame = document.getElementById('content-frame');
const welcomeScreen = document.getElementById('welcome-screen');
const homeLink = document.querySelector('.home-link');
const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('.toggle-sidebar');

// Update tooltip position based on sidebar state
const updateTooltipPosition = () => {
    const isCollapsed = sidebar.classList.contains('collapsed');
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '60px' : '320px');
};

// Event Handlers
const handleNavItemHover = (e) => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    
    const rect = item.getBoundingClientRect();
    const span = item.querySelector('span');
    if (span) {
        span.style.setProperty('--tooltip-top', `${rect.top}px`);
    }
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

// Initialize
const initializeApp = () => {
    // Restore sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
    updateTooltipPosition();

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('mouseenter', handleNavItemHover);
        item.addEventListener('click', handleNavItemClick);
    });

    homeLink.addEventListener('click', handleHomeClick);
    toggleButton.addEventListener('click', handleSidebarToggle);
};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 