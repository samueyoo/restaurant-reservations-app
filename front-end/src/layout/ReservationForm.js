import React from "react";

function ReservationForm({ handleSubmit, handleCancel, handleChange, reservation }) {
    const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = reservation;

    let dateFormatted;
    if (reservation_date) {
        dateFormatted = reservation_date.substring(0, 10)
    }

    return(
        <form onSubmit={handleSubmit}>
            <label>
                First Name: 
                <input
                    name="first_name"
                    type="text"
                    id="first_name"
                    defaultValue={first_name}
                    placeholder="First Name"
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Last Name: 
                <input
                    name="last_name"
                    type="text"
                    id="last_name"
                    defaultValue={last_name}
                    placeholder="Last Name"
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Mobile Number: 
                <input
                    name="mobile_number"
                    type="text"
                    id="mobile_number"
                    defaultValue={mobile_number}
                    placeholder="Mobile Number"
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Date of Reservation: 
                <input
                    name="reservation_date"
                    type="date"
                    id="reservation_date"
                    defaultValue={dateFormatted ? dateFormatted : reservation_date}
                    placeholder="YYYY-MM-DD" 
                    pattern="\d{4}-\d{2}-\d{2}"
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Time of Reservation: 
                <input
                    name="reservation_time"
                    type="time"
                    id="reservation_time"
                    defaultValue={reservation_time}
                    placeholder="HH:MM XM" 
                    pattern="[0-9]{2}:[0-9]{2}"
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Number of People in the Party: 
                <input
                    name="people"
                    type="number"
                    id="people"
                    defaultValue={people}
                    placeholder="Number of People in the Party"
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <button type="button" className="btn btn-secondary" style={{"marginRight": 5}} onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} >Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default ReservationForm;