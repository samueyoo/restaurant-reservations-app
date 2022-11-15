import React from "react";
import axios from "axios";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";

function ReservationCard({ reservation, loadDash }) {
    const { first_name, last_name, mobile_number, reservation_date, reservation_time, people, reservation_id, status } = reservation;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    async function handleCancel() {
        if (!window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            return
        }
        await axios.put(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
            data: { status: "cancelled" }
        })
            .then(() => loadDash())
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{first_name} {last_name}</h5>
                <p className="card-test">Mobile Number: {mobile_number}</p>
                <p className="card-test">Reservation Date: {reservation_date}</p>
                <p className="card-test">Reservation Time: {reservation_time}</p>
                <p className="card-test">Number of People: {people}</p>
                {status === "booked" ? <a className="btn btn-primary" href={`/reservations/${reservation_id}/edit`}>Edit</a> : null}
            </div>
            <div className="">
                <h6 style={{textAlign: "center"}} data-reservation-id-status={reservation_id}>{capitalizeFirstLetter(status)}</h6>
            </div>
            {status !== "cancelled" ? <button className="btn btn-danger" data-reservation-id-cancel={reservation_id} onClick={handleCancel}>Cancel</button> : null}
            {status === "booked" ? <a type="button" className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>Seat</a> : null}
        </div>
    )
}

export default ReservationCard;