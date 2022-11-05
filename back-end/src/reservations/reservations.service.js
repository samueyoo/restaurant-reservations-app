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
}

function create(newReservation) {
    console.log(newReservation);
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(createdRecord => {
            console.log(createdRecord, 234)
            return createdRecord[0]
        });
}

module.exports = {
    list,
    create,
}