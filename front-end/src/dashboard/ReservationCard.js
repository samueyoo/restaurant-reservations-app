import React from "react";

function ReservationCard({ reservation }) {
    const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = reservation;
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{first_name} {last_name}</h5>
                <p className="card-test">Mobile Number: {mobile_number}</p>
                <p className="card-test">Reservation Date: {reservation_date}</p>
                <p className="card-test">Reservation Time: {reservation_time}</p>
                <p className="card-test">Number of People: {people}</p>
            </div>
        </div>
    )
}

export default ReservationCard;