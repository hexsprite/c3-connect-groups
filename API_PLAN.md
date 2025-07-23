# API Integration Plan: Planning Center to Static JSON

## Overview

This plan outlines the approach to access the Planning Center API, retrieve Connect Groups data, and generate a static JSON file for the C3 Connect Groups platform. The generated JSON will initially be stored in the public directory with future migration to a CDN.

## Phase 1: API Setup and Authentication

### 1.1 Environment Configuration
- [ ] Set up Planning Center API credentials in `.env.local`
  ```env
  PLANNING_CENTER_APP_ID=your_app_id
  PLANNING_CENTER_SECRET=your_secret
  PLANNING_CENTER_API_BASE=https://api.planningcenteronline.com
  ```
- [ ] Configure API base URL and version (Planning Center API v2)
- [ ] Set up rate limiting parameters (Planning Center limits: 100 requests/minute)

### 1.2 Authentication Setup
- [ ] Set up API key authentication for server-side data fetching (backend app only)
- [ ] Create authentication utilities for API routes
- [ ] Test API connectivity with basic endpoint

## Phase 2: Data Retrieval Strategy

### 2.1 API Endpoint Mapping
Planning Center Groups API endpoints to utilize:
- `/groups/v2/groups` - Main groups endpoint
- `/groups/v2/groups/{id}/events` - Meeting schedule information (if needed)

### 2.2 Required Data Fields
Based on the existing `Group` interface in `src/types/index.ts`:
- **Basic Information**:
  - `id`: Group ID (string)
  - `name`: Group name (string)
  - `description`: Group description (string)
  - `groupType`: 'Mixed' | 'Men' | 'Women'
  - `capacity`: Maximum group size (optional number)
  - `currentMemberCount`: Current enrollment (optional number)
  - `isOpen`: Whether group accepts new members (boolean)
  - `planningCenterUrl`: Link to Planning Center group page (string)
- **Schedule Information**:
  - `meetingDay`: Day of week (string)
  - `meetingTime`: Time category - 'Morning' | 'Afternoon' | 'Evening' (string)
- **Location Data**:
  - `location`: Meeting location name/address (string)
  - `latitude`: Coordinates for map (optional number)
  - `longitude`: Coordinates for map (optional number)
  - `campusLocation`: 'Downtown' | 'Midtown' | 'Hamilton' (string)
- **Media**:
  - `imageUrl`: Group photo URL (optional string)

### 2.3 Data Fetching Implementation
- [ ] Create `src/lib/planning-center.ts` - API client and utilities
- [ ] Implement pagination handling for large datasets
- [ ] Add error handling and retry mechanisms with exponential backoff
- [ ] Implement request caching to respect rate limits
- [ ] Filter for active connect groups only
- [ ] Add request logging for debugging

## Phase 3: JSON File Generation

### 3.1 Data Processing
- [ ] Transform Planning Center API response to match our `Group` type structure
- [ ] Normalize location data for Google Maps integration
- [ ] Process meeting schedules into filterable formats (day, time categories)
- [ ] Optimize image URLs and validate media accessibility
- [ ] Handle missing or incomplete data gracefully

### 3.2 Static File Creation
- [ ] Generate `public/groups.json` file
- [ ] Include metadata object:
  ```json
  {
    "metadata": {
      "lastUpdated": "2024-01-15T10:30:00Z",
      "totalGroups": 45,
      "version": "1.0",
      "source": "planning-center"
    },
    "groups": [...]
  }
  ```
- [ ] Implement data validation before file creation
- [ ] Add JSON compression/minification for production
- [ ] Create backup of previous version before overwriting

### 3.3 File Structure Design
```typescript
interface GroupsData {
  metadata: {
    lastUpdated: string;
    totalGroups: number;
    version: string;
    source: string;
  };
  groups: Group[]; // Uses existing Group interface from src/types/index.ts
}

// Existing Group interface (for reference):
interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  groupType: 'Mixed' | 'Men' | 'Women';
  capacity?: number;
  currentMemberCount?: number;
  isOpen: boolean;
  imageUrl?: string;
  planningCenterUrl: string;
  latitude?: number;
  longitude?: number;
  campusLocation: 'Downtown' | 'Midtown' | 'Hamilton';
}
```

## Phase 4: Update Mechanism

### 4.1 Manual Trigger System
- [ ] Create admin API route `/api/admin/generate-groups-data`
- [ ] Add authentication/authorization for admin access
- [ ] Implement progress tracking for long-running generation
- [ ] Add email notifications on completion/failure
- [ ] Create simple admin interface for triggering updates

### 4.2 Webhook Integration
- [ ] Create simple POST webhook endpoint `/api/webhooks/planning-center`
- [ ] Accept POST requests to trigger group data regeneration
- [ ] Return appropriate HTTP status codes (200, 500, etc.)
- [ ] Handle webhook processing asynchronously to prevent timeout issues
- [ ] **BACKLOG**: Add webhook signature verification for security

