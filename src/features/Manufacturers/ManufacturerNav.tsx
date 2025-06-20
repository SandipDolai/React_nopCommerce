import { Link, useNavigate } from "react-router-dom";
import NopApi from "../../app/api/ThemeContext/NopApi";
import { useEffect, useState } from "react";

interface Manufacturer {
    Id: number;
    Name: string;
    SeName: string;
}

export default function ManufacturerNav() {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchManufacturers = async () => {
            const RequestBody = {
                StoreId: 1,
                LanguageId: 1
            };

            try {
                const response = await NopApi.Manufacturers.GetAllManufacturers(RequestBody);
                if (Array.isArray(response)) {
                    setManufacturers(response);
                } else {
                    setError("Invalid response format");
                }
            } catch (err) {
                setError("Failed to load manufacturers");
            } finally {
                setLoading(false);
            }
        };

        fetchManufacturers();
    }, []);

    return (
        <div className="side-2">
            <h3 className="cat_title_catPage">Manufacturers</h3>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && manufacturers.length === 0 && (
                <p>No manufacturers found.</p>
            )}

            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {manufacturers.slice(0, 2).map((m) => (
                    <li key={m.Id} style={{ margin: "6px 0" }}>
                        <Link to={`/${m.SeName}`}>{m.Name}</Link>
                    </li>
                ))}
            </ul>

            {manufacturers.length > 2 && (
                <button
                    style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        padding: 0,
                        marginTop: "8px"
                    }}
                    onClick={() => navigate("/manufacturer/all")}
                >
                    View All
                </button>
            )}
        </div>
    );
}
