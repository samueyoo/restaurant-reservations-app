import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsDisplay({ reservations = [], loadDash }) {
    const formattedReservations = reservations.map(reservation => {
        return (
            <ReservationCard key={reservation.reservation_id} reservation={reservation} loadDash={loadDash} />
        )
    })
    return (
        <div>
            <h3>Reservations</h3>
            {formattedReservations}
        </div>
    )
}

export default ReservationsDisplay;