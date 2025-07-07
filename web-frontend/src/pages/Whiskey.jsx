import React from 'react';
import { liquorsByCategory } from '../data/data';
import LiquorCard from '../components/LiquorCard';

function Whiskey() {
  const whiskeyList = liquorsByCategory["Whiskey"];
  
  if (!whiskeyList || whiskeyList.length === 0) {
    return <div className="container mt-4"><h2>No Whiskey available</h2></div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Whiskey Collection</h2>
      <div className="row">
        {whiskeyList.map((item, index) => (
          <LiquorCard key={index} liquor={item} />
        ))}
      </div>
    </div>
  );
}

export default Whiskey;
