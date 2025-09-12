import React, { useState } from 'react';
import DriverPayment from './DriverPayment';
import CashWithdraws from './CashWithdraws';
import FinanceSummery from '../../../components/admin/payment/FinanceSummery';

const Payment = () => {
    const [activeComponent, setActiveComponent] = useState('DriverPayment');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'DriverPayment':
                return <DriverPayment />;
            case 'CashWithdraws':
                return <CashWithdraws />;
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
                        className={`btn rounded-pill ${activeComponent === 'CashWithdraws' ? 'btn-primary' : 'btn-outline-dark'}`}
                        style={{ minWidth: '130px', flex: '0 0 auto' }}
                        onClick={() => setActiveComponent('CashWithdraws')}
                    >
                        Cash Withdraws
                    </button>
                </div>
            </div>
            <div>{renderComponent()}</div>
        </div>
    );
};

export default Payment;
