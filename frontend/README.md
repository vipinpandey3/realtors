# Realtors Frontend

A React application for browsing real estate projects and their details.

## Features

### Projects List Page

- Display all projects in a responsive table format
- Filter projects by:
  - Location
  - Builder name
  - Status (active, inactive, completed)
- Pagination support
- Click on any project row to view details

### Project Detail Page

- Comprehensive project information including:
  - Project name, location, price range, status
  - Configuration, possession date, total/available units
  - Amenities list
- Builder information:
  - Name, headquarters, established year
  - Total and completed projects
  - Builder description
- Back to projects navigation

## Tech Stack

- **React 19** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and development server
- **CSS3** - Styling with responsive design

## Project Structure

```
src/
├── components/          # Reusable components (empty for now)
├── pages/              # Page components
│   ├── ProjectsList.jsx # Projects listing with filters
│   └── ProjectDetail.jsx # Individual project details
├── services/           # API services
│   └── api.js          # API configuration and endpoints
├── utils/              # Utility functions (empty for now)
├── App.jsx             # Main app component with routing
├── App.css             # Global styles
├── main.jsx            # Entry point
└── index.css           # Base styles
```

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd realtors/frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (optional)

```bash
# Create .env file in the root directory
REACT_APP_API_URL=http://localhost:3000/api
```

4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application is designed to work with a backend API. Currently includes fallback mock data for testing when the API is not available.

### Expected API Endpoints

#### Projects

- `GET /api/projects` - Get all projects with optional query parameters:

  - `page` - Page number for pagination
  - `limit` - Number of items per page
  - `location` - Filter by location
  - `builder_name` - Filter by builder name
  - `status` - Filter by status

  **Response format:**

  ```json
  {
    "projects": [
      {
        "id": 1,
        "name": "Project Name",
        "location": "Location",
        "status": "active",
        "builder_name": "Builder Name",
        "price_range": "₹50L - ₹80L"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```

- `GET /api/projects/:id` - Get project details by ID

  **Response format:**

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

## Features Implemented

✅ **Projects List Page**

- Responsive table layout
- Location, builder name, and status filters
- Pagination with previous/next buttons
- Click-to-navigate to project details
- Loading and error states
- Mock data fallback

✅ **Project Detail Page**

- Complete project information display
- Builder details section
- Amenities display
- Responsive design
- Back to projects navigation
- Loading and error states

✅ **API Integration**

- Axios configuration with interceptors
- Centralized API service layer
- Error handling
- Mock data for testing

✅ **Responsive Design**

- Mobile-friendly layout
- Flexible grid system
- Responsive navigation

## Assumptions Made

1. **API Response Format**: Assumed standard REST API responses with consistent data structure
2. **Authentication**: Basic token-based auth structure prepared but not implemented
3. **Status Values**: Assumed three main project statuses (active, inactive, completed)
4. **Price Format**: Used Indian Rupee format for price ranges
5. **Pagination**: Implemented page-based pagination (not infinite scroll for simplicity)

## Potential Improvements

### Short Term

- Add search functionality for project names
- Implement sorting options (by price, date, etc.)
- Add loading skeletons for better UX
- Include project images/gallery
- Add form validation for filters

### Medium Term

- Implement infinite scroll as an alternative to pagination
- Add project comparison feature
- Include map integration for project locations
- Add favorites/wishlist functionality
- Implement advanced filters (price range slider, amenities)

### Long Term

- Add user authentication and profiles
- Include property booking/inquiry forms
- Add real-time notifications
- Implement data caching and offline support
- Add analytics and tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.
