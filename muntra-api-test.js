/**
 * Muntra API Test Script
 * 
 * This script helps test various Muntra API endpoints using the credentials in muntra-api-config.js.
 * Run with: node muntra-api-test.js <endpoint>
 * 
 * Example:
 *   node muntra-api-test.js searchPatients
 *   node muntra-api-test.js getPatient
 *   node muntra-api-test.js getAppointments
 */

import fetch from 'node-fetch';
import { muntraApiConfig } from './muntra-api-config.js';

// Get command line arguments
const command = process.argv[2];

if (!command) {
  console.log('Please provide a command to test. Available commands:');
  console.log('  searchPatients - Search for patients by email');
  console.log('  getPatient - Get patient details');
  console.log('  getAppointments - Get patient appointments');
  console.log('  getUpcomingAppointments - Get upcoming appointments');
  process.exit(1);
}

// Helper function to make API requests
async function makeApiRequest(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: muntraApiConfig.getHeaders(),
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Execute the requested command
async function executeCommand() {
  const { baseUrl, testPatient, endpoints } = muntraApiConfig;
  
  let url;
  
  switch (command) {
    case 'searchPatients':
      url = `${baseUrl}${endpoints.searchPatients}?query=${encodeURIComponent(testPatient.email)}`;
      break;
      
    case 'getPatient':
      url = `${baseUrl}${endpoints.getPatient.replace('{id}', testPatient.id)}`;
      break;
      
    case 'getAppointments':
      url = `${baseUrl}${endpoints.getAppointments.replace('{id}', testPatient.id)}`;
      break;
      
    case 'getUpcomingAppointments':
      url = `${baseUrl}${endpoints.getUpcomingAppointments.replace('{id}', testPatient.id)}`;
      break;
      
    default:
      console.log(`Unknown command: ${command}`);
      process.exit(1);
  }
  
  console.log(`Making API request to: ${url}`);
  const result = await makeApiRequest(url);
  
  // Pretty print the result
  console.log('\nResponse:');
  console.log('Status:', result.status);
  console.log('Data:');
  console.log(JSON.stringify(result.data, null, 2));
}

// Run the command
executeCommand().catch(error => {
  console.error('Error executing command:', error);
  process.exit(1);
}); 