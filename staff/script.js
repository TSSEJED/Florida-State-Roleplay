document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.querySelector('.theme-toggle');
    const viewButtons = document.querySelectorAll('.view-btn');
    const pdfEmbed = document.getElementById('pdf-embed');
    const pdfIframe = document.getElementById('pdf-iframe');
    const closePdfBtn = document.getElementById('close-pdf');
    const currentDocumentTitle = document.getElementById('current-document-title');
    const warningPolicyBtn = document.getElementById('warning-policy-btn');
    const restrictedDocBtn = document.getElementById('restricted-doc-btn');
    const trainerInfoBtn = document.getElementById('trainer-info-btn');
    const joinGameBtn = document.getElementById('join-game-btn');
    const openInBrowserLink = document.getElementById('open-in-browser');
    
    // Access Popup Elements
    const accessPopup = document.getElementById('access-popup');
    const accessCodeInput = document.getElementById('access-code');
    const submitCodeBtn = document.getElementById('submit-code');
    const openDiscordBtn = document.getElementById('open-discord');
    const closePopupBtn = document.getElementById('close-popup');
    
    // Theme Management
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Initialize theme
    initTheme();
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    
    // Add click listeners to view buttons
    viewButtons.forEach(button => {
        if (!button.classList.contains('restricted')) {
            button.addEventListener('click', () => {
                const pdfUrl = button.getAttribute('data-pdf');
                const title = button.getAttribute('data-title');
                if (pdfUrl && title) {
                    openPdfViewer(pdfUrl, title);
                }
            });
        }
    });
    
    // Close PDF viewer
    closePdfBtn.addEventListener('click', () => {
        pdfEmbed.classList.add('hidden');
        pdfIframe.src = '';
    });
    
    // Warning Policy button in quick access menu
    warningPolicyBtn.addEventListener('click', () => {
        const pdfUrl = warningPolicyBtn.getAttribute('data-pdf');
        const title = warningPolicyBtn.getAttribute('data-title');
        if (pdfUrl && title) {
            openPdfViewer(pdfUrl, title);
        }
    });
    
    // Restricted document button
    restrictedDocBtn.addEventListener('click', () => {
        showAccessPopup('training');
    });
    
    // Trainer info document button
    trainerInfoBtn.addEventListener('click', () => {
        showAccessPopup('trainer');
    });
    
    // Check if device is mobile
    function isMobileDevice() {
        return (window.innerWidth <= 768) || 
               (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }
    
    // Helper function to resolve relative PDF paths to absolute URLs
    function getAbsolutePdfPath(relativePath) {
        // Get the base URL of the current page (without the filename)
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        
        // If the path starts with '../', go up one directory
        if (relativePath.startsWith('../')) {
            // Remove the '../' and go up one directory in the baseUrl
            const parentBaseUrl = baseUrl.substring(0, baseUrl.slice(0, -1).lastIndexOf('/') + 1);
            
            // Get the filename part and properly encode it
            const pathWithoutPrefix = relativePath.substring(3);
            const lastSlashIndex = pathWithoutPrefix.lastIndexOf('/');
            
            if (lastSlashIndex !== -1) {
                // If there are subdirectories in the path
                const directory = pathWithoutPrefix.substring(0, lastSlashIndex + 1);
                const filename = pathWithoutPrefix.substring(lastSlashIndex + 1);
                return parentBaseUrl + directory + encodeURIComponent(filename);
            } else {
                // If it's just a filename
                return parentBaseUrl + encodeURIComponent(pathWithoutPrefix);
            }
        }
        
        // Otherwise, just join the base URL and the properly encoded relative path
        return baseUrl + encodeURIComponent(relativePath);
    }
    
    // Function to open PDF viewer
    function openPdfViewer(pdfUrl, title) {
        
        // For other PDF links
        // Get the absolute path to the PDF
        const absolutePdfUrl = getAbsolutePdfPath(pdfUrl);
        
        // For mobile devices, open PDF directly in a new tab
        if (isMobileDevice()) {
            window.open(absolutePdfUrl, '_blank');
            return;
        }
        
        // For desktop devices, continue with the embedded viewer
        // Set the title in the viewer
        currentDocumentTitle.textContent = title;
        
        // Show the PDF viewer
        pdfEmbed.classList.remove('hidden');
        
        // Set iframe source to the PDF
        // Make sure we're using the correct path format with proper encoding
        try {
            // Always use the absolute URL for PDFs when in the iframe
            // This ensures it works both locally and when hosted online
            pdfIframe.src = absolutePdfUrl;
            
            // For debugging
            console.log('Setting PDF iframe source to:', absolutePdfUrl);
        } catch (error) {
            console.error('Error setting PDF iframe source:', error);
            alert('There was an error loading the PDF. Please try again.');
        }
        
        // Update the 'Open in Browser' link
        if (openInBrowserLink) {
            openInBrowserLink.href = absolutePdfUrl;
        }
        
        console.log('Opening PDF:', absolutePdfUrl);
    }
    
    // Function to show access popup
    function showAccessPopup(docType) {
        // Store the document type in a data attribute for later use
        accessPopup.setAttribute('data-doc-type', docType);
        accessPopup.classList.remove('hidden');
        accessCodeInput.focus();
    }
    
    // Join Game button functionality
    joinGameBtn.addEventListener('click', () => {
        window.open('https://policeroleplay.community/join/AebBj', '_blank');
    });
    
    // Access code popup functionality
    submitCodeBtn.addEventListener('click', () => {
        const code = accessCodeInput.value.trim();
        const docType = accessPopup.getAttribute('data-doc-type');
        
        if (code === 'sejed') {
            accessPopup.classList.add('hidden');
            
            if (docType === 'training') {
                openPdfViewer('Full staff training document.pdf', 'Full Staff Training Document');
            } else if (docType === 'trainer') {
                openPdfViewer('Trainer Guide for FSRP (2).pdf', 'Trainer Information Document');
            }
            
            accessCodeInput.value = '';
        } else {
            alert('Invalid access code. Please try again or open a Discord ticket.');
        }
    });
    
    // Enter key for access code
    accessCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitCodeBtn.click();
        }
    });
    
    // Open Discord button
    openDiscordBtn.addEventListener('click', () => {
        window.open('https://discord.gg/2Zustjzbtf', '_blank');
    });
    
    // Close popup button
    closePopupBtn.addEventListener('click', () => {
        accessPopup.classList.add('hidden');
        accessCodeInput.value = '';
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (pdfEmbed.classList.contains('hidden')) return;
        
        if (e.key === 'Escape') {
            pdfEmbed.classList.add('hidden');
            pdfIframe.src = '';
        }
        
        // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+I
        if ((e.ctrlKey && e.key === 's') || 
            (e.ctrlKey && e.key === 'p') || 
            (e.ctrlKey && e.shiftKey && e.key === 'i')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // This is a client-side check only and should be supplemented with server-side validation in a production environment
    const fullTrainingLinks = document.querySelectorAll('a[href*="Full staff training"]');
    fullTrainingLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Access denied. You do not have permission to view this document.');
        });
    });
    // Console Branding
    console.log('%cFSRP Staff Portal', 'color: #f44336; font-size: 20px; font-weight: bold;');
    console.log('%cDesigned by Sejed TRABELLSSI | sejed.pages.dev', 'color: #ff9800; font-size: 12px;');
});
