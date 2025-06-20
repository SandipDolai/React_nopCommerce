import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NopApi from '../api/ThemeContext/NopApi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

type Section = 'information' | 'customerService' | 'myAccount';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const { isLoggedIn } = useAuth();
    const [isMobile, setIsMobile] = useState(false);

    const [visibleSections, setVisibleSections] = useState<Record<Section, boolean>>({
        information: false,
        customerService: false,
        myAccount: false,
    });

    // Check if screen is mobile size and update on resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 576); // Bootstrap's sm breakpoint
        };

        // Check initial screen size
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSection = (section: Section) => {
        if (isMobile) {
            setVisibleSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
        }
    };

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubscribe = async () => {
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        try {
            const requestBody = {
                StoreId: 0,
                Email: email,
                IsSubscribed: true,
                LanguageId: 1
            };
            const response = await NopApi.Home.SubscribeNewsletter(requestBody);
            if (response.length > 0) {
                setResponseMessage(response);
                setSubscribed(true);
            } else {
                setResponseMessage("Failed to subscribe. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setResponseMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="Footer">
            <div className="container-lg">
                <div className="Footer_upper">
                    <div className="footer_box">
                        <div className="footer_title_box">
                            <h4>Information</h4>
                            <div className="footer-toggle" onClick={() => toggleSection('information')}>dddd</div>
                        </div>
                        <ul className={isMobile && visibleSections.information ? 'open' : ''}>
                            <li><a href="#" className="text-decoration-none">Sitemap</a></li>
                            <li><a href="#" className="text-decoration-none">Shipping & returns</a></li>
                            <li><a href="#" className="text-decoration-none">Privacy notice</a></li>
                            <li><a href="#" className="text-decoration-none">Conditions of Use</a></li>
                            <li><a href="#" className="text-decoration-none">About us</a></li>
                            <li><a href="/contactus" className="text-decoration-none">Contact us</a></li>
                        </ul>
                    </div>

                    <div className="footer_box">
                        <div className="footer_title_box">
                            <h4>Customer service</h4>
                            <div className="footer-toggle" onClick={() => toggleSection('customerService')}>dddd</div>
                        </div>
                        <ul className={isMobile && visibleSections.customerService ? 'open' : ''}>
                            <li><a href="#" className="text-decoration-none">Search</a></li>
                            <li><a href="#" className="text-decoration-none">News</a></li>
                            <li><a href="#" className="text-decoration-none">Blog</a></li>
                            <li><a href="#" className="text-decoration-none">Recently viewed products</a></li>
                            <li><a href="#" className="text-decoration-none">Compare products list</a></li>
                            <li><a href="#" className="text-decoration-none">New products</a></li>
                        </ul>
                    </div>

                    <div className="footer_box">
                        <div className="footer_title_box">
                            <h4>My account</h4>
                            <div className="footer-toggle" onClick={() => toggleSection('myAccount')}>dddd</div>
                        </div>
                        <ul className={isMobile && visibleSections.myAccount ? 'open' : ''}>
                            <li><a href={isLoggedIn ? "/customer/info" : "/login?returnUrl=/customer/info"} className="text-decoration-none">My account</a></li>
                            <li><a href={isLoggedIn ? "/order/history" : "/login?returnUrl=/order/history"} className="text-decoration-none">Orders</a></li>
                            <li><a href={isLoggedIn ? "/customer/addresses" : "/login?returnUrl=/customer/addresses"} className="text-decoration-none">Addresses</a></li>
                            <li><a href="/cart" className="text-decoration-none">Shopping cart</a></li>
                            <li><a href="/wishlist" className="text-decoration-none">Wishlist</a></li>
                            <li><a href="#" className="text-decoration-none">Apply for vendor account</a></li>
                        </ul>
                    </div>

                    <div className="footer_box social_box">
                        <h4>Follow us</h4>
                        <ul className="social list-unstyled">
                            <li><a href="#" className="facebook text-decoration-none">facebook</a></li>
                            <li><a href="#" className="twiter text-decoration-none">twiter</a></li>
                            <li><a href="#" className="news text-decoration-none">News</a></li>
                            <li><a href="#" className="youtube text-decoration-none">Youtube</a></li>
                        </ul>

                        <h4>Newsletter</h4>
                        <div className="d-flex align-items-start searchBox newslatterBox">
                            {!subscribed ? (
                                <>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email here..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ maxWidth: '280px', backgroundColor: 'white', boxSizing: 'border-box' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-primary ms-2"
                                        onClick={handleSubscribe}
                                    >
                                        Subscribe
                                    </button>
                                </>
                            ) : (
                                <p className="ms-2 mb-0">
                                    {responseMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="Footer_down">
                    <h6 className="mb-0">
                        Powered by <a href="#" className="nop_link text-decoration-none">nopCommerce</a>
                    </h6>
                    <h6 className="mb-0">
                        Copyright © 2025 Your store name. All rights reserved.
                    </h6>
                </div>
            </div>
        </div>
    );
}