import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../layout/ReservationForm";

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
    //const { first_name, last_name, mobile_number, reservation_date, reservation_time, people, reservation_id, status } = reservation;

    useEffect(loadDash, []);

    async function loadDash() {
        axios.get(`${API_BASE_URL}/reservations/${reservationId}`)
            .then(res => {
                console.log("EditReservation; loadDash; res.data.data:", res.data.data);
                setReservation(res.data.data);
                return res.data.data;
            })
            .then(data => setFormData(data))
            .catch(err => setErr(err));
    }
    
    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
        console.log(formData)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        axios.put(`${API_BASE_URL}/reservations/${reservationId}`, {
            data: {
                reservation_id: reservationId,
                first_name: formData.first_name,
                last_name: formData.last_name,
                mobile_number: formData.mobile_number,
                reservation_date: formData.reservation_date.substring(0, 10),
                reservation_time: formData.reservation_time,
                people: formData.people,
            }
        })
            .then((res) => {
                console.log("EditReservation; handleSubmit; res:", res)
            })
            .then(() => history.push(`/dashboard?date=${formData.reservation_date.substring(0, 10)}`))
            .catch(err => setErr(err));
    }

    function handleCancel() {
        history.goBack();
    }
    
    return (
        <div>
            <h1>Edit Reservation</h1>
            <button onClick={() => console.log(reservation)} >Test reservation</button>
            <button onClick={() => console.log(formData)} >Test formData</button>
            <ErrorAlert error={err} />
            <ReservationForm handleSubmit={handleSubmit} handleCancel={handleCancel} handleChange={handleChange} reservation={reservation} />
            <br />
        </div>
    )
}

export default EditReservation;