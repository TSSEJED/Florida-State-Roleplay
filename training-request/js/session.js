// Session management utilities

// Check if user is logged in
function isLoggedIn() {
    try {
        // Check if we're on a public page
        const publicPages = ['/login.html', '/auth/discord/callback.html', '/logout.html'];
        const currentPage = window.location.pathname.replace('/training-request', '');
        
        if (publicPages.some(page => currentPage.endsWith(page))) {
            return true; // Skip auth check for public pages
        }
        
        const hasAuthCode = !!sessionStorage.getItem('discord_auth_code');
        const hasSessionCookie = document.cookie.split(';').some(
            (item) => item.trim().startsWith('fsrp_session=')
        );
        
        return hasAuthCode && hasSessionCookie;
    } catch (error) {
        console.error('Session check error:', error);
        return false;
    }
}

// Check if current page is public
function isPublicPage() {
    const publicPages = ['/login.html', '/auth/discord/callback.html', '/logout.html'];
    const currentPage = window.location.pathname.replace('/training-request', '');
    return publicPages.some(page => currentPage.endsWith(page));
}

// Check session on page load
function checkSession() {
    // Don't check session for public pages
    if (isPublicPage()) {
        return true;
    }
    
    // If not logged in, redirect to login
    if (!isLoggedIn()) {
        const currentPath = window.location.pathname.replace('/training-request', '') || '/index.html';
        if (currentPath && !currentPath.includes('login.html')) {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
        window.location.href = '/training-request/login.html';
        return false;
    }
    
    return true;
}

// Log out the user
function logout() {
    try {
        sessionStorage.clear();
        document.cookie = 'fsrp_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/training-request/logout.html';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/training-request/login.html';
    }
}

// Get auth code
function getAuthCode() {
    return sessionStorage.getItem('discord_auth_code');
}

// Initialize session management
function initSession() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Export functions to window
    window.sessionManager = {
        isLoggedIn,
        logout,
        getAuthCode,
        checkSession
    };
    
    // Run session check when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkSession);
    } else {
        checkSession();
    }
}

// Initialize session management
initSession();
