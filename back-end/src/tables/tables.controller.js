const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    return res.json({ data: await service.list() });
}

async function create(req, res) {
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
    if (typeof data.capacity !== "number") {
        return next({ status: 400, message: "Table capacity must be a number" });
    }
    if (data.capacity === 0) {
        return next({ status: 400, message: "Table capacity cannot be zero" });
    }
    next();
}

async function assign(req, res) {
    const { reservation_id } = req.body.data;
    const table_id = req.params.table_id;
    const response = await service.assign(reservation_id, table_id)
    const reservationResponse = await reservationService.updateStatus("seated", reservation_id);
    return res.status(200).json({ data: response})
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

function validateAlreadySeated(req, res, next) {
    const readReservation = res.locals.readReservation;
    if (readReservation.status === "seated") {
        return next({ status: 400, message: "Reservation status is already set to seated" });
    }
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

async function unassign(req, res) {
    const tableId = req.params.table_id;
    await service.unassign(tableId)
    await reservationService.updateStatus("finished", res.locals.table.reservation_id)
    return res.status(200).json({ data: await service.list() });
}

async function validateTableExists(req, res, next) {
    const response = await service.read(req.params.table_id);
    if (!response) {
        return next({ status: 404, message: `Table does not exist; received: ${req.params.table_id}`});
    }
    res.locals.table = response;
    next();
}

async function validateTableOccupancy(req, res, next) {
    const data = res.locals.table;
    if (!data.reservation_id) {
        return next({ status: 400, message: `table_id is not occupied`});
    }
    next();
}

module.exports = {
    list: [
        asyncErrorBoundary(list),
    ],
    create: [
        validateProperty("table_name"),
        validateProperty("capacity"),
        validateNameLength,
        validateCapacity,
        asyncErrorBoundary(create)
    ],
    assign: [
        validateProperty("reservation_id"),
        asyncErrorBoundary(validateReservationExists),
        asyncErrorBoundary(validateAlreadySeated),
        asyncErrorBoundary(validateCapactityForParty),
        asyncErrorBoundary(assign),
    ],
    unassign: [
        asyncErrorBoundary(validateTableExists),
        asyncErrorBoundary(validateTableOccupancy),
        asyncErrorBoundary(unassign)
    ]
}