import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../layout/ReservationForm";
import validateDateIsBefore from "../utils/validateDate";
import validateTime from "../utils/validateTime";

function New() {
    const history = useHistory();
    const [formData, setFormData] = useState();
    const [err, setErr] = useState();

    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  
    const handleNewReservation = async (e) => {
        e.preventDefault();
        const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = formData;
        console.log("Submit was clicked; firstName, date:", first_name, reservation_date)
        
        const validDay = validateDateIsBefore(reservation_date);
        if (validDay) {
            setErr(validDay);
            return false;
        }
        const validTime = validateTime(reservation_time);
        if (validTime) {
            setErr(validTime);
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
                //console.log("New; about to setDate with:", reservation_date);
                //console.log("setDateNew function:", typeof setDateNew)
                //setDateNew(reservation_date);
            })
            .then(() => history.push(`/dashboard?date=${reservation_date}`))
            .catch(error => {
                console.error(error);
                setErr(error); //Save error in err state for display
            })
        //history.push("/reservations")
    }

    function handleCancel() {
        history.push(`/reservations`);
    }

    return (
        <div>
            { err && <ErrorAlert error={err} />}
        
            <h1>
                Create a New Reservation
            </h1>

            <ReservationForm handleSubmit={handleNewReservation} handleCancel={handleCancel} handleChange={handleChange} 
                reservation={{
                    first_name: "",
                    last_name: "",
                    mobile_number: "",
                    reservation_date: "",
                    reservation_time: "",
                    people: 0,
                    reservation_id: "",
                    status: "",
                }} 
            />

        </div>
    )
}

export default New;