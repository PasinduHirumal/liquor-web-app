import React from 'react';
import { liquorsByCategory } from '../../data/data';

const ShopByProducts = () => {
    const vodkaItems = liquorsByCategory['Vodka']?.slice(0, 5) || [];

    return (
        <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">SHOP BY PRODUCTS</h3>
                <a href="/vodka" className="btn btn-outline-danger btn-sm">View More</a>
            </div>
            <div className="row g-4">
                {vodkaItems.map((item) => (
                    <div className="col-6 col-md-4 col-lg-2" key={item.name}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={item.bottleImage}
                                className="card-img-top p-3"
                                alt={item.name}
                                style={{ height: '180px', objectFit: 'contain' }}
                            />
                            <div className="card-body text-center">
                                <h6 className="card-title">{item.name}</h6>
                                <p className="card-text fw-bold text-success">{item.price}</p>
                                <button className="btn btn-sm btn-danger">Add to cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShopByProducts;
