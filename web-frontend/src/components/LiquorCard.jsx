import React from 'react';

function LiquorCard({ liquor }) {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
                <img src={liquor.bottleImage} className="card-img-top" alt={liquor.name} style={{ height: "280px", objectFit: "contain" }} />
                <div className="card-body">
                    <h5 className="card-title">{liquor.name}</h5>
                    <p className="card-text"><strong>Brand:</strong> {liquor.brand}</p>
                    <p className="card-text"><strong>Price:</strong> {liquor.price}</p>
                </div>
                <div className="card-footer text-center bg-white">
                    <img src={liquor.brandImage} alt={`${liquor.brand} logo`} style={{ height: "40px", maxWidth: "80%" }} />
                </div>
            </div>
        </div>
    );
}

export default LiquorCard;
