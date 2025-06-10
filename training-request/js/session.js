// Session management utilities

// Check if user is logged in
function isLoggedIn() {
    const hasAuthCode = !!sessionStorage.getItem('discord_auth_code');
    const hasSessionCookie = document.cookie.split(';').some(
        (item) => item.trim().startsWith('fsrp_session=')
    );
    return hasAuthCode && hasSessionCookie;
}

// Redirect to login if not authenticated
function requireAuth(redirectTo = '') {
    if (!isLoggedIn()) {
        if (redirectTo) {
            sessionStorage.setItem('redirectAfterLogin', redirectTo);
        }
        window.location.href = '/training-request/login.html';
        return false;
    }
    return true;
}

// Check session on page load
function checkSession() {
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('auth/discord/callback.html') ||
        window.location.pathname.includes('logout.html')) {
        return;
    }
    
    if (!isLoggedIn()) {
        const currentPath = window.location.pathname.replace('/training-request/', '');
        if (currentPath && currentPath !== '/training-request/') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
        window.location.href = '/training-request/login.html';
    }
}

// Log out the user
function logout() {
    sessionStorage.clear();
    document.cookie = 'fsrp_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/training-request/logout.html';
}

// Get auth code
function getAuthCode() {
    return sessionStorage.getItem('discord_auth_code');
}

// Run session check when this script loads
if (typeof window !== 'undefined') {
    // Export functions to window
    window.sessionManager = {
        isLoggedIn,
        requireAuth,
        logout,
        getAuthCode,
        checkSession
    };
    
    // Run session check on page load
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.location.pathname.includes('logout.html')) {
            checkSession();
        }
    });
}
