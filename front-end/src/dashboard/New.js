import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import checkDate from "../utils/checkDate";

function New() {
    const history = useHistory();
    const [formData, setFormData] = useState();
    const [errorStatus, setErrorStatus] = useState(false);
    const [err, setErr] = useState();

    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
        console.log("formData:", formData);
    }

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  
    const handleNewReservation = async (e) => {
        e.preventDefault();
        const { firstName, lastName, number, date, time, numberOfPeople } = formData;
        console.log("Submit was clicked; firstName:", firstName)

        const checkedDate = checkDate(date);
        console.log('checkedDate...', checkedDate)
        if (checkedDate.length > 0) {
            const alertMsg = checkedDate.length > 0 ? checkedDate.join('; ') : checkedDate[0]
            window.alert(alertMsg);
            return null;
        }

        await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            body: JSON.stringify({
                data: {                
                    first_name: firstName,
                    last_name: lastName,
                    mobile_number: number,
                    reservation_date: date,
                    reservation_time: time,
                    people: numberOfPeople
                }   
            }),
            headers: { 'Content-Type': 'application/json' } 
        })
            .then(response => {
                console.log("fetch response no JSON:", response);
                return response.json();
            })
            .then(data => console.log("fetch response:", data))
            .then(() => {
                history.push("/reservations");
            })
            .catch(error => {
                setErrorStatus(true);
                setErr(error);
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
                        name="firstName"
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Last Name: 
                    <input
                        name="lastName"
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Mobile Number: 
                    <input
                        name="number"
                        type="text"
                        id="number"
                        placeholder="Mobile Number"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Date of Reservation (MM/DD/YYYY): 
                    <input
                        name="date"
                        type="date"
                        id="date"
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
                        name="time"
                        type="time"
                        id="time"
                        placeholder="YYYY-MM-DD" 
                        pattern="\d{4}-\d{2}-\d{2}"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Number of People in the Party: 
                    <input
                        name="numberOfPeople"
                        type="text"
                        id="numberOfPeople"
                        placeholder="Number of People in the Party"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <Link to={"/reservations"} className="btn btn-secondary" style={{"marginRight": 5}}>Cancel</Link>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default New;