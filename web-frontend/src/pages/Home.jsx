import React from 'react';
import ShopByCategory from '../components/HomePageComponent/ShopByCategory';
import ShopByProducts from '../components/HomePageComponent/ShopByProducts';
import ShopByBrands from '../components/HomePageComponent/ShopByBrands';

function Home() {
  return (
    <>
      {/* Hero Banner */}
      <div className="container-fluid p-0 pt-2 mt-5">
        <img
          src="https://img.freepik.com/premium-photo/premium-liquor-selection-glossy-bar-surface-banner_40453-5271.jpg"
          alt="Liquor Banner"
          className="img-fluid w-100"
          style={{ maxHeight: '350px', objectFit: 'cover' }}
        />
      </div>

      {/* Sections */}
      <div className="container mt-5">
        <ShopByProducts />
        <hr className="my-5" />
        <ShopByCategory />
        <hr className="my-5" />
        <ShopByBrands />
      </div>
    </>
  );
}

export default Home;
