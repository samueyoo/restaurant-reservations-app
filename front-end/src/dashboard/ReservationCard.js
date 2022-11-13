import React, { useState } from "react";

function ReservationCard({ reservation }) {
    const [status, setStatus] = useState("Booked");
    const { first_name, last_name, mobile_number, reservation_date, reservation_time, people, reservation_id } = reservation;
    
    async function updateStatus(e) {
        setStatus("Seated");
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{first_name} {last_name}</h5>
                <p className="card-test">Mobile Number: {mobile_number}</p>
                <p className="card-test">Reservation Date: {reservation_date}</p>
                <p className="card-test">Reservation Time: {reservation_time}</p>
                <p className="card-test">Number of People: {people}</p>
            </div>
            <div className="">
                <h6 style={{textAlign: "center"}}>{status}</h6>
            </div>
            {status === "Booked" ? <a type="button" className="btn btn-primary" href={`/reservations/${reservation_id}/seat`} onClick={updateStatus}>Seat</a> : null}
        </div>
    )
}

export default ReservationCard;