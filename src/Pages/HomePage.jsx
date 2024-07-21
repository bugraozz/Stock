import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to Home Page</h1>
      <div className="card-container">
        <div className="card">
          <h2>Page 1</h2>
          <p>Some description for Page 1.</p>
          <Link to="/admin">Go to Page 1</Link>
        </div>
        <div className="card">
          <h2>Page 2</h2>
          <p>Some description for Page 2.</p>
          <Link to="/stock">Go to Page 2</Link>
        </div>
        <div className="card">
          <h2>Page 3</h2>
          <p>Some description for Page 3.</p>
          <Link to="/page3">Go to Page 3</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;



