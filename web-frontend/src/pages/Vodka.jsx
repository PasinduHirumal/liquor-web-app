import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

function Vodka() {
  const vodkaList = liquorsByCategory["Vodka"];
  
  if (!vodkaList || vodkaList.length === 0) {
    return <div className="container mt-5 pt-4 text-center"><h2>No Vodka available</h2></div>;
  }

  return (
    <div className="container mt-5 pt-4">
      <h2 className="mb-4">Vodka Collection</h2>
      <div className="row">
        {vodkaList.map((item, index) => (
          <LiquorCard key={index} liquor={item} />
        ))}
      </div>
    </div>
  );
}

export default Vodka;
