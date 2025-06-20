import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import NopApi from '../../app/api/ThemeContext/NopApi';
import { useEffect, useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';

const defaultTheme = createTheme();
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
                toast.success('Address added successfully');
                reset(); // Reset the form fields
            }
        } catch (error) {
            handleApiErrors(error);
            toast.error('Failed to save address.');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component={Paper} maxWidth="sm" sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', p: 4 }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <DomainAddIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add new address
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}
                    noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="FirstName"
                        autoFocus
                        {...register('FirstName', { required: 'FirstName  is required' })}
                        error={!!errors.FirstName}
                        helperText={errors?.FirstName?.message as string}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Lastname"
                        {...register('LastName', { required: 'Lastname  is required' })}
                        error={!!errors.LastName}
                        helperText={errors?.LastName?.message as string}
                    />
                    <TextField
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
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Company Name"
                        {...register('Company')}
                    />
                    <FormControl fullWidth margin="normal">
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
                    </FormControl>

                    <FormControl fullWidth margin="normal">
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
                    </FormControl>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="City"
                        {...register('City',)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Address 1"
                        {...register('Address1', { required: 'Street address is required' })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Address 2"
                        {...register('Address2')}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Zip / postal code"
                        {...register('ZipPostalCode', { required: 'Zip / postal code is required' })}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Phone Number"
                        {...register('PhoneNumber', { required: 'Phone Number is required' })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Fax Number"
                        {...register('FaxNumber')}
                    />
                    <LoadingButton loading={isSubmitting}
                        disabled={!isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        SAVE
                    </LoadingButton>
                </Box>
            </Container >
        </ThemeProvider >
    )
}