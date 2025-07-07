import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

function Gin() {
  const ginList = liquorsByCategory["Gin"];
  
  if (!ginList || ginList.length === 0) {
    return <div className="container mt-4"><h2>No Gin available</h2></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gin Collection</h2>
      <div className="row">
        {ginList.map((item, index) => (
          <LiquorCard key={index} liquor={item} />
        ))}
      </div>
    </div>
  );
}

export default Gin;
