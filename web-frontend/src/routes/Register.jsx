import React, { useState } from 'react';
import AdminRegister from '../pages/admin/AdminRegister';
import UserRegister from '../pages/user/UserRegister';
import PublicNavbar from '../components/PublicNavbar';

const Register = () => {
  const [activeComponent, setActiveComponent] = useState('UserRegister');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'AdminRegister':
        return <AdminRegister />;
      case 'UserRegister':
        return <UserRegister />;
      default:
        return <UserRegister />;
    }
  };

  return (
    <>
      <PublicNavbar isAuthenticated={false} />
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light px-3 mt-5">
        <h3 className="mt-4 text-center fw-semibold" style={{ letterSpacing: '0.05em' }}>
          Register
        </h3>

        <div
          className="card border-0 p-4 border-0"
          style={{ minWidth: '350px', maxWidth: '500px', width: '100%' }}
        >
          {/* Toggle Buttons */}
          <div className="btn-group w-100 gap-1 mb-4" role="group" aria-label="Register Toggle">
            <button
              className={`btn ${activeComponent === 'UserRegister' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveComponent('UserRegister')}
            >
              User Register
            </button>
            <button
              className={`btn ${activeComponent === 'AdminRegister' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveComponent('AdminRegister')}
            >
              Admin Register
            </button>
          </div>

          {/* Render Form */}
          <div className="fade-in">
            {renderComponent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
