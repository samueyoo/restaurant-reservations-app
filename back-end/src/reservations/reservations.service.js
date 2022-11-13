const knex = require("../db/connection");

function list() {
    return knex("reservations")
        .select("first_name",
        "last_name",
        "mobile_number",
        "reservation_date",
        "reservation_time",
        "people",
        "reservation_id"
        )
        .orderBy("reservation_time");
}

function listByDate(date) {
    return knex("reservations")
        .select("first_name",
            "last_name",
            "mobile_number",
            "reservation_date",
            "reservation_time",
            "people",
            "reservation_id"
        )
        .where({ reservation_date: date })
        .orderBy("reservation_time");
}

function read(reservationId) {
    return knex("reservations")
        .select("people",
            "reservation_id")
        .where({ reservation_id: reservationId })
        .first();
}

function create(newReservation) {
    console.log(newReservation);
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(createdRecord => {
            //console.log("Knex returned createdRecord:", createdRecord);
            return createdRecord[0];
        })
        .catch(error => {
            console.error("Error has occurred", error);
            return error;
        });
}

module.exports = {
    list,
    listByDate,
    read,
    create,
}