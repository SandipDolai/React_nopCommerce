interface TierPrice {
    Price: string;
    Quantity: number;
}

interface TierPriceProps {
    tierPrices: TierPrice[];
}

export default function TierPrice({ tierPrices }: TierPriceProps) {
    if (!tierPrices || tierPrices.length === 0) {
        return null;
    }

    return (
        <div className="my-3">
            <div className="table-responsive">
                <table className="table table-sm table-bordered tire_price">
                    <thead className="bg-light">
                        <tr>
                            <th className="fw-bold">Quantity</th>
                            {tierPrices.map((tier, index) => (
                                <th key={index} className="fw-bold text-center">
                                    {tier.Quantity}+
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="fw-bold">Price</td>
                            {tierPrices.map((tier, index) => (
                                <td key={index} className="text-center text-danger item_price">
                                    {tier.Price}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
