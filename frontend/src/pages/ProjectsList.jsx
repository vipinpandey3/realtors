import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const navigate = useNavigate();
  
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    builder_name: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Available filter options (will be populated from API or hardcoded)
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    builders: [],
    statuses: ['active', 'inactive', 'completed']
  });


  // Combined function to fetch both projects and filter options efficiently
  const fetchProjectsAndFilters = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await projectsAPI.getProjects(params);
      
      // API returns data in format: { total, limit, offset, data: [] }
      const projectsData = response.data.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      
      // Update pagination based on API response
      if (response.data.total !== undefined) {
        // Use our frontend limit for pagination calculation, not API limit
        const totalPages = Math.ceil(response.data.total / pagination.limit);
        
        console.log('Pagination Debug:', {
          total: response.data.total,
          frontendLimit: pagination.limit,
          apiLimit: response.data.limit,
          totalPages: totalPages,
          currentPage: pagination.page
        });
        
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: totalPages
        }));
      }

      // On initial load, extract filter options from the first page of data (SINGLE API CALL)
      if (isInitialLoad && filterOptions.locations.length === 0 && projectsData.length > 0) {
        const uniqueLocations = [...new Set(projectsData.map(p => p.location))].filter(Boolean);
        const uniqueBuilders = [...new Set(projectsData.map(p => p.Builder?.name))].filter(Boolean);
        const uniqueStatuses = [...new Set(projectsData.map(p => p.status))].filter(Boolean);
        
        setFilterOptions({
          locations: uniqueLocations.length > 0 ? uniqueLocations : ['All Locations'],
          builders: uniqueBuilders.length > 0 ? uniqueBuilders : ['All Builders'],
          statuses: uniqueStatuses.length > 0 ? uniqueStatuses : ['Ongoing', 'Completed', 'Upcoming']
        });
      }
    } catch (err) {
      // Only log error if it's not a network error (backend not available)
      if (err.code !== 'ERR_NETWORK') {
        console.error('Error fetching projects:', err);
      }
      // Don't show error message for network errors, just use fallback data
      if (err.code === 'ERR_NETWORK') {
        console.log('Backend API not available, using mock data for development');
      } else {
        setError('Failed to load projects. Please try again.');
      }

      // Set fallback filter options on initial load
      if (isInitialLoad) {
        setFilterOptions({
          locations: ['Location 1', 'Location 2', 'Location 3'],
          builders: ['Sample Builder 1', 'Sample Builder 2', 'Sample Builder 3'],
          statuses: ['Ongoing', 'Completed', 'Upcoming']
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    // Initial load - fetch both projects and filter options
    fetchProjectsAndFilters(true);
  }, []);

  useEffect(() => {
    // Subsequent loads - only fetch projects when filters or pagination change
    if (filterOptions.locations.length > 0) {
      fetchProjectsAndFilters(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Event handlers
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  // Render pagination
  const renderPagination = () => {
    console.log('Rendering pagination:', { 
      totalPages: pagination.totalPages, 
      currentPage: pagination.page,
      total: pagination.total,
      limit: pagination.limit 
    });
    
    if (pagination.totalPages <= 1) return null;

    // Simple pagination for testing - show all pages
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      const isActive = pagination.page === i;
      console.log(`Creating page button ${i}, isActive: ${isActive}, className: ${isActive ? 'active' : ''}`);
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={isActive ? 'active' : ''}
          disabled={loading}
          style={{ 
            margin: '0 2px',
            border: '1px solid #ddd',
            background: isActive ? '#007bff' : 'white',
            color: isActive ? 'white' : '#333',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            style={{ 
              margin: '0 2px',
              border: '1px solid #ddd',
              background: 'white',
              color: '#333',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              opacity: pagination.page === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
            style={{ 
              margin: '0 2px',
              border: '1px solid #ddd',
              background: 'white',
              color: '#333',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
              opacity: pagination.page === pagination.totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
        <div className="pagination-info">
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} total projects)
        </div>
      </div>
    );
  };

  return (
    <div className="projects-container">
      <h1>Projects List</h1>
      
      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            {filterOptions.locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="builder">Builder</label>
          <select
            id="builder"
            value={filters.builder_name}
            onChange={(e) => handleFilterChange('builder_name', e.target.value)}
          >
            <option value="">All Builders</option>
            {filterOptions.builders.map(builder => (
              <option key={builder} value={builder}>{builder}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && <div className="loading">Loading projects...</div>}

      {/* Error state */}
      {error && <div className="error">{error}</div>}

      {/* Projects table */}
      {!loading && !error && (
        <>
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Builder Name</th>
                <th>Price Range</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(projects) && projects.map(project => (
                <tr
                  key={project.id}
                  className="project-row"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <td className='text-black'>{project.name}</td>
                  <td className='text-black'>{project.location}</td>
                  <td>
                    <span className={getStatusBadgeClass(project.status)}>
                      {project.status}
                    </span>
                  </td>
                  <td className='text-black'>{project.Builder?.name || 'N/A'}</td>
                  <td className='text-black'>{project.price_range || 'Price on request'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {Array.isArray(projects) && projects.length === 0 && (
            <div className="loading">No projects found with current filters.</div>
          )}

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default ProjectsList;
