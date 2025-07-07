import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const categories = ['vodka', 'whiskey', 'beer', 'wine', 'gin', 'rum'];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top py-2 px-3 px-md-4">
      <NavLink className="navbar-brand fw-bold fs-4 text-uppercase me-3" to="/">
        🍷 Liquor Store
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ms-auto gap-2 mt-2 mt-lg-0">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                'nav-link px-3 py-2 rounded' + (isActive ? ' active text-warning fw-bold' : '')
              }
            >
              Home
            </NavLink>
          </li>
          {categories.map((category) => (
            <li className="nav-item" key={category}>
              <NavLink
                to={`/${category}`}
                className={({ isActive }) =>
                  'nav-link px-3 py-2 rounded text-capitalize' +
                  (isActive ? ' active text-warning fw-bold' : '')
                }
              >
                {category}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
