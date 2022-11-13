const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    return res.json({ data: await service.list() });
}

//Validate the reservation size vs table capacity
    //Get the current table data
    //Get the current reservation data
        //We are provided IDs for both
//Validate that the table is not already assigned a reservation
// function validateCapacity(req, res, next) {
//     const { reservation_id, table_id } = req.body.data;

// }

async function create(req, res) {
    console.log("req.body", req.body)
    const response = await service.create(req.body.data);
    return res.status(201).json({ data: response });
}

function validateProperty(property) {
    return (req, res, next) => {
        const { data = {} } = req.body;
        if (data[property]) return next();
        return next({ status: 400, message: `Table request must include ${property}` });
    }
}

function validateNameLength(req, res, next) {
    if (req.body.data.table_name.length < 2) {
        return next({ status: 400, message: "table_name must be at least two characters" });
    }
    next();
}

function validateCapacity(req, res, next) {
    const { data = {} } = req.body;
    console.log("validateCapacity; req.body.data.capacity:", data.capacity)
    console.log("typeof:", typeof data.capacity)
    if (typeof data.capacity !== "number") {
        return next({ status: 400, message: "Table capacity must be a number" });
    }
    if (data.capacity === 0) {
        return next({ status: 400, message: "Table capacity cannot be zero" });
    }
    next();

}

async function update(req, res) {
    const { reservation_id } = req.body.data;
    const table_id = req.params.table_id;
    return res.status(200).json({ data: await service.update(reservation_id, table_id)})
}

async function validateReservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const readReservation = await reservationService.read(reservation_id);
    if (!readReservation) {
        return next({ status: 404, message: `reservation_id does not exist; received: ${reservation_id}`})
    }
    res.locals.readReservation = readReservation;
    next();
}

async function validateCapactityForParty(req, res, next) {
    const table_id = req.params.table_id;
    const readTable = await service.read(table_id);
    const readReservation = res.locals.readReservation;
    if (!readReservation.reservation_id) {
        return next({ status: 404, message: "reservation_id does not exist" });
    }
    if (readTable.capacity < readReservation.people) {
        return next({ status: 400, message: "Table does not have sufficient capacity" });
    }
    if (readTable.reservation_id) {
        return next({ status: 400, message: "Table is occupied" });
    }
    next();
}

module.exports = {
    list,
    create: [
        validateProperty("table_name"),
        validateProperty("capacity"),
        validateNameLength,
        validateCapacity,
        create
    ],
    update: [
        validateProperty("reservation_id"),
        validateReservationExists,
        validateCapactityForParty,
        update
    ],

}