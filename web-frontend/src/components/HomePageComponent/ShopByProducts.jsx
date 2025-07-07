import React from 'react';
import { liquorsByCategory } from '../../data/data';
import { useNavigate } from 'react-router-dom';

const ShopByProducts = () => {
    const navigate = useNavigate();

    const allProducts = Object.values(liquorsByCategory)
        .flat()
        .filter((item) => item?.bottleImage);

    const visibleItems = allProducts.slice(0, 6);

    const handleNavigate = () => {
        navigate('/products');
    };

    return (
        <section className="my-5 px-3 px-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Shop By Products
                </h3>
                {allProducts.length > 6 && (
                    <button
                        onClick={handleNavigate}
                        className="btn btn-outline-danger btn-sm"
                        style={{ minWidth: '100px' }}
                    >
                        View More
                    </button>
                )}
            </div>
            <div className="row g-4">
                {visibleItems.map((item) => (
                    <div className="col-6 col-md-4 col-lg-2" key={item.name}>
                        <div className="card h-100 shadow-sm">
                            <img
                                src={item.bottleImage}
                                className="card-img-top p-3"
                                alt={item.name}
                                style={{ height: '180px', objectFit: 'contain' }}
                            />
                            <div className="card-body text-center">
                                <h6 className="card-title text-truncate">{item.name}</h6>
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
