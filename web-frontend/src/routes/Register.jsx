import React, { useState } from 'react'
import AdminRegister from '../pages/AdminRegister';
import UserRegister from '../pages/UserRegister';

const Register = () => {

  const [activeComponent, setActiveComponent] = useState('UserManagement')
  
  const renderComponent = () => {
    switch(activeComponent) {
      case 'AdminRegister':
        return <AdminRegister />
      case 'UserRegister':
        return <UserRegister />
      default:
        return <UserRegister />
    }
  }

  return (
    <div >
      <div className="dashboard-nav">
        <div className="btn-group" role="group" aria-label="Dashboard Navigation">
          <button 
            className={`btn nav-button ${activeComponent === 'UserRegister' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('UserRegister')}
          >
            <span className="btn-text">User Register</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'AdminRegister' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('AdminRegister')}
          >
            <span className="btn-text">Admin Register</span>
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

export default Register