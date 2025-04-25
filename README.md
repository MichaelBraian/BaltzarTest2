# Dental Clinic Website

A modern dental clinic website with patient portal integration.

## API Integration Setup

This project integrates with the Muntra Patient Management System through a secure API. Follow these steps to set up the integration:

### 1. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
# Muntra API Configuration
MUNTRA_API_BASE_URL=https://api.muntra.com
MUNTRA_API_KEY=your-muntra-api-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
```

### 2. Muntra API Integration

The system integrates with the following Muntra API endpoints:

#### Verify Patient
- Checks if a patient exists by email
- Implemented in `muntraService.verifyPatient()`

#### Get Patient Details
- Retrieves detailed patient information
- Implemented in `muntraService.getPatientDetails()`

#### Update Patient Profile
- Updates patient information in the Muntra system
- Implemented in `muntraService.updatePatientProfile()`
- Used by the profile edit form in the dashboard

### 3. Security Considerations

- All API requests are authenticated using the `MUNTRA_API_KEY` environment variable
- The API key should be kept secure and never exposed to the client
- All API communication is done over HTTPS
- The system implements robust error handling for failed requests
- Rate limiting is handled appropriately

### 4. Error Handling

The Muntra API client includes robust error handling:
- Specific error messages based on response status codes
- Detailed error logging for debugging
- Type-safe error responses
- User-friendly error messages displayed in the UI

### 5. Development

To run the project locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 6. Deployment

The project is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `.next`
4. Configure the environment variables in Netlify's dashboard

## Architecture

The API integration follows these best practices:

1. **Separation of Concerns**:
   - `muntraService.ts` handles Muntra API communication
   - Type definitions for Muntra data structures
   - API route handlers for secure server-side communication

2. **Error Handling**:
   - Specific error handling based on HTTP status codes
   - Client-side validation before API calls
   - User-friendly error messages

3. **Security**:
   - API key authentication
   - HTTPS-only communication
   - Secure environment variable handling

4. **Maintainability**:
   - Modular code structure
   - Comprehensive documentation
   - Type safety throughout

5. **Performance**:
   - Efficient request handling
   - Proper error handling
   - Form validation 