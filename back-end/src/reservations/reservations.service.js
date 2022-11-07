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
            console.log("Knex returned createdRecord:", createdRecord);
            return createdRecord[0];
        })
        .catch(error => {
            console.error("Error has occurred", error);
            return error;
        });
}

module.exports = {
    list,
    create,
}