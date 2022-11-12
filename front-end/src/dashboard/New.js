import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import checkDate from "../utils/checkDate";
import validateDateIsBefore from "../utils/validateDate";

function New({ updateDateAfterSubmit }) {
    const history = useHistory();
    const [formData, setFormData] = useState();
    // const [errorStatus, setErrorStatus] = useState(false); //Can just check if err state is truthy
    const [err, setErr] = useState();

    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
        //console.log("formData:", formData);
    }

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  
    const handleNewReservation = async (e) => {
        e.preventDefault();
        const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = formData;
        console.log("Submit was clicked; firstName, date:", first_name, reservation_date)

        const valid = validateDateIsBefore(reservation_date);
        if (valid.length > 0) {
            const errorMessages = valid.join("; ");
            console.log(errorMessages);
            setErr({ message: errorMessages})
            return false;
        }

        await fetch(`${API_BASE_URL}/reservations`, { //Updating with axios.post breaks <ErrorAlert /> component (does not read error.message properly)
            method: "POST",
            body: JSON.stringify({
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    mobile_number: mobile_number,
                    reservation_date: reservation_date,
                    reservation_time: reservation_time,
                    people: Number(people),
                }   
            }),
            headers: { 'Content-Type': 'application/json' } 
        })
            .then(response => {
                //console.log("fetch response no JSON:", response);
                return response.json();
            })
            .then(response => {
                if (response.error) {
                    //console.log("error detected:", response)
                    throw new Error(response.error);
                }
                return response;
            })
            .then(data => console.log("fetch response:", data))
            .then(() => {
                //updateDateAfterSubmit(reservation_date);
                history.push(`/dashboard?date=${reservation_date}`);
            })
            .catch(error => {
                console.error(error);
                setErr(error); //Save error in err state for display
            })
        //history.push("/reservations")
    }

    return (
        <div>
            { err && <ErrorAlert error={err} />}
        
            <h1>
                Create a New Reservation
            </h1>

            <form onSubmit={handleNewReservation}>
                <label>
                    First Name: 
                    <input
                        name="first_name"
                        type="text"
                        id="first_name"
                        placeholder="First Name"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Last Name: 
                    <input
                        name="last_name"
                        type="text"
                        id="last_name"
                        placeholder="Last Name"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Mobile Number: 
                    <input
                        name="mobile_number"
                        type="text"
                        id="mobile_number"
                        placeholder="Mobile Number"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Date of Reservation: 
                    <input
                        name="reservation_date"
                        type="date"
                        id="reservation_date"
                        placeholder="YYYY-MM-DD" 
                        pattern="\d{4}-\d{2}-\d{2}"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Time of Reservation: 
                    <input
                        name="reservation_time"
                        type="time"
                        id="reservation_time"
                        placeholder="HH:MM XM" 
                        pattern="[0-9]{2}:[0-9]{2}"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Number of People in the Party: 
                    <input
                        name="people"
                        type="number"
                        id="people"
                        placeholder="Number of People in the Party"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="button" className="btn btn-secondary" style={{"marginRight": 5}} onClick={() => {
                    history.push(`/reservations`);
                }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default New;