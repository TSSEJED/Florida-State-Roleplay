document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trainingForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            try {
                // Get form data
                const formData = new FormData(form);
                const formValues = Object.fromEntries(formData.entries());
                
                // Send data to server
                const response = await fetch('/api/submit-application', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showNotification('Application submitted successfully!', 'success');
                    form.reset();
                } else {
                    throw new Error(result.message || 'Failed to submit application');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification(error.message || 'An error occurred while submitting the form', 'error');
            } finally {
                // Reset button state
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
