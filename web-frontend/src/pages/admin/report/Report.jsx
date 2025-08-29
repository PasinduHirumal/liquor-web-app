import React, { useState } from 'react';
import FinanceReport from './FinanceReport';
import DriverReport from './DriverReport';

const Report = () => {
  const [activeComponent, setActiveComponent] = useState('FinanceReport');

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
    <div className="pt-0 pt-md-3">
      <div className="overflow-auto px-3 mb-3">
        <div className="d-flex gap-2">
          <button
            className={`btn rounded-pill ${activeComponent === 'FinanceReport' ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ minWidth: '130px', flex: '0 0 auto' }}
            onClick={() => setActiveComponent('FinanceReport')}
          >
            Finance Report
          </button>
          <button
            className={`btn rounded-pill ${activeComponent === 'DriverReport' ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ minWidth: '130px', flex: '0 0 auto' }}
            onClick={() => setActiveComponent('DriverReport')}
          >
            Driver Report
          </button>
        </div>
      </div>
      <div>{renderComponent()}</div>
    </div>
  );
};

export default Report;
