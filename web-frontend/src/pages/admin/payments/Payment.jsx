import React, { useState } from 'react';
import DriverPayment from './DriverPayment';
import Office from './office';
import FinanceSummery from '../../../components/admin/payment/FinanceSummery';

const Payment = () => {
    const [activeComponent, setActiveComponent] = useState('DriverPayment');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'DriverPayment':
                return <DriverPayment />;
            case 'Office':
                return <Office />;
            default:
                return <DriverPayment />;
        }
    };

    return (
        <div className="pt-0 pt-md-3 bg-white">
            <FinanceSummery />
            <div className="overflow-auto px-3 mb-3">
                <div className="d-flex gap-2">
                    <button
                        className={`btn rounded-pill ${activeComponent === 'DriverPayment' ? 'btn-primary' : 'btn-outline-dark'}`}
                        style={{ minWidth: '130px', flex: '0 0 auto' }}
                        onClick={() => setActiveComponent('DriverPayment')}
                    >
                        Driver Payment
                    </button>

                    <button
                        className={`btn rounded-pill ${activeComponent === 'Office' ? 'btn-primary' : 'btn-outline-dark'}`}
                        style={{ minWidth: '130px', flex: '0 0 auto' }}
                        onClick={() => setActiveComponent('Office')}
                    >
                        Office
                    </button>
                </div>
            </div>
            <div>{renderComponent()}</div>
        </div>
    );
};

export default Payment;
