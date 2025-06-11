// Generate a unique ID for the application
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format application data for storage
function formatApplication(formData) {
    const application = Object.fromEntries(formData.entries());
    return {
        id: generateId(),
        ...application,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// Save application to localStorage
function saveApplication(application) {
    const applications = JSON.parse(localStorage.getItem('trainingApplications') || '[]');
    applications.push(application);
    localStorage.setItem('trainingApplications', JSON.stringify(applications));
    return application;
}

// Send notification to Discord
function sendDiscordNotification(application) {
    // This is a stub - in a real implementation, you would send this to your backend
    // which would then forward it to Discord using a webhook
    console.log('Would send to Discord:', application);
    
    // In a real implementation, you would make a fetch request to your backend:
    /*
    return fetch('/api/send-discord-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'new_application',
            application: application
        })
    });
    */
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trainingForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            try {
                // Get and format form data
                const formData = new FormData(form);
                const application = formatApplication(formData);
                
                // Save to localStorage
                saveApplication(application);
                
                // Log and simulate Discord notification
                console.log('Application submitted:', application);
                await sendDiscordNotification(application);
                
                // Show success message and reset form
                showNotification('Application submitted successfully!', 'success');
                form.reset();
                
                // Trigger storage event to update other tabs
                window.dispatchEvent(new Event('storage'));
                
            } catch (error) {
                console.error('Error submitting application:', error);
                showNotification('Error submitting application. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});

// Make showNotification globally available
window.showNotification = function(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('i');
    const messageEl = notification.querySelector('.notification-message');
    
    // Set message and type
    messageEl.textContent = message;
    
    // Update icon and styling based on type
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Update icon
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        icon.className = 'fas fa-exclamation-triangle';
    }
    
    // Show notification
    notification.style.display = 'flex';
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.style.display = 'none', 300);
    }, 5000);
};
