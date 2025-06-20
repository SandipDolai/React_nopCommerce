import {
  AppBar,
  Typography,
  List,
  ListItem,
  IconButton,
  MenuItem,
  Container,
  Select,
  SelectChangeEvent
} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings';

import NopSignedInMenu from "./NopSignedInMenu";
import SearchComponent from "./SearchComponent";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCategory } from "../context/CategoryProvider";
import NopApi from "../api/ThemeContext/NopApi";
import logo from "../assets/nopCommerce_logo.png";
import cartIcon from "../assets/shopping-bag.png";

// Constants
const RIGHT_LINKS = [
  { title: "register", path: "/register" },
  { title: "login", path: "/login" },
] as const;

const NAV_STYLE = {
  color: "inherit",
  typography: "h6",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "text.secondary" },
  textDecoration: "none",
} as const;

const CURRENCY_OPTIONS = [
  { value: "", label: "US Dollar" },
  { value: "2", label: "Euro" },
] as const;

// Types
interface PictureModel {
  ThumbImageUrl: string;
  AlternateText: string;
}

interface SubCategory {
  Id: number;
  Name: string;
  SeName: string;
}

interface Category {
  Id: number;
  Name: string;
  SeName: string;
  PictureModel: PictureModel;
  IncludeInTopMenu: boolean;
  SubCategories: SubCategory[];
}

// Custom hooks
const useCartData = () => {
  const { totalItems, setTotalItems, totalwishlistItems, setTotalwishlistItems } = useCart();
  const { isLoggedIn, customerId } = useAuth();

  const fetchCartData = useCallback(async (currentCustomerId: string | null) => {
    if (!currentCustomerId) {
      const storedCustomerId = localStorage.getItem('guestCustomerId');
      if (storedCustomerId) {
        currentCustomerId = storedCustomerId;
      }
    }

    if (!currentCustomerId) {
      setTotalItems(0);
      setTotalwishlistItems(0);
      return;
    }

    try {
      const requestBody = {
        StoreId: 0,
        LanguageId: 1,
        CustomerId: currentCustomerId,
        CurrencyId: 1
      };

      const [cartResponse, wishlistResponse] = await Promise.all([
        NopApi.Cart.nopCart(requestBody),
        NopApi.WishList.nopWishList(requestBody)
      ]);

      const cartTotal = cartResponse.Items?.reduce(
        (sum: number, item: { Quantity: number }) => sum + item.Quantity,
        0
      ) || 0;

      const wishlistTotal = wishlistResponse.Items?.reduce(
        (sum: number, item: { Quantity: number }) => sum + item.Quantity,
        0
      ) || 0;

      setTotalItems(cartTotal);
      setTotalwishlistItems(wishlistTotal);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setTotalItems(0);
      setTotalwishlistItems(0);
    }
  }, [setTotalItems, setTotalwishlistItems]);

  useEffect(() => {
    fetchCartData(customerId);
  }, [customerId, isLoggedIn, fetchCartData]);

  return { totalItems, totalwishlistItems };
};

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const requestBody = { StoreId: 1, Language: 1, CustomerID: 0 };
        const response = await NopApi.Home.TopMenu(requestBody);
        setCategories(response.Categories || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return { categories, error };
};

