import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../app/context/CategoryProvider";
interface Category {
    Id: number;
    SeName: string;
    Name: string;
    PictureModel: {
        ImageUrl: string;
        AlternateText: string;
    };
}
interface CategoryCardProps {
    Categorys: Category[];
}
export default function CategoryCard({ Categorys }: CategoryCardProps) {
    const { setActiveSubCategory } = useCategory();
    const navigate = useNavigate();
    const handleCategoryClick = (category: Category) => {
        //  setActiveCategory(category.SeName);
        setActiveSubCategory(category.SeName);
        navigate(`/${category.SeName}`);
    };
    return (
        <Box className="category_wrapper">
            {Categorys.map(category => (
                <Card key={category.Id} className="category_box" onClick={() => handleCategoryClick(category)}>
                    {/* <CardActionArea component={Link} to={`/getProductByCategory/${category.Id}`}> */}
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h5">
                                {category.Name}
                            </Typography>
                        </CardContent>
                        <CardMedia
                            component="img"
                            height="140"
                            image={category.PictureModel.ImageUrl}
                            alt={category.PictureModel.AlternateText}
                        />
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}