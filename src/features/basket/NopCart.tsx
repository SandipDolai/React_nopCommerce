import { Box, Button, Checkbox, FormControlLabel, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCart } from "../../app/context/CartContext";
import { Add, Remove } from "@mui/icons-material";
import { useAuth } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { toast } from "react-toastify";

interface CartItem {
    Id: number;
    Sku: string;
    ProductSeName: string;
    ProductId: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    SubTotal: number;
    Picture: {
        FullSizeImageUrl: string;
        AlternateText: string;
    };
    AttributeInfo: string;
    RentalInfo: string;
}

interface Cart {
    Items: CartItem[];
    subTotal: number;
}
type CheckedItems = {
    [key: number]: boolean;
};

export default function NopCart() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cartmessage, setCartmessage] = useState<string | null>(null);
    const { setTotalItems } = useCart();
    const { isLoggedIn, customerId } = useAuth();
    const navigate = useNavigate();
    const [termsChecked, setTermsChecked] = useState(false);
    const [removeCheckedItems, setremoveCheckedItems] = useState<CheckedItems>({});
    let currentCustomerId = customerId;

    const fetchCart = async () => {
        if (!currentCustomerId) {
            const storedCustomerId = localStorage.getItem('guestCustomerId');
            if (storedCustomerId) {
                currentCustomerId = storedCustomerId;
            } else {
                setCartmessage("Your Shopping Cart is empty!");
                setLoading(false);
                return;
            }
        }

        try {
            const requestBody = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: currentCustomerId,
                CurrencyId: 1
            };
            const response = await NopApi.Cart.nopCart(requestBody);
            setCart(response);
            const total = response.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
            setTotalItems(total);
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

    const removeCheckboxChange = (itemId: number) => {
        setremoveCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const handleCheckDelete = async () => {
        //debugger;
        let currentCustomerId = customerId;
        const selectedItems = Object.keys(removeCheckedItems).filter(key => removeCheckedItems[Number(key)]).map(Number);
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
                const response = await NopApi.Cart.nopRemoveFromCart(requestBody);
                if (response.messageCode === 1) {
                    fetchCart();
                } else {
                    setError(response.messageText);
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

            const response = await NopApi.Cart.UpdateCart(requestBody);
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

    const handleCheckout = () => {
        if (!termsChecked) {
            alert("Please accept the terms of service before the next step.");
            return;
        }
        if (isLoggedIn) {
            navigate(`/onepagecheckout`);
        } else {
            navigate(`/login?returnUrl=/cart`)
        }
    };

    if (loading) {
        return (
            <Box>
                <Skeleton variant="text" width={210} height={40} />
                <Skeleton variant="rectangular" width="100%" height={118} />
                <Skeleton variant="rectangular" width="100%" height={118} />
                <Skeleton variant="rectangular" width="100%" height={118} />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (cartmessage) {
        return <Typography variant="h6" color="text.secondary">{cartmessage}</Typography>;
    }

    return (
        <Box>
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                <Typography variant="h4" component="h4" align="center" gutterBottom style={{ margin: '20px 0', fontSize: '30px' }}>
                    Shopping cart
                </Typography>
                {cart?.Items?.length === 0 ? (
                    <Typography variant="h6" align="center" color="text.secondary">
                        No items in the cart.
                    </Typography>
                ) : (
                    <Table className="wishlist_table cart_table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Remove</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Product(s)</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart?.Items?.map((item) => (
                                <TableRow key={item.Id}>
                                    <TableCell data-label="Remove">
                                        <Checkbox
                                            checked={!!removeCheckedItems[item.Id]}
                                            onChange={() => removeCheckboxChange(item.Id)}
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
                )}

                {cart?.Items && cart.Items.length > 0 && (
                    <>
                        <Typography variant="h6" align="right" style={{ margin: '10px' }}>
                            Subtotal: {cart?.subTotal}
                        </Typography>
                        <Box className="wish_to_cart_btn_wrapper">
                            <Button style={{ margin: '10px' }} variant="contained" color="secondary" onClick={() => handleCheckDelete()}>
                                Update shopping cart
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-end" style={{ margin: '10px' }}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={termsChecked}
                                    onChange={(e) => setTermsChecked(e.target.checked)} />}
                                label="I agree with the terms of service and I adhere to them unconditionally" />
                            <Button variant="contained" color="primary" onClick={handleCheckout}>
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </>
                )}
            </TableContainer>
        </Box>
    );
}
