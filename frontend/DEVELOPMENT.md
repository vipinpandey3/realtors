# Development Guide

## Current Status ✅

The frontend application is **working correctly**! The network errors you see in the console are **expected behavior** when the backend API is not running.

## What's Happening

1. **Network Error is Normal**: The app tries to connect to `http://localhost:3000/api` but the backend server isn't running
2. **Fallback System Works**: When the API fails, the app automatically shows mock data
3. **Full Functionality**: All features work with mock data - filtering, pagination, navigation, etc.

## Console Messages

You'll see these messages in the browser console:

- ✅ `Backend API not available, using mock data for development` - This is normal
- ❌ `API Error: Network Error` - This is expected when backend is not running

## Testing the Frontend

The application is fully functional with mock data:

### ✅ What Works Right Now

- **Projects List Page** (`http://localhost:5173/`)

  - Shows 3 sample projects
  - All filters work (Location, Builder, Status)
  - Pagination controls display
  - Click on any project row to navigate

- **Project Detail Page** (`http://localhost:5173/projects/1`)
  - Shows detailed project information
  - Builder details section
  - Amenities display
  - Back navigation works

### 🔄 Mock Data Available

- 3 sample projects with different statuses
- Complete project details for testing
- Builder information
- All filter options populated

## Connecting to Real Backend

When your backend API is ready:

### 1. Update API Base URL (Optional)

If your backend runs on a different port, update `src/services/api.js`:

```javascript
baseURL: "http://localhost:YOUR_PORT/api",
```

### 2. Expected API Endpoints

Your backend should provide these endpoints:

**GET /api/projects** - Projects list

```json
{
  "total": 25,
  "limit": 20,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "builder_id": 2,
      "name": "Project Name",
      "location": "Location",
      "price_range": "50L-2Cr",
      "status": "Ongoing",
      "Builder": {
        "id": 2,
        "name": "Builder Name",
        "hq_location": "Location",
        "established_year": 2001
      }
    }
  ]
}
```

**GET /api/projects/:id** - Project details

```json
{
  "id": 1,
  "name": "Project Name",
  "location": "Full Location",
  "price_range": "₹50L - ₹80L",
  "status": "active",
  "description": "Project description",
  "area": "1-3 BHK",
  "possession_date": "2025-12-31",
  "total_units": 250,
  "available_units": 45,
  "amenities": ["Swimming Pool", "Gym"],
  "builder": {
    "id": 1,
    "name": "Builder Name",
    "headquarters": "Location",
    "established_year": 1995,
    "description": "Builder description"
  }
}
```

### 3. Query Parameters Supported

- `offset` - Number of records to skip (for pagination)
- `limit` - Items per page
- `location` - Filter by location
- `builder_name` - Filter by builder name
- `status` - Filter by status

## Removing Mock Data

Once your backend is working, you can remove the fallback mock data from:

- `src/pages/ProjectsList.jsx` (lines 76-95)
- `src/pages/ProjectDetail.jsx` (lines 32-50)

## Development Commands

```bash
# Start frontend (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Next Steps

1. ✅ Frontend is complete and working
2. 🔄 Connect your backend API
3. 🧪 Test with real data
4. 🚀 Deploy to production

The frontend is ready for integration!
