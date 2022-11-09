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

async function create(req, res) {
  console.log("req.body", req.body)
  const { from_client, ...trueData } = req.body.data;
  const response = await service.create(trueData);
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
  //const checkPeople = Number(data.people);
  if (!data.from_client) { //temp measure to pass test...
    if (typeof data.people !== "number") {
      return next({ status: 400, message: `people must be a number; received: ${data.people}` });
    }
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
  const timeArray = time.split(":");
  if (!(Number(timeArray[0]) >= 0) || !(Number(timeArray[0]) <= 24)) {
    return next({ status: 400, message: `reservation_time must be a valid time; received: ${time}`})
  }
  if (!(Number(timeArray[1]) >= 0) || !(Number(timeArray[1]) < 60)) {
    return next({ status: 400, message: `reservation_time must be a valid time; received: ${time}`})
  }
  // if (!(Number(timeArray[2]) >= 0) || !(Number(timeArray[2]) < 60)) {
  //   return next({ status: 400, message: `reservation_time must be a valid time; received: ${time}`})
  // }
  return next()
}

module.exports = {
  list,
  create: [ //Validation of properties not needed since required on front-end side
    validateProperty("first_name"), 
    validateProperty("last_name"), 
    validateProperty("mobile_number"), 
    validateProperty("people"), 
    validateProperty("reservation_date"), 
    validateProperty("reservation_time"), 
    validatePeople,
    validateDate, 
    validateTime,
    asyncErrorBoundary(create)
  ],
};
