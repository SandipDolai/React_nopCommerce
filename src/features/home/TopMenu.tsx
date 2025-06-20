import { AppBar, Toolbar, Typography, Menu, MenuItem, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import NopApi from '../../app/api/ThemeContext/NopApi';
interface Category {
    Id: number;
    Name: string;
    PictureModel: {
        ThumbImageUrl: string;
        AlternateText: string;
    };
    SubCategories: SubCategory[];
}

interface SubCategory {
    Id: number;
    Name: string;
}
const TopMenu = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const requestBody = { StoreId: 1, Language: 1, CustomerID: 0 }

                const response = await NopApi.Home.TopMenu(requestBody);
                setCategories(response.Categories);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, category: Category) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setAnchorEl(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(() => {
            setAnchorEl(null);
            setSelectedCategory(null);
        }, 200);
        setTimeoutId(id);
    };

    const handleMenuMouseEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    const handleSubCategoryClick = async (subCategoryId: unknown) => {
        try {
            const requestBody = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: 0,
                CurrencyId: 1,
                CategoryId: subCategoryId,
                CatalogPagingResponse: {
                    PageNumber: 1,
                    PageSize: 10,
                    OrderBy: 0,
                    ViewMode: "grid",
                },
            };
            await NopApi.ProductandCategory.GetProductByCategory(requestBody)
            navigate(`/getProductByCategory/${subCategoryId}`);
            // <GetProductByCategory />
            // console.log(response.data); // Handle the response data here
            //<GetProductByCategory />
            // Optionally navigate to a product page or update state to show products
            // For example, you might use React Router to navigate:
            // navigate(`/products/${response.data.SeName}`);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <AppBar position="static">
            <Toolbar>
                {categories.map((category) => (
                    <div key={category.Id}
                        onMouseEnter={(event) => handleMouseEnter(event, category)}
                        onMouseLeave={handleMouseLeave}>
                        <Button
                            color="inherit"
                            startIcon={
                                <img
                                    src={category.PictureModel.ThumbImageUrl}
                                    alt={category.PictureModel.AlternateText}
                                    style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                            }
                        >
                            {category.Name}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl) && selectedCategory?.Id === category.Id}
                            onClose={handleMouseLeave}
                            onMouseEnter={handleMenuMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {category.SubCategories.length === 0 ? (
                                <MenuItem onClick={handleMouseLeave}>No Subcategories</MenuItem>
                            ) : (
                                category.SubCategories.map((subCategory) => (
                                    <MenuItem key={subCategory.Id} onClick={() => {
                                        handleSubCategoryClick(subCategory.Id);
                                        handleMouseLeave(); // Close the menu after clicking
                                    }}>
                                        {subCategory.Name}
                                    </MenuItem>
                                ))
                            )}
                        </Menu>
                    </div>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;
