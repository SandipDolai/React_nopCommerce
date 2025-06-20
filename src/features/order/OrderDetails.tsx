import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NopApi from "../../app/api/ThemeContext/NopApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Address {
    Id: number;
    FirstName: string;
    LastName: string;
    Address1: string;
    City: string;
    ZipPostalCode: string;
    CountryName: string;
    Email?: string;
    PhoneNumber?: string;
    FaxNumber?: string;
}

interface OrderReviewData {
    BillingAddress: Address;
    ShippingAddress: Address;
    PaymentMethodSystemName: string;
    PaymentStatus: string;
    ShippingMethod: string;
    ShippingStatus: string;
    OrderTotal: string;
    CreatedOnUtc: string;
    OrderStatus: string;
    OrderItems: OrderItem[];
    OrderSubtotalInclTax: number;
    OrderShippingExclTax: number;
    OrderTax: number;
}

interface PaymentInformation {
    Data: OrderReviewData;
    Items: {
        Id: number;
        Sku: string;
        ProductId: number;
        ProductName: string;
        UnitPrice: string;
        Quantity: number;
        SubTotal: string;
        Picture: {
            FullSizeImageUrl: string;
            AlternateText: string;
        };
    }[];
    SubTotal: string;
    Shipping: string;
    Tax: string;
}

export interface OrderItem {
    UnitPriceInclTax: number;
    UnitPriceExclTax: number;
    PriceInclTax: number;
    PriceExclTax: number;
    DiscountAmountInclTax: number;
    DiscountAmountExclTax: number;
    OriginalProductCost: number;
    AttributeDescription: string;
    DownloadCount: number;
    IsDownloadActivated: boolean;
    LicenseDownloadId: number;
    ItemWeight: number;
    RentalStartDateUtc: string;
    RentalEndDateUtc: string;
    Product: Product;
    ProductId: number;
}

export interface Product {
    Name: string;
    Sku: string;
    Price: number;
    OldPrice: number;
    ProductCost: number;
}