### 4.3 Automation Preparation
- [ ] Design for future scheduled updates via cron jobs or Vercel cron
- [ ] Plan for incremental updates strategy
- [ ] Consider change detection to minimize unnecessary regeneration

## Phase 5: CDN Migration Preparation

### 5.1 File Structure for CDN
- [ ] Design JSON structure for CDN compatibility
- [ ] Plan for versioning strategy (e.g., `groups-v1.json`, `groups-latest.json`)
- [ ] Consider multiple file strategy:
  - `groups-metadata.json` - Just metadata for quick checks
  - `groups-data.json` - Full dataset
  - `groups-search.json` - Optimized for search functionality

### 5.2 Performance Optimization
- [ ] Implement GZIP compression
- [ ] Add appropriate cache headers
- [ ] Plan for global CDN distribution (Vercel, CloudFlare, AWS CloudFront)
- [ ] Design cache invalidation strategy

## Implementation Files

### Core Files to Create
1. **`src/lib/planning-center.ts`**
   - API client class
   - API key authentication (no OAuth needed)
   - Rate limiting utilities
   - Error handling

2. **`src/app/api/generate-groups-data/route.ts`**
   - Manual data generation endpoint
   - File writing logic to `public/groups.json`
   - Response handling

3. **`src/app/api/webhooks/planning-center/route.ts`**
   - Simple POST webhook endpoint (no auth for now)
   - Triggers group data regeneration
   - Async processing

4. **`src/types/planning-center.ts`**
   - Planning Center API response types
   - Data transformation interfaces
   - Mappings to existing `Group` interface

5. **`scripts/generate-groups.js`** (Optional)
   - CLI script for manual generation
   - Useful for development and testing

### Configuration Files
- `.env.local` - API credentials and configuration
- `next.config.js` - Add any required API proxy settings

## Rate Limiting Strategy

### Planning Center API Limits
- **Rate Limit**: 100 requests per minute
- **Burst Limit**: Additional requests allowed in short bursts
- **Best Practices**:
  - Use batch requests where supported
  - Implement request queuing
  - Cache responses during generation process
  - Add delays between requests if needed

### Implementation
```typescript
class RateLimiter {
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private requestsPerMinute = 80; // Buffer below 100 limit
  
  async addRequest<T>(request: () => Promise<T>): Promise<T> {
    // Implementation details
  }
}
```

## Error Handling & Monitoring

### Error Scenarios
- [ ] Planning Center API unavailable
- [ ] Authentication failures
- [ ] Rate limit exceeded
- [ ] Invalid/missing data fields
- [ ] File system write errors

### Monitoring & Logging
- [ ] Log all API requests and responses
- [ ] Track generation success/failure rates
- [ ] Monitor file generation times
- [ ] Alert on repeated failures

### Graceful Degradation
- [ ] Use cached/previous JSON file if generation fails
- [ ] Validate required fields before JSON generation
- [ ] Provide partial data if some groups fail to fetch

## Security Considerations

### API Security
- [ ] Secure storage of API credentials
- [ ] Implement API key rotation strategy
- [ ] Use environment-specific credentials

### File Security
- [ ] Validate JSON structure before serving
- [ ] Sanitize any user-generated content
- [ ] Implement access logging for admin endpoints

## Testing Strategy

### Unit Tests
- [ ] Test API client functionality
- [ ] Test data transformation logic
- [ ] Test file generation process

### Integration Tests
- [ ] Test full data pipeline
- [ ] Test error scenarios
- [ ] Test rate limiting behavior

### Manual Testing
- [ ] Verify JSON file structure
- [ ] Test with Planning Center staging environment
- [ ] Validate map integration with generated coordinates

## Success Criteria

### Functional Requirements
- [ ] Successfully fetch all active Connect Groups from Planning Center
- [ ] Generate valid JSON file with all required fields
- [ ] Handle API rate limits without errors
- [ ] Complete generation process within 5 minutes
- [ ] Maintain data integrity across updates

### Performance Requirements
- [ ] JSON file size < 1MB for fast loading
- [ ] Generation process completes within 5 minutes
- [ ] Support for 500+ groups without performance degradation

## Next Steps

1. **Review this plan** and confirm approach
2. **Set up Planning Center API credentials** in development environment
3. **Implement Phase 1** - Basic API setup and authentication
4. **Create initial data fetching** logic for testing
5. **Build JSON generation** pipeline
6. **Test with real Planning Center data**
7. **Implement admin interface** for manual triggers
8. **Plan CDN migration** strategy

---

**Document Status**: Draft  
**Created**: [Current Date]  
**Next Review**: After Phase 1 implementation 