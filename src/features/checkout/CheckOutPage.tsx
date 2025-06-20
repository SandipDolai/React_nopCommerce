import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useAuth } from '../../app/context/AuthContext';
import NopApi from '../../app/api/ThemeContext/NopApi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../app/context/CartContext';


interface CheckoutStep {
    number: number;
    title: string;
}
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
// interface PickupPoint {
//     Id: number;
//     Name: string;
//     Address: string;
//     City: string;
//     ZipPostalCode: string;
//     CountryName: string;
//     PickupFee: string;
// }

interface OrderReviewData {
    BillingAddress: Address;
    ShippingAddress: Address;
    PaymentMethod: string;
    ShippingMethod: string;
}

interface PaymentInformation {
    OrderReviewData: OrderReviewData;
    Items: {
        Id: number;
        Sku: string;
        ProductId: number;
        ProductName: string;
        ProductSeName: string;
        UnitPrice: string;
        Quantity: number;
        SubTotal: string;
        AttributeInfo: string;
        Picture: {
            FullSizeImageUrl: string;
            AlternateText: string;
        };
    }[];
    SubTotal: string;
    Shipping: string;
    Tax: string;
    OrderTotal: string;
}
interface ShippingMethod {
    Name: string;
    ShippingRateComputationMethodSystemName: string;
    Fee: string;
    Description?: string;
}
interface PaymentMethod {
    PaymentMethodSystemName: string;
    Name: string;
    Fee?: string;
    LogoUrl?: string;
}

const checkoutSteps: CheckoutStep[] = [
    { number: 1, title: "Billing address" },
    { number: 2, title: "Shipping address" },
    { number: 3, title: "Shipping method" },
    { number: 4, title: "Payment method" },
    //{ number: 5, title: "Payment information" },
    { number: 5, title: "Confirm order" },
];

const CheckOutPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [checkoutData, setCheckoutData] = useState({
        billingAddress: '',
        shippingAddress: '',
        shippingMethod: '',
        paymentMethod: '',
        //paymentInformation: '',
        shipToSameAddress: false,
        usePickup: false
    });
    const [addresses, setAddresses] = useState<Address[]>([]);
    // const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
    const [openSection, setOpenSection] = useState(1);
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [allpaymentInformation, setallpaymentInformation] = useState<PaymentInformation | null>(null);
    const navigate = useNavigate();
    const { customerId } = useAuth();
    const { setTotalItems } = useCart();
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    useEffect(() => {
        const fetchBillingAddress = async () => {
            try {

                const requestBody = {
                    StoreId: 1,
                    Language: 1,
                    CustomerId: customerId,

                };
                //console.log(requestBody);
                const response = await NopApi.CheckOut.GetBillingAddress(requestBody);
                if (response.messageCode === 0) {
                    navigate('/cart');
                    return
                }
                // console.log('response.ExistingAddresses', response.ExistingAddresses);
                setAddresses(response.ExistingAddresses);
                if (response.ExistingAddresses.length > 0) {
                    setCheckoutData(prevData => ({
                        ...prevData,
                        billingAddress: response.ExistingAddresses[0].Id.toString(),
                        shippingAddress: response.ExistingAddresses[0].Id.toString(),
                    }));
                }
            } catch (error) {
                //setError(error.message);
            } finally {
                // setLoading(false);
            }
        };
        fetchBillingAddress();
    }, [customerId]);
    useEffect(() => {
        if (stepRefs.current[currentStep - 1]) {
            stepRefs.current[currentStep - 1]?.focus();
        }
    }, [currentStep]);
    // console.log(checkoutData);
    const handleContinue = async () => {
        //debugger;
        if (currentStep === 1) {
            try {
                const requestBody = {
                    StoreId: 1,
                    LanguageId: 1,
                    CustomerID: customerId,
                    AddressId: checkoutData.billingAddress,
                    CurrencyId: 1,
                };
                //console.log('requestBody', requestBody);
                await NopApi.CheckOut.SelectBillingAddress(requestBody);
                if (checkoutData.shipToSameAddress) {
                    // setCheckoutData(prevData => ({
                    //     ...prevData,
                    //     shippingAddress: prevData.billingAddress,
                    // }));
                    const requestBody1 = {
                        StoreId: 1,
                        LanguageId: 1,
                        CustomerID: customerId,
                        AddressId: checkoutData.shippingAddress,
                        CurrencyId: 1,
                    };

                    //console.log('requestBody11', requestBody);
                    const response = await NopApi.CheckOut.SelectShippingAddress(requestBody1);
                    setShippingMethods(response.ShippingMethods);
                    setCheckoutData(prevData => ({
                        ...prevData,
                        shippingMethod: (response.ShippingMethods[0].Name).toString() + '___' + (response.ShippingMethods[0].ShippingRateComputationMethodSystemName).toString()
                    }));
                    setCurrentStep(currentStep + 2);
                    setOpenSection(currentStep + 2);
                } else {
                    setCurrentStep(currentStep + 1);
                    setOpenSection(currentStep + 1);
                }
            } catch (error) {
                console.error('Error selecting billing address:', error);
            }
        } else if (currentStep === 2) {
            if (checkoutData.usePickup) {
                // Handle pickup point selection
                setCurrentStep(currentStep + 2);
            } else {
                try {
                    const requestBody = {
                        StoreId: 1,
                        LanguageId: 1,
                        CustomerID: customerId,
                        AddressId: checkoutData.shippingAddress,
                        CurrencyId: 1,
                    };
                    //console.log('requestBody1', requestBody);
                    const response = await NopApi.CheckOut.SelectShippingAddress(requestBody);
                    setShippingMethods(response.ShippingMethods);
                    setCheckoutData(prevData => ({
                        ...prevData,
                        shippingMethod: (response.ShippingMethods[0].Name).toString() + '___' + (response.ShippingMethods[0].ShippingRateComputationMethodSystemName).toString()
                    }));
                    setCurrentStep(currentStep + 1);
                    setOpenSection(currentStep + 1);
                } catch (error) {
                    console.error('Error selecting Shipping address:', error);
                }
            }
        } else if (currentStep === 3) {
            try {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerID: customerId,
                    ShippingOption: checkoutData.shippingMethod,
                    CurrencyId: 1,
                };
                //console.log(requestBody);
                const response = await NopApi.CheckOut.SelectShippingMethod(requestBody);
                //console.log(response.PaymentMethods);
                setPaymentMethods(response.PaymentMethods);
                setCheckoutData(prevData => ({
                    ...prevData,
                    paymentMethod: response.PaymentMethods[0].PaymentMethodSystemName.toString(),
                }));
                setCurrentStep(currentStep + 1);
                setOpenSection(currentStep + 1);
            }
            catch (error) {
                console.error('Error selecting shipping address:', error);
            }

        }
        else if (currentStep === 4) {
            try {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerID: customerId,
                    PaymentMethod: checkoutData.paymentMethod,
                    CurrencyId: 1,
                };
                //console.log(requestBody);
                const response = await NopApi.CheckOut.SelectPaymentMethod(requestBody);
                //console.log('setallpaymentInformation', response);
                setallpaymentInformation(response);
                setCurrentStep(currentStep + 1);
                setOpenSection(currentStep + 1);
            }
            catch (error) {
                console.error('Error selecting Payment Method:', error);
            }

        }
        else if (currentStep === 5) {
            try {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 1,
                    CustomerID: customerId,
                    CurrencyId: 1,
                };
                //console.log(requestBody);
                const response = await NopApi.CheckOut.ConfirmOrder(requestBody);
                const cart = await NopApi.Cart.nopCart(requestBody);
                const total = cart.Items.reduce((sum: number, item: { Quantity: number }) => sum + item.Quantity, 0);
                setTotalItems(total);
                //console.log('ConfirmOrder', response);
                navigate('/orderconfirmation', { state: { order: response } });
                return
            }
            catch (error) {
                console.error('Error ConfirmOrder:', error);
            }
        }
        else if (currentStep < checkoutSteps.length) {
            setCurrentStep(currentStep + 1);
            // setOpenSection(3);
        }
    };

    const handleBack = () => {
        if (currentStep === 3 && checkoutData.shipToSameAddress) {
            setCurrentStep(currentStep - 2);
            setOpenSection(currentStep - 2);
        } else if (currentStep === 4 && checkoutData.usePickup) {
            setCurrentStep(currentStep - 2);
        }
        else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setOpenSection(currentStep - 1);
        }
    };

    const handleAddNewAddress = () => {
        navigate('/addressadd');
    };

    const handleSectionClick = (sectionNumber: number) => {
        //debugger;
        if (sectionNumber < currentStep) {
            if (!checkoutData.shipToSameAddress) {
                setOpenSection(sectionNumber);
                const newStep = (currentStep - sectionNumber);
                setCurrentStep(currentStep - newStep);
            }
            if (checkoutData.shipToSameAddress && sectionNumber != 2) {
                setOpenSection(sectionNumber);
                const newStep = (currentStep - sectionNumber);
                setCurrentStep(currentStep - newStep);
            }
        }
    };
    const handleAddressChange = (event: SelectChangeEvent<string>, field: string) => {
        setCheckoutData({
            ...checkoutData,
            [field]: event.target.value as string,
        });
    };
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setCheckoutData(prevData => ({
            ...prevData,
            shipToSameAddress: isChecked,
            shippingAddress: isChecked ? prevData.billingAddress : addresses[0]?.Id.toString() || '',
        }));
    };


    // const handlePickupChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const isChecked = event.target.checked;
    //     setCheckoutData(prevData => ({
    //         ...prevData,
    //         usePickup: isChecked,
    //     }));

    //     if (isChecked) {
    //         try {
    //             const requestBody = {
    //                 StoreId: 1,
    //                 LanguageId: 1,
    //                 CustomerID: customerId,
    //                 AddressId: checkoutData.billingAddress,
    //                 CurrencyId: 1,
    //             };
    //             const response = await NopApi.CheckOut.SelectBillingAddress(requestBody);
    //             //console.log('PickupPoints', response.PickupPoints);
    //             setPickupPoints(response.PickupPoints);
    //         } catch (error) {
    //             console.error('Error fetching pickup points:', error);
    //         }
    //     }
    // };
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Checkout
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {checkoutSteps.map((step, index) => (
                    <Box
                        key={step.number}
                        ref={el => (stepRefs.current[index] = el as HTMLDivElement | null)}
                        tabIndex={-1}
                        sx={{
                            backgroundColor: '#4ab2f1',
                            color: 'white',
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body1" align="center" onClick={() => handleSectionClick(step.number)}>
                            {step.number}. {step.title}
                        </Typography>

                        {/* Show input fields only for the current step */}
                        {step.number === openSection && (
                            <>
                                {step.number === 1 && (
                                    <>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="billing-address-label"
                                                value={checkoutData.billingAddress}
                                                onChange={(e) => handleAddressChange(e, 'billingAddress')}
                                            >
                                                {addresses.map((address, index) => (
                                                    <MenuItem key={index} value={address.Id}>
                                                        {`${address.FirstName} ${address.LastName}, ${address.Address1}, ${address.City} ${address.ZipPostalCode}, ${address.CountryName}`}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checkoutData.shipToSameAddress}
                                                    onChange={handleCheckboxChange}
                                                />
                                            }
                                            label="Ship to same address"
                                        />
                                        <Button variant="contained" onClick={handleAddNewAddress}>Add New Address</Button>
                                    </>
                                )}

                                {step.number === 2 && !checkoutData.shipToSameAddress && (
                                    <>
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checkoutData.usePickup}
                                                    onChange={handlePickupChange}
                                                />
                                            }
                                            label="Pickup"
                                        /> */}
                                        {!checkoutData.usePickup && (
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="shipping-address-label"
                                                    value={checkoutData.shippingAddress}
                                                    onChange={(e) => handleAddressChange(e, 'shippingAddress')}
                                                >
                                                    {addresses.map((address, index) => (
                                                        <MenuItem key={index} value={address.Id}>
                                                            {`${address.FirstName} ${address.LastName}, ${address.Address1}, ${address.City} ${address.ZipPostalCode}, ${address.CountryName}`}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                        {/* {checkoutData.usePickup && pickupPoints.length > 0 && (
                                            <Box mt={2}>
                                                {pickupPoints.map(point => (
                                                    <Typography key={point.Id}>
                                                        {`${point.Name}, ${point.Address}, ${point.City}, ${point.ZipPostalCode}, ${point.CountryName} - ${point.PickupFee}`}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        )} */}
                                    </>
                                )}

                                {step.number === 3 && (
                                    <>
                                        <FormControl fullWidth>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                value={checkoutData.shippingMethod}
                                                onChange={(e) => handleAddressChange(e, 'shippingMethod')}
                                            >
                                                {shippingMethods.map((payMethod, index) =>
                                                    <FormControlLabel key={index}
                                                        value={`${payMethod.Name}___${payMethod.ShippingRateComputationMethodSystemName}`}
                                                        control={<Radio />}
                                                        label={
                                                            <Box key={index}>
                                                                {`${payMethod.Name}(${payMethod.Fee})`}
                                                                {<Typography variant="body2">{payMethod.Description}</Typography>}
                                                            </Box>
                                                        }
                                                    />
                                                )}

                                            </RadioGroup>
                                        </FormControl>
                                    </>
                                )}

                                {step.number === 4 && (
                                    <>
                                        <FormControl fullWidth>
                                            <Box>
                                                <FormControl component="fieldset">
                                                    <RadioGroup row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="row-radio-buttons-group" value={checkoutData.paymentMethod} onChange={(e) => handleAddressChange(e, 'paymentMethod')}>
                                                        {paymentMethods.map((method) => (
                                                            <FormControlLabel
                                                                key={method.PaymentMethodSystemName}
                                                                value={method.PaymentMethodSystemName}
                                                                control={<Radio />}
                                                                label={
                                                                    <Box display="flex" alignItems="center">
                                                                        <img src={method.LogoUrl} alt={method.Name} style={{ marginRight: 8, height: 24 }} />
                                                                        {method.Name}
                                                                        {method.Fee && <Typography variant="caption" style={{ marginLeft: 8 }}>Fee: {method.Fee}</Typography>}
                                                                    </Box>
                                                                }
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            </Box>
                                        </FormControl>
                                    </>
                                )}
                                {step.number === 5 && (
                                    <>
                                        <Box padding={2}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">Billing Address</Typography>
                                                    <Typography>{`${allpaymentInformation?.OrderReviewData.BillingAddress.FirstName} ${allpaymentInformation?.OrderReviewData.BillingAddress.LastName}`}</Typography>
                                                    <Typography>Email: {allpaymentInformation?.OrderReviewData.BillingAddress.Email}</Typography>
                                                    <Typography>Phone: {allpaymentInformation?.OrderReviewData.BillingAddress.PhoneNumber}</Typography>
                                                    <Typography>Fax: {allpaymentInformation?.OrderReviewData.BillingAddress.FaxNumber}</Typography>
                                                    <Typography>{allpaymentInformation?.OrderReviewData.BillingAddress.Address1}</Typography>
                                                    <Typography>{allpaymentInformation?.OrderReviewData.BillingAddress.City}, {allpaymentInformation?.OrderReviewData.BillingAddress.ZipPostalCode}</Typography>
                                                    <Typography>{allpaymentInformation?.OrderReviewData.BillingAddress.CountryName}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">Shipping Address</Typography>
                                                    <Typography>{`${allpaymentInformation?.OrderReviewData.ShippingAddress.FirstName} ${allpaymentInformation?.OrderReviewData.ShippingAddress.LastName}`}</Typography>
                                                    <Typography>Email: {allpaymentInformation?.OrderReviewData.ShippingAddress.Email}</Typography>
                                                    <Typography>Phone: {allpaymentInformation?.OrderReviewData.ShippingAddress.PhoneNumber}</Typography>
                                                    <Typography>Fax: {allpaymentInformation?.OrderReviewData.ShippingAddress.FaxNumber}</Typography>
                                                    <Typography>{allpaymentInformation?.OrderReviewData.ShippingAddress.Address1}</Typography>
                                                    <Typography>{allpaymentInformation?.OrderReviewData.ShippingAddress.City}, {allpaymentInformation?.OrderReviewData.ShippingAddress.ZipPostalCode}</Typography>
                                                    <Typography>{allpaymentInformation?.OrderReviewData.ShippingAddress.CountryName}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">Payment</Typography>
                                                    <Typography>Payment Method: {allpaymentInformation?.OrderReviewData.PaymentMethod}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6">Shipping</Typography>
                                                    <Typography>Shipping Method: {allpaymentInformation?.OrderReviewData.ShippingMethod}</Typography>
                                                </Grid>
                                                <TableContainer component={Paper} style={{ margin: '10px' }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>SKU</TableCell>
                                                                <TableCell> Image</TableCell>
                                                                <TableCell>Product(s)</TableCell>
                                                                <TableCell>Price</TableCell>
                                                                <TableCell>Quantity</TableCell>
                                                                <TableCell>Subtotal</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {(
                                                                allpaymentInformation?.Items?.map((item) => (
                                                                    <TableRow key={item.Id}>
                                                                        <TableCell>{item.Sku}</TableCell>
                                                                        <TableCell onClick={() => navigate(`/${item.ProductSeName}`)}>
                                                                            <img
                                                                                src={item.Picture.FullSizeImageUrl}
                                                                                alt={item.Picture.AlternateText}
                                                                                style={{ height: '100px' }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell onClick={() => navigate(`/${item.ProductSeName}`)}>
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
                                                                        </TableCell>

                                                                        <TableCell>{item.UnitPrice}</TableCell>
                                                                        <TableCell>{item.Quantity}</TableCell>
                                                                        <TableCell>{item.SubTotal}</TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Grid item xs={6}>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography>Sub-Total: {allpaymentInformation?.SubTotal}</Typography>
                                                    <Typography>Shipping: ({allpaymentInformation?.OrderReviewData.ShippingMethod}): {allpaymentInformation?.Shipping}</Typography>
                                                    <Typography>Tax: {allpaymentInformation?.Tax}</Typography>
                                                    <Typography>Total: {allpaymentInformation?.OrderTotal}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </>
                                )}
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    {currentStep > 1 && (
                                        <Button variant="contained" onClick={handleBack}>Back</Button>
                                    )}
                                    {currentStep < 5 && (
                                        <Button variant="contained" onClick={handleContinue}>Continue</Button>
                                    )}
                                    {currentStep === 5 && (
                                        <Button variant="contained" onClick={handleContinue}>CONFIRM</Button>
                                    )}

                                </Box>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
export default CheckOutPage;