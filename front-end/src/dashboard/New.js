import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import checkDate from "../utils/checkDate";

function New() {
    const history = useHistory();
    const [formData, setFormData] = useState();
    // const [errorStatus, setErrorStatus] = useState(false); //Can just check if err state is truthy
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
        const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = formData;
        console.log("Submit was clicked; firstName, date:", first_name, reservation_date)

        //Validate reservation date, returning null if validation fails
        const checkedDate = checkDate(reservation_date);
        console.log('checkedDate...', checkedDate)
        if (checkedDate.length > 0) {
            const alertMsg = checkedDate.length > 0 ? checkedDate.join('; ') : checkedDate[0]
            window.alert(alertMsg);
            return null;
        }

        //Otherwise, proceed with POST request
        await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            body: JSON.stringify({
                data: {                
                    first_name: first_name,
                    last_name: last_name,
                    mobile_number: mobile_number,
                    reservation_date: reservation_date,
                    reservation_time: reservation_time,
                    people: people
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
                console.log("error object caught:", error);
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
                        name="people"
                        type="text"
                        id="people"
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