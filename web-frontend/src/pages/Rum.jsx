import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

function Rum() {
  const rumList = liquorsByCategory["Rum"];
  
  if (!rumList || rumList.length === 0) {
    return <div className="container mt-5 pt-4 text-center"><h2>No Rum available</h2></div>;
  }

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4">Rum Collection</h2>
      <div className="row">
        {rumList.map((item, index) => (
          <LiquorCard key={index} liquor={item} />
        ))}
      </div>
    </div>
  );
}

export default Rum;
