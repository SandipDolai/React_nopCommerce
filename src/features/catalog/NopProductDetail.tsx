import { Rating } from "@mui/material";

import { useCallback, useEffect, useState } from "react";
//import LoadingComponent from "../../app/layout/LoadingComponent";
import { toast } from "react-toastify";
import { useCart } from "../../app/context/CartContext";
import { useAuth } from "../../app/context/AuthContext";
import NopApi from "../../app/api/ThemeContext/NopApi";
import ProductAttributes from "./ProductAttributes";
import ProductImageGallery from "./ProductImageGallery";
import TierPrice from "./TierPrice";
import RentalInfo from "./RentalInfo";
import ProductSpecifications from "./ProductSpecifications";
import ProductBreadcrumb from "./ProductBreadcrumbs";

interface Product {
    Name: string;
    Sku: string;
    StockAvailability: string;
    ShortDescription: string;
    FullDescription: string;
    IsFreeShipping: boolean;
    ShowSku: boolean;
    IsAddedToWhishList: boolean;
    IsAddedToCart: boolean;
    DefaultPictureModel: {
        ImageUrl: string;
        Title: string;
    };
    PictureModels: Array<{
        ImageUrl: string;
        ThumbImageUrl: string;
        Title: string;
        AlternateText: string;
        FullSizeImageUrl: string;
    }>;
    ProductReviewOverview: {
        AllowCustomerReviews: boolean;
        RatingSum: number;
        TotalReviews: number;
        ProductId: number;
    }
    ProductPrice: {
        Price: string;
    };
    Breadcrumb: {
        ProductName: string;
        ProductSeName: string;
        Enabled: boolean;
        CategoryBreadcrumb: Array<{
            Name: string;
            SeName: string;
        }>;
    }
    ProductManufacturers: Array<{
        Name: string;
        Id: number;
    }>;
    AddToCart: {
        ProductId: number;
        EnteredQuantity: number;
        DisableBuyButton: boolean;
        DisableWishlistButton: boolean;
        AvailableForPreOrder: boolean;
        PreOrderAvailabilityStartDateTimeUtc: string;
        IsRental: boolean;
        MinimumQuantityNotification: string;
    }
    TierPrices: Array<{
        Price: string;
        Quantity: number;
    }>;
    ProductAttributes: Array<{
        ProductId: number;
        Id: number;
        ProductAttributeId: number;
        Name: string;
        IsRequired: boolean;
        AttributeControlType: number;
        Values: Array<{
            Name: string;
            IsPreSelected: boolean;
            PriceAdjustment: string;
            PriceAdjustmentValue: number;
            Id: number;
            ColorSquaresRgb?: string;
            PictureId?: number;
            PictureUrl?: string;
            FullSizePictureUrl?: string;
        }>;
    }>;
    ProductSpecifications: Array<{
        SpecificationAttributeId: number;
        SpecificationAttributeName: string;
        ValueRaw: string;
        ColorSquaresRgb: string | null;
        AttributeTypeId: number;
    }>;
}

interface NopProductDetailProps {
    id: number;
    name: string;
}

