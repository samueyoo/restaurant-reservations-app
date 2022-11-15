import React from "react";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";

function ReservationCard({ reservation }) {
    const { first_name, last_name, mobile_number, reservation_date, reservation_time, people, reservation_id, status } = reservation;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    //Per instructions, status is updated as soon as you click "Seat"... why not update when you confirm a table instead? Now if you hit cancel it'll still "seat" them?
        //Called it. Tests are checking if reservation's status changed after confirming a table (as it should). Instructions are wrong.
    // async function handleSeat() {
    //     await axios.put(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
    //         data: {
    //             status: "seated"
    //         }
    //     })
    //         .then(res => console.log("handeSeat res:", res.data))
    //         .catch(error => console.error(error));
    // }

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
                <h6 style={{textAlign: "center"}} data-reservation-id-status={reservation_id}>{capitalizeFirstLetter(status)}</h6>
            </div>
            {status === "booked" ? <a type="button" className="btn btn-primary" href={`/reservations/${reservation_id}/seat`}>Seat</a> : null}
        </div>
    )
}

export default ReservationCard;