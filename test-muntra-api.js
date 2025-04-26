/**
 * Muntra API Verification Test
 * 
 * This script tests the connection to the Muntra API using the credentials
 * from the muntra-api-config.js file.
 * 
 * Run with: node test-muntra-api.js
 */

// Import the Muntra API configuration using CommonJS
const { muntraApiConfig } = require('./muntra-api-config.js');

// Test patient details from the config
const testPatient = muntraApiConfig.testPatient;

// Function to make API requests
async function makeApiRequest(endpoint, params = {}) {
  // Build the URL with query parameters
  const url = new URL(`${muntraApiConfig.baseUrl}${endpoint}`);
  
  // Add any query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  console.log(`Making request to: ${url.toString()}`);
  
  try {
    // Get headers from config
    const headers = muntraApiConfig.getHeaders();
    console.log('Using headers:', {
      ...headers,
      'Authorization': 'Bearer [TOKEN HIDDEN]' // Hide token in logs
    });
    
    // Send the API request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers,
    });
    
    // Check if the request was successful
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText.substring(0, 500)); // Show first 500 chars
      throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    return { error: error.message };
  }
}

// Main test function
async function testMuntraApi() {
  console.log('=== MUNTRA API VERIFICATION TEST ===');
  console.log('API Base URL:', muntraApiConfig.baseUrl);
  console.log('Client ID:', muntraApiConfig.clientId);
  console.log('Test Patient Email:', testPatient.email);
  console.log('\n');
  
  try {
    // Test 1: Search for a patient by email
    console.log('TEST 1: Search for patient by email');
    const searchEndpoint = muntraApiConfig.endpoints.searchPatients;
    const searchParams = { query: testPatient.email };
    const searchResult = await makeApiRequest(searchEndpoint, searchParams);
    
    // Check search results
    if (searchResult.error) {
      console.log('❌ Patient search failed');
    } else {
      const patients = searchResult.data || [];
      console.log(`✅ Patient search successful - Found ${patients.length} patients`);
      
      if (patients.length > 0) {
        const patient = patients[0];
        console.log('First patient found:');
        console.log('- ID:', patient.id);
        console.log('- Attributes:', JSON.stringify(patient.attributes, null, 2));
        
        // Test 2: Get patient details
        if (patient.id) {
          console.log('\nTEST 2: Get patient details');
          const patientEndpoint = muntraApiConfig.endpoints.getPatient.replace('{id}', patient.id);
          const patientResult = await makeApiRequest(patientEndpoint);
          
          if (patientResult.error) {
            console.log('❌ Patient details fetch failed');
          } else {
            console.log('✅ Patient details fetched successfully');
            console.log('Patient details:', JSON.stringify(patientResult.data, null, 2));
            
            // Test 3: Get patient appointments
            console.log('\nTEST 3: Get patient appointments');
            const appointmentsEndpoint = muntraApiConfig.endpoints.getAppointments.replace('{id}', patient.id);
            const appointmentsResult = await makeApiRequest(appointmentsEndpoint);
            
            if (appointmentsResult.error) {
              console.log('❌ Appointments fetch failed');
            } else {
              const appointments = appointmentsResult.data || [];
              console.log(`✅ Appointments fetched successfully - Found ${appointments.length} appointments`);
              
              if (appointments.length > 0) {
                console.log('First appointment:');
                console.log(JSON.stringify(appointments[0], null, 2));
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the tests
testMuntraApi(); 