import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../layout/ReservationForm";
import validateDateIsBefore from "../utils/validateDate";
import validateTime from "../utils/validateTime";
import axios from "axios";
import styles from "../style/styleSheet.module.css";

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
        const controller = new AbortController();
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
        try {
            await axios.post(`${API_BASE_URL}/reservations`, {
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    mobile_number: mobile_number,
                    reservation_date: reservation_date,
                    reservation_time: reservation_time,
                    people: Number(people),
                }   
            }, { signal: controller.signal } )
            history.push(`/dashboard?date=${reservation_date}`)
        } catch (error) {
            if (error.name !== "CanceledError") setErr(error);
        }
        
        return () => {
            controller.abort();
        }
    }

    function handleCancel() {
        history.push(`/reservations`);
    }

    return (
        <div>
            { err && <ErrorAlert error={err} />}
        
            <h1 className={styles.dashboardHeader}>
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