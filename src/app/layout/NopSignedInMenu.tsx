import { Button } from "@mui/material";
//import React, { useEffect, useState } from "react";


import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
interface NopSignedInMenuProps {
    onLogout: () => void;
}
export default function NopSignedInManu({ onLogout }: NopSignedInMenuProps) {
    //debugger;
    const navigate = useNavigate();
    const location = useLocation();

    //const [anchorEl, setAnchorEl] = React.useState(null);
    //const open = Boolean(anchorEl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const handleClick = (event: any) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    //const [username, setUsername] = useState<string | null>(null);
    const { logout } = useAuth();
    // useEffect(() => {
    //     const cookieUsername = getCookie();
    //     //console.log('Cookie Username:', cookieUsername.name); // Debugging line
    //     if (cookieUsername) {
    //         setUsername(cookieUsername.name);
    //     }
    //     else {
    //         setUsername(null);
    //     }
    // }, [isLoggedIn]);
    //console.log(onLogout);
    // function getCookie() {
    //     // debugger;
    //     const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    //         const [key, value] = cookie.trim().split('=');
    //         acc[key] = value;
    //         return acc;
    //     }, {} as Record<string, string>);
    //     //console.log('Parsed Cookies:', cookies);
    //     return {
    //         username: cookies['username'],
    //         customerId: cookies['CustomerId'],
    //         name: cookies['Name']
    //     };
    // }

    function clearCookies() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "CustomerId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "Name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //setUsername(null);
        logout();
        onLogout();
        navigate(location.state?.from || '/');
    }
    return (
        <>
            {/* <Button color='inherit'
                onClick={handleClick}
                sx={{ typography: 'h6' }}
            >
                {username}
            </Button> */}

            <Button color='inherit'
                component={Link} to={'/customer/info'}
                sx={{ typography: 'h6' }}
            >
                My account
            </Button>

            <Button color='inherit'
                onClick={() => {
                    clearCookies();
                }}
                sx={{ typography: 'h6' }}
            >
                Logout
            </Button>
            {/* <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose} component={Link} to={'/info'}>Profile</MenuItem>
                <MenuItem onClick={handleClose} component={Link} to={'/orderhistory'}>My orders</MenuItem>
                <MenuItem onClick={() => {
                    clearCookies();

                    // dispatch(signOut());
                    // dispatch(clearBasket());
                }}>Logout</MenuItem>
            </Menu> */}
        </>
    );

}