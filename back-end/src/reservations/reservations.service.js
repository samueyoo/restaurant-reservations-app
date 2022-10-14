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
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(createdRecord => createdRecord[0]);
}

module.exports = {
    list,
    create,
}