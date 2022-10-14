import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

function New() {
    const history = useHistory();
    const [formData, setFormData] = useState();
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
        //const { firstName } = e.target.value;
        console.log("Submit was clicked; firstName:", firstName)
        await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                mobile_number: number,
                date_of_reservation: date,
                time_of_reservation: time,
                number_of_people: numberOfPeople
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
        history.push("/reservations")
        //Should send POST request to 
    }

    return (
        <div>
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
                    Date of Reservation: 
                    <input
                        name="date"
                        type="text"
                        id="date"
                        placeholder="Date of Reservation"
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Time of Reservation: 
                    <input
                        name="time"
                        type="text"
                        id="time"
                        placeholder="Time of Reservation"
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