import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../layout/ReservationForm";
import styles from "../style/styleSheet.module.css";

function EditReservation() {
    const defaultReservation = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
        reservation_id: "",
        status: "",
    };
    const reservationId = useParams().reservation_id;
    const history = useHistory();
    const [reservation, setReservation] = useState(defaultReservation);
    const [formData, setFormData] = useState({ ...reservation, reservation_id: reservationId });
    const [err, setErr] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    useEffect(() => {
        const controller = new AbortController();
        loadDash(controller);
        return () => {
            console.log("cleanup", reservationId);
            controller.abort();
        }
    }, []);

    async function loadDash(controller) {
        try {
            const response = await axios.get(`${API_BASE_URL}/reservations/${reservationId}`, { signal: controller.signal });
            setReservation(response.data.data);
            setFormData(response.data.data)
        } catch (err) {
            if (err.name === "CanceledError") {
                console.log("Aborted", reservationId);
            } else {
                setErr(err)
            }
        }
    }
    
    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const controller = new AbortController()
        try {
            await axios.put(`${API_BASE_URL}/reservations/${reservationId}`, {
                data: {
                    reservation_id: reservationId,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    mobile_number: formData.mobile_number,
                    reservation_date: formData.reservation_date.substring(0, 10),
                    reservation_time: formData.reservation_time,
                    people: formData.people,
                }
            }, { signal: controller.signal })
            history.push(`/dashboard?date=${formData.reservation_date.substring(0, 10)}`);        
        } catch (err) {
            if (err.name !== "CanceledError") setErr(err);
        }
        return () => {
            console.log("Edit PUT submit aborted")
            controller.abort();
        }
    }

    function handleCancel() {
        history.goBack();
    }
    
    return (
        <div>
            <h1 className={styles.dashboardHeader}>Edit Reservation</h1>
            <ErrorAlert error={err} />
            <ReservationForm handleSubmit={handleSubmit} handleCancel={handleCancel} handleChange={handleChange} reservation={reservation} />
            <br />
        </div>
    )
}

export default EditReservation;