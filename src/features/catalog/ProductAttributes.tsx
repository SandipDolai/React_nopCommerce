import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox,
    Button, // Add Button for color squares
} from '@mui/material';

interface ProductAttribute {
    ProductId: number;
    Id: number;
    ProductAttributeId: number;
    Name: string;
    IsRequired: boolean;
    AttributeControlType: number; // 1: Dropdown, 2: Radio, 3: Checkbox, 40: Color Squares
    Values: Array<{
        Name: string;
        IsPreSelected: boolean;
        PriceAdjustment: string;
        PriceAdjustmentValue: number;
        Id: number;
        ColorSquaresRgb?: string; // Add optional ColorSquaresRgb
        PictureId?: number; // Add optional PictureId
        PictureUrl?: string; // Add optional PictureUrl for thumb/gallery update
        FullSizePictureUrl?: string; // Add optional FullSizePictureUrl for main image update
    }>;
}

interface ProductAttributesProps {
    productId: number;
    attributes: ProductAttribute[];
    onChange: (attributeControlIds: string[], selectedPictureUrls?: { PictureUrl: string, FullSizePictureUrl: string } | null) => void;
}

export default function ProductAttributes({ productId, attributes, onChange }: ProductAttributesProps) {
    //debugger;
    const [selectedAttributeValues, setSelectedAttributeValues] = useState<{ [key: number]: string | string[] }>({});
    const isInitialMount = useRef(true);

    useEffect(() => {
        const initialSelections: { [key: number]: string | string[] } = {};
        attributes.forEach(attribute => {
            if (attribute.AttributeControlType === 3) { // Checkbox
                initialSelections[attribute.ProductAttributeId] = attribute.Values
                    .filter(value => value.IsPreSelected)
                    .map(value => value.Id.toString());
            } else { // Dropdown, Radio, or Color Squares
                const preSelectedValue = attribute.Values.find(value => value.IsPreSelected);
                if (preSelectedValue) {
                    initialSelections[attribute.ProductAttributeId] = preSelectedValue.Id.toString();
                }
            }
        });
        setSelectedAttributeValues(initialSelections);
        isInitialMount.current = false;
    }, [attributes]);

    const memoizedOnChange = useCallback(onChange, [onChange]);

    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }

        const attributeControlIds: string[] = [];
        let selectedPictureUrls: { PictureUrl: string, FullSizePictureUrl: string } | null = null;

        attributes.forEach(attribute => {
            const selectedValue = selectedAttributeValues[attribute.ProductAttributeId];
            if (selectedValue) {
                if (Array.isArray(selectedValue)) { // Checkbox
                    selectedValue.forEach(val => {
                        attributeControlIds.push(`product_attribute_${productId}_${attribute.ProductAttributeId}_${attribute.Id}_${val}`);
                    });
                } else { // Dropdown, Radio, Color Squares
                    attributeControlIds.push(`product_attribute_${productId}_${attribute.ProductAttributeId}_${attribute.Id}_${selectedValue}`);
                    //alert(attributeControlIds.join(', '));
                    // If it's a color attribute and a picture is associated, capture it
                    if ((attribute.AttributeControlType === 40 || attribute.AttributeControlType === 45)) {
                        const selectedColorValue = attribute.Values.find(v => v.Id.toString() === selectedValue);
                        if (selectedColorValue?.PictureUrl && selectedColorValue?.FullSizePictureUrl) {
                            selectedPictureUrls = {
                                PictureUrl: selectedColorValue.PictureUrl,
                                FullSizePictureUrl: selectedColorValue.FullSizePictureUrl
                            };
                        }
                    }
                }
            }
        });

        memoizedOnChange(attributeControlIds, selectedPictureUrls);

    }, [selectedAttributeValues, attributes, productId, memoizedOnChange]);

    const handleChange = (attributeId: number, value: string | string[]) => {
        //debugger;
        setSelectedAttributeValues(prev => ({
            ...prev,
            [attributeId]: value
        }));
    };

    return (
        <Box mt={2}>
            {attributes.map((attribute) => (
                <Box key={attribute.ProductAttributeId} mt={2}>
                    {/* <Typography variant="subtitle1">{attribute.Name}{attribute.IsRequired && '*'}</Typography> */}

                    {/* Attribute Control Type 1: Dropdown */}
                    {attribute.AttributeControlType === 1 && (
                        // <FormControl fullWidth margin="normal" required={attribute.IsRequired}>
                        //     <InputLabel id={`attribute-select-label-${attribute.ProductAttributeId}`}>{attribute.Name}</InputLabel>
                        //     <Select
                        //         labelId={`attribute-select-label-${attribute.ProductAttributeId}`}
                        //         value={selectedAttributeValues[attribute.ProductAttributeId]?.toString() || ''}
                        //         onChange={(e) => handleChange(attribute.ProductAttributeId, e.target.value as string)}
                        //         label={attribute.Name}
                        //     >
                        //         {!attribute.IsRequired && (
                        //             <MenuItem value="">
                        //                 <em>None</em>
                        //             </MenuItem>
                        //         )}
                        //         {attribute.Values.map((value) => (
                        //             <MenuItem key={value.Id} value={value.Id.toString()}>
                        //                 {value.Name} {value.PriceAdjustment && `(${value.PriceAdjustment})`}
                        //             </MenuItem>
                        //         ))}
                        //     </Select>
                        // </FormControl>
                        <div className="mb-3">
                            <label htmlFor={`attribute-select-${attribute.ProductAttributeId}`} className="form-label size_attributes_label">
                                {attribute.Name}
                                {attribute.IsRequired && <span className="text-danger"> *</span>}
                            </label>
                            <select
                                className="form-select size_attributes"
                                id={`attribute-select-${attribute.ProductAttributeId}`}
                                value={selectedAttributeValues[attribute.ProductAttributeId]?.toString() || ''}
                                onChange={(e) => handleChange(attribute.ProductAttributeId, e.target.value as string)}
                                required={attribute.IsRequired}
                            >
                                {!attribute.IsRequired && (
                                    <option value="">
                                        ---
                                    </option>
                                )}
                                {attribute.Values.map((value) => (
                                    <option key={value.Id} value={value.Id.toString()}>
                                        {value.Name} {value.PriceAdjustment ? `(${value.PriceAdjustment})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                    )}

                    {/* Attribute Control Type 2: Radio buttons */}
                    {attribute.AttributeControlType === 2 && (
                        <>
                            <label className="form-label size_attributes_label">{attribute.Name}</label>
                            <RadioGroup
                                value={selectedAttributeValues[attribute.ProductAttributeId]?.toString() || ''}
                                onChange={(e) => handleChange(attribute.ProductAttributeId, e.target.value)}
                            >
                                {attribute.Values.map((value) => (
                                    <FormControlLabel
                                        className="product_details_radio_btn"
                                        key={value.Id}
                                        value={value.Id.toString()}
                                        control={<Radio />}
                                        label={`${value.Name} ${value.PriceAdjustment ? `(${value.PriceAdjustment})` : ''}`}
                                    />
                                ))}
                            </RadioGroup></>
                    )}

                    {/* Attribute Control Type 3: Checkboxes */}
                    {attribute.AttributeControlType === 3 && (
                        <>
                            <label className="form-label size_attributes_label">{attribute.Name}</label>
                            <FormGroup>
                                {attribute.Values.map((value) => (
                                    <FormControlLabel
                                        className="product_details_check_box"
                                        key={value.Id}
                                        control={
                                            <Checkbox
                                                checked={(selectedAttributeValues[attribute.ProductAttributeId] as string[] || []).includes(value.Id.toString())}
                                                onChange={(e) => {
                                                    const currentSelections = (selectedAttributeValues[attribute.ProductAttributeId] as string[] || []);
                                                    if (e.target.checked) {
                                                        handleChange(attribute.ProductAttributeId, [...currentSelections, value.Id.toString()]);
                                                    } else {
                                                        handleChange(attribute.ProductAttributeId, currentSelections.filter(id => id !== value.Id.toString()));
                                                    }
                                                }}
                                            />
                                        }
                                        label={`${value.Name} ${value.PriceAdjustment ? `(${value.PriceAdjustment})` : ''}`}
                                    />
                                ))}
                            </FormGroup></>
                    )}

                    {/* Attribute Control Type 40: Color Squares */}
                    {attribute.AttributeControlType === 40 && (
                        <Box className="mb-5">
                            <label className="form-label size_attributes_label">{attribute.Name}</label>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                {attribute.Values.map((value) => (
                                    <Button
                                        key={value.Id}
                                        onClick={() => handleChange(attribute.ProductAttributeId, value.Id.toString())}
                                        sx={{
                                            minWidth: 30,
                                            height: 30,
                                            borderRadius: '0%',
                                            backgroundColor: value.ColorSquaresRgb || '#ccc',
                                            border: `0.5px solid ${selectedAttributeValues[attribute.ProductAttributeId] === value.Id.toString() ? '#4ab2f1' : 'transparent'}`,
                                            '&:hover': {
                                                backgroundColor: value.ColorSquaresRgb || '#ccc',
                                                opacity: 0.8,
                                            },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: selectedAttributeValues[attribute.ProductAttributeId] === value.Id.toString() ? '0 0 0 0.5px #4ab2f1' : 'none',
                                        }}
                                        title={value.Name}
                                    >


                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    )}


                    {attribute.AttributeControlType === 45 && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {attribute.Values.map((value) => (
                                <Button
                                    key={value.Id}
                                    onClick={() => handleChange(attribute.ProductAttributeId, value.Id.toString())}
                                    sx={{
                                        minWidth: 60, // Adjust size as needed for print images
                                        height: 60, // Adjust size as needed for print images
                                        border: `2px solid ${selectedAttributeValues[attribute.ProductAttributeId] === value.Id.toString() ? 'blue' : 'transparent'}`,
                                        '&:hover': {
                                            backgroundColor: value.ColorSquaresRgb || '#ccc',
                                            opacity: 0.8,
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: selectedAttributeValues[attribute.ProductAttributeId] === value.Id.toString() ? '0 0 0 2px blue' : 'none',
                                        p: 0.5, // Padding for the image inside the button
                                    }}
                                    title={value.Name}
                                >
                                    {/* Display the image for the print attribute */}
                                    {value.PictureUrl && (
                                        <img
                                            src={value.PictureUrl}
                                            alt={value.Name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain', // or 'cover' depending on desired crop
                                                borderRadius: 2, // Slightly rounded corners for the image
                                            }}
                                        />
                                    )}
                                </Button>
                            ))}
                        </Box>
                    )}


                </Box>
            ))}
        </Box>
    );
}