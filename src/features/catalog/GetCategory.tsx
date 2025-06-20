import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import LoadingComponent from "../../app/layout/LoadingComponent";
//import GetProductByCategory from "./GetProductByCategory";
import SideNav from "../../app/layout/SideNav";
interface Category {
    Id: number;
    Name: string;
    PictureModel: {
        ImageUrl: string;
        AlternateText: string;
    };
}
export default function GetCategory() {
    const { subCategoryId = '' } = useParams<{ subCategoryId: string }>();
    const [Categorys, setCategory] = useState<Category[]>([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState('');
    useEffect(() => {
        const fetchCategorys = async () => {
            try {

                const requestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerId: 0,
                    CurrencyId: 1,
                    CategoryId: parseInt(subCategoryId),
                    CatalogPagingResponse: {
                        PageNumber: 1,
                        PageSize: 10,
                        OrderBy: 0,
                        ViewMode: "grid",
                    },
                };
                //console.log(requestBody);
                const response = await NopApi.ProductandCategory.GetProductByCategory(requestBody);
                //console.log(response.Categories);
                setCategory(response.Categories || []);
                setProducts(response.products || []);
                setCategoryName(response.Name);

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

        fetchCategorys();

    }, [subCategoryId]);

    if (loading) {
        return <LoadingComponent message='Loading Product...' />
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <SideNav />
                <Box sx={{ flexGrow: 1, padding: 2 }}>
                    {products.length === 0 && Categorys.length === 0 ?
                        <Typography variant="h4" gutterBottom sx={{ marginLeft: 3 }} style={{ borderBottom: '1px solid #c6c3c3', padding: '15px 0' }}>
                            {categoryName}
                        </Typography>
                        : null
                    }
                    {Categorys.length === 0 ? null :
                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 2 }}>
                            {Categorys.map(category => (
                                <Card key={category.Id} sx={{ margin: 1, width: '20%' }}>
                                    <CardActionArea component={Link} to={`/getProductByCategory/${category.Id}`}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={category.PictureModel.ImageUrl}
                                            alt={category.PictureModel.AlternateText}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {category.Name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Box>
                    }
                    {products.length === 0 ? null :
                        <Box>
                            {/* <GetProductByCategory /> */}
                        </Box>
                    }
                </Box>
            </Box>

        </>
    );


}