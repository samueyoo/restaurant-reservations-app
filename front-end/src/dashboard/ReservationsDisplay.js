import React from "react";
import ReservationCard from "./ReservationCard";
import styles from "../style/styleSheet.module.css";

function ReservationsDisplay({ reservations = [], loadDash }) {
    const formattedReservations = reservations.map(reservation => {
        return (
            <ReservationCard key={reservation.reservation_id} reservation={reservation} loadDash={loadDash} />
        )
    })
    return (
        <div className={styles.reservationsDisplay}>
            <h3 style={{padding: "5px"}}>Reservations</h3>
            {formattedReservations}
        </div>
    )
}

export default ReservationsDisplay;