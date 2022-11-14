import React from "react";
import ReservationCard from "./ReservationCard";

function ReservationsDisplay({ reservations = [], setReservations }) {
    const formattedReservations = reservations.map(reservation => {
        if (reservation.status === "finished") {
            return null;
        }
        return (
            <ReservationCard key={reservation.reservation_id} reservation={reservation} setReservations={setReservations} />
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