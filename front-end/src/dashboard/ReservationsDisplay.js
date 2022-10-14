import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsDisplay({ reservations }) {
    const formattedReservations = reservations.map(reservation => {
        return (
            <ReservationCard key={reservation.reservation_id} reservation={reservation} />
        )
    })
    return (
        <div>
            {formattedReservations}
        </div>
    )
}

export default ReservationsDisplay;