import React from "react";
import { useNavigate } from "react-router-dom";
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

interface ManufacturerCardProps {
    manufacturer: Manufacturer;
}

const ManufacturerCard: React.FC<ManufacturerCardProps> = ({ manufacturer }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${manufacturer.SeName}`);
    };
    return (
        <div className="manufacturer-card" onClick={handleClick} style={{ cursor: "pointer" }}>
            <div className="image-container">
                <img
                    src={manufacturer.PictureModel.ImageUrl}
                    alt={manufacturer.PictureModel.AlternateText}
                />
            </div>
            <h3>{manufacturer.Name}</h3>
        </div>
    );
};

export default ManufacturerCard;
