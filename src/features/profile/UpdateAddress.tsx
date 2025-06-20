import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import { useEffect, useState } from "react";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { Form, } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface UpdateAddressProps {
    addressId: number;
}
export interface Address {
    AddressId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Company?: string;
    CountryId: number;
    StateProvinceId?: number;
    City: string;
    Address1: string;
    Address2?: string;
    ZipPostalCode: string;
    PhoneNumber: string;
    FaxNumber?: string;
    CountryName?: string;
    StateProvinceName?: string;
}

export interface Country {
    CountryId: number;
    CountryName: string;
}

export interface State {
    StateId: number;
    StateName: string;
}

export default function UpdateAddress({ addressId }: UpdateAddressProps) {
    //const { addressId } = useParams();
    const { customerId } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState<Address | null>(null);
    const [error, setError] = useState<string | null>(null);
    //const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchAddress = async () => {
            const RequestBody = {
                StoreId: 0,
                Language: 1,
                CustomerId: customerId,
                AddressId: addressId
            };

            try {
                //console.log(RequestBody);
                const response = await NopApi.Profile.GetAddress(RequestBody);
                if (response.messageCode === 1 && response.Addresses.length > 0) {
                    const fetchedAddress = response.Addresses[0];
                    setAddress(fetchedAddress);
                    //console.log(fetchedAddress);
                    setSelectedCountry(fetchedAddress.CountryId.toString());
                    setValue('CountryId', fetchedAddress.CountryId);
                    setValue('StateProvinceId', fetchedAddress.StateProvinceId);
                    fetchStates(fetchedAddress.CountryId);
                } else {
                    setError('Address not found');
                }

            } catch (error) {
                setError('Error fetching Info');
            } finally {
                //setLoading(false);
            }
        };
        fetchAddress();
    }, [customerId, addressId, setValue]);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 0
                };
                const response = await NopApi.CheckOut.GetAllCountries(requestBody);
                setCountries(response);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        }
        fetchCountries();
    }, [customerId]);

    const fetchStates = async (countryId: string) => {
        try {
            const requestBody = {
                CountryId: countryId,
                StateId: 0,
                LanguageId: 1
            };
            const response = await NopApi.CheckOut.GetAllStateByCountryId(requestBody);
            setStates(response);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    useEffect(() => {
        if (selectedCountry) {
            fetchStates(selectedCountry);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    const onSubmit = async (data: unknown) => {
        // setLoading(true);
        try {
            const addressData = data as Address;
            const requestBody = {
                ...addressData,
                CustomerId: customerId,
                AddressId: addressId,
                LanguageId: 1,
            };
            //console.log(requestBody);
            const response = await NopApi.Profile.UpdateAddress(requestBody);
            //console.log(response);
            if (response.messageCode === 1) {
                toast.success('Address updated successfully');
                navigate('/info')
            } else {
                setError('Failed to update address');
            }
        } catch (error) {
            setError('Error updating address');
        } finally {
            // setLoading(false);
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div >

            <div >
                {/* <h1>My account - Add new address</h1> */}
                <div className="my_account_box registation_form">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="text_box">
                            <div className="form_group_wrapper">
                                <Form.Group controlId="formFirstName" className="form-group mb-4">
                                    <Form.Label>First Name</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('FirstName', { required: true })}
                                            value={address?.FirstName || ''}
                                            onChange={(e) => setAddress({ ...address!, FirstName: e.target.value })}
                                        />
                                        {errors.FirstName && <span className="invalid-feedback">This field is required</span>}

                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('LastName', { required: true })}
                                            value={address?.LastName || ''}
                                            onChange={(e) => setAddress({ ...address!, LastName: e.target.value })}
                                        />
                                        {errors.LastName && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="email"
                                            {...register('Email', { required: true })}
                                            value={address?.Email || ''}
                                            onChange={(e) => setAddress({ ...address!, Email: e.target.value })}
                                        />
                                        {errors.Email && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formCompany">
                                    <Form.Label>Company</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('Company')}
                                            value={address?.Company || ''}
                                            onChange={(e) => setAddress({ ...address!, Company: e.target.value })}
                                        />
                                    </div>
                                </Form.Group>


                                <Form.Group className="form-group mb-4" controlId="formCountry">
                                    <Form.Label>Country</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Select
                                            {...register('CountryId', { required: true })}
                                            value={selectedCountry || ''}
                                            onChange={(e) => {
                                                const countryId = e.target.value;
                                                setSelectedCountry(countryId);
                                                setAddress({ ...address!, CountryId: parseInt(countryId) });
                                            }}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.CountryId} value={country.CountryId}>
                                                    {country.CountryName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.CountryId && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formState">
                                    <Form.Label>State</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Select
                                            {...register('StateProvinceId', { required: true })}
                                            value={address?.StateProvinceId || ''}
                                            onChange={(e) => setAddress({ ...address!, StateProvinceId: parseInt(e.target.value) })}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.StateId} value={state.StateId}>
                                                    {state.StateName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.StateProvinceId && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formCity">
                                    <Form.Label>City</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('City', { required: true })}
                                            value={address?.City || ''}
                                            onChange={(e) => setAddress({ ...address!, City: e.target.value })}
                                        />
                                        {errors.City && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formAddress1">
                                    <Form.Label>Address 1</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('Address1', { required: true })}
                                            value={address?.Address1 || ''}
                                            onChange={(e) => setAddress({ ...address!, Address1: e.target.value })}
                                        />
                                        {errors.Address1 && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formAddress2">
                                    <Form.Label>Address 2</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('Address2')}
                                            value={address?.Address2 || ''}
                                            onChange={(e) => setAddress({ ...address!, Address2: e.target.value })}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formZipPostalCode">
                                    <Form.Label>Zip/Postal Code</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('ZipPostalCode', { required: true })}
                                            value={address?.ZipPostalCode || ''}
                                            onChange={(e) => setAddress({ ...address!, ZipPostalCode: e.target.value })}
                                        />
                                        {errors.ZipPostalCode && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>

                                <Form.Group className="form-group mb-4" controlId="formPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <div className="input_wrapper required">
                                        <Form.Control
                                            type="text"
                                            {...register('PhoneNumber', { required: true })}
                                            value={address?.PhoneNumber || ''}
                                            onChange={(e) => setAddress({ ...address!, PhoneNumber: e.target.value })}
                                        />
                                        {errors.PhoneNumber && <span className="invalid-feedback">This field is required</span>}
                                        <sup>*</sup>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>

                        <Button variant="primary" type="submit" className="general_form_btn mt-3">
                            SAVE
                        </Button>
                    </Form>

                </div>

            </div>
        </div>
    );
}