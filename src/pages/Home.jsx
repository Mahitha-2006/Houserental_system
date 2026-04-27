import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import './Home.css';

// Import local images
import hydImage from '../assets/images/hyd.avif';
import puneImage from '../assets/images/pune.webp';
import chennaiImage from '../assets/images/chennai.jpg';
import vizagImage from '../assets/images/vizag.avif';
import mysoreImage from '../assets/images/mysore.jpg';
import homeBgImage from '../assets/images/home.jpg';

const API_URL = 'http://localhost:5000';

function Home() {
  const navigate = useNavigate();
  const [popularLocations, setPopularLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch property counts for each city
        const cities = ['hyderabad', 'bengaluru', 'mumbai', 'pune', 'goa', 'chennai', 'vizag', 'mysore'];
        const cityCounts = {};
        
        for (const city of cities) {
          try {
            const response = await fetch(`${API_URL}/properties/city/${city}?limit=1`);
            if (response.ok) {
              const data = await response.json();
              cityCounts[city] = data.pagination?.totalProperties || 0;
            }
          } catch (error) {
            console.error(`Error fetching count for ${city}:`, error);
            cityCounts[city] = 0;
          }
        }
        
        setPopularLocations([
          { name: 'Hyderabad', count: cityCounts.hyderabad || 156, slug: 'hyderabad', image: hydImage },
          { name: 'Bengaluru', count: cityCounts.bengaluru || 245, slug: 'bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
          { name: 'Mumbai', count: cityCounts.mumbai || 189, slug: 'mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' },
          { name: 'Pune', count: cityCounts.pune || 176, slug: 'pune', image: puneImage },
          { name: 'Goa', count: cityCounts.goa || 312, slug: 'goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400' },
          { name: 'Chennai', count: cityCounts.chennai || 168, slug: 'chennai', image: chennaiImage },
          { name: 'Vizag', count: cityCounts.vizag || 98, slug: 'vizag', image: vizagImage },
          { name: 'Mysore', count: cityCounts.mysore || 145, slug: 'mysore', image: mysoreImage }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data
        setPopularLocations([
          { name: 'Hyderabad', count: 156, slug: 'hyderabad', image: hydImage },
          { name: 'Bengaluru', count: 245, slug: 'bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
          { name: 'Mumbai', count: 189, slug: 'mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' },
          { name: 'Pune', count: 176, slug: 'pune', image: puneImage },
          { name: 'Goa', count: 312, slug: 'goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400' },
          { name: 'Chennai', count: 168, slug: 'chennai', image: chennaiImage },
          { name: 'Vizag', count: 98, slug: 'vizag', image: vizagImage },
          { name: 'Mysore', count: 145, slug: 'mysore', image: mysoreImage }
        ]);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.checkIn) params.append('checkIn', searchParams.checkIn);
    if (searchParams.checkOut) params.append('checkOut', searchParams.checkOut);
    if (searchParams.guests) params.append('guests', searchParams.guests);
    navigate(`/browse?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing places...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section" style={{ 
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%), url(${homeBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="hero-content">
          <h1>Find Your Perfect Home Away From Home</h1>
          <p>Discover, book, and rent unique homes and apartments with ease.</p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                placeholder="Search by city, location..."
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
            <div className="search-input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                placeholder="Check in"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
              />
            </div>
            <div className="search-input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                type="date"
                placeholder="Check out"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
              />
            </div>
            <div className="search-input-group">
              <FaUser className="input-icon" />
              <input
                type="number"
                min="1"
                placeholder="Guests"
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
              />
            </div>
            <button type="submit" className="search-button">
              <FaSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Popular Locations - 8 cities */}
      <section className="locations-section">
        <div className="section-header">
          <h2>Popular locations</h2>
        </div>
        <div className="locations-grid">
          {popularLocations.map((location, index) => (
            <Link to={`/${location.slug}`} key={index} className="location-card">
              <div className="location-image">
                <img src={location.image} alt={location.name} />
                <div className="location-overlay">
                  <h3>{location.name}</h3>
                  <p>{location.count} properties</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;