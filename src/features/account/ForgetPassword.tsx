import { useState } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import NopApi from "../../app/api/ThemeContext/NopApi";

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [recover, setRecover] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const requestBody = {
            EmailId: email,
            LanguageId: 1
        };
        // console.log(requestBody)
        try {
            const response = await NopApi.Account.PasswordRecovery(requestBody);
            //console.log(response.length)
            if (response) {
                if (response.messageCode === 1) {
                    setResponseMessage(response.Message);
                } else {
                    setResponseMessage(response.messageText);
                }
                setRecover(true);
            } else {
                setResponseMessage("Failed to reset your password. Please try again.");
            }


        } catch (error) {
            console.error("Error:", error);
            setResponseMessage("An error occurred. Please try again.");
        }
    };

    //console.log(recover)
    //console.log(responseMessage)

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Password Recovery</h2>
            <p className="text-center">Please enter your email address below. You will receive a link to reset your password.</p>
            {recover && <p className="text-center">{responseMessage}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Recover
                </Button>
            </Form>
        </div>
    );
}