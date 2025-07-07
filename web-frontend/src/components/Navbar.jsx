import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const categories = ['vodka', 'whiskey', 'beer', 'wine', 'gin', 'rum'];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top py-3">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 text-uppercase" to="/">
          🍷 Liquor Store
        </NavLink>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  'nav-link px-3 rounded' + (isActive ? ' active text-warning fw-bold' : '')
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
                    'nav-link px-3 rounded text-capitalize' +
                    (isActive ? ' active text-warning fw-bold' : '')
                  }
                >
                  {category}
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
