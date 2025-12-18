#!/usr/bin/env node

const axios = require('axios');

// Configuration - update these values as needed
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';
const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL || '';
const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD || '';

/**
 * Find event category ID by name and event
 * @param {string} name - The name of the event category
 * @param {string} event - The event identifier
 * @returns {Promise<string|null>} - The ID of the found record or null if not found
 */
async function findEventCategoryId(name, event) {
    try {
        // If no token provided, try to authenticate with email/password
        let authToken = DIRECTUS_TOKEN;
        if (!authToken && DIRECTUS_EMAIL && DIRECTUS_PASSWORD) {
            console.log('Authenticating with email/password...');
            const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
                email: DIRECTUS_EMAIL,
                password: DIRECTUS_PASSWORD
            });
            authToken = authResponse.data.data.access_token;
        }

        if (!authToken) {
            throw new Error('No authentication token available. Please set DIRECTUS_TOKEN or DIRECTUS_EMAIL/DIRECTUS_PASSWORD environment variables.');
        }

        // Query the event_categories collection
        const response = await axios.get(`${DIRECTUS_URL}/items/event_categories`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            params: {
                filter: {
                    name: {
                        _eq: name
                    },
                    event: {
                        _eq: event
                    }
                },
                fields: ['id', 'name', 'event']
            }
        });

        const items = response.data.data;
        
        if (items.length === 0) {
            console.log(`No event category found with name "${name}" and event "${event}"`);
            return null;
        }

        if (items.length > 1) {
            console.log(`Multiple event categories found with name "${name}" and event "${event}":`);
            items.forEach(item => {
                console.log(`  ID: ${item.id}, Name: ${item.name}, Event: ${item.event}`);
            });
            console.log('Returning the first match...');
        }

        const foundItem = items[0];
        console.log(`Found event category: ID=${foundItem.id}, Name="${foundItem.name}", Event="${foundItem.event}"`);
        
        return foundItem.id;

    } catch (error) {
        if (error.response) {
            console.error('Directus API Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        } else {
            console.error('Error:', error.message);
        }
        return null;
    }
}

/**
 * Main function to run the script
 */
async function main() {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node find-event-category.js <name> <event>');
        console.log('Example: node find-event-category.js "Workshop" "summer-festival-2024"');
        console.log('');
        console.log('Environment variables:');
        console.log('  DIRECTUS_URL - Directus instance URL (default: http://localhost:8055)');
        console.log('  DIRECTUS_TOKEN - Directus API token');
        console.log('  DIRECTUS_EMAIL - Directus user email (if no token provided)');
        console.log('  DIRECTUS_PASSWORD - Directus user password (if no token provided)');
        process.exit(1);
    }

    const [name, event] = args;
    
    console.log(`Searching for event category with name "${name}" and event "${event}"...`);
    console.log(`Directus URL: ${DIRECTUS_URL}`);
    
    const id = await findEventCategoryId(name, event);
    
    if (id) {
        console.log(`\n✅ Event Category ID: ${id}`);
        process.exit(0);
    } else {
        console.log('\n❌ Event category not found');
        process.exit(1);
    }
}

// Run the script if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Script failed:', error.message);
        process.exit(1);
    });
}

module.exports = { findEventCategoryId }; 