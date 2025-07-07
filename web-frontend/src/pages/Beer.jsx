import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

function Beer() {
  const BeerList = liquorsByCategory["Beer"];

  if (!BeerList || BeerList.length === 0) {
    return <div className="container mt-5 pt-4 text-center"><h2>No Beer available</h2></div>;
  }
  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4">Beer Collection</h2>
      <div className="row">
        {BeerList.map((item, index) => (
          <LiquorCard key={index} liquor={item} />
        ))}
      </div>
    </div>
  );
}

export default Beer;
