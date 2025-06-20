import { Box, Collapse, List, ListItem, ListItemText, Typography } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import NopApi from "../api/ThemeContext/NopApi";
import { useCategory } from "../context/CategoryProvider";
import { Link, useParams } from "react-router-dom";
import ManufacturerNav from "../../features/Manufacturers/ManufacturerNav";
interface SubCategory {
    Id: number;
    SeName: string;
    Name: string;
}

interface Category {
    Id: number;
    SeName: string;
    Name: string;
    SubCategories: SubCategory[];
    IncludeInTopMenu: boolean;
}

interface CategoryListProps {
    categories: Category[];
    openCategory: string | null;
    openSubCategory: string | null;
    handleClick: (categorySeName: string, subCategorySeName: string | null) => void;
}
const CategoryList: React.FC<CategoryListProps> = ({ categories, openCategory, openSubCategory, handleClick }) => {
    //debugger
    return (
        <>

            <List sx={{ width: '100%', maxWidth: 380 }}>
                {categories.filter(category => category.IncludeInTopMenu).map(category => (
                    <Box key={category.Id}>
                        <ListItem component={Link} to={`/${category.SeName}`}
                            //component="div"
                            onClick={() => handleClick(category.SeName, null)}
                            sx={{
                                backgroundColor: openCategory === category.SeName ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                                py: 1,
                                px: 2,
                                borderRadius: 1,
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                            }}
                        >
                            <ListItemText primary={category.Name} />
                        </ListItem>
                        <Collapse in={openCategory === category.SeName} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {category.SubCategories.map(subCategory => (
                                    <ListItem
                                        key={subCategory.SeName}
                                        component={Link} to={`/${subCategory.SeName}`}
                                        onClick={() => handleClick(category.SeName, subCategory.SeName)}
                                        sx={{ pl: 4, backgroundColor: openSubCategory === subCategory.SeName ? 'rgba(0, 0, 0, 0.08)' : 'inherit' }}
                                    >
                                        <ListItemText primary={subCategory.Name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </Box>
                ))}
            </List>
            <ManufacturerNav />
        </>

    );
};

const SideNav = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    //const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory } = useCategory();
    const { subCategoryId = '' } = useParams<{ subCategoryId: string }>();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const requestBody = { StoreId: 1, Language: 1, CustomerID: 0 };
                const response = await NopApi.Home.TopMenu(requestBody);
                setCategories(response.Categories);
                response.Categories.forEach((category: Category) => {
                    if (category.Id === parseInt(subCategoryId)) {
                        setActiveCategory(category.SeName);
                    }
                    category.SubCategories.forEach((subCategory: SubCategory) => {
                        if (subCategory.Id === parseInt(subCategoryId)) {
                            setActiveCategory(category.SeName);
                            setActiveSubCategory(subCategory.SeName);
                        }
                    });
                });

            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
            }
            // finally {
            //     setLoading(false);
            // }
        };

        fetchCategories();
        // }, []);
    }, [setActiveCategory, setActiveSubCategory, subCategoryId]);

    const handleClick = (categoryName: SetStateAction<string | null>, subCategoryName: SetStateAction<string | null>) => {
        // debugger
        setActiveCategory(categoryName);
        setActiveSubCategory(subCategoryName);
    };

    // if (loading) {
    //     return <CircularProgress />;
    // }
    // console.log(activeCategory);
    //console.log(activeSubCategory);
    if (error) {
        return <Box>Error: {error}</Box>;
    }

    return (
        <Box className="side-2  ">
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }} className="cat_title_catPage">
                Categories
            </Typography>
            <CategoryList
                categories={categories}
                openCategory={activeCategory}
                openSubCategory={activeSubCategory}
                handleClick={handleClick}
            />
        </Box>
    );
};

export default SideNav;