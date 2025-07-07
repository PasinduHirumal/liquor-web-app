import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const categories = ['vodka', 'whiskey', 'beer', 'wine', 'gin', 'rum'];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Liquor Store</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                Home
              </NavLink>
            </li>
            {categories.map(category => (
              <li className="nav-item" key={category}>
                <NavLink
                  to={`/${category}`}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
