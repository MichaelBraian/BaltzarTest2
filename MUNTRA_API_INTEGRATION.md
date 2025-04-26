# Muntra API Integration Guide

This guide provides instructions for integrating the dental website with the Muntra API, which gives access to patient information, appointments, and other dental practice data.

## Prerequisites

Before you begin, you need:

1. A Muntra account with API access
2. API credentials (Client ID and API Key/Token)
3. Access to the Muntra API base URL

## Environment Configuration

### Local Development

Create a `.env.local` file in the root of your project with the following variables:

```
# Muntra API Configuration
MUNTRA_API_KEY=your-api-key
MUNTRA_API_BASE_URL=https://api.muntra.com
MUNTRA_CLIENT_ID=your-client-id

# Site URL for development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production Deployment (Netlify)

When deploying to Netlify, add the following environment variables in the Netlify dashboard:

1. Go to your site in Netlify
2. Navigate to Site settings > Build & deploy > Environment
3. Add the variables:
   - `MUNTRA_API_KEY` - Your Muntra API key/token
   - `MUNTRA_API_BASE_URL` - The Muntra API URL (typically https://api.muntra.com)
   - `MUNTRA_CLIENT_ID` - Your Muntra client ID
   - `NEXT_PUBLIC_SITE_URL` - Your production site URL

## API Configuration Files

### muntra-api-config.js

The `muntra-api-config.js` file in the root directory contains the client-side configuration for interacting with the Muntra API:

```javascript
/**
 * Muntra API Configuration
 * 
 * This file contains the configuration for connecting to the Muntra API.
 * IMPORTANT: This file should be added to .gitignore to prevent exposing API credentials.
 */

export const muntraApiConfig = {
  // Muntra API credentials
  clientId: 'your-client-id',
  token: 'your-token',
  
  // API base URL
  baseUrl: 'https://api.muntra.com/',
  
  // API endpoints
  endpoints: {
    searchPatients: '/patients/search',
    getPatient: '/patients/{id}',
    getAppointments: '/patients/{id}/appointments',
    getUpcomingAppointments: '/patients/{id}/appointments/upcoming'
  },
  
  // Test patient data - replace with actual test patient information
  testPatient: {
    id: 'TEST_PATIENT_ID',
    email: 'test@example.com'
  },
  
  // Helper function to generate headers for API requests
  getHeaders: function() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'X-Client': this.clientId,
      'Content-Type': 'application/json'
    };
  }
};
```

### Server-Side Integration

The MuntraService class is implemented in `lib/api/services/muntraService.ts` and handles all API interactions with the Muntra system. This service is used by the API routes to communicate with Muntra.

## Testing the Integration

You can use the provided `test-muntra-api.js` script to verify your API connection:

```
node test-muntra-api.js
```

This script will:
1. Search for a patient by email
2. Retrieve patient details
3. Fetch patient appointments

## API Routes

The following API routes are implemented to interface with Muntra:

- `/api/patients/verify` - Verify a patient by email
- `/api/patients/profile` - Get a patient's profile information
- `/api/patients/appointments` - Get a patient's appointments

## Data Models

### Patient Model

```typescript
interface MuntraPatient {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  phone: string
  address?: string
  postalCode?: string
  city?: string
  country?: string
  insuranceInformation?: string
  appointments?: MuntraAppointment[]
}
```

### Appointment Model

```typescript
interface MuntraAppointment {
  id: string
  date: string
  time: string
  duration: number
  clinicName: string
  clinicianName: string
  status: AppointmentStatus
  type: string
  notes?: string
  location?: string
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure your API key and client ID are correct.
2. **CORS Issues**: Make sure your API requests are made server-side through API routes.
3. **Rate Limiting**: The Muntra API may have rate limits; implement proper error handling.
4. **Data Format Changes**: If the Muntra API changes, update the field mappings in the MuntraService class.

## Security Considerations

1. Never expose your API credentials in client-side code
2. Always use environment variables for API keys
3. Implement proper authentication and authorization in your application
4. Validate and sanitize all user inputs before sending to the API

## Support

For issues with the Muntra API, contact their support team. For integration issues with this website, refer to the internal development team. 