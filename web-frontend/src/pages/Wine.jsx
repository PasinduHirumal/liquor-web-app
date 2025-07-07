import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

function Wine() {
  const wineList = liquorsByCategory["Wine"];
  
  if (!wineList || wineList.length === 0) {
    return <div className="container mt-4"><h2>No wine available</h2></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Wine Collection</h2>
      <div className="row">
        {wineList.map((item, index) => (
          <LiquorCard key={index} liquor={item} />
        ))}
      </div>
    </div>
  );
}

export default Wine;
