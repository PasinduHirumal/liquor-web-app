import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

const AllProducts = () => {
    const allProducts = Object.values(liquorsByCategory)
        .flat()
        .filter((item) => item?.bottleImage);

    return (
        <section className="container mt-5 pt-4">
            <h3 className="fw-bold mb-4 text-uppercase text-center">All Products</h3>
            <div className="row">
                {allProducts.map((liquor) => (
                    <LiquorCard key={liquor.name} liquor={liquor} />
                ))}
            </div>
        </section>
    );
};

export default AllProducts;
