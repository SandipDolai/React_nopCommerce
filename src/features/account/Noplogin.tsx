import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import NopApi from '../../app/api/ThemeContext/NopApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../app/context/AuthContext';
import { useEffect, useState } from 'react';
import { useCart } from '../../app/context/CartContext';

interface CartItem {
    Id: number;
    Sku: string;
    ProductId: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    SubTotal: number;
    Picture: {
        FullSizeImageUrl: string;
        AlternateText: string;
    };
    AttributeControlIds: string[];
    RentalStartDate: string;
    RentalEndDate: string;
}
type Cart = CartItem[];
export default function Noplogin() {
    const currentCustomerId = localStorage.getItem('guestCustomerId');
    const [cart, setCart] = useState<Cart | null>(null);
    const [wishlist, setWishlist] = useState<Cart | null>(null);
    const { setTotalItems, setTotalwishlistItems } = useCart();
    const [rememberMe, setRememberMe] = useState(false);
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';
    const { login } = useAuth();
    const navigate = useNavigate();
    type FormData = {
        username: string;
        password: string;
        storeId: number;
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerId: currentCustomerId,
                    CurrencyId: 1
                };
                const [cartRes, wishlistRes] = await Promise.all([
                    NopApi.Cart.nopCart(requestBody),
                    NopApi.WishList.nopWishList(requestBody)
                ]);
                setCart(cartRes.Items);
                setWishlist(wishlistRes.Items);
            } catch (error) {
                console.error(error);
            }
        };

        if (currentCustomerId) fetchCart();
    }, [currentCustomerId]);

    const { register, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm<FormData>({
        mode: 'onTouched',
        defaultValues: {
            storeId: 1
        }
    })

    async function syncGuestData(customerId: number) {
        const buildRequest = (item: CartItem, type: number) => ({
            StoreId: 1,
            CurrencyId: 1,
            CustomerId: customerId,
            ProductId: item.ProductId,
            ShoppingCartTypeId: type,
            Quantity: item.Quantity,
            AttributeControlIds: item.AttributeControlIds?.join(',') || '',
            RentalStartDate: item.RentalStartDate || '',
            RentalEndDate: item.RentalEndDate || ''
        });

        const addToCart = cart?.map(item => NopApi.Cart.AddProductToCart(buildRequest(item, 1))) || [];
        const addToWishlist = wishlist?.map(item => NopApi.WishList.AddProductToWishlist(buildRequest(item, 2))) || [];

        await Promise.all([...addToCart, ...addToWishlist]);

        const fetchUpdatedData = {
            StoreId: 0,
            LanguageId: 1,
            CustomerId: customerId,
            CurrencyId: 1
        };

        const [updatedCart, updatedWishlist] = await Promise.all([
            NopApi.Cart.nopCart(fetchUpdatedData),
            NopApi.WishList.nopWishList(fetchUpdatedData)
        ]);

        setTotalItems(
            updatedCart.Items?.reduce((sum: number, item: CartItem) => sum + item.Quantity, 0) || 0
        );

        setTotalwishlistItems(
            updatedWishlist.Items?.reduce((sum: number, item: CartItem) => sum + item.Quantity, 0) || 0
        );

    }

    async function submitForm(data: FieldValues) {
        try {
            const response = await NopApi.Account.noplogin(data);

            if (response.Status === 400) {
                toast.error(response.ErrorMessage);
                return;
            }

            document.cookie = `username=${data.username}`;
            document.cookie = `CustomerId=${response.CustomerId}`;
            document.cookie = `Name=${response.FirstName} ${response.LastName}`;

            login(response.CustomerId);

            if (currentCustomerId) {
                await syncGuestData(response.CustomerId);
            }

            navigate(returnUrl);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        // <div className="container">
        <>
            <div className="page_title text-center my-4">
                <h1>Welcome, Please Sign In!</h1>
            </div>
            <div className="login_wrapper">
                <div className="welcome_box">
                    <h3 className="text-center">New Customer</h3>
                    <div className="text_box">
                        <p>
                            By creating an account on our website, you will be able to shop faster, be up to date on an orders status, and keep track of the orders you have previously made.
                        </p>
                    </div>
                    <Link to="/register" className="btn btn-primary general_form_btn">
                        Register
                    </Link>
                </div>
                <div className="welcome_box">
                    <h3 className="text-center">Returning Customer</h3>
                    <form onSubmit={handleSubmit(submitForm)} noValidate>
                        <div className="text_box">
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <div className="form_field">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username" autoComplete="username"
                                        {...register('username', { required: 'Username is required' })}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.username?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <div className="form_field">
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password" autoComplete="current-password"
                                        {...register('password', { required: 'Password is required' })}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.password?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="remember_box">
                                <div className="form-group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <label> Remember me?</label>
                                </div>
                                <Link to='/passwordrecovery' className="forgot_password_link">Forgot password?</Link>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block general_form_btn"
                            disabled={!isValid || isSubmitting}
                        >
                            {/* {isSubmitting ? 'Logged In...' : 'Log In'} */}
                            Log In
                        </button>
                    </form>
                </div>
            </div>
            <div className="page_title text-center my-4">
                <h2>About login / registration</h2>
                <p>
                    Put your login / registration information here. You can edit this in the admin site.
                </p>
            </div>
        </>
    );
}