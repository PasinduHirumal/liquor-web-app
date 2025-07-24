import React, { useState } from 'react';
import UserLogin from '../pages/user/UserLogin';
import AdminLogin from '../pages/admin/AdminLogin';
import PublicNavbar from '../components/publicNavbar';

const Login = () => {
    const [activeComponent, setActiveComponent] = useState('UserLogin');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'AdminLogin':
                return <AdminLogin />;
           {/*  case 'UserLogin':
                return <UserLogin />; */}
            default:
                return <AdminLogin />;
        }
    };

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center">
                <h3 className="mt-3 m-0 p-0 text-center fw-semibold" style={{ letterSpacing: '0.05em' }}>
                    Sign In
                </h3>
                <div className="card border-0 p-4" style={{ minWidth: '350px', maxWidth: '450px', width: '100%' }}>
                    <div className="btn-group w-100 gap-1 mb-4" role="group" aria-label="Login Toggle">
                        
                        {/*
                        <button
                            className={`btn ${activeComponent === 'UserLogin' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveComponent('UserLogin')}
                        >
                            User Login
                        </button>
                        */}
                        <button
                            className={`btn ${activeComponent === 'AdminLogin' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveComponent('AdminLogin')}
                        >
                            Admin Login
                        </button>
                    </div>
                    <div>{renderComponent()}</div>
                </div>
            </div>
        </>
    );
};

export default Login;
