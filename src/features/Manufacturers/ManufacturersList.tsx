
import NopApi from "../../app/api/ThemeContext/NopApi";
import ManufacturerCard from "./ManufacturerCard"; // Ensure correct import path
// import SideNav from "../../app/layout/SideNav";
// import ManufacturerNav from "./ManufacturerNav";
import { useEffect, useState } from "react";

interface Manufacturer {
    Id: number;
    Name: string;
    SeName: string;
    Description: string | null;
    PictureModel: {
        ImageUrl: string;
        ThumbImageUrl: string;
        FullSizeImageUrl: string;
        Title: string;
        AlternateText: string;
    };
}

export default function ManufacturersList() {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchManufacturers = async () => {
            const RequestBody = {
                StoreId: 1,
                LanguageId: 1
            };

            try {
                const response = await NopApi.Manufacturers.GetAllManufacturers(RequestBody);
                // console.log("Manufacturers response:", response);
                if (Array.isArray(response)) {
                    setManufacturers(response);
                } else {
                    setError("Invalid response format");
                }
            } catch (error) {
                setError("Error fetching manufacturers");
            } finally {
                setLoading(false);
            }
        };

        fetchManufacturers();
    }, []);

    return (
        <>
            {/* <SideNav />
            <ManufacturerNav /> */}
            <div className="manufacturers-wrapper" style={{ padding: "20px" }}>

                {loading && <p></p>}


                {error && <p>Error: {error}</p>}
                {!loading && !error && manufacturers.length === 0 && (
                    <p>No manufacturers found.</p>
                )}

                <div
                    className="manufacturers-grid"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "16px"
                    }}
                >
                    {manufacturers.map((manufacturer) => (
                        <ManufacturerCard key={manufacturer.Id} manufacturer={manufacturer} />
                    ))}
                </div>
            </div>
        </>
    );
}
