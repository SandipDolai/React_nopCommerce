import { useEffect, useState } from "react";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { Box, Button, Grid, Typography, Skeleton } from "@mui/material";
import GridIcon from "../../app/assets/view-grid.png";
import ListIcon from "../../app/assets/view-list.png";
import Form from 'react-bootstrap/Form';
import NopProductCard from "../catalog/NopProductCard";
import { useCategory } from "../../app/context/CategoryProvider";
// import SideNav from "../../app/layout/SideNav";
// import ManufacturerNav from "./ManufacturerNav";

export default function ManufacturerProduct({ id }: { id: number }) {
    interface Product {
        Id: number;
        Name: string;
        SeName: string;
        DefaultPictureModel: {
            ImageUrl: string;
            FullSizeImageUrl: string;
            Title: string;
            AlternateText: string;
        };
        ReviewOverviewModel: {
            RatingSum: number;
        }
        ProductPrice: {
            Price: string;
            OldPrice?: string;
            //PriceWithDiscount?: string;
            IsRental: boolean;
        };
    }
    const [products, setProducts] = useState<Product[]>([]);
    //const [Categorys, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [manufacturerName, setManufacturerName] = useState('');
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sortOrder, setSortOrder] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [viewType, setViewType] = useState('grid');
    const { setActiveCategory, setActiveSubCategory } = useCategory();
    useEffect(() => {
        // Reset category and subcategory when manufacturer changes
        setActiveCategory(null);
        setActiveSubCategory(null);
        const fetchProducts = async () => {
            setLoading(true);
            if (!id) {
                setError('Product id is missing');
                return;
            }
            try {

                //console.log(productId);
                const requestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: 0,
                    CurrencyId: 1,
                    ManufacturerId: parseInt(id.toString()),

                };
                const response = await NopApi.Manufacturers.ManufacturerProduct(requestBody);

                //console.log("ManufacturerProduct response:", response.Products);
                setProducts(response.Products || []);
                setManufacturerName(response.Name);
                //setCategory(response.Categories || []);
                //console.log("ManufacturerProduct response:", response.Products.length);
                setTotalProducts(response.Products.length);
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

        fetchProducts();
    }, [id, page, itemsPerPage, sortOrder, setActiveCategory, setActiveSubCategory]);

    useEffect(() => {
        setPage(1);
    }, [id]);
    //debugger;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setPage(1);
    };
    const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(Number(event.target.value));
    };

    if (error) {
        return <div color="error">Error: {error}</div>;
    }
    //debugger;
    return (

        <Box className="master-column-wrapper">
            {/* <SideNav />
            <ManufacturerNav /> */}
            <Box sx={{ flexGrow: 1 }} className="center-2">
                <Typography variant="h1" gutterBottom>
                    {loading ? <Skeleton width="50%" /> : manufacturerName}
                </Typography>

                {products.length === 0 ? null : (
                    <Box className="shorting_wrapper">
                        <Box className="shorting_view_wrapper">
                            {loading ? (
                                <>
                                    <Skeleton width="50%" />
                                </>
                            ) : (
                                <>
                                    <Form.Group className="short_by">
                                        <Form.Label htmlFor="sort_by">Sort by</Form.Label>
                                        <Form.Select value={sortOrder} onChange={handleSortOrderChange}>
                                            <option value={0}>Position</option>
                                            <option value={5}>Name: A to Z</option>
                                            <option value={6}>Name: Z to A</option>
                                            <option value={10}>Price: Low to High</option>
                                            <option value={11}>Price: High to Low</option>
                                            <option value={15}>Created on</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="display_by">
                                        <Form.Label htmlFor="Items Per Page">Display</Form.Label>
                                        <Form.Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                            <option value={3}>3</option>
                                            <option value={6}>6</option>
                                            <option value={9}>9</option>
                                        </Form.Select>
                                        <Form.Label>Per page</Form.Label>
                                    </Form.Group>
                                </>
                            )}
                        </Box>
                        <Box className="view_by_wrapper">
                            {loading ? (
                                <>
                                    <Skeleton width="50%" />
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setViewType('grid')} className={"viewtypebtn" + " " + (viewType === 'grid' ? 'active' : 'deactive')}>
                                        <img src={GridIcon} />
                                    </Button>
                                    <Button onClick={() => setViewType('list')} className={"viewtypebtn" + " " + (viewType === 'list' ? 'active' : 'deactive')}>
                                        <img src={ListIcon} />
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                )}
                {loading ? (
                    <Grid container spacing={3} className="productBox_wrapper">
                        {[...Array(itemsPerPage)].map((_, index) => (
                            <Grid item xs={viewType === 'grid' ? 12 : 12} sm={viewType === 'grid' ? 6 : 12} md={viewType === 'grid' ? 4 : 12} key={index} className={"productBox" + " " + (viewType === 'grid' ? 'grid' : 'list')}>
                                <Skeleton variant="rectangular" height={200} />
                                <Skeleton />
                                <Skeleton width="60%" />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    products.length === 0 ? (
                        <Typography>No products found in this category.</Typography>
                    ) : (
                        <Grid container spacing={3} className="productBox_wrapper">
                            {products.map(product => (
                                <Grid item xs={viewType === 'grid' ? 12 : 12} sm={viewType === 'grid' ? 6 : 12} md={viewType === 'grid' ? 4 : 12} key={product.Id} className={"productBox" + " " + (viewType === 'grid' ? 'grid' : 'list')}>
                                    <NopProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    )
                )}
                {products.length === 0 ? null : (
                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                        <Typography variant="body2" margin={2}>Page {page} of {totalPages}</Typography>
                        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                    </Box>
                )}
            </Box>

        </Box>
    );
}