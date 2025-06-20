import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const linkStyle = {
        textDecoration: "none",
        color: "#444",
    };
    return (
        <div className="my_account side-2">
            <h5>My account</h5>
            <ul>
                <li>
                    <NavLink to="/customer/info" style={linkStyle}>Customer info</NavLink>
                </li>
                <li>
                    <NavLink to="/customer/addresses" style={linkStyle}>Addresses</NavLink>
                </li>
                <li>
                    <NavLink to="/order/history" style={linkStyle}>Orders</NavLink>
                </li>
                <li>
                    <a>Downloadable products</a>
                </li>
                <li>
                    <a>Back in stock subscriptions</a>
                </li>
                <li>
                    <a>Reward points</a>
                </li>
                <li>
                    <a>Change password</a>
                </li>
                <li>
                    <a>Avatar</a>
                </li>
                <li>
                    <a>My product reviews</a>
                </li>
            </ul>
        </div>
    );
}
