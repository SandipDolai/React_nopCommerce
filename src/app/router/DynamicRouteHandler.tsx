import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NopProductDetail from "../../features/catalog/NopProductDetail";
import GetProductByCategory from "../../features/catalog/GetProductByCategory";
import ManufacturerProduct from "../../features/Manufacturers/ManufacturerProduct";
import NopApi from "../../app/api/ThemeContext/NopApi";
import SideLayout from "../layout/SideLayout";

interface UrlRecordResponse {
    EntityId: number;
    EntityName: string;
    Slug: string;
    Message: string;
}

export default function DynamicRouteHandler() {
    const { seName } = useParams<{ seName: string }>();
    const [entity, setEntity] = useState<UrlRecordResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntity = async () => {
            try {
                const response = await NopApi.ProductandCategory.GetUrlRecord({ Slug: seName });
                if (response.Message === "Success") {
                    setEntity(response);
                } else {
                    setError("Entity not found");
                }
            } catch {
                setError("Error fetching entity");
            }
        };

        if (seName) fetchEntity();
    }, [seName]);

    if (error) return <h1 color="error">{error}</h1>;
    if (!entity) return null;

    const { EntityName, EntityId, Slug } = entity;
    const type = EntityName.toLowerCase();

    const renderComponent = () => {
        switch (type) {
            case "product":
                return <NopProductDetail id={EntityId} name={Slug} />;
            case "category":
                return <GetProductByCategory id={EntityId} />;
            case "manufacturer":
                return <ManufacturerProduct id={EntityId} />;
            case "topic":
                return <div>Topic Component</div>;
            case "newsitem":
                return <div>NewsItem Component</div>;
            case "blogpost":
                return <div>BlogPost Component</div>;
            default:
                return <h1 color="error">Unknown entity type</h1>;
        }
    };


    const requiresSideLayout = type === "category" || type === "manufacturer";

    return requiresSideLayout ? (
        <SideLayout>{renderComponent()}</SideLayout>
    ) : (
        renderComponent()
    );
}
