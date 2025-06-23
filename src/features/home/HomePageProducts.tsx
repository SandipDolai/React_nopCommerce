import { memo, useEffect, useState } from "react";
import NopApi from "../../app/api/ThemeContext/NopApi";
//import { useAuth } from "../../app/context/AuthContext";
import { Typography, Grid, Box, Skeleton } from '@mui/material';
import NopProductCard from '../catalog/NopProductCard';

interface Product {
    Id: number;
    Name: string;
    SeName: string;
    ShortDescription: string;
    ProductPrice: {
        Price: string;
        IsRental: boolean;
        AvailableForPreOrder?: boolean;
    };
    DefaultPictureModel: {
        ImageUrl: string;
        AlternateText: string;
    };
    ReviewOverviewModel: {
        RatingSum: number;
    };
}
const HomePageProducts = () => {
    // export default function HomePageProducts() {
    //const { customerId } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const RequestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: 0,
                    CurrencyId: 1,
                    ProductThumbPictureSize: null
                };
                const response = await NopApi.Home.homePageProducts(RequestBody);
                setProducts(response.products);
            } catch (error) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1 }} className="category_section">
            <Typography variant="h5" component="h2" align="center" gutterBottom>
                Featured products
            </Typography>
            <Grid container spacing={4} className="productBox_wrapper">
                {loading ? (
                    Array.from(new Array(4)).map((_, index) => (
                        <Grid item key={index} xs={12} sm={6} md={3} className="productBox">
                            <Skeleton variant="rectangular" width="100%" height={300} />
                            <Skeleton width="60%" />
                            <Skeleton width="80%" />
                        </Grid>
                    ))
                ) : (
                    products.map((product) => (
                        <Grid item key={product.Id} xs={12} sm={6} md={3} className="productBox">
                            <NopProductCard product={product} />
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}
const MemoizedHomePageProducts = memo(HomePageProducts);
export default MemoizedHomePageProducts;