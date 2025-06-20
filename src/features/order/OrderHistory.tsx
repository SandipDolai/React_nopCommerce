import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/AuthContext";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { Button, List, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import btnOrderDetails from "../../app/assets/details.png";

export interface Order {
    OrderId: string;
    OrderDate: string;
    OrderStatus: string;
    OrderTotal: string;
    orderResult: OrderResult;
}

export interface OrderResult {
    Id: number;
    Message: string;
    OrderItems: OrderItem[];
    BillingAddress: BillingAddress;
    ShippingAddress: ShippingAddress;
    OrderTotal: string;
    Orders: string;
    OrderDate: string;
    OrderStatus: string;
    PaymentStatus: string;
    PaymentMethods: string;
    ShippingStatus: string;
    ShippingMethods?: string;
    IsReOrderAllowed: boolean;
    IsReturnRequestAllowed: boolean;
    IsShippable: boolean;
    PickUpInStore: boolean;
    VatNumber: string;
    CanRePostProcessPayment: boolean;
    OrderSubtotal: string;
    OrderSubTotalDiscount: number;
    OrderShipping: string;
    PaymentMethodAdditionalFee: number;
    Tax: string;
    TaxRates: TaxRate[];
    DisplayTax: boolean;
    DisplayTaxRates: boolean;
    PricesIncludeTax: boolean;
    DisplayTaxShippingInfo: boolean;
    OrderTotalDiscount: number;
    RedeemedRewardPoints: number;
    RedeemedRewardPointsAmount: number;
    CheckoutAttributeInfo: string;
    ShowSku: boolean;
}

export interface OrderItem {
    Id: number;
    OrderItemGuid: string;
    Sku: string;
    ProductId: number;
    ProductName: string;
    ProductSeName: string;
    UnitPrice: string;
    SubTotal: string;
    Quantity: number;
    AttributeInfo: string;
    RentalInfo: string;
    DownloadId: number;
    LicenseId: number;
    Picture: Picture;
}

export interface Picture {
    ImageUrl: string;
    ThumbImageUrl: string;
    FullSizeImageUrl: string;
    Title: string;
    AlternateText: string;
    CustomProperties: CustomProperties;
}

export interface CustomProperties { }

export interface BillingAddress {
    AddressId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Company: string;
    CountryId: string;
    StateProvinceId: string;
    City: string;
    Address1: string;
    Address2: string;
    ZipPostalCode: string;
    PhoneNumber: string;
    FaxNumber: string;
    CountryName: string;
    StateProvinceName: string;
}

export interface ShippingAddress {
    AddressId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Company: string;
    CountryId: number;
    StateProvinceId: number;
    City: string;
    Address1: string;
    Address2: string;
    ZipPostalCode: string;
    PhoneNumber: string;
    FaxNumber: string;
    CountryName: string;
    StateProvinceName: string;
}

export interface TaxRate {
    Rate: string;
    Value: string;
}

export default function OrderHistory() {
    const { customerId } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const requestBody = {
                    StoreId: 0,
                    CustomerID: customerId,
                    CurrencyId: 1,
                };
                const response = await NopApi.CheckOut.GetOrder(requestBody);
                if (response.messageCode === 1) {
                    setOrders(response.orders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [customerId]);

    return (
        <div>
            {loading ? (
                <div className="Order_list_box">
                    <div className="order_list_head">
                        <h5></h5>

                    </div>
                    <div className="text_box">
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-6"></p>
                        <p className="placeholder col-8"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-4"></p>
                    </div>
                    <div className="text-center m-block">

                    </div>
                </div>
            ) : (
                <>
                    {orders.length === 0 ? (
                        <Typography variant="h6" component="div" gutterBottom>
                            No orders
                        </Typography>
                    ) : (
                        <>
                            <h1>My account - Orders</h1><List>
                                {orders.map((order) => (
                                    <div key={order.OrderId} className="Order_list_box">
                                        <div className="order_list_head">
                                            <h5>Order Number: {order.OrderId}</h5>
                                            <Button
                                                component={Link}
                                                to={`/orderdetails?orderId=${order.OrderId}`}
                                                className="OrderDetailsBtn m-none"
                                            >
                                                <img src={btnOrderDetails} alt="Order Details" />
                                                Details
                                            </Button>
                                        </div>
                                        <div className="text_box">
                                            <p>Order Status: {order.OrderStatus}</p>
                                            <p>Order Date: {order.OrderDate}</p>
                                            <p>Order Total: {order.OrderTotal}</p>
                                        </div>
                                        <div className="text-center m-block">
                                            <Button
                                                component={Link}
                                                to={`/orderdetails?orderId=${order.OrderId}`}
                                                className="OrderDetailsBtn"
                                            >
                                                <img src={btnOrderDetails} alt="Order Details" />
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </List>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