const ProductDetailSkeleton = () => (
    <div className="product_details_wrapper">
        <div className="row g-2">
            <div className="col-12 col-md-6">
                <div className="position-relative">
                    <div
                        className="skeleton skeleton-img w-100"
                        style={{
                            height: 400,
                            borderRadius: 8,
                            background: "#e0e0e0",
                            minHeight: 400 // Ensure consistent height
                        }}
                    />
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="card-body">
                    {/* Product name skeleton - reserve space */}
                    <div
                        className="skeleton skeleton-title mb-3"
                        style={{
                            height: 32,
                            width: "80%",
                            background: "#e0e0e0",
                            minHeight: 32
                        }}
                    />

                    {/* Short description skeleton */}
                    <div
                        className="skeleton skeleton-text mb-2"
                        style={{
                            height: 20,
                            width: "90%",
                            background: "#e0e0e0",
                            minHeight: 20
                        }}
                    />
                    <div
                        className="skeleton skeleton-text mb-4"
                        style={{
                            height: 20,
                            width: "70%",
                            background: "#e0e0e0",
                            minHeight: 20
                        }}
                    />

                    {/* Rating skeleton */}
                    <div
                        className="skeleton skeleton-rating mb-4"
                        style={{
                            height: 24,
                            width: 120,
                            background: "#e0e0e0",
                            minHeight: 24
                        }}
                    />

                    {/* Manufacturer skeleton */}
                    <div
                        className="skeleton skeleton-text mb-4"
                        style={{
                            height: 20,
                            width: "60%",
                            background: "#e0e0e0",
                            minHeight: 20
                        }}
                    />

                    {/* Stock availability skeleton */}
                    <div
                        className="skeleton skeleton-text mb-4"
                        style={{
                            height: 20,
                            width: "50%",
                            background: "#e0e0e0",
                            minHeight: 20
                        }}
                    />

                    {/* SKU skeleton */}
                    <div
                        className="skeleton skeleton-text mb-4"
                        style={{
                            height: 20,
                            width: "40%",
                            background: "#e0e0e0",
                            minHeight: 20
                        }}
                    />

                    {/* Price skeleton */}
                    <div
                        className="skeleton skeleton-price mb-3"
                        style={{
                            height: 28,
                            width: 100,
                            background: "#e0e0e0",
                            minHeight: 28
                        }}
                    />

                    {/* Controls skeleton */}
                    <div className="d-flex align-items-center my-3 gap-2 flex-wrap">
                        <div
                            className="skeleton skeleton-input"
                            style={{
                                height: 38,
                                width: 120,
                                background: "#e0e0e0",
                                minHeight: 38
                            }}
                        />
                        <div
                            className="skeleton skeleton-btn"
                            style={{
                                height: 38,
                                width: 120,
                                background: "#e0e0e0",
                                borderRadius: 4,
                                minHeight: 38
                            }}
                        />
                    </div>

                    {/* Wishlist button skeleton */}
                    <div
                        className="skeleton skeleton-btn"
                        style={{
                            height: 38,
                            width: 160,
                            background: "#e0e0e0",
                            borderRadius: 4,
                            minHeight: 38
                        }}
                    />
                </div>
            </div>
        </div>

        {/* Description skeleton */}
        <div className="mt-5" style={{ minHeight: 100 }}>
            <div
                className="skeleton skeleton-desc mb-2"
                style={{
                    height: 18,
                    width: "95%",
                    background: "#e0e0e0",
                    minHeight: 18
                }}
            />
            <div
                className="skeleton skeleton-desc mb-2"
                style={{
                    height: 18,
                    width: "88%",
                    background: "#e0e0e0",
                    minHeight: 18
                }}
            />
            <div
                className="skeleton skeleton-desc mb-2"
                style={{
                    height: 18,
                    width: "82%",
                    background: "#e0e0e0",
                    minHeight: 18
                }}
            />
        </div>
    </div>
);



