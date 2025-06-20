import { SubmitHandler, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import NopApi from '../../app/api/ThemeContext/NopApi';
import { useEffect, useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from "react-bootstrap";

//const defaultTheme = createTheme();
export default function NewAddress() {
    const { customerId } = useAuth();
    type FormData = {
        CustomerID: string
        FirstName: string;
        LastName: string;
        Email: string;
        Company?: string;
        City: string;
        Address1: string;
        Address2?: string;
        PhoneNumber: string;
        ZipPostalCode: string;
        FaxNumber?: string;
        CountryId: string;
        StateProvinceId: string;
        LanguageId: number,
        AddressId: number
    };
    type Country = {
        CountryName: string;
        CountryId: string;
    };
    type State = {
        StateName: string;
        StateId: string;
    };
    const navigate = useNavigate();
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid }, reset } = useForm<FormData>({
        mode: 'all',
        defaultValues: {
            CountryId: '0',
            LanguageId: 1,
            AddressId: 0,
            CustomerID: customerId ?? ''
        }
    });
    useEffect(() => {
        async function fetchCountries() {
            try {
                const requestBody = {
                    StoreId: 0,
                    LanguageId: 0
                };
                const response = await NopApi.CheckOut.GetAllCountries(requestBody)
                //console.log(response);
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


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleApiErrors(errors: any) {
        //console.log(errors)
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Email')) {
                    setError('Email', { message: error })
                } else if (error.includes('FirstName')) {
                    setError('FirstName', { message: error })
                }
            });
        }
    }

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            //console.log(data);
            const response = await NopApi.Account.AddAddress(data);
            if (response.Status === 400) {
                handleApiErrors(response);
            } else {
                navigate('/info')
                toast.success('Address added successfully');
                reset(); // Reset the form fields
            }
        } catch (error) {
            handleApiErrors(error);
            toast.error('Failed to save address.');
        }
    };

    return (
        <div
        //className="master-column-wrapper"
        >

            {/* <div className="center-2">
                <h1>My account - Add new address</h1> */}
            <div className="my_account_box registation_form">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="text_box">
                        <div className="form_group_wrapper">
                            <Form.Group controlId="formFirstName" className="form-group mb-4">
                                <Form.Label>First Name:</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your first name"
                                        {...register('FirstName', { required: true })}
                                    />
                                    <sup>*</sup>
                                </div>
                            </Form.Group>

                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="FirstName"
                                    autoFocus
                                    {...register('FirstName', { required: 'FirstName  is required' })}
                                    error={!!errors.FirstName}
                                    helperText={errors?.FirstName?.message as string}
                                /> */}
                            <Form.Group controlId="formLastName" className="form-group mb-4">
                                <Form.Label>Last Name:</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your last name"
                                        {...register('LastName', { required: true })}
                                    />
                                    <sup>*</sup>
                                </div>
                            </Form.Group>
                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Lastname"
                                    {...register('LastName', { required: 'Lastname  is required' })}
                                    error={!!errors.LastName}
                                    helperText={errors?.LastName?.message as string}
                                /> */}
                            <Form.Group controlId="formEmail" className="form-group mb-4">
                                <Form.Label>Email:</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register('Email', { required: true })}
                                    />
                                    <sup>*</sup>
                                </div>
                            </Form.Group>
                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Email"

                                    {...register('Email',
                                        {
                                            required: 'Email  is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Not a Valid Email address'
                                            }
                                        })}
                                    error={!!errors.Email}
                                    helperText={errors?.Email?.message as string}
                                /> */}
                            <Form.Group controlId="formCompanyName" className="form-group">
                                <Form.Label>Company Name:</Form.Label>
                                <div className="input_wrapper">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your company name"
                                        {...register('Company')}
                                    />
                                </div>
                            </Form.Group>
                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Company Name"
                                    {...register('Company')}
                                /> */}
                            <Form.Group className="form-group mb-4" controlId="formCountry">
                                <Form.Label>Country</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Select
                                        {...register('CountryId', { required: true })}
                                        value={selectedCountry || ''}
                                        onChange={(e) => setSelectedCountry(e.target.value as string)
                                            //     {
                                            //     const countryId = e.target.value;
                                            //     setSelectedCountry(countryId);
                                            //     setAddress({ ...address!, CountryId: parseInt(countryId) });
                                            // }
                                        }
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.CountryId} value={country.CountryId}>
                                                {country.CountryName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.CountryId && <span className="invalid-feedback">{errors?.CountryId?.message}</span>}
                                    <sup>*</sup>
                                </div>
                            </Form.Group>
                            {/* <FormControl fullWidth margin="normal">
                                    <InputLabel id="Country-label">Country</InputLabel>
                                    <Select
                                        labelId="Country-label"
                                        label="Country"
                                        {...register('CountryId', { required: 'Country is required' })}
                                        error={!!errors.CountryId}
                                        defaultValue=""
                                        onChange={(e) => setSelectedCountry(e.target.value as string)}
                                    >
                                        {countries.map(country => (
                                            <MenuItem key={country.CountryId} value={country.CountryId}>
                                                {country.CountryName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.CountryId && <Typography color="error">{errors?.CountryId?.message}</Typography>}
                                </FormControl> */}
                            <Form.Group className="form-group mb-4" controlId="formState">
                                <Form.Label>State</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Select
                                        {...register('StateProvinceId', { required: true })}
                                    // value={address?.StateProvinceId || ''}
                                    // onChange={(e) => setAddress({ ...address!, StateProvinceId: parseInt(e.target.value) })}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.StateId} value={state.StateId}>
                                                {state.StateName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.StateProvinceId && <span className="invalid-feedback">{errors?.StateProvinceId?.message}</span>}
                                    <sup>*</sup>
                                </div>
                            </Form.Group>

                            {/* <FormControl fullWidth margin="normal">
                                    <InputLabel id="StateProvince-label">State / Province</InputLabel>
                                    <Select
                                        labelId="StateProvince-label"
                                        label="State / Province"
                                        defaultValue=""
                                        {...register('StateProvinceId', { required: 'State is required' })}
                                        error={!!errors.StateProvinceId}
                                    >
                                        {selectedCountry ? (
                                            states.map(state => (
                                                <MenuItem key={state.StateId} value={state.StateId}>
                                                    {state.StateName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">Select State</MenuItem>
                                        )}
                                    </Select>
                                    {errors.StateProvinceId && <Typography color="error">{errors?.StateProvinceId?.message}</Typography>}
                                </FormControl> */}


                            <Form.Group className="form-group mb-4" controlId="formCity">
                                <Form.Label>City</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        {...register('City', { required: true })}
                                    />
                                    {errors.City && <span className="invalid-feedback">This field is required</span>}
                                    <sup>*</sup>
                                </div>
                            </Form.Group>

                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="City"
                                    {...register('City',)}
                                /> */}
                            <Form.Group className="form-group mb-4" controlId="formCity">
                                <Form.Label>Address 1</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        {...register('Address1', { required: true })}
                                    />
                                    {errors.Address1 && <span className="invalid-feedback">Street address is required</span>}
                                    <sup>*</sup>
                                </div>
                            </Form.Group>
                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Address 1"
                                    {...register('Address1', { required: 'Street address is required' })}
                                /> */}
                            <Form.Group className="form-group mb-4" controlId="formCity">
                                <Form.Label>Address 2</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        {...register('Address2')}
                                    />
                                </div>
                            </Form.Group>
                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Address 2"
                                    {...register('Address2')}
                                /> */}
                            <Form.Group className="form-group mb-4" controlId="formCity">
                                <Form.Label>Zip / postal code</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        {...register('ZipPostalCode', { required: true })}
                                    />
                                    {errors.ZipPostalCode && <span className="invalid-feedback">Zip / postal code is required</span>}
                                    <sup>*</sup>
                                </div>
                            </Form.Group>

                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Zip / postal code"
                                    {...register('ZipPostalCode', { required: 'Zip / postal code is required' })}
                                /> */}
                            <Form.Group className="form-group mb-4" controlId="formCity">
                                <Form.Label>Phone Number</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        {...register('PhoneNumber', { required: true })}
                                    />
                                    {errors.PhoneNumber && <span className="invalid-feedback">Phone Number is required</span>}
                                    <sup>*</sup>
                                </div>
                            </Form.Group>

                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Phone Number"
                                    {...register('PhoneNumber', { required: 'Phone Number is required' })}
                                /> */}
                            <Form.Group className="form-group mb-4" controlId="formCity">
                                <Form.Label>Fax Number</Form.Label>
                                <div className="input_wrapper required">
                                    <Form.Control
                                        type="text"
                                        {...register('FaxNumber')}
                                    />
                                </div>
                            </Form.Group>
                            {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    label="Fax Number"
                                    {...register('FaxNumber')}
                                /> */}
                            <LoadingButton loading={isSubmitting}
                                className='general_form_btn btn btn-primary'
                                disabled={!isValid}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                SAVE
                            </LoadingButton>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
        // </div>
    )
}