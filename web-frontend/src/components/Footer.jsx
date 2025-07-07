import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-3 mt-5">
            <div className="container">
                <div className="row">
                    {/* Column 1 */}
                    <div className="col-md-2 mb-3">
                        <h5>Online Shopping</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-light text-decoration-none">Shop</a></li>
                            <li><a href="#" className="text-light text-decoration-none">My Account</a></li>
                            <li><a href="#" className="text-light text-decoration-none">FAQ</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Delivery</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Returns & Refunds</a></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="col-md-2 mb-3">
                        <h5>The Company</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-light text-decoration-none">About Us</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Terms & Conditions</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
                            <li><a href="#" className="text-light text-decoration-none">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="col-md-3 mb-3">
                        <h5>Email Newsletter</h5>
                        <form>
                            <div className="mb-2">
                                <input type="email" className="form-control" placeholder="Your email" />
                            </div>
                            <button className="btn btn-outline-light btn-sm">Sign Up</button>
                        </form>
                    </div>

                    {/* Column 4 */}
                    <div className="col-md-2 mb-3">
                        <h5>Connect With Us</h5>
                        <div className="d-flex gap-3 fs-4">
                            <a href="#" className="text-light"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-light"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-light"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>

                    {/* Column 5 */}
                    <div className="col-md-3 mb-3">
                        <h5>Our Retail Store</h5>
                        <p className="small">
                            New City Wine Stores<br />
                            No 28, Chatham Street<br />
                            Colombo 01, Sri Lanka<br />
                            Island of Ceylon
                        </p>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="text-center mt-4 pt-3 border-top border-secondary">
                    <small>Powered by NetIT Technology / Liquor Home</small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
