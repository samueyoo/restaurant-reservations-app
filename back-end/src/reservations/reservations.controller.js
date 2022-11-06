/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");

async function list(req, res) {
  return res.json({ data: await service.list()});
}

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
    create
  ],
};
