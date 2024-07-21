import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminPage from './Pages/AdminPage';
import HomePage from './Pages/HomePage';
import StockPage from './Pages/StockPage';

function App() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setShowForm(false);
      navigate('/home'); 
    } catch (err) {
      if (err.response && err.response.data) {
        console.error('Giriş başarısız:', err.response.data);
      } else {
        console.error('Giriş başarısız:', err.message);
      }
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <>
          <div className="app_search-list-container">
            <form className="app_search-form">
              <input type="text" className="app_form-input" placeholder="Search product" />
              <button className="app_search-btn" type="submit">Search</button>
            </form>
          </div>
          <button onClick={handleButtonClick} className="top-left-button">Log in</button>
          {showForm && (
            <div ref={formRef} className="app_form-container">
              <form onSubmit={handleLogin}>
                <div className="app_form-group">
                  <label htmlFor="username">User Name:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="app_form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </>
      } />
      <Route path="/admin" element={<AdminPage/>} />
      <Route path="/home"  element={<HomePage/>} />
      <Route path="/stock" element={<StockPage/>}/>
    </Routes>
  );
}

export default App;


