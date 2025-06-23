
import { memo, useEffect, useState } from "react";
import NopApi from "../../app/api/ThemeContext/NopApi";
//import { useAuth } from "../../app/context/AuthContext";
import { Typography, Grid, Box } from '@mui/material';

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
const BestSellers = () => {
    //export default function BestSellers() {
    //const { customerId } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    //const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const RequestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: 0,
                    CurrencyId: 1,
                    CatalogPagingResponse: {
                        PageNumber: 1,
                        PageSize: 8,
                        OrderBy: 0,
                        ViewMode: "grid"
                    }
                };
                const response = await NopApi.Home.bestSellers(RequestBody);
                //console.log(response)
                setProducts(response);
            } catch (error) {
                setError('Error fetching products');
            }
            //  finally {
            //     setLoading(false);
            // }
        };

        fetchProducts();
    }, []);

    // if (loading) {
    //     return <CircularProgress />;
    // }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1 }} className="category_section">
            <Typography variant="h5" component="h2" align="center" gutterBottom >
                Bestsellers
            </Typography>
            <Grid container spacing={4} className="productBox_wrapper">
                {products.map((product) => (
                    <Grid item key={product.Id} xs={12} sm={6} md={3} className="productBox">
                        <NopProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

const MemoizedBestSellers = memo(BestSellers);
export default MemoizedBestSellers;