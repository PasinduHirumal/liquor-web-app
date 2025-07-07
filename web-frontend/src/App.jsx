import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Vodka from './pages/Vodka';
import Whiskey from './pages/Whiskey';
import Beer from './pages/Beer';
import Wine from './pages/Wine';
import Gin from './pages/Gin';
import Rum from './pages/Rum';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vodka" element={<Vodka />} />
        <Route path="/whiskey" element={<Whiskey />} />
        <Route path="/beer" element={<Beer />} />
        <Route path="/wine" element={<Wine />} />
        <Route path="/gin" element={<Gin />} />
        <Route path="/rum" element={<Rum />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
