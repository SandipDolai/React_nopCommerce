import { Box, Button, Card, CardActionArea, CardContent, CardMedia, IconButton, Rating, styled, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Link, useNavigate } from "react-router-dom";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { toast } from "react-toastify";
import { useAuth } from "../../app/context/AuthContext";
import { useCart } from "../../app/context/CartContext";

const Item = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
}));

const truncateText = (text: string, charLimit: number) => {
    if (!text) return '';
    if (text.length <= charLimit) return text;
    return text.substring(0, charLimit) + '...';
};
const formatProductName = (name: string) => {
    if (!name) return '';
    const words = name.split(' ');
    const firstPart = words.slice(0, 25).join(' ');
    const secondPart = words.slice(25).join(' ');
    return (
        <>
            {firstPart}
            {secondPart && <br />}
            {secondPart}
        </>
    );
};

interface Product {
    Id: number;
    Name: string;
    SeName: string;
    DefaultPictureModel: {
        ImageUrl: string;
        AlternateText: string;
    };
    ReviewOverviewModel: {
        RatingSum: number;
    }
    ShortDescription?: string;
    ProductPrice: {
        Price: string;
        IsRental: boolean;
        AvailableForPreOrder?: boolean;
    };
}

export default function NopProductCard({ product }: { product: Product }) {
    //const [products, setProducts] = useState<ProductDetails | null>(null);
    const { setTotalItems, setTotalwishlistItems } = useCart();
    const { customerId } = useAuth();
    const navigate = useNavigate();

    const getButtonText = () => {
        if (product?.ProductPrice.IsRental) {
            return "Rent";
        }
        if (product?.ProductPrice.AvailableForPreOrder) {
            return "Pre-order";
        }
        return "Add to Cart";
    };

    //const [error, setError] = useState<string | null>(null);
    const handleAddToCart = async (event: React.MouseEvent, productId: number, productSeName: string) => {
        //debugger;
        event.stopPropagation();


        let currentCustomerId = customerId || localStorage.getItem('guestCustomerId');
        if (!currentCustomerId) {
            try {

                const productDetailRequestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: customerId ? parseInt(customerId) : 0,
                    //CustomerId: 0,
                    CurrencyId: 1,
                    ProductId: productId,
                };
                const productDetailResponse = await NopApi.ProductandCategory.ProductDetail(productDetailRequestBody);
                if ((productDetailResponse.ProductAttributes && productDetailResponse.ProductAttributes.length > 0) || productDetailResponse.AddToCart.IsRental === true
                    || (productDetailResponse.AddToCart.MinimumQuantityNotification && productDetailResponse.AddToCart.MinimumQuantityNotification.length > 0)) {
                    navigate(`/${productSeName}`);
                    return;
                }
                const requestBody = {
                    StoreId: 1,
                    CurrencyId: 1,
                    CustomerId: 0,
                    ProductId: productId,
                    ShoppingCartTypeId: 1,
                    Quantity: 1,
                    AttributeControlIds: "",
                    RentalStartDate: "",
                    RentalEndDate: ""
                };
                const response = await NopApi.Cart.AddProductToCart(requestBody);
                if (response.messageCode === 1) {
                    currentCustomerId = response.CustomerId;
                    localStorage.setItem('guestCustomerId', response.CustomerId);
                    toast.success('The product has been added to your Cart');
                } else {
                    //console.error('Error adding product to cart:', error);
                    toast.error('Failed to add product to cart.');
                    return;
                }
                const cartRequestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: currentCustomerId,
                    CurrencyId: 1
                };
                const cartResponse = await NopApi.Cart.nopCart(cartRequestBody);
                const total = cartResponse.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
                setTotalItems(total);
                // await axios.post('/api/cart', { productId: product.Id });
                //alert(`Item${productId} added to wishlist`);
            } catch (error) {
                console.error('Error adding to cart', error);
            }
        } else {
            try {
                const requestBody = {
                    StoreId: 1,
                    CurrencyId: 1,
                    CustomerId: currentCustomerId,
                    ProductId: productId,
                    ShoppingCartTypeId: 1,
                    Quantity: 1,
                    AttributeControlIds: "",
                    RentalStartDate: "",
                    RentalEndDate: ""
                };
                //console.log(requestBody);
                await NopApi.Cart.AddProductToCart(requestBody);
                //console.log('Product added to cart:', response.data);
                toast.success('The product has been added to your Cart');

                const cartRequestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: currentCustomerId,
                    CurrencyId: 1
                };
                const cartResponse = await NopApi.Cart.nopCart(cartRequestBody);
                //console.log(response.Items);
                const total = cartResponse.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
                setTotalItems(total);
            } catch (error) {
                console.error('Error adding product to Cart:');
            }
        }
    };

    const handleAddToWishlist = async (event: React.MouseEvent, productId: number, productSeName: string) => {
        event.stopPropagation();
        try {
            let currentCustomerId = customerId || localStorage.getItem('guestCustomerId');
            if (!currentCustomerId) {
                try {
                    const productDetailRequestBody = {
                        StoreId: 1,
                        LanguageId: 1,
                        CustomerId: customerId ? parseInt(customerId) : 0,
                        //CustomerId: 0,
                        CurrencyId: 1,
                        ProductId: productId,
                    };
                    const productDetailResponse = await NopApi.ProductandCategory.ProductDetail(productDetailRequestBody);
                    if ((productDetailResponse.ProductAttributes && productDetailResponse.ProductAttributes.length > 0) || productDetailResponse.AddToCart.IsRental === true
                        || (productDetailResponse.AddToCart.MinimumQuantityNotification && productDetailResponse.AddToCart.MinimumQuantityNotification.length > 0)) {
                        navigate(`/${productSeName}`);
                        return;
                    }
                    const requestBody = {
                        StoreId: 1,
                        CurrencyId: 1,
                        CustomerId: 0,
                        ProductId: productId,
                        ShoppingCartTypeId: 2,
                        Quantity: 1,
                        AttributeControlIds: "",
                        RentalStartDate: "",
                        RentalEndDate: ""
                    };
                    const response = await NopApi.WishList.AddProductToWishlist(requestBody);
                    if (response.messageCode === 1) {
                        currentCustomerId = response.CustomerId;
                        localStorage.setItem('guestCustomerId', response.CustomerId);
                        toast.success('The product has been added to your Wishlist');
                    } else {
                        //console.error('Error adding product to cart:', error);
                        toast.error('Failed to add product to Wishlist.');
                        return;
                    }
                    const cartRequestBody = {
                        StoreId: 1,
                        LanguageId: 1,
                        CustomerId: currentCustomerId,
                        CurrencyId: 1
                    };
                    const cartResponse = await NopApi.WishList.nopWishList(cartRequestBody);
                    const total = cartResponse.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
                    setTotalwishlistItems(total);
                    // await axios.post('/api/cart', { productId: product.Id });
                    //alert(`Item${productId} added to wishlist`);
                } catch (error) {
                    console.error('Error adding to Wishlist', error);
                }
            } else {
                try {
                    const requestBody = {
                        StoreId: 1,
                        CurrencyId: 1,
                        CustomerId: currentCustomerId,
                        ProductId: productId,
                        ShoppingCartTypeId: 2,
                        Quantity: 1,
                        AttributeControlIds: "",
                        RentalStartDate: "",
                        RentalEndDate: ""
                    };
                    //console.log(requestBody);
                    await NopApi.WishList.AddProductToWishlist(requestBody);
                    //console.log('Product added to cart:', response.data);
                    toast.success('The product has been added to your Wishlist');

                    const cartRequestBody = {
                        StoreId: 1,
                        LanguageId: 1,
                        CustomerId: currentCustomerId,
                        CurrencyId: 1
                    };
                    const cartResponse = await NopApi.WishList.nopWishList(cartRequestBody);
                    //console.log(response.Items);
                    const total = cartResponse.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
                    setTotalwishlistItems(total);
                } catch (error) {
                    console.error('Error adding product to Wishlist:');
                }
            }
        } catch (error) {
            console.error('Error adding to Wishlist', error);
        }
    };
    return (
        <Item>
            <CardActionArea component={Link} to={`/${product.SeName}`}>
                <CardMedia
                    component="img"
                    height="288"
                    width="288"
                    image={product.DefaultPictureModel.ImageUrl}
                    alt={product.DefaultPictureModel.AlternateText}
                    className="productBox_image"
                />
                <CardContent className="cardContent_wrapper">
                    <Typography variant="h6" className="productBox_title">{formatProductName(product.Name)}</Typography>
                    <Typography variant="body2" color="textSecondary" className="productBox_description">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: truncateText(product.ShortDescription || '', 30)
                            }}
                        />
                    </Typography>


                    <Rating
                        name={`rating-${product.Id}`}
                        value={product.ReviewOverviewModel.RatingSum}
                        readOnly
                    />
                    <Typography variant="body1" color="text.primary" className="productBox_price">
                        {product.ProductPrice.Price}
                    </Typography>

                </CardContent>
            </CardActionArea>
            <Box className="productBox_Btngroup">
                <Button size="small" color="primary" className="cartBtn" onClick={(event) => handleAddToCart(event, product.Id, product.SeName)}>
                    {getButtonText()}
                </Button>
                <IconButton aria-label="share" className="shareBtn">
                    <ShareIcon />
                </IconButton>
                <IconButton aria-label="add to favorites" className="wishBtn" onClick={(event) => handleAddToWishlist(event, product.Id, product.SeName)}>
                    <FavoriteIcon />
                </IconButton>
            </Box>
        </Item>
    );
}