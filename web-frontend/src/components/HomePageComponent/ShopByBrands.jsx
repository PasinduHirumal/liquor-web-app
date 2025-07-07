import React, { useState } from 'react';
import { liquorsByBrand } from '../../data/data';

const ShopByBrands = () => {
    const [showAll, setShowAll] = useState(false);

    const allBrands = Object.keys(liquorsByBrand).map((brand) => ({
        name: brand,
        image: liquorsByBrand[brand][0]?.brandImage || '',
    }));

    const visibleBrands = showAll ? allBrands : allBrands.slice(0, 6);

    const handleToggle = () => setShowAll((prev) => !prev);

    return (
        <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">SHOP BY BRAND</h3>
                {allBrands.length > 6 && (
                    <button
                        onClick={handleToggle}
                        className="btn btn-outline-danger btn-sm"
                    >
                        {showAll ? 'Show Less' : 'View More'}
                    </button>
                )}
            </div>
            <div className="row g-4 text-center">
                {visibleBrands.map((brand) => (
                    <div className="col-4 col-md-2" key={brand.name}>
                        <img
                            src={brand.image}
                            alt={brand.name}
                            className="img-fluid p-2 bg-white shadow-sm rounded"
                            style={{ height: '90px', objectFit: 'contain' }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShopByBrands;
