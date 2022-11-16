const knex = require("../db/connection");

function list() {
    return knex("reservations")
        .select("first_name",
        "last_name",
        "mobile_number",
        "reservation_date",
        "reservation_time",
        "people",
        "reservation_id",
        "status"
        )
        .whereNot({ status: "finished"})
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
            "reservation_id",
            "status"
        )
        .where({ reservation_date: date })
        .whereNot({ status: "finished"})
        .orderBy("reservation_time");
}

function listByNumber(mobile_number) {
    return knex("reservations")
        .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

function read(reservationId) {
    return knex("reservations")
        .select("first_name",
            "last_name",
            "mobile_number",
            "reservation_date",
            "reservation_time",
            "people",
            "reservation_id",
            "status"
        )
        .where({ reservation_id: reservationId })
        .first();
}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then(createdRecord => {
            return createdRecord[0];
        })
        .catch(error => {
            console.error("Error has occurred", error);
            return error;
        });
}

function updateStatus(newStatus, reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .update({ status: newStatus }, "*")
        .then(updatedRecord => {
            return updatedRecord[0];
        })
        .catch(error => {
            console.error("Error has occurred", error);
            return error;
        });
}

function update(newData) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: newData.reservation_id })
        .update({ 
            first_name: newData.first_name,
            last_name: newData.last_name,
            mobile_number: newData.mobile_number,
            reservation_date: newData.reservation_date,
            reservation_time: newData.reservation_time,
            people: newData.people,
        }, "*")
        .then(updatedRecord => {
            return updatedRecord[0];
        })
        .catch(error => {
            console.error("Error has occurred", error);
            return error;
        });
}

module.exports = {
    list,
    listByDate,
    listByNumber,
    read,
    create,
    updateStatus,
    update,
}