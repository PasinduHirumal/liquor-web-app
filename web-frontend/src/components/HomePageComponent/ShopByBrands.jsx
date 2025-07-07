import React from 'react';
import { liquorsByBrand } from '../../data/data';

const ShopByBrands = () => {
    const brandLogos = Object.keys(liquorsByBrand)
        .slice(0, 6)
        .map((brand) => ({
            name: brand,
            image: liquorsByBrand[brand][0].brandImage,
        }));

    return (
        <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">SHOP BY BRAND</h3>
                <a href="/brands" className="btn btn-outline-danger btn-sm">View More</a>
            </div>
            <div className="row g-4 text-center">
                {brandLogos.map((brand) => (
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
