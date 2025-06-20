import { Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface RentalDatesProps {
    rentalStartDate: Date | null;
    rentalEndDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    startDateError?: string | null;
    endDateError?: string | null;
}

export default function RentalInfo({
    rentalStartDate,
    rentalEndDate,
    onStartDateChange,
    onEndDateChange,
    startDateError,
    endDateError,
}: RentalDatesProps) {
    return (
        <Form.Group className="mb-3 rent_product">
            {/* <Form.Label as="h5">Rental Period</Form.Label> */}
            <Row>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                    <Form.Label>Start Date:<sup>*</sup></Form.Label>
                    <DatePicker
                        selected={rentalStartDate}
                        onChange={onStartDateChange}
                        selectsStart
                        startDate={rentalStartDate}
                        endDate={rentalEndDate}
                        minDate={new Date()}
                        className={`form-control ${startDateError ? 'is-invalid' : ''}`}
                        placeholderText="Select start date"
                    />
                    {startDateError && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                            {startDateError}
                        </Form.Control.Feedback>
                    )}
                </Col>
                <Col xs={12} sm={4}>
                    <Form.Label>End Date:<sup>*</sup></Form.Label>
                    <DatePicker
                        selected={rentalEndDate}
                        onChange={onEndDateChange}
                        selectsEnd
                        startDate={rentalStartDate}
                        endDate={rentalEndDate}
                        minDate={rentalStartDate || new Date()}
                        className={`form-control ${endDateError ? 'is-invalid' : ''}`}
                        placeholderText="Select end date"
                    />
                    {endDateError && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                            {endDateError}
                        </Form.Control.Feedback>
                    )}
                </Col>
            </Row>
        </Form.Group>
    );
}
