document.addEventListener('DOMContentLoaded', function() {
    // Get the loading overlay and main container
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContainer = document.querySelector('.container');
    
    // Minimum loading time (1.5 seconds)
    const minLoadingTime = 1500;
    const startTime = Date.now();
    
    // Function to hide loading screen and show content
    function showContent() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
            // Fade out the loading overlay
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
            
            // Show the main content with a fade-in effect
            mainContainer.style.display = 'block';
            setTimeout(() => {
                mainContainer.style.opacity = '1';
            }, 50);
            
            // Remove the loading overlay from the DOM after the transition
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, remainingTime);
    }
    
    // Check if all resources are loaded
    if (document.readyState === 'complete') {
        showContent();
    } else {
        window.addEventListener('load', showContent);
    }
    
    // Fallback in case the load event doesn't fire
    setTimeout(showContent, 3000);
});

// Add smooth transition for the main container when it becomes visible
document.querySelector('.container').style.transition = 'opacity 0.5s ease-in-out';
document.querySelector('.container').style.opacity = '0';
