import React, { useState } from 'react';
import OrderReport from '../../components/admin/downloadReport/OrderReport';
import DriverReport from '../../components/admin/downloadReport/DriverReport';
import WarehouseReport from '../../components/admin/downloadReport/WarehouseReport';

const Report = () => {
    const [activeComponent, setActiveComponent] = useState('DownloadOrder');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'OrderReport':
                return <OrderReport />;
            case 'DriverReport':
                return <DriverReport />;
            case 'WarehouseReport':
                return <WarehouseReport />;
            default:
                return <OrderReport />;
        }
    };

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center bg-white">
                <div className="card border-0 p-4" style={{ minWidth: '350px', width: '100%' }}>
                    <div className="btn-group w-100 gap-1 mb-4" role="group" aria-label="Login Toggle">
                        <button
                            className={`btn ${activeComponent === 'OrderReport' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveComponent('OrderReport')}
                        >
                            Order Report
                        </button>

                        <button
                            className={`btn ${activeComponent === 'DriverReport' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveComponent('DriverReport')}
                        >
                            Driver Report
                        </button>

                        <button
                            className={`btn ${activeComponent === 'WarehouseReport' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveComponent('WarehouseReport')}
                        >
                            Warehouse Report
                        </button>
                    </div>
                    <div>{renderComponent()}</div>
                </div>
            </div>
        </>
    );
};

export default Report;