export default function NopProductDetail({ id }: NopProductDetailProps) {
    //const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { setTotalItems, setTotalwishlistItems } = useCart();
    const { customerId } = useAuth();
    const [dynamicPrice, setDynamicPrice] = useState<string | null>(null);
    const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
    const [displayQuantity, setDisplayQuantity] = useState<number>(1);
    const [initialSlideImageUrl, setInitialSlideImageUrl] = useState<string | undefined>(undefined);
    const [rentalStartDate, setRentalStartDate] = useState<Date | null>(null);
    const [rentalEndDate, setRentalEndDate] = useState<Date | null>(null);
    // const [startDateError, setStartDateError] = useState<string | null>(null);
    // const [endDateError, setEndDateError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<number>(0);

    useEffect(() => {
        const fetchProducts = async () => {
            const currentCustomerId = customerId || localStorage.getItem('guestCustomerId');
            setLoading(true);
            if (!id) {
                setError('Product ID is missing');
                setLoading(true);
                return;
            }
            try {
                const requestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: currentCustomerId ? parseInt(currentCustomerId) : 0,
                    //CustomerId: 0,
                    CurrencyId: 1,
                    ProductId: parseInt(id.toString())
                };
                const response = await NopApi.ProductandCategory.ProductDetail(requestBody);
                //console.log(response);
                //debugger;
                setProducts(response);
                setDisplayQuantity(response?.AddToCart.EnteredQuantity || 1);
                //setCurrentProductImages(response?.PictureModels || []); // Initialize with all product images
                //setIsInWishlist(response?.IsAddedToWhishList || false);
                if (response?.PictureModels && response.PictureModels.length > 0) {
                    setInitialSlideImageUrl(response.PictureModels[0].FullSizeImageUrl);
                }

                const cartRequest = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerId: currentCustomerId ? parseInt(currentCustomerId) : 0,
                    CurrencyId: 1
                };

                const cartResponse = await NopApi.Cart.nopCart(cartRequest);
                //debugger;
                const cartItem = cartResponse.Items.find((item: { ProductId: number; Id: number }) =>
                    item.ProductId === parseInt(id.toString())
                );

                if (cartItem) {
                    setItem(cartItem.Id);
                    // console.log("cartItem", cartItem);
                } else {
                    //console.warn("Item not found in cart for the given ProductId");
                }

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
    }, [id, customerId]);


    const handleAttributeChange = useCallback(async (attributeIds: string[], selectedPictureUrls?: { PictureUrl: string, FullSizePictureUrl: string } | null) => {
        //debugger;
        try {
            setSelectedAttributeIds(attributeIds);
            // If a color attribute with associated pictures is selected, update the initialSlideImageUrl
            if (selectedPictureUrls && selectedPictureUrls.FullSizePictureUrl) {
                setInitialSlideImageUrl(selectedPictureUrls.FullSizePictureUrl);
            } else {
                // If no specific image from color attribute, revert to the default first product image
                // This ensures if a color is deselected or changed to one without an image, it defaults
                if (products?.PictureModels && products.PictureModels.length > 0) {
                    setInitialSlideImageUrl(products.PictureModels[0].FullSizeImageUrl);
                }
            }

            const res = await NopApi.ProductandCategory.ProductDetailsAttributeChange({
                ProductId: id,
                ValidateAttributeConditions: true,
                LoadPicture: true,
                AttributeControlIds: attributeIds
            });
            setDynamicPrice(res?.price ?? null);
        } catch (error) {
            console.error('Error fetching dynamic price:', error);
            setDynamicPrice(products?.ProductPrice.Price || null);
        }
    }, [id, products?.ProductPrice.Price, products?.PictureModels]);


    const handleDisplayQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setDisplayQuantity(newQuantity);
        } else if (event.target.value === '') {
            setDisplayQuantity(1);
        }
    };

    // const getButtonText = () => {
    //     if (products?.AddToCart.IsRental) {
    //         return "Rent";
    //     }

    //     if (products?.IsAddedToCart) {
    //         return "Added to Cart";
    //     }

    //     if (products?.AddToCart.AvailableForPreOrder) {
    //         return "Pre-order";
    //     }
    //     return "Add to Cart";
    // };

    const validateDates = () => {
        let isValid = true;

        if (!rentalStartDate || isNaN(rentalStartDate.getTime())) {
            toast.error('Start date is required.');
            return false; // Return early if start date is missing
        }

        if (!rentalEndDate) {
            toast.error('End date is required.');
            isValid = false;
        } else if (rentalStartDate && rentalEndDate < rentalStartDate) {
            toast.error('End date cannot be before start date.');
            isValid = false;
        }

        return isValid;
    };


    const addToCart = async (quantity: number | undefined) => {
        //debugger;
        if (!id) {
            toast.error('Product ID is missing.');
            return;
        }

        if (products?.AddToCart.IsRental && !validateDates()) {
            return;
        }

        let currentCustomerId = customerId || localStorage.getItem('guestCustomerId') || '0';


        try {
            const requestBody = {
                StoreId: 1,
                CurrencyId: 1,
                CustomerId: parseInt(currentCustomerId),
                ProductId: parseInt(id.toString()),
                ShoppingCartTypeId: 1, // Shopping Cart
                Quantity: quantity,
                AttributeControlIds: selectedAttributeIds,
                RentalStartDate: rentalStartDate?.toLocaleDateString() || "",
                RentalEndDate: rentalEndDate?.toLocaleDateString() || ""
            };

            const response = await NopApi.Cart.AddProductToCart(requestBody);

            if (response?.messageCode === 1) {
                if (!customerId && response.CustomerId) {
                    currentCustomerId = response.CustomerId.toString();
                    localStorage.setItem('guestCustomerId', currentCustomerId);
                }
                setProducts(prevProducts => {
                    if (prevProducts) {
                        return {
                            ...prevProducts,
                            IsAddedToCart: true,
                            AddToCart: {
                                ...prevProducts.AddToCart,

                            }
                        };
                    }
                    return prevProducts;
                });
                toast.success('The product has been added to your cart');
            } else {
                toast.error(response?.Message || 'Failed to add product to cart.');
                return;
            }

            const cartRequest = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: parseInt(currentCustomerId),
                CurrencyId: 1
            };

            const cartResponse = await NopApi.Cart.nopCart(cartRequest);
            const cartItem = cartResponse.Items.find((item: { ProductId: number; Id: number }) =>
                item.ProductId === products?.AddToCart.ProductId
            );

            if (cartItem) {
                setItem(cartItem.Id);
                // console.log("cartItem", cartItem);
            } else {
                //console.warn("Item not found in cart for the given ProductId");
            }
            const total = cartResponse.Items.reduce(
                (sum: number, item: { Quantity: number }) => sum + item.Quantity,
                0
            );

            setTotalItems(total);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('An error occurred while adding the product to cart.');
        }
    };


    const addToWishlist = async (quantity: number | undefined) => {
        //debugger;
        if (products?.AddToCart.IsRental && !validateDates()) return;
        if (!id) {
            toast.error('Product ID is missing.');
            return;
        }
        try {
            // 1. Determine the customer ID (logged in or guest)
            const currentCustomerId = customerId || localStorage.getItem('guestCustomerId') || "0"; // default to guest
            // 2. Prepare request body
            const requestBody = {
                StoreId: 1,
                CurrencyId: 1,
                CustomerId: parseInt(currentCustomerId),
                ProductId: parseInt(id.toString()),
                ShoppingCartTypeId: 2,
                Quantity: quantity,
                AttributeControlIds: selectedAttributeIds,
                RentalStartDate: rentalStartDate?.toLocaleDateString() || "",
                RentalEndDate: rentalEndDate?.toLocaleDateString() || ""
            };
            // 3. Add to wishlist
            const response = await NopApi.WishList.AddProductToWishlist(requestBody);

            if (response.messageCode === 1) {
                // Update guest ID if returned
                if (!customerId && response.CustomerId) {
                    localStorage.setItem('guestCustomerId', response.CustomerId);
                }
                toast.success('The product has been added to your Wishlist');
            } else {
                toast.error('Failed to add product to Wishlist.');
                return;
            }
            // 4. Fetch wishlist item count
            const cartRequestBody = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: response.CustomerId || customerId || currentCustomerId,
                CurrencyId: 1
            };
            const cartResponse = await NopApi.WishList.nopWishList(cartRequestBody);
            const total = cartResponse.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
            setTotalwishlistItems(total);

        } catch (error) {
            console.error('Error adding product to Wishlist:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    const removeFromCart = async () => {
        //debugger;
        try {
            const currentCustomerId = customerId || localStorage.getItem('guestCustomerId') || '0';
            const requestBody = {
                StoreId: 1,
                LanguageId: 1,
                CurrencyId: 1,
                CustomerId: parseInt(currentCustomerId, 10),
                ItemIds: item
            };
            const response = await NopApi.Cart.nopRemoveFromCart(requestBody);
            if (response?.messageCode === 1) {
                setProducts(prev => prev ? { ...prev, IsAddedToCart: false } : prev);
                toast.success('Product removed from cart');
            } else {
                toast.error(response?.Message || 'Failed to remove product from cart.');
            }
            const cartRequest = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: parseInt(currentCustomerId),
                CurrencyId: 1
            };

            const cartResponse = await NopApi.Cart.nopCart(cartRequest);
            const total = cartResponse.Items.reduce(
                (sum: number, item: { Quantity: number }) => sum + item.Quantity,
                0
            );

            setTotalItems(total);

        } catch (error) {
            toast.error('An error occurred while removing the product from cart.');
        }
    };

    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        //debugger;
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
                //fetchCart();
            } else {
                setError(response.messageText);
            }

            const cartRequest = {
                StoreId: 1,
                LanguageId: 1,
                CustomerId: currentCustomerId,
                CurrencyId: 1
            };

            const cartResponse = await NopApi.Cart.nopCart(cartRequest);
            const total = cartResponse.Items.reduce(
                (sum: number, item: { Quantity: number }) => sum + item.Quantity,
                0
            );

            setTotalItems(total);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        }
    };


    // if (loading) {
    //     return <LoadingComponent message='Loading Product...' />
    // }
    if (error) {
        return <div color="error">Error: {error}</div>;
    }
    if (loading) {
        return <ProductDetailSkeleton />;
    }

    return (
        <>
            {/* {loading ? (
                <div className="product_details_wrapper">
                    <div className="row g-2">
                        <div className="col-12 col-md-6">
                            <div className="position-relative">
                                <div className="skeleton skeleton-img w-100" style={{ height: 400, borderRadius: 8, background: "#e0e0e0" }} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="card-body">
                                <div className="skeleton skeleton-title mb-3" style={{ height: 32, width: "60%", background: "#e0e0e0" }} />
                                <div className="skeleton skeleton-text mb-2" style={{ height: 20, width: "80%", background: "#e0e0e0" }} />
                                <div className="skeleton skeleton-text mb-2" style={{ height: 20, width: "40%", background: "#e0e0e0" }} />
                                <div className="skeleton skeleton-rating mb-2" style={{ height: 24, width: 120, background: "#e0e0e0" }} />
                                <div className="skeleton skeleton-text mb-2" style={{ height: 20, width: "50%", background: "#e0e0e0" }} />
                                <div className="skeleton skeleton-text mb-2" style={{ height: 20, width: "30%", background: "#e0e0e0" }} />
                                <div className="skeleton skeleton-price mb-3" style={{ height: 28, width: 100, background: "#e0e0e0" }} />
                                <div className="d-flex align-items-center my-3 gap-2 flex-wrap">
                                    <div className="skeleton skeleton-input" style={{ height: 32, width: 80, background: "#e0e0e0" }} />
                                    <div className="skeleton skeleton-btn" style={{ height: 38, width: 120, background: "#e0e0e0", borderRadius: 4 }} />
                                </div>
                                <div className="skeleton skeleton-btn" style={{ height: 38, width: 160, background: "#e0e0e0", borderRadius: 4 }} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="skeleton skeleton-desc mb-2" style={{ height: 18, width: "90%", background: "#e0e0e0" }} />
                        <div className="skeleton skeleton-desc mb-2" style={{ height: 18, width: "80%", background: "#e0e0e0" }} />
                        <div className="skeleton skeleton-desc mb-2" style={{ height: 18, width: "70%", background: "#e0e0e0" }} />
                    </div>
                </div>
            ) : ( */}

            <div className="product_details_wrapper">
                {/* Breadcrumb with reserved space */}
                <div style={{ minHeight: products?.Breadcrumb ? 'auto' : 32 }}>
                    {products?.Breadcrumb && (
                        <ProductBreadcrumb breadcrumb={products.Breadcrumb} />
                    )}
                </div>
                <div className="row g-2">
                    <div className="col-12 col-md-6">
                        <div className="position-relative" style={{ minHeight: 400 }}>
                            <ProductImageGallery
                                images={products?.PictureModels ?? []}
                                initialSlideFullSizeImageUrl={initialSlideImageUrl} />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="card-body">
                            <h4 className="product_name" style={{ minHeight: 32, marginBottom: 16 }}>
                                {products?.Name || ""}
                            </h4>
                            <div className="text-secondary" style={{ minHeight: 48, marginBottom: 16 }}>
                                <span
                                    className="short-description"
                                    dangerouslySetInnerHTML={{ __html: products?.ShortDescription ?? "" }} />
                            </div>

                            <div className="product-reviews-overview mb-4" style={{ minHeight: 24 }}>
                                <Rating
                                    name={`rating-${products?.ProductReviewOverview.ProductId}`}
                                    value={products?.ProductReviewOverview.RatingSum || 0}
                                    readOnly />
                            </div>

                            {/* Manufacturer with reserved space */}
                            <div style={{ minHeight: products?.ProductManufacturers?.length ? 'auto' : 20, marginBottom: 16 }}>
                                {products?.ProductManufacturers && products.ProductManufacturers.length > 0 && (
                                    products.ProductManufacturers.map((manufacturer) => (
                                        <div className="text-secondary mb-4" key={manufacturer.Id}>
                                            <span className="manufacturer">Manufacturer:</span>
                                            <span className="value"> {manufacturer.Name}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="stock mb-4" style={{ minHeight: 20 }}>
                                <span className="availability">Availability:</span>
                                <span className="value">{products?.StockAvailability || ''}</span>
                            </div>

                            {/* SKU with reserved space */}
                            <div style={{ minHeight: products?.ShowSku ? 20 : 0, marginBottom: 16 }}>
                                {products?.ShowSku && (
                                    <div className="additional-details mb-4">
                                        <span className="sku">SKU:</span>
                                        <span className="value">{products?.Sku}</span>
                                    </div>
                                )}
                            </div>

                            {/* Free shipping with reserved space */}
                            <div className="free-shipping_wrapper" style={{ minHeight: products?.IsFreeShipping ? 24 : 0, marginBottom: 16 }}>
                                {products?.IsFreeShipping && <span className="free-shipping">Free Shipping</span>}
                            </div>

                            {/* Tier prices with reserved space */}
                            <div style={{ minHeight: products?.TierPrices?.length ? 'auto' : 0, marginBottom: 16 }}>
                                {products?.TierPrices && products.TierPrices.length > 0 && (
                                    <TierPrice tierPrices={products.TierPrices} />
                                )}
                            </div>

                            {/* Product attributes with reserved space */}
                            <div style={{ minHeight: products?.ProductAttributes?.length ? 'auto' : 0, marginBottom: 16 }}>
                                {products?.ProductAttributes && products.ProductAttributes.length > 0 && (
                                    <ProductAttributes
                                        productId={products.AddToCart.ProductId}
                                        attributes={products.ProductAttributes}
                                        onChange={handleAttributeChange}
                                    />
                                )}
                            </div>

                            {/* Rental info with reserved space */}
                            <div style={{ minHeight: products?.AddToCart.IsRental ? 'auto' : 0, marginBottom: 16 }}>
                                {products?.AddToCart.IsRental && (
                                    <RentalInfo
                                        rentalStartDate={rentalStartDate}
                                        rentalEndDate={rentalEndDate}
                                        onStartDateChange={setRentalStartDate}
                                        onEndDateChange={setRentalEndDate}
                                    />
                                )}
                            </div>

                            {/* Price with reserved space */}
                            <div className="product-price" style={{ minHeight: 28, marginBottom: 16 }}>
                                {dynamicPrice ?? products?.ProductPrice.Price ?? ''}
                            </div>

                            <div className="d-flex align-items-center my-3 flex-wrap product_details_cart_btn_wrapper" style={{ minHeight: 48 }}>
                                {products?.AddToCart.MinimumQuantityNotification && (
                                    <div className="text-secondary me-3 minimumQuantityNotification">
                                        {products?.AddToCart.MinimumQuantityNotification}
                                    </div>
                                )}
                                {/* <div>
                                      
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            min={1}
                                            value={displayQuantity}
                                            onChange={handleDisplayQuantityChange} />
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => addToCart(displayQuantity)}
                                        disabled={products?.AddToCart.DisableBuyButton || displayQuantity < 1}
                                    >
                                        {getButtonText()}
                                    </button> */}





                                <div className="input-group" style={{ width: 120 }}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={async () => {
                                            const minQuantity = products?.AddToCart.EnteredQuantity ?? 1;
                                            if (displayQuantity > minQuantity) {
                                                if (products?.IsAddedToCart) {
                                                    const newQuantity = displayQuantity - 1;
                                                    await handleQuantityChange(item, newQuantity);
                                                    setDisplayQuantity(newQuantity);
                                                } else {
                                                    setDisplayQuantity(q => q - 1);
                                                }
                                            } else {
                                                toast.info(`Minimum quantity is ${minQuantity}`);
                                            }
                                        }}
                                        disabled={displayQuantity <= (products?.AddToCart.EnteredQuantity ?? 1)}
                                        style={{ minWidth: 32, padding: 0 }}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm text-center"
                                        min={products?.AddToCart.EnteredQuantity ?? 1}
                                        value={displayQuantity}
                                        onChange={handleDisplayQuantityChange}
                                        style={{ maxWidth: 40 }}
                                        disabled={!products?.IsAddedToCart}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={async () => {
                                            const newQuantity = displayQuantity + 1;
                                            if (products?.IsAddedToCart) {
                                                await handleQuantityChange(item, newQuantity);
                                                //await addToCart(newQuantity);
                                            }
                                            setDisplayQuantity(newQuantity);
                                        }}
                                        disabled={products?.AddToCart.DisableBuyButton}
                                        style={{ minWidth: 32, padding: 0 }}
                                    >
                                        +
                                    </button>
                                </div>

                                {!products?.IsAddedToCart ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => addToCart(displayQuantity)}
                                        disabled={products?.AddToCart.DisableBuyButton || displayQuantity < 1}
                                    >
                                        {products?.AddToCart.IsRental ? "Rent" : "Add to Cart"}
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger"
                                        onClick={removeFromCart}
                                    >
                                        Remove from Cart
                                    </button>
                                )}
                            </div>
                            {/* Wishlist button with reserved space */}
                            <div className="product_details_wish_list" style={{ minHeight: 38 }}>
                                <button
                                    type="button"
                                    className="product_details_wish_btn"
                                    onClick={() => addToWishlist(displayQuantity)}
                                >
                                    {/* <i className="product_details_heart"><img src="src/app/assets/wishlist-button.png"/></i> */}
                                    <span>Add to wishlist</span>
                                </button>
                            </div>

                            {/* <Button variant="contained" color="primary" style={{ marginTop: '16px' }} onClick={() => addToCart(products?.AddToCart.EnteredQuantity)}>
                                 Add to Cart
                                 </Button> */}
                        </div>
                    </div>
                </div>
                {/* Full description with reserved space */}
                <div className="mt-5 text-secondary product-essential_description" style={{ minHeight: 100 }}>
                    <span
                        style={{ fontWeight: 'normal', margin: '10px 0', textAlign: 'justify', lineHeight: '24px', fontSize: '14px', color: '#777' }}
                        dangerouslySetInnerHTML={{ __html: products?.FullDescription ?? "" }} />
                </div>
                {products?.ProductSpecifications && products.ProductSpecifications.length > 0 && (
                    <ProductSpecifications specifications={products?.ProductSpecifications || []} />
                )}
            </div>
            {/* )} */}
        </>
    );
}