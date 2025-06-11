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
async function sendDiscordNotification(application) {
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === 'YOUR_DISCORD_WEBHOOK_URL') {
        console.warn('Discord webhook URL not configured');
        return Promise.resolve();
    }

    try {
        // Extract Discord ID from the discordInfo field (format: username#1234 | 123456789012345678)
        const discordIdMatch = application.discordInfo.match(/\|\s*(\d+)\s*$/);
        const discordMention = discordIdMatch ? `<@${discordIdMatch[1].trim()}>` : application.discordInfo;

        const embed = {
            title: '📝 New Training Application',
            color: 0x3498db,
            fields: [
                { name: 'Applicant', value: application.applicantName, inline: true },
                { name: 'Discord', value: discordMention, inline: true },
                { name: 'In-Game', value: application.ingameInfo, inline: true },
                { name: 'Application ID', value: application.id, inline: false },
                { name: 'Status', value: 'Pending Review', inline: true },
                { name: 'Submitted At', value: new Date(application.submittedAt).toLocaleString(), inline: true }
            ],
            timestamp: new Date().toISOString()
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `New training application from ${application.applicantName} (${discordMention})`,
                embeds: [embed]
            })
        });

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error sending Discord notification:', error);
        throw error;
    }
}

// Validate form fields
function validateForm(formData) {
    const errors = [];
    const values = Object.fromEntries(formData.entries());

    if (!values.applicantName?.trim()) {
        errors.push('Please enter your name');
    }

    if (!values.discordInfo?.trim()) {
        errors.push('Please enter your Discord information (Name#1234 | ID)');
    } else if (!/\|\s*\d+\s*$/.test(values.discordInfo)) {
        errors.push('Please include your Discord ID in the format: username#1234 | 123456789012345678');
    }

    if (!values.ingameInfo?.trim()) {
        errors.push('Please enter your in-game information');
    }

    // Validate all required questions
    for (let i = 1; i <= 10; i++) {
        const questionKey = `q${i}`;
        if (!values[questionKey]?.trim()) {
            errors.push(`Please answer question ${i}`);
        }
    }

    return errors;
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
                // Get form data
                const formData = new FormData(form);
                
                // Validate form
                const errors = validateForm(formData);
                if (errors.length > 0) {
                    throw new Error(errors.join('\n'));
                }
                
                // Format and save application
                const application = formatApplication(formData);
                saveApplication(application);
                
                // Send Discord notification
                await sendDiscordNotification(application);
                
                // Show success and reset form
                showNotification('Application submitted successfully!', 'success');
                form.reset();
                
                // Update other tabs
                window.dispatchEvent(new Event('storage'));
                
            } catch (error) {
                console.error('Error:', error);
                showNotification(error.message || 'Error submitting application', 'error');
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