// Main component
export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const { setActiveCategory, setActiveSubCategory } = useCategory();
  const navigate = useNavigate();
  const location = useLocation();

  const [currency, setCurrency] = useState('');
  const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({});

  const { totalItems, totalwishlistItems } = useCartData();
  const { categories, error } = useCategories();

  // Memoized values
  const returnUrl = useMemo(() =>
    encodeURIComponent(location.pathname + location.search),
    [location.pathname, location.search]
  );

  const topMenuCategories = useMemo(() =>
    categories.filter(category => category.IncludeInTopMenu),
    [categories]
  );

  // Event handlers
  const handleCurrencyChange = useCallback((event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  }, []);

  const showDropdown = useCallback((id: number) => {
    setDropdownStates(prev => ({ ...prev, [id]: true }));
  }, []);

  const hideDropdown = useCallback((id: number) => {
    setDropdownStates(prev => ({ ...prev, [id]: false }));
  }, []);

  const handleCategoryClick = useCallback((category: Category) => {
    setActiveCategory(category.SeName);
    setActiveSubCategory(null);
    navigate(`/${category.SeName}`);
    setDropdownStates(prev => ({ ...prev, [category.Id]: false }));
  }, [setActiveCategory, setActiveSubCategory, navigate]);

  const handleSubCategoryClick = useCallback((category: Category, subCategory: SubCategory) => {
    setActiveCategory(category.SeName);
    setActiveSubCategory(subCategory.SeName);
    navigate(`/${subCategory.SeName}`);
    setDropdownStates(prev => ({ ...prev, [category.Id]: false }));
  }, [setActiveCategory, setActiveSubCategory, navigate]);

  const toggleDropdown = useCallback((id: number) => {
    setDropdownStates(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Error state
  if (error) {
    return (
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container maxWidth="lg">
          <Typography color="error" sx={{ p: 2 }}>
            Error loading header: {error}
          </Typography>
        </Container>
      </AppBar>
    );
  }
  console.log("Header rendered")
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        {/* Top Header Links */}
        <div className="top_header-links">
          <div className="currency">
            <FormControl sx={{ minWidth: 100, maxHeight: 25, borderRadius: 0 }}>
              <Select
                value={currency}
                onChange={handleCurrencyChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Currency selector' }}
              >
                {CURRENCY_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="header-links">
            {isLoggedIn ? (
              <NopSignedInMenu onLogout={logout} />
            ) : (
              <List sx={{ display: "flex" }}>
                {RIGHT_LINKS.map(({ title, path }) => {
                  const isLogin = path === "/login";
                  const dynamicPath = isLogin ? `${path}?returnUrl=${returnUrl}` : path;

                  return (
                    <ListItem
                      component={NavLink}
                      to={dynamicPath}
                      key={path}
                      sx={NAV_STYLE}
                    >
                      {title}
                    </ListItem>
                  );
                })}
              </List>
            )}

            <IconButton
              component={Link}
              to='/wishlist'
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              aria-label={`Wishlist with ${totalwishlistItems} items`}
            >
              wishlist ({totalwishlistItems})
            </IconButton>

            <IconButton
              component={Link}
              to='/cart'
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              className="cart_btn"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <img src={cartIcon} alt="Cart" />
              <span>Shopping cart ({totalItems})</span>
            </IconButton>
          </div>
        </div>

        {/* Middle Header */}
        <div className="middle_header">
          <NavLink to="/" className="logo-link">
            <img src={logo} className="App-logo" alt="Company logo" />
          </NavLink>
          <div>
            <SearchComponent />
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation">
          <Navbar expand="lg">
            <Navbar.Toggle aria-controls="navbarScroll">
              Categories <SettingsIcon />
            </Navbar.Toggle>

            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-lg-0 top_navigation" navbarScroll>
                {topMenuCategories.map((category) => (
                  category.SubCategories.length > 0 ? (
                    <NavDropdown
                      title={
                        <>
                          <div
                            className="sublist-toggle"
                            onClick={() => toggleDropdown(category.Id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                toggleDropdown(category.Id);
                              }
                            }}
                          />
                          <div onClick={() => handleCategoryClick(category)}>
                            {category.Name}
                          </div>
                        </>
                      }
                      id={`nav-dropdown-${category.Id}`}
                      key={category.Id}
                      className="dropdown-hover"
                      show={dropdownStates[category.Id] || false}
                      onMouseEnter={() => showDropdown(category.Id)}
                      onMouseLeave={() => hideDropdown(category.Id)}
                    >
                      {category.SubCategories.map((subCategory) => (
                        <NavDropdown.Item
                          key={subCategory.Id}
                          onClick={() => handleSubCategoryClick(category, subCategory)}
                        >
                          {subCategory.Name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  ) : (
                    <div className="top_mav_item" key={category.Id}>
                      <Nav.Link
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.Name}
                      </Nav.Link>
                    </div>
                  )
                ))}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </AppBar>
  );
} 