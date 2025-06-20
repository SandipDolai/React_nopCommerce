import { Box, Button, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../app/context/AuthContext";
import NopApi from "../../app/api/ThemeContext/NopApi";

export default function Vote() {
    const [selectedValue, setSelectedValue] = useState(null);
    const { isLoggedIn, customerId } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };

    const handleSubmit = () => {
        if (isLoggedIn) {
            console.log(`Selected: ${selectedValue}`);

            const requestBody = {
                StoreId: 0,
                PollAnswerId: selectedValue,
                CustomerId: customerId
            };

            try {
                const response = NopApi.Home.Vote(requestBody);

                //const data = await response.json();
                console.log(response);

                // if (response.AlreadyVoted) {
                //     alert('You have already voted.');
                // } else {
                //     alert('Thank you for voting!');
                // }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting your vote.');
            }

        } else {
            alert('Only registered users can vote.');
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }} className="category_section" >
            <Typography variant="h5" component="h2" align="center" gutterBottom>
                Community poll
            </Typography>
            <Typography variant="h6" gutterBottom>
                DO YOU LIKE NOPCOMMERCE?
            </Typography>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="null"
                name="radio-buttons-group"
                value={selectedValue}
                onChange={handleChange}
            >
                <FormControlLabel value="1" control={<Radio />} label="Excellent" />
                <FormControlLabel value="2" control={<Radio />} label="Good" />
                <FormControlLabel value="3" control={<Radio />} label="Poor" />
                <FormControlLabel value="4" control={<Radio />} label="Very bad" />
            </RadioGroup>
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                VOTE
            </Button>

        </Box>
    )

}