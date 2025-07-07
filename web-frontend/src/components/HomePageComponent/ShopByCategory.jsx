import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { liquorsByCategory } from '../../data/data';

const ShopByCategory = () => {
    const [showAll, setShowAll] = useState(false);

    const categories = Object.entries(liquorsByCategory).map(([category, items]) => ({
        name: category,
        image: items[0]?.bottleImage || '',
        link: `/${category.toLowerCase()}`
    }));

    const visibleCategories = showAll ? categories : categories.slice(0, 3);

    const handleToggle = () => {
        setShowAll((prev) => !prev);
    };

    return (
        <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">SHOP BY CATEGORY</h3>
                {categories.length > 3 && (
                    <button
                        onClick={handleToggle}
                        className="btn btn-outline-danger btn-sm"
                    >
                        {showAll ? 'Show Less' : 'View More'}
                    </button>
                )}
            </div>
            <div className="row g-4">
                {visibleCategories.map((cat) => (
                    <div className="col-md-4 col-sm-6" key={cat.name}>
                        <Link
                            to={cat.link}
                            className="text-center d-block border border-light-subtle rounded p-4 text-decoration-none bg-white shadow-sm h-100"
                        >
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
