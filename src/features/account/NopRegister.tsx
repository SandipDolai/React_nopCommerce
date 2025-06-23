import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import NopApi from '../../app/api/ThemeContext/NopApi';
import { Form } from 'react-bootstrap';
//import { useState } from 'react';
export default function NopRegister() {
    type FormData = {
        UserName: string;
        EmailId: string;
        password: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        companyName?: string;
        phoneNumber?: string;
        gender: string;
        storeId: number;
        languageId: number;
        newsLetter: string;
        isGuestCustomerId: string;
        day: number;
        month: number;
        year: number;
    };
    //const [validationErrors, setValidationErrors] = useState([]);
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm<FormData>({
        mode: 'all',
        defaultValues: {
            storeId: 0,
            languageId: 1,
            newsLetter: 'false',
            isGuestCustomerId: '0',
            gender: 'M'
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleApiErrors(errors: any) {
        //console.log(errors)
        if (errors.ErrorMessage) {
            if (errors.ErrorMessage.includes('email already exists')) {
                setError('EmailId', { message: 'The specified email already exists' });
            }
        }
        else if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                } else if (error.includes('EmailId')) {
                    setError('EmailId', { message: error })
                } else if (error.includes('UserName')) {
                    setError('UserName', { message: error })
                }
            });
        }
    }

    const onSubmit = (data: FormData) => {
        const { day, month, year, ...rest } = data;


        const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;


        const userData = {
            ...rest,
            DateOfBirth: dateOfBirth,
            StoreId: 1,
            LanguageId: 1,
            IsGuestCustomerId: "0"
        };


        NopApi.Account.nopregister(userData)
            .then(response => {
                if (response.Status === 400) {
                    handleApiErrors(response);
                } else {
                    toast.success('Registration successful - you can now login');
                    navigate('/noplogin');
                }
            })
            .catch(error => handleApiErrors(error));
    };

    return (
        <>
            <div className="page_title text-center my-4">
                <h1>Register</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="registation_form">
                <div className="welcome_box">
                    <h4 className="text-center">Your Personal Details</h4>
                    <div className="text_box">
                        <div className="form_group_wrapper">
                            <div className="form-group mb-4">
                                <label>Gender:</label>
                                <div className="d-flex">
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                                            id="genderMale"
                                            value="M"
                                            {...register('gender', { required: 'Gender is required' })}
                                        />
                                        <label className="form-check-label" htmlFor="genderMale">Male</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                                            id="genderFemale"
                                            value="F"
                                            {...register('gender', { required: 'Gender is required' })}
                                        />
                                        <label className="form-check-label" htmlFor="genderFemale">Female</label>
                                    </div>
                                </div>
                                <div className="invalid-feedback">
                                    {errors.gender?.message}
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="firstName">First Name:</label>
                                <div className="input_wrapper required">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                        id="firstName"
                                        {...register('firstName', { required: 'First name is required' })}
                                    />
                                    <sup>*</sup>
                                    <div className="invalid-feedback">
                                        {errors.firstName?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="lastName">Last Name:</label>
                                <div className="input_wrapper required">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                        id="lastName"
                                        {...register('lastName', { required: 'Last name is required' })}
                                    />
                                    <sup>*</sup>
                                    <div className="invalid-feedback">
                                        {errors.lastName?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label>Date of Birth:</label>
                                <div className="date_selection">
                                    <Form.Select {...register('day', { required: 'Day is required' })} className="form-control me-2">
                                        <option value="">Day</option>
                                        {[...Array(31)].map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select {...register('month', { required: 'Month is required' })} className="form-control me-2">
                                        <option value="">Month</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select {...register('year', { required: 'Year is required' })} className="form-control">
                                        <option value="">Year</option>
                                        {[...Array(100)].map((_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return <option key={i} value={year}>{year}</option>;
                                        })}
                                    </Form.Select>
                                </div>
                                <div className="invalid-feedback">
                                    {errors.day?.message || errors.month?.message || errors.year?.message}
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="EmailId">Email:</label>
                                <div className="input_wrapper required">
                                    <input
                                        type="email"
                                        className={`form-control ${errors.EmailId ? 'is-invalid' : ''}`}
                                        id="EmailId"
                                        {...register('EmailId', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Not a valid email address'
                                            }
                                        })}
                                    />
                                    <sup>*</sup>
                                    <div className="invalid-feedback">
                                        {errors.EmailId?.message}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="phoneNumber">Phone Number: </label>
                                <div className="input_wrapper">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phoneNumber"
                                        {...register('phoneNumber')}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="UserName">Username: </label>
                                <div className="input_wrapper required">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.UserName ? 'is-invalid' : ''}`}
                                        id="UserName" autoComplete="username"
                                        {...register('UserName', { required: 'Username is required' })}
                                    />
                                    <sup>*</sup>
                                    <div className="invalid-feedback">
                                        {errors.UserName?.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className="text-center">Company Details</h4>
                    <div className="text_box">
                        <div className="form_group_wrapper">
                            <div className="form-group mb-4">
                                <label htmlFor="companyName">Company Name</label>
                                <div className="input_wrapper">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="companyName"
                                        {...register('companyName')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className="text-center">Company Details</h4>
                    <div className="text_box">
                        <div className="form_group_wrapper">
                            <div className="form-group mb-4">
                                <label htmlFor="password">Password</label>
                                <div className="input_wrapper required">
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password" autoComplete="current-password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/<>.,])(?!.*\s).*$/,
                                                message: 'Password does not meet complexity requirements'
                                            }
                                        })}
                                    />
                                    <sup>*</sup>
                                    <div className="invalid-feedback">
                                        {errors.password?.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block general_form_btn"
                        disabled={!isValid || isSubmitting}
                    >
                        {/* {isSubmitting ? 'Registering...' : 'Register'} */}
                        Register
                    </button>
                </div>
                {/* <div className="mt-3 text-center">
                    <Link to='/noplogin'>
                        Already have an account? Sign In
                    </Link>
                </div> */}
            </form>
        </>
    );
}
