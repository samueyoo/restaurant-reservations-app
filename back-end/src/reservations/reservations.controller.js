/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  if (req.query.date) {
    console.log("Query data detected:", req.query.date);
    return res.json({ data: await service.listByDate(req.query.date) });
  }
  console.log("No query data detected, proceeding with full list");
  return res.json({ data: await service.list()});
}

async function read(req, res) {
  return res.status(200).json({ data: res.locals.data })
}

async function validateIdExists(req, res, next) {
  const data = await service.read(req.params.reservationId);
  if (!data) return next({ status: 404, message: `reservation_id does not exist; received: ${req.params.reservationId}`});
  res.locals.data = data;
  next();
}

async function create(req, res) {
  console.log("req.body", req.body)
  const response = await service.create(req.body.data);
  return res.status(201).json({ data: response });
}

function validateProperty(property) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[property]) return next();
    return next({ status: 400, message: `Reservation request must include ${property}` });
  }
}

function validatePeople(req, res, next) {
  const { data = {} } = req.body;
  if (typeof data.people !== "number") {
    return next({ status: 400, message: `people must be a number; received: ${data.people}` });
  }
  return next();
}

function validateDate(req, res, next) {
  const { data = {} } = req.body;
  const { reservation_date } = data;
  const dateArray = reservation_date.split("-");
  if (dateArray[0].length !== 4 || dateArray[1].length !== 2 || dateArray[2].length !== 2) {
    return next({ status: 400, message: `reservation_date must be in YYYY-MM-DD format; received: ${reservation_date}`});
  }
  return next()
}

function validateTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (time < "10:30") {
    console.log("validateTime; reservation_time cannot be before 10:30 AM");
    return next({ status: 400, message: `reservation_time cannot be before 10:30 AM`});
  }
  if (time > "21:30") {
    console.log("validateTime; reservation_time cannot be after 9:30 PM");
    return next({ status: 400, message: `reservation_time cannot be after 9:30 PM`});
  }
  const timeArray = time.split(":");
  if (!(Number(timeArray[0]) >= 0) || !(Number(timeArray[0]) <= 24)) {
    return next({ status: 400, message: `reservation_time must be a valid time; received: ${time}`})
  }
  if (!(Number(timeArray[1]) >= 0) || !(Number(timeArray[1]) < 60)) {
    return next({ status: 400, message: `reservation_time must be a valid time; received: ${time}`})
  }

  return next()
}

function validateClosedFuture(req, res, next) {
  const day = new Date(req.body.data.reservation_date.replace(/-/g, '\/'));
  const today = new Date();
  console.log("Backend; day = ", day)
  if (day.getTime() < today.getTime()) {
    return next({ status: 400, message: "Reservations must be in the future" })
  }
  if (day.getDay() === 2) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays" })
  }
  next();
}

async function validatePostStatus(req, res, next) {
  const { status = "" } = req.body.data;
  if (status === "seated" || status === "finished") {
    return next({ status: 400, message: `status should be "booked" only; received: ${status}` });
  }
  return next();
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const response = await service.updateStatus(status, req.params.reservationId);
  console.log("reservations.controller.update; response:", response)
  return res.status(200).json({ data: response});
}

async function validatePutStatus(req, res, next) {
  const { status = "" } = req.body.data;
  if (status === "unknown") {
    return next({ status: 400, message: `status should not be unknown; received: ${status}`});
  }
  console.log("validatePutStatus; res.locals.data:", res.locals.data)
  if (res.locals.data.status === "finished") {
    return next({ status: 400, message: `status is already finished; current status: ${status}`});
  }
  next();
}

module.exports = {
  list,
  read: [
    validateIdExists,
    read
  ],
  create: [ //Validation of properties not needed since required on front-end side
    validateProperty("first_name"), 
    validateProperty("last_name"), 
    validateProperty("mobile_number"), 
    validateProperty("people"), 
    validateProperty("reservation_date"), 
    validateProperty("reservation_time"), 
    validatePeople,
    validateClosedFuture,
    validateDate, 
    validateTime,
    validatePostStatus,
    asyncErrorBoundary(create)
  ],
  updateStatus: [
    validateIdExists,
    validatePutStatus,
    updateStatus,
  ]
};
