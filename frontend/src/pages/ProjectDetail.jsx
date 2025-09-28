import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsAPI.getProject(id);
      // API might return data directly or wrapped in data property
      setProject(response.data.data || response.data);
    } catch (err) {
      // Only log error if it's not a network error (backend not available)
      if (err.code !== 'ERR_NETWORK') {
        console.error('Error fetching project details:', err);
      }
      // Don't show error message for network errors, just use fallback data
      if (err.code === 'ERR_NETWORK') {
        console.log('Backend API not available, using mock data for development');
      } else {
        setError('Failed to load project details. Please try again.');
      }
      
      // Fallback mock data for testing
      setProject({
        id: parseInt(id),
        name: 'Green Valley Apartments',
        location: 'Andheri West, Mumbai',
        price_range: '₹50L - ₹80L',
        status: 'active',
        description: 'A premium residential project offering modern amenities and excellent connectivity.',
        area: '1-3 BHK',
        possession_date: '2025-12-31',
        total_units: 250,
        available_units: 45,
        amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 'Security'],
        builder: {
          id: 1,
          name: 'ABC Builders',
          headquarters: 'Mumbai, Maharashtra',
          established_year: 1995,
          description: 'Leading real estate developer with 25+ years of experience in residential and commercial projects.',
          total_projects: 50,
          completed_projects: 45
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetail();
    }
  }, [id]);

  const getStatusBadgeClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="project-detail">
        <Link to="/projects" className="back-button">
          ← Back to Projects
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <Link to="/projects" className="back-button">
          ← Back to Projects
        </Link>
        <div className="error">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <Link to="/projects" className="back-button">
        ← Back to Projects
      </Link>

      {/* Project Header */}
      <div className="detail-section">
        <h1>{project.name}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
          {project.description}
        </p>
      </div>

      {/* Project Details */}
      <div className="detail-section">
        <h2>Project Information</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <span className="detail-value">{project.location}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Price Range</span>
            <span className="detail-value">{project.price_range}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className={getStatusBadgeClass(project.status)}>
              {project.status}
            </span>
          </div>
          
          {project.area && (
            <div className="detail-item">
              <span className="detail-label">Configuration</span>
              <span className="detail-value">{project.area}</span>
            </div>
          )}
          
          {project.possession_date && (
            <div className="detail-item">
              <span className="detail-label">Possession Date</span>
              <span className="detail-value">{formatDate(project.possession_date)}</span>
            </div>
          )}
          
          {project.total_units && (
            <div className="detail-item">
              <span className="detail-label">Total Units</span>
              <span className="detail-value">{project.total_units}</span>
            </div>
          )}
          
          {project.available_units !== undefined && (
            <div className="detail-item">
              <span className="detail-label">Available Units</span>
              <span className="detail-value">{project.available_units}</span>
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      {project.amenities && project.amenities.length > 0 && (
        <div className="detail-section">
          <h2>Amenities</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.amenities.map((amenity, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '15px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Builder Information */}
          {project.Builder && (
        <div className="detail-section">
          <h2>Builder Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Builder Name</span>
              <span className="detail-value">{project.Builder.name}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Headquarters</span>
              <span className="detail-value">{project.Builder.hq_location}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Established Year</span>
              <span className="detail-value">{project.Builder.established_year}</span>
            </div>
            
            {project.Builder.total_projects && (
              <div className="detail-item">
                <span className="detail-label">Total Projects</span>
                <span className="detail-value">{project.Builder.total_projects}</span>
              </div>
            )}
            
            {project.Builder.completed_projects && (
              <div className="detail-item">
                <span className="detail-label">Completed Projects</span>
                <span className="detail-value">{project.Builder.completed_projects}</span>
              </div>
            )}
          </div>
          
          {project.Builder.description && (
            <div style={{ marginTop: '1rem' }}>
              <span className="detail-label">About Builder</span>
              <p style={{ marginTop: '0.5rem', color: '#666', lineHeight: '1.6' }}>
                {project.Builder.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
