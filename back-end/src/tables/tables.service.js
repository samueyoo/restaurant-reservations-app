const knex = require("../db/connection");

function list() {
    return knex("tables")
        .select()
        .orderBy("table_name")
}

function read(tableId) {
    return knex("tables")
        .select()
        .where({ table_id: tableId })
        .first();
}

function create(newTable) {
    console.log("creating new table...")
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then(createdRecord => createdRecord[0])
        .catch(error => {
            console.error("Error has occurred", error);
            return error;
        })
}

function update(reservationId, tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .update({
            reservation_id: reservationId
        })
}

function unassign(tableId) {
    return knex("tables")
        .select("*")
        .where({ table_id: tableId })
        .update({
            reservation_id: null
        })
}

module.exports = {
    list,
    read,
    create,
    update,
    unassign,
}