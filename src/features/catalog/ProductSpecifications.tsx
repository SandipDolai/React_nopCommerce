interface Specification {
    SpecificationAttributeId: number;
    SpecificationAttributeName: string;
    ValueRaw: string;
    ColorSquaresRgb: string | null;
    AttributeTypeId: number;
}

interface ProductSpecificationsProps {
    specifications: Specification[];
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
    if (!specifications || specifications.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <h5 className="mb-3">Product specifications</h5>
            <div className="table-responsive">
                <table className="table table-sm table-bordered Product_specifications">
                    <tbody>
                        {specifications.map((spec) => (
                            <tr
                                key={spec.SpecificationAttributeId}
                            >
                                <th
                                >
                                    {spec.SpecificationAttributeName}
                                </th>
                                <td
                                    dangerouslySetInnerHTML={{ __html: spec.ValueRaw }}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
