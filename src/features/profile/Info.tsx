import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/AuthContext";
import NopApi from "../../app/api/ThemeContext/NopApi";
//import LoadingComponent from "../../app/layout/LoadingComponent";
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
// import { Box } from "@mui/material";
// import Address from "./Address";
// import SideBar from "./SideBar";
// import OrderHistory from "../order/OrderHistory";
// import NewAddress from "./NewAddress";
export interface customer {
    Gender: string
    FirstName: string
    LastName: string
    DateOfBirth: string
    Email: string
    CompanyName: string
    messageCode: number
    messageText: string
}
export default function Info() {
    const { customerId } = useAuth();
    //const [user, setUsers] = useState<customer[]>([]);
    //const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, setValue, getValues } = useForm();
    //const [activeComponent, setActiveComponent] = useState('info');
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const RequestBody = {
                    CustomerId: customerId
                };
                const response = await NopApi.Profile.Info(RequestBody);
                //console.log(response)
                //setUsers(response);
                const userData = response;
                if (userData.messageCode === 1) {
                    // Set the form values with the fetched user data
                    setValue('firstName', userData.FirstName);
                    setValue('lastName', userData.LastName);
                    setValue('email', userData.Email);
                    setValue('companyName', userData.CompanyName);

                    // Parse the DateOfBirth to extract day, month, and year
                    const dob = new Date(userData.DateOfBirth);
                    setValue('dob.day', dob.getDate());
                    setValue('dob.month', dob.getMonth() + 1); // Months are 0-indexed
                    setValue('dob.year', dob.getFullYear());
                    // Set gender based on the response
                    setValue('gender', userData.Gender === 'F' ? 'Female' : userData.Gender === 'M' ? 'Male' : '');
                } else {
                    console.error(userData.messageText);
                }
            } catch (error) {
                setError('Error fetching Info');
            } finally {
                //setLoading(false);
            }
        };

        fetchProfile();
    }, [customerId, setValue]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        //debugger
        try {
            const payload = {
                StoreId: 0,
                CustomerId: customerId,
                LanguageId: 1,
                CompanyName: data.companyName,
                Gender: data.gender === 'Female' ? 'F' : data.gender === 'Male' ? 'M' : '',
                FirstName: data.firstName,
                LastName: data.lastName,
                Email: data.email,
                DateOfBirth: `${data.dob.year}-${String(data.dob.month).padStart(2, '0')}-${String(data.dob.day).padStart(2, '0')}`,
                // PhoneNumber: "234354657", 
                //NewsLetter: data.newsletter.toString()
            };
            //console.log(payload);
            const response = await NopApi.Profile.UpdateInfo(payload)
            console.log('User  data updated successfully:', response);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    const generateDays = () => {
        return Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>{day}</option>
        ));
    };

    const generateMonths = () => {
        return Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>{month}</option>
        ));
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i).map(year => (
            <option key={year} value={year}>{year}</option>
        ));
    };

    // if (loading) {
    //     return <LoadingComponent />;
    // }

    if (error) {
        return <h1 color="error">{error}</h1>;
    }

    // const renderComponent = () => {
    //     // Add logic here if you want to render different components conditionally
    // };



    return (
        <>


            <div >
                {/* <SideBar setActiveComponent={setActiveComponent} /> */}

                {/* <> <Address /></> */}

                <div >
                    <h1>My account - Customer info</h1>
                    {/* {activeComponent === 'addresses' && <h1>My account - Addresses</h1>}
                    {activeComponent === 'addressadd' && <h1>My account - Add New Address</h1>} */}
                    {/* {activeComponent === 'order' && <h1>My account - Orders</h1>}
                {renderComponent()} */}

                    <div className="my_account_box registation_form">
                        <h4 className="form_section_title">Your Personal Details</h4>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="text_box">
                                <div className="form_group_wrapper">
                                    <Form.Group controlId="formGender" className="form-group mb-4">
                                        <Form.Label>Gender:</Form.Label>
                                        {/* <div className="d-flex">
                                        <Form.Check
                                            type="radio"
                                            label="Male"
                                            value="Male"
                                            {...register('gender')}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Female"
                                            value="Female"
                                            {...register('gender')}
                                        />
                                    </div> */}

                                        <div className="d-flex">
                                            <div className="form-check">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    id="genderMale"
                                                    value="M"
                                                    {...register('gender', { required: 'Gender is required' })}
                                                />
                                                <label className="form-check-label" htmlFor="genderMale">Male</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    id="genderFemale"
                                                    value="F"
                                                    {...register('gender', { required: 'Gender is required' })}
                                                />
                                                <label className="form-check-label" htmlFor="genderFemale">Female</label>
                                            </div>
                                        </div>
                                    </Form.Group>


                                    <Form.Group controlId="formFirstName" className="form-group mb-4">
                                        <Form.Label>First Name:</Form.Label>
                                        <div className="input_wrapper required">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your first name"
                                                {...register('firstName', { required: true })}
                                            />
                                            <sup>*</sup>
                                        </div>
                                    </Form.Group>

                                    <Form.Group controlId="formLastName" className="form-group mb-4">
                                        <Form.Label>Last Name:</Form.Label>
                                        <div className="input_wrapper required">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your last name"
                                                {...register('lastName', { required: true })}
                                            />
                                            <sup>*</sup>
                                        </div>
                                    </Form.Group>

                                    <Form.Group controlId="formDob" className="form-group mb-4">
                                        <Form.Label>Date of Birth:</Form.Label>
                                        <div className="date_selection">
                                            <Form.Control as="select" {...register('dob.day', { required: true })} className="form-control form-select me-2">
                                                <option value="">Day</option>
                                                {generateDays()}
                                            </Form.Control>
                                            <Form.Control as="select" {...register('dob.month', { required: true })} className="form-control form-select me-2">
                                                <option value="">Month</option>
                                                {generateMonths()}
                                            </Form.Control>
                                            <Form.Control as="select" {...register('dob.year', { required: true })} className="form-control form-select">
                                                <option value="">Year</option>
                                                {generateYears()}
                                            </Form.Control>
                                        </div>
                                    </Form.Group>

                                    <Form.Group controlId="formEmail" className="form-group mb-4">
                                        <Form.Label>Email:</Form.Label>
                                        <div className="input_wrapper required">
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter your email"
                                                {...register('email', { required: true })}
                                            />
                                            <sup>*</sup>
                                        </div>
                                    </Form.Group>

                                    <Form.Group controlId="formUsername" className="form-group mb-4">
                                        <Form.Label>Username:</Form.Label>
                                        <div className="input_wrapper mb-2">
                                            <span>    {getValues('email')}</span>
                                        </div>
                                        {/* <Form.Control
                type="text"
                placeholder="Enter your username"
                {...register('email', { required: true })}
            /> */}
                                    </Form.Group>
                                </div>
                            </div>
                            <h4 className="form_section_title">Company Details</h4>

                            <div className="text_box">
                                <div className="form_group_wrapper">
                                    <Form.Group controlId="formCompanyName" className="form-group">
                                        <Form.Label>Company Name:</Form.Label>
                                        <div className="input_wrapper">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your company name"
                                                {...register('companyName')}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>

                            <h4 className="form_section_title">Options</h4>

                            <div className="text_box">
                                <div className="form_group_wrapper">
                                    <Form.Group controlId="formNewsletter" className="form-group">
                                        <Form.Label>Newsletter:</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            // label="Newsletter:"
                                            {...register('newsletter')}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <Button variant="primary" type="submit" className="general_form_btn">
                                Save
                            </Button>
                        </Form>
                    </div>


                </div>

            </div>
        </>
    )
}
