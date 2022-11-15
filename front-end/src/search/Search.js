import axios from "axios";
import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import ReservationsDisplay from "../dashboard/ReservationsDisplay";

function Search() {
    const [formData, setFormData] = useState((""));
    const [reservations, setReservations] = useState();
    const [noResults, setNoResults] = useState(false);
    const [reservationsError, setReservationsError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";


    useEffect(loadDash, []);

    function loadDash() {

    }

    function handleChange({ target }) {
        console.log(target.name, target.value)
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        //console.log("Search; submitted!");
        await setNoResults(false);
        await axios.get(`${API_BASE_URL}/reservations?mobile_number=${formData.mobile_number}`)
            .then(res => {
                console.log("Search; handleSubmit; res.data.data:", res.data.data)
                if (res.data.data.length > 0) {
                    setReservations(res.data.data)
                } else {
                    setNoResults(true);
                    setReservations();
                }
            })
    }

    return (
        <div>
            <h1>
                Search by Phone Number
            </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Phone Number:
                    <input 
                        name="mobile_number"
                        type="text"
                        id="mobile_number"
                        placeholder="Enter a customer's phone number"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit" className="btn btn-primary">Find</button>
                <button type="button" className="btn btn-secondary" onClick={() => console.log(reservations)}>Test reservations state</button>
            </form>
            <Container>
                <Row>
                    <Col>
                        {reservations ? <ReservationsDisplay reservations={reservations} /> : null}
                        {noResults ? <h3>No reservations found</h3> : null}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Search;