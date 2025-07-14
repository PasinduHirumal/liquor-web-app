import React, { useState } from 'react'
import UserLogin from '../pages/UserLogin';
import AdminLogin from '../pages/AdminLogin';

const Login = () => {

    const [activeComponent, setActiveComponent] = useState('UserManagement')

    const renderComponent = () => {
        switch (activeComponent) {
            case 'AdminLogin':
                return <AdminLogin />
            case 'UserLogin':
                return <UserLogin />
            default:
                return <UserLogin />
        }
    }

    return (
        <div >
            <div className="dashboard-nav">
                <div className="btn-group" role="group" aria-label="Dashboard Navigation">
                    <button
                        className={`btn nav-button ${activeComponent === 'UserLogin' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveComponent('UserLogin')}
                    >
                        <span className="btn-text">User Login</span>
                    </button>
                    <button
                        className={`btn nav-button ${activeComponent === 'AdminLogin' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveComponent('AdminLogin')}
                    >
                        <span className="btn-text">Admin Login</span>
                    </button>
                </div>
            </div>

            <div className="">
                <div className="">
                    {renderComponent()}
                </div>
            </div>
        </div>
    )
}

export default Login