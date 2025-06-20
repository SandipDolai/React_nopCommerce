import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/AuthContext";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { Button } from "react-bootstrap";
//import { useNavigate } from "react-router-dom";
import btnEdit from "../../app/assets/edit.png";
import btnDelete from "../../app/assets/remove.png";
import NewAddress from "./NewAddress";
import UpdateAddress from "./UpdateAddress";

export interface AddressList {
    Addresses: Address[]
    Message: string
    messageCode: number
    messageText: string
}

export interface Address {
    AddressId: number
    FirstName: string
    LastName: string
    Email: string
    Company?: string
    CountryId: number
    StateProvinceId?: number
    City: string
    Address1: string
    Address2?: string
    ZipPostalCode: string
    PhoneNumber: string
    FaxNumber?: string
    CountryName: string
    StateProvinceName: string
}

export default function Address() {
    const { customerId } = useAuth();
    const [address, setAddress] = useState<AddressList | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [editAddressId, setEditAddressId] = useState<number | null>(null);
    // const navigate = useNavigate();

    const fetchAddress = async () => {
        const RequestBody = {
            StoreId: 0,
            Language: 1,
            CustomerId: customerId,
            AddressId: 0
        };

        try {
            const response = await NopApi.Profile.GetAddress(RequestBody);
            setAddress(response);
        } catch (error) {
            setError('Error fetching address');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, [customerId]);

    const handleDelete = async (addressId: number) => {
        try {
            const responseBody = {
                CustomerId: customerId,
                AddressId: addressId
            }
            await NopApi.Profile.DeleteAddress(responseBody);
            fetchAddress();
        } catch (error) {
            setError('Error deleting address');
        }
    };

    if (loading) {
        return (
            <div>

                <div className="address_box_wrapper placeholder-glow">

                    <div className="text_box my_address_details placeholder-glow">

                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-6"></p>
                        <p className="placeholder col-8"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-6"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-6"></p>
                        <p className="placeholder col-4"></p>
                        <p className="placeholder col-4"></p>
                    </div>



                    {/* <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-8"></span>
                    </p> */}
                </div>
            </div >
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div>
                {showNewAddress ? (
                    <>
                        <h1>My account - Add new address</h1>
                        <NewAddress />
                    </>
                ) : editAddressId !== null ? (
                    <>
                        <h1>My account - Edit address</h1>
                        <UpdateAddress addressId={editAddressId} />
                    </>
                ) : (
                    <>
                        <h1>My account - Addresses</h1>
                        <div className="address_box_wrapper">
                            {address?.Addresses.map(address => (
                                <div key={address.AddressId}>
                                    <div className="d-flex justify-content-md-between justify-content-center align-center">
                                        <h3>{address.FirstName} {address.LastName}</h3>
                                        <div className="d-flex m-none">
                                            <Button onClick={() => setEditAddressId(address.AddressId)} className="editbtn mb-2">
                                                <img src={btnEdit} alt="Edit" />
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(address.AddressId)} className="deletebtn mb-2">
                                                <img src={btnDelete} alt="Delete" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text_box my_address_details">
                                        <h5 className="mb-2">{address.FirstName} {address.LastName}</h5>
                                        <p className="mb-2">Email: {address.Email}</p>
                                        <p className="mb-2">Phone: {address.PhoneNumber}</p>
                                        <p className="mb-2">{address.Company ? address.Company : 'N/A'}</p>
                                        <p className="mb-2">{address.Address1}, {address.City}, {address.ZipPostalCode}</p>
                                    </div>
                                    <div className="d-flex justify-content-center align-center m-block">
                                        <Button onClick={() => setEditAddressId(address.AddressId)} className="editbtn mb-2">
                                            <img src={btnEdit} alt="Edit" />
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(address.AddressId)} className="deletebtn mb-2">
                                            <img src={btnDelete} alt="Delete" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="primary" type="submit" onClick={() => setShowNewAddress(true)} className="general_form_btn">
                                Add New
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}