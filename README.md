# Dental Clinic Website

A modern dental clinic website with patient portal integration.

## API Integration Setup

This project integrates with your existing patient management system through a secure API. Follow these steps to set up the integration:

### 1. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-existing-system-api.com
API_KEY=your-api-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
```

### 2. API Endpoints

The system expects the following API endpoints from your existing system:

#### Verify Patient
- **Endpoint**: `POST /api/patients/verify`
- **Request Body**:
  ```json
  {
    "email": "patient@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "exists": true,
    "patientId": "12345"
  }
  ```

#### Get Patient Details
- **Endpoint**: `GET /api/patients/details/{patientId}`
- **Response**:
  ```json
  {
    "patient": {
      "id": "12345",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+46123456789",
      "dateOfBirth": "1980-01-01",
      "medicalHistory": {},
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
  ```

### 3. Security Considerations

- All API requests are authenticated using the `API_KEY` environment variable
- The API key should be kept secure and never exposed to the client
- All API communication is done over HTTPS
- The system implements retry logic with exponential backoff for failed requests
- Rate limiting is handled automatically

### 4. Error Handling

The API client includes robust error handling:
- Automatic retries for server errors (5xx) and rate limiting (429)
- No retries for client errors (4xx)
- Detailed error messages for debugging
- Type-safe error responses

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
   - API client for low-level HTTP communication
   - Service layer for domain-specific logic
   - Type definitions for type safety

2. **Error Handling**:
   - Custom error classes
   - Retry logic with exponential backoff
   - Detailed error messages

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
   - Proper caching strategies
   - Optimized retry logic 