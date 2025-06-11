// Import configuration
import { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } from './github-config.js';

// GitHub Service for storing applications
class GitHubService {
    constructor() {
        this.owner = GITHUB_OWNER;
        this.repo = GITHUB_REPO;
        this.branch = 'main';
        this.token = GITHUB_TOKEN || '';
        this.baseUrl = 'https://api.github.com';
        this.dataFile = 'applications.json';
        this.initialized = false;
    }

    async init(token) {
        // Use provided token, then config token, then check localStorage
        this.token = token || this.token || localStorage.getItem('github_token');
        
        if (!this.token) {
            throw new Error('GitHub token is required. Please set it in js/github-config.js or provide it when initializing.');
        }
        
        // Store token in localStorage for future use
        localStorage.setItem('github_token', this.token);
        this.initialized = true;
        
        // Verify we can access the repo
        try {
            await this._makeRequest(`/repos/${this.owner}/${this.repo}`);
            return true;
        } catch (error) {
            console.error('Error initializing GitHub service:', error);
            throw new Error('Could not access GitHub repository. Please check your token and repository permissions.');
        }
    }

    async getApplications() {
        try {
            const data = await this._getFileContent();
            return data.applications || [];
        } catch (error) {
            if (error.status === 404) {
                // File doesn't exist yet, return empty array
                return [];
            }
            console.error('Error getting applications:', error);
            throw error;
        }
    }

    async saveApplication(application) {
        const applications = await this.getApplications();
        const existingIndex = applications.findIndex(app => app.id === application.id);
        
        if (existingIndex >= 0) {
            applications[existingIndex] = application; // Update existing
        } else {
            applications.push(application); // Add new
        }

        await this._saveApplications(applications);
        return application;
    }

    async _getFileContent() {
        const response = await this._makeRequest(
            `/repos/${this.owner}/${this.repo}/contents/${this.dataFile}?ref=${this.branch}`,
            { method: 'GET' }
        );
        
        if (response.content) {
            return JSON.parse(atob(response.content));
        }
        return { applications: [] };
    }

    async _saveApplications(applications) {
        const content = JSON.stringify({ applications }, null, 2);
        const message = `Update applications (${new Date().toISOString()})`;
        
        try {
            // Try to get the SHA of the existing file
            let sha;
            try {
                const existingFile = await this._makeRequest(
                    `/repos/${this.owner}/${this.repo}/contents/${this.dataFile}?ref=${this.branch}`,
                    { method: 'GET' }
                );
                sha = existingFile.sha;
            } catch (error) {
                // File doesn't exist yet, which is fine
                if (error.status !== 404) throw error;
            }

            await this._makeRequest(
                `/repos/${this.owner}/${this.repo}/contents/${this.dataFile}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        message,
                        content: btoa(unescape(encodeURIComponent(content))),
                        sha,
                        branch: this.branch
                    })
                }
            );
        } catch (error) {
            console.error('Error saving applications:', error);
            throw error;
        }
    }

    async _makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            error.status = response.status;
            throw error;
        }

        // For 204 No Content
        if (response.status === 204) return null;
        
        return response.json();
    }
}

// Create a single instance
export const githubService = new GitHubService();
