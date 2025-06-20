import { Box, List, ListItem, ListItemText, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
interface SubCategory {
    SeName: string;
    Name: string;
}

interface Category {
    SeName: string;
    Name: string;
    SubCategories: SubCategory[];
}

interface CategoryListProps {
    categories: Category[];
    openCategory: string | null;
    openSubCategory: string | null;
    handleClick: (categorySeName: string, subCategorySeName: string | null) => void;
}
const CategoryList: React.FC<CategoryListProps> = ({ categories, openCategory, openSubCategory, handleClick }) => {
    return (
        <List>
            {categories.map(category => (
                <Box key={category.SeName}>
                    <ListItem onClick={() => handleClick(category.SeName, null)}
                        sx={{ backgroundColor: openCategory === category.SeName ? 'rgba(0, 0, 0, 0.08)' : 'inherit' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <ListItemText primary={category.Name} />
                            <Link to={`/getProductByCategory/${category.SeName}`} style={{ marginLeft: 'auto', textDecoration: 'none', color: 'inherit' }}>
                                View Products
                            </Link>
                        </Box>
                    </ListItem>
                    <Collapse in={openCategory === category.SeName} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {category.SubCategories.map(subCategory => (
                                <ListItem key={subCategory.SeName} onClick={() => handleClick(category.SeName, subCategory.SeName)}
                                    sx={{ pl: 4, backgroundColor: openSubCategory === subCategory.SeName ? 'rgba(0, 0, 0, 0.08)' : 'inherit' }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <ListItemText primary={subCategory.Name} />
                                        <Link to={`/getProductByCategory/${subCategory.SeName}`} style={{ marginLeft: 'auto', textDecoration: 'none', color: 'inherit' }}>
                                            View Products
                                        </Link>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </Box>
            ))}
        </List>
    );
};

export default CategoryList;