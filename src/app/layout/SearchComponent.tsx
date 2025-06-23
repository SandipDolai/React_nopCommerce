import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import NopApi from "../api/ThemeContext/NopApi";

interface Product {
    Id: number;
    SeName: string;
    Name: string;
    DefaultPictureModel?: {
        ImageUrl?: string;
    };
}

const SearchComponent = () => {
    const [productName, setProductName] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    //const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const latestProductName = useRef(productName);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        latestProductName.current = productName;
        const fetchProducts = async () => {
            if (latestProductName.current.length < 3) {
                setProducts([]);
                setShowDropdown(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const requestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: 0,
                    CurrencyId: 1,
                    ProductName: latestProductName.current,
                    CatalogPagingResponse: {
                        PageNumber: 1,
                        PageSize: 10
                    }
                };

                const response = await NopApi.Search.ProductSearch(requestBody);

                if (latestProductName.current === productName) {
                    const productsList = response?.products || response?.Products || response || [];
                    setProducts(Array.isArray(productsList) ? productsList : []);
                    setShowDropdown(Array.isArray(productsList) && productsList.length > 0);
                }
            } catch (err) {
                console.error('Search error:', err);
                setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [productName]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setProductName(value);
        //setInputValue(value);
        if (value.length < 3) {
            setProducts([]);
            setShowDropdown(false);
        } else if (products.length > 0) {
            setShowDropdown(true);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentValue = productName.trim();
            if (currentValue.length >= 3) {
                navigate(`/advancedSearch?query=${currentValue}`);
                clearSearch();
            }
        }
    };

    const handleOptionClick = (product: Product) => {
        clearSearch();
        navigate(`/${product.SeName}`);
    };

    const handleSearchClick = () => {
        if (productName.length >= 3) {
            navigate(`/advancedSearch?query=${productName}`);
            clearSearch();
        }
    };

    const clearSearch = () => {
        setProductName('');
        //setInputValue('');
        setProducts([]);
        setShowDropdown(false);
        latestProductName.current = '';
    };

    const getNoOptionsText = () => {
        if (loading) return "Searching...";
        if (productName.length < 3) return "Type at least 3 characters";
        if (products.length === 0 && productName.length >= 3) return `No products found for "${productName}"`;
        return "No options available";
    };
    console.log('SearchComponent rendered with productName:');
    return (
        <div>
            <div className="search-container position-relative" ref={dropdownRef}>
                <div className="d-flex align-items-start">
                    <div className="position-relative" style={{ maxWidth: '280px' }}>
                        <input
                            ref={inputRef}
                            type="text"
                            className="form-control search_box"
                            placeholder="Search store"
                            value={productName}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            onFocus={() => {
                                if (products.length > 0 && productName.length >= 3) {
                                    setShowDropdown(true);
                                }
                            }}
                        />

                        {loading && (
                            <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="dropdown-menu show position-absolute search_list">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <button
                                            key={product.Id}
                                            type="button"
                                            className="dropdown-item d-flex align-items-center"
                                            onClick={() => handleOptionClick(product)}
                                        >
                                            <img
                                                src={product.DefaultPictureModel?.ImageUrl || ""}
                                                alt={product.Name}
                                                width="20"
                                                height="20"
                                                className="me-2 flex-shrink-0"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <span className="searchProductName">{product.Name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="dropdown-item-text text-muted">
                                        {getNoOptionsText()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary search_btn"
                        onClick={handleSearchClick}
                        disabled={productName.length < 3}
                    >
                        Search
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mt-2" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
};

const MemoizedSearchComponent = memo(SearchComponent);
export default MemoizedSearchComponent;