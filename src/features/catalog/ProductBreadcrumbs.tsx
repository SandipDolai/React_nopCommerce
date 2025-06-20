import { useNavigate } from 'react-router-dom';

interface Breadcrumb {
    ProductName: string;
    ProductSeName: string;
    Enabled: boolean;
    CategoryBreadcrumb: Array<{
        Name: string;
        SeName: string;
    }>;
}

interface Props {
    breadcrumb: Breadcrumb | null;
}

const ProductBreadcrumb: React.FC<Props> = ({ breadcrumb }) => {
    const navigate = useNavigate();

    if (!breadcrumb?.Enabled) return null;

    const goTo = (path: string) => {
        navigate(path);
    };

    return (
        <div className="breadcrumb_wrapper my-3">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <a href="" onClick={(e) => { e.preventDefault(); goTo('/'); }}>Home</a>
                </li>

                {breadcrumb.CategoryBreadcrumb?.map((category) => {
                    const path = `/${category.SeName}`;
                    return (
                        <li className="breadcrumb-item" key={category.SeName}>
                            <a href="" onClick={(e) => { e.preventDefault(); goTo(path); }}>
                                {category.Name}
                            </a>
                        </li>
                    );
                })}

                <li className="breadcrumb-item active" aria-current="page">
                    {breadcrumb.ProductName}
                </li>
            </ol>
        </div>
    );
};

export default ProductBreadcrumb;
