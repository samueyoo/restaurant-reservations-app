/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  if (req.query.date) {
    console.log("Query data detected:", req.query.date);
    const date = req.query.date;
    return res.json({ data: await service.listByDate(date) });
  }
  console.log("No query data detected, proceeding with full list");
  return res.json({ data: await service.list()});
}

// async function listByDate(req, res) {
//   const date = req.query.date;
//   return res.json({ data: await service.listByDate(date) });
// }

async function create(req, res) {
  console.log("req.body", req.body)
  const response = await service.create(req.body.data);
  return res.json({ data: response });
}

function validateProperty(property) {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[property]) return next();
    return next({ status: 400, message: `Reservation request must include ${property}` });
  }
}

async function validateDate(req, res, next) {
  const { data = {} } = req.body;
  const { reservation_date } = data;
  
}

async function validateTime(req, res, next) {
  
}

module.exports = {
  list,
  create: [ //Validation of properties not needed since required on front-end side
    //validateProperty("first_name"), 
    // validateProperty("last_name"), 
    // validateProperty("mobile_number"), 
    // validateProperty("people"), 
    // validateDate, 
    asyncErrorBoundary(create)
  ],
};
