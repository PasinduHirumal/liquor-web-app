import React, { useState } from 'react';
import FinanceReport from './FinanceReport';
import DriverReport from './DriverReport';

const Report = () => {
  const [activeComponent, setActiveComponent] = useState('UserLogin');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'FinanceReport':
        return <FinanceReport />;
      case 'DriverReport':
        return <DriverReport />;
      default:
        return <FinanceReport />;
    }
  };

  return (
    <>
      <div className="pt-0 pt-md-3">
        <div className="btn-group w-50 gap-2 mb-4" role="group" aria-label="Login Toggle">
          <button
            className={`btn ${activeComponent === 'FinanceReport' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('FinanceReport')}
          >
            Finance Report
          </button>
          <button
            className={`btn ${activeComponent === 'DriverReport' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('DriverReport')}
          >
            Driver Report
          </button>
        </div>
        <div>{renderComponent()}</div>
      </div>
    </>
  );
};

export default Report;
