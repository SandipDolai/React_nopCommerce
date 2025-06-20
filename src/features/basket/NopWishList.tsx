import { Box, Button, Checkbox, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCart } from "../../app/context/CartContext";
import { Add, Remove } from "@mui/icons-material";
import { useAuth } from "../../app/context/AuthContext";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type CheckedItems = {
    [key: number]: boolean;
};

type CartItem = {
    Id: number;
    ProductId: number;
    Sku: string;
    ProductSeName: string;
    Picture: {
        FullSizeImageUrl: string;
        AlternateText: string;
    };
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    SubTotal: number;
    AttributeInfo: string;
    RentalInfo: string;
    AttributeControlIds: string[];
    RentalStartDate: string;
    RentalEndDate: string;
};

type Cart = CartItem[] | null;

export default function NopWishList() {
    const [cart, setCart] = useState<Cart>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cartmessage, setCartmessage] = useState<string | null>(null);
    const { setTotalItems, setTotalwishlistItems } = useCart();
    const { customerId } = useAuth();
    const navigate = useNavigate();
    const [addtocartCheckedItems, setaddtocartCheckedItems] = useState<CheckedItems>({});
    const [removeCheckedItems, setremoveCheckedItems] = useState<CheckedItems>({});
    let currentCustomerId = customerId;

    const fetchCart = async () => {
        if (!currentCustomerId) {
            const storedCustomerId = localStorage.getItem('guestCustomerId');
            if (storedCustomerId) {
                currentCustomerId = storedCustomerId;
            } else {
                setCartmessage("Your Wishlist is empty!");
                setLoading(false);
                return;
            }
        }
        try {
            const requestBody = {
                StoreId: 0,
                LanguageId: 1,
                CustomerId: currentCustomerId,
                CurrencyId: 1
            };
            const response = await NopApi.WishList.nopWishList(requestBody);
            setCart(response.Items);
            const total = response.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
            setTotalwishlistItems(total);
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

    useEffect(() => {
        fetchCart();
    }, [customerId]);

    const handleCheckDelete = async () => {
        //debugger;
        const selectedItems = Object.keys(removeCheckedItems).filter(key => removeCheckedItems[Number(key)]).map(Number);
        let currentCustomerId = customerId;
        if (!currentCustomerId) {
            currentCustomerId = localStorage.getItem('guestCustomerId');
        }
        try {
            if (selectedItems.length === 0) {
                toast.error('No items selected.');
                return;
            }
            for (const itemId of selectedItems) {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerId: currentCustomerId,
                    CurrencyId: 1,
                    ItemIds: itemId
                };

                const response = await NopApi.WishList.nopRemoveFromWishList(requestBody);
                if (response.messageCode === 1) {
                    fetchCart();
                } else {
                    setError(response.data.messageText);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        }
    };

    const handleDelete = async (itemId: number) => {
        //debugger;
        let currentCustomerId = customerId;
        if (!currentCustomerId) {
            currentCustomerId = localStorage.getItem('guestCustomerId');
        }
        try {
            const requestBody = {
                StoreId: 0,
                LanguageId: 1,
                CustomerId: currentCustomerId,
                CurrencyId: 1,
                ItemIds: itemId
            };

            const response = await NopApi.WishList.nopRemoveFromWishList(requestBody);
            if (response.messageCode === 1) {
                fetchCart();
            } else {
                setError(response.data.messageText);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        }
    };

    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        let currentCustomerId = customerId;
        if (!currentCustomerId) {
            currentCustomerId = localStorage.getItem('guestCustomerId');
        }
        try {
            const requestBody = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: currentCustomerId,
                CurrencyId: 1,
                ItemId: itemId,
                NewQuantity: newQuantity
            };

            const response = await NopApi.WishList.UpdateWishlist(requestBody);
            if (response.messageCode === 1) {
                fetchCart();
            } else {
                setError(response.messageText);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        }
    };

    const addtocartCheckboxChange = (itemId: number) => {
        setaddtocartCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const removeCheckboxChange = (itemId: number) => {
        setremoveCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const addToCart = async () => {
        //debugger;
        currentCustomerId = customerId || localStorage.getItem('guestCustomerId');
        const selectedItems = Object.keys(addtocartCheckedItems).filter(key => addtocartCheckedItems[Number(key)]).map(Number);

        if (selectedItems.length === 0) {
            toast.error('No items selected.');
            return;
        }
        if (!cart) {
            toast.error('Cart is not loaded.');
            return;
        }

        try {
            for (const itemId of selectedItems) {
                const filteredItem = cart.filter(item => item.Id === itemId);
                const quantity = filteredItem.length > 0 ? filteredItem[0].Quantity : 0;
                const productId = filteredItem.length > 0 ? filteredItem[0].ProductId : 0;
                const RentalStartDate = filteredItem.length > 0 ? filteredItem[0].RentalStartDate : "";
                const RentalEndDate = filteredItem.length > 0 ? filteredItem[0].RentalEndDate : "";
                const requestBody = {
                    StoreId: 1,
                    CurrencyId: 1,
                    CustomerId: currentCustomerId,
                    ProductId: productId,
                    ShoppingCartTypeId: 1,
                    Quantity: quantity,
                    // AttributeControlIds: "product_attribute_1_6_1_1,product_attribute_1_7_2_3,product_attribute_1_5_4_9,product_attribute_1_9_5_10,product_attribute_1_4_3_7",
                    AttributeControlIds: filteredItem.length > 0 ? filteredItem[0].AttributeControlIds.join(',') : "",
                    RentalStartDate: RentalStartDate,
                    RentalEndDate: RentalEndDate
                };

                await NopApi.Cart.AddProductToCart(requestBody);

                const cartRequestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: currentCustomerId,
                    CurrencyId: 1
                };

                const cartResponse = await NopApi.Cart.nopCart(cartRequestBody);
                const total = cartResponse.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
                setTotalItems(total);
                handleDelete(itemId);
            }
        } catch (error) {
            console.error('Error adding product to cart');
        }
    };

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (cartmessage) {
        return <Typography variant="h6" color="text.secondary">{cartmessage}</Typography>;
    }

    return (
        <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
            <Typography variant="h4" component="h4" align="center" gutterBottom style={{ margin: '20px 0', fontSize: '30px' }}>
                Wishlist
            </Typography>
            {loading ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                            <TableCell><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="rectangular" width={100} height={100} /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                                <TableCell><Skeleton variant="text" /></TableCell>
                                <TableCell><Skeleton variant="rectangular" width={100} height={100} /></TableCell>
                                <TableCell><Skeleton variant="text" /></TableCell>
                                <TableCell><Skeleton variant="text" /></TableCell>
                                <TableCell><Skeleton variant="text" /></TableCell>
                                <TableCell><Skeleton variant="text" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                cart === null || cart.length === 0 ? (
                    <Typography variant="h6" align="center" color="text.secondary">
                        No items in the cart.
                    </Typography>
                ) : (
                    <Table className="wishlist_table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Remove</TableCell>
                                <TableCell>Add to cart</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Product(s)</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.Id}>
                                    <TableCell data-label="Remove:">
                                        <Checkbox
                                            checked={!!removeCheckedItems[item.Id]}
                                            onChange={() => removeCheckboxChange(item.Id)}
                                            className="custom_checkBox"
                                        />
                                    </TableCell>
                                    <TableCell data-label="Add to cart:" className="wish_add_to_cart">
                                        <Checkbox
                                            checked={!!addtocartCheckedItems[item.Id]}
                                            onChange={() => addtocartCheckboxChange(item.Id)}
                                            className="custom_checkBox"
                                        />
                                    </TableCell>
                                    <TableCell data-label="SKU:">{item.Sku}</TableCell>
                                    <TableCell onClick={() => navigate(`/${item.ProductSeName}`)} className="wish_product_image">
                                        <img
                                            src={item.Picture.FullSizeImageUrl}
                                            alt={item.Picture.AlternateText}
                                            style={{ height: '100px' }}
                                        />
                                    </TableCell>
                                    <TableCell onClick={() => navigate(`/${item.ProductSeName}`)}>
                                        <strong>
                                            {item.ProductName}
                                            {item.AttributeInfo && (
                                                <>
                                                    <br />
                                                    <span
                                                        style={{ fontWeight: 'normal' }}
                                                        dangerouslySetInnerHTML={{ __html: item.AttributeInfo }}
                                                    />
                                                </>
                                            )}
                                            {item.RentalInfo && (
                                                <>
                                                    <br />
                                                    <span
                                                        style={{ fontWeight: 'normal' }}
                                                        dangerouslySetInnerHTML={{ __html: item.RentalInfo }}
                                                    />
                                                </>
                                            )}
                                        </strong>
                                    </TableCell>

                                    <TableCell data-label="Price:" className="wish_price">{item.UnitPrice}</TableCell>
                                    <TableCell data-label="Quantity:" className="wish_quantity">
                                        <div className="capsule_qty">
                                            <IconButton onClick={() => handleQuantityChange(item.Id, item.Quantity - 1)}>
                                                <Remove />
                                            </IconButton>
                                            {item.Quantity}
                                            <IconButton onClick={() => handleQuantityChange(item.Id, item.Quantity + 1)}>
                                                <Add />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                    <TableCell data-label="Subtotal:" className="wish_sub_total">{item.SubTotal}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            )}
            <Box alignContent='' className="wish_to_cart_btn_wrapper">
                {cart !== null && cart.length > 0 && (
                    <>
                        <Button style={{ margin: '10px' }} variant="contained" color="secondary" onClick={() => handleCheckDelete()}>
                            Update Wishlist
                        </Button>
                        <Button style={{ margin: '10px' }} variant="contained" color="secondary" onClick={() => addToCart()}>
                            Add To Cart
                        </Button>
                    </>
                )}
            </Box>
        </TableContainer>
    );
}
