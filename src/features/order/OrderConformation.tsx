import { Button, Container, Paper, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function OrderConformation() {
    const location = useLocation();
    const { order } = location.state || {};
    return (
        <Container component={Paper} sx={{ height: 400 }}>
            <Typography variant="h5" align="center" component="h2" gutterBottom style={{ margin: '20px 0', borderBottom: '1px solid #c6c3c3', padding: '15px 0' }}>
                Thank You
            </Typography>

            <Typography gutterBottom align="center" variant="h6"> {order.Message}</Typography>
            <Typography gutterBottom align="center" variant="h6"> ORDER NUMBER: {order.CheckoutCompleteResponses.OrderId}</Typography>
            <Button variant="contained" component={Link} to='/'>CONTINUE</Button>
        </ Container >
    )
}