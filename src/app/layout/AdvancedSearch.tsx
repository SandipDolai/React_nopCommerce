import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NopApi from '../api/ThemeContext/NopApi';
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Apps, ViewHeadline } from '@mui/icons-material';
import NopProductCard from '../../features/catalog/NopProductCard';
//import { useCategory } from '../context/CategoryProvider';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

interface Product {
    Id: number;
    SeName: string;
    DefaultPictureModel: {
        ImageUrl: string;
        AlternateText: string;
    };
    Name: string;
    ShortDescription: string;
    ProductPrice: {
        Price: string;
        IsRental: boolean;
        AvailableForPreOrder?: boolean;
    };
    ReviewOverviewModel: {
        RatingSum: number;
    };
}


function AdvancedSearch() {
    const query = useQuery();
    const productName = query.get("query");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortOrder, setSortOrder] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [viewType, setViewType] = useState('grid');
    // const { setActiveCategory, setActiveSubCategory } = useCategory();

    useEffect(() => {
        const fetchProducts = async () => {
            //console.log(RequestBody)
            try {
                if (!productName || productName.length < 3) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }
                const RequestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerId: 0,
                    CurrencyId: 1,
                    ProductName: productName ?? null,
                    CatalogPagingResponse: {
                        PageNumber: page,
                        PageSize: itemsPerPage,
                        OrderBy: sortOrder
                    }

                };
                const response = await NopApi.Search.ProductSearch(RequestBody);
                //console.log(response.products)
                setProducts(response.products);
                setTotalProducts(response.TotalCount);
                // console.log(response.products.length)

            } catch (error) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [productName, page, itemsPerPage, sortOrder]);

    useEffect(() => {
        setPage(1);
    }, [productName]);

    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    //setActiveCategory(null);
    // setActiveSubCategory(null);
    const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
        setItemsPerPage(Number(event.target.value));
        setPage(1);
    };

    const handleSortOrderChange = (event: SelectChangeEvent<number>) => {
        setSortOrder(Number(event.target.value));
    };
    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        // <Box>
        //     <SideNav />

        <Box >
            <Typography variant="h5" component="h2" gutterBottom >
                Search
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
                <Box display="flex" alignItems="center">
                    <FormControl variant="outlined" margin="normal" sx={{ marginRight: 2, minWidth: 110 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortOrder} onChange={handleSortOrderChange} label="Sort By">
                            <MenuItem value={0}>Position</MenuItem>
                            <MenuItem value={5}>Name: A to Z</MenuItem>
                            <MenuItem value={6}>Name: Z to A</MenuItem>
                            <MenuItem value={10}>Price: Low to High</MenuItem>
                            <MenuItem value={11}>Price: High to Low</MenuItem>
                            <MenuItem value={15}>Created on</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" margin="normal" sx={{ marginRight: 2, minWidth: 110 }}>
                        <InputLabel>Items Per Page</InputLabel>
                        <Select value={itemsPerPage} onChange={handleItemsPerPageChange} label="Items Per Page">
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Button onClick={() => setViewType('grid')} startIcon={<Apps fontSize="large" />}></Button>
                    <Button onClick={() => setViewType('list')} startIcon={<ViewHeadline fontSize="large" />}></Button>
                </Box>
            </Box>
            {products.length === 0 ? (
                <Typography>No products were found that matched your criteria.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {products.map((product) => (
                        <Grid item xs={viewType === 'grid' ? 3 : 12} key={product.Id} className="productBox">
                            <NopProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Typography variant="body2" margin={2}>Page {page} of {totalPages}</Typography>
                <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </Box>
        </Box>
        // </Box>
    );
}
export default AdvancedSearch;