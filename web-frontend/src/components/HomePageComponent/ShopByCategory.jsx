import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'Wine', image: '/images/wine-glass.png', link: '/wine' },
    { name: 'Whiskey', image: '/images/whiskey-glass.png', link: '/whiskey' },
    { name: 'Beers', image: '/images/beer-glass.png', link: '/beer' },
];

const ShopByCategory = () => {
    return (
        <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">SHOP BY CATEGORY</h3>
                <Link to="/categories" className="btn btn-outline-danger btn-sm">View More</Link>
            </div>
            <div className="row g-4">
                {categories.map((cat) => (
                    <div className="col-md-4" key={cat.name}>
                        <Link
                            to={cat.link}
                            className="text-center d-block border border-light-subtle rounded p-4 text-decoration-none bg-white shadow-sm h-100"
                        >
                            <img src={cat.image} alt={cat.name} className="img-fluid mb-3" style={{ maxHeight: '150px' }} />
                            <h5 className="text-dark">{cat.name}</h5>
                            <span className="text-primary text-decoration-underline small">Shop Now</span>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShopByCategory;