export default function OrderDetails() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const [orders, setorders] = useState<PaymentInformation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const requestBody = {
                    OrderId: orderId
                };

                const response = await NopApi.CheckOut.OrderDetails(requestBody)
                setorders(response);
            } catch (error) {
                setError('Error fetching order details.');
            } finally {
                setLoading(false);
            }
        }
        fetchOrderDetails();
    }, [orderId]);

    const generatePDF = () => {
        //debugger;
        const input = document.getElementById('order-details');
        const reOrderButton = document.querySelector('.re-order_btn');
        const printButton = document.querySelector('.invoice_printBtn');
        const invoiceButton = document.querySelector('.invoice_pdfBtn');

        if (input && reOrderButton) {
            (reOrderButton as HTMLElement).style.display = 'none';
            (printButton as HTMLElement).style.display = 'none';
            (invoiceButton as HTMLElement).style.display = 'none';
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 15, 4, 180, 160);
                pdf.save(`Order_${orderId}.pdf`);
                (reOrderButton as HTMLElement).style.display = 'block';
                //(printButton as HTMLElement).style.display = 'block';
                //(invoiceButton as HTMLElement).style.display = 'block';
            });
        }
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (loading) {
        return (
            <div className="order_deatils">
                <Skeleton variant="text" width={300} height={40} />
                <Skeleton variant="rectangular" width="100%" height={400} />
            </div>
        );
    }

    if (!orders) {
        return <Typography>No order details found.</Typography>;
    }

    return (
        <div id="order-details" className="order_deatils">
            <div className="page_title text-center">
                <h1>Order information</h1>
                <div className="text-center">
                    <a className="invoice_printBtn" onClick={() => window.print()}>Print</a>
                    <a className="invoice_pdfBtn" onClick={generatePDF}>PDF Invoice</a>
                </div>
            </div>
            <div className="text-center order-overview">
                <h5>ORDER #{orderId}</h5>
                <p>Order Date: {orders?.Data.CreatedOnUtc}</p>
                <p>Order Status: {orders?.Data.OrderStatus}</p>
                <p>Order Total: <span>${orders?.Data.OrderTotal}</span></p>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-12 mb-5">
                    <div className="billing-info-wrap">
                        <ul>
                            <li><h6>Billing Address</h6></li>
                            <li><p>{`${orders?.Data.BillingAddress.FirstName} ${orders?.Data.BillingAddress.LastName}`}</p></li>
                            <li><p>Email: {orders?.Data.BillingAddress.Email}</p></li>
                            <li><p>Phone: {orders?.Data.BillingAddress.PhoneNumber}</p></li>
                            <li><p>Fax: {orders?.Data.BillingAddress.FaxNumber}</p></li>
                            <li><p>{orders?.Data.BillingAddress.Address1}</p></li>
                            <li><p>{orders?.Data.BillingAddress.City}, {orders?.Data.BillingAddress.ZipPostalCode}</p></li>
                            <li><p>{orders?.Data.BillingAddress.CountryName}</p></li>
                        </ul>
                        <ul>
                            <li><h6>Payment</h6></li>
                            <li><p>Payment Method: {orders?.Data.PaymentMethodSystemName}</p></li>
                            <li><p>Payment Method: {orders?.Data.PaymentStatus}</p></li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12 mb-5">
                    <div className="billing-info-wrap">
                        <ul>
                            <li><h6>Shipping Address</h6></li>
                            <li><p>{`${orders?.Data.ShippingAddress.FirstName} ${orders?.Data.ShippingAddress.LastName}`}</p></li>
                            <li><p>Email: {orders?.Data.ShippingAddress.Email}</p></li>
                            <li><p>Phone: {orders?.Data.ShippingAddress.PhoneNumber}</p></li>
                            <li><p>Fax: {orders?.Data.ShippingAddress.FaxNumber}</p></li>
                            <li><p>{orders?.Data.ShippingAddress.Address1}</p></li>
                            <li><p>{orders?.Data.ShippingAddress.City}, {orders?.Data.ShippingAddress.ZipPostalCode}</p></li>
                            <li><p>{orders?.Data.ShippingAddress.CountryName}</p></li>
                        </ul>
                        <ul>
                            <li><h6>Shipping</h6></li>
                            <li><p>Shipping Method: {orders?.Data.ShippingMethod}</p></li>
                            <li><p>Shipping Method: {orders?.Data.ShippingStatus}</p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-12 text-center">
                    <h4>Product(s)</h4>
                </div>
                <div className="col-lg-12 col-md-12 col-12 text-center mt-2">
                    <Table className="wishlist_table orrder-details_table">
                        <TableHead>
                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(
                                orders?.Data.OrderItems?.map((item) => (
                                    <TableRow key={item.ProductId}>
                                        <TableCell data-label="SKU:">{item.Product.Sku}</TableCell>
                                        <TableCell><strong>{`${item.Product.Name} ${item.AttributeDescription}`}</strong></TableCell>
                                        <TableCell data-label="Price:">{item.UnitPriceInclTax}</TableCell>
                                        <TableCell data-label="Quantity:"></TableCell>
                                        <TableCell data-label="Subtotal:">{item.PriceInclTax}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="col-lg-12 col-md-12 col-12 mt-4">
                    <div className="order_total_info">
                        <ul className="mb-4">
                            <li><span>Sub-Total:</span> <span>${orders?.Data.OrderSubtotalInclTax}</span></li>
                            <li><span>Shipping:</span> <span>$({orders?.Data.ShippingMethod}): {orders?.Data.OrderShippingExclTax}</span></li>
                            <li><span>Tax:</span> <span>${orders?.Data.OrderTax}</span></li>
                            <li><span>Total:</span> <strong>${orders?.Data.OrderTotal}</strong></li>
                        </ul>
                        <a className="invoice_printBtn re-order_btn text-center">Re-order</a>
                    </div>
                </div>
            </div>
        </div>
    );
}