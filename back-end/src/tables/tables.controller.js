const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    return res.json({ data: await service.list() });
}

module.exports = {
    list,
    
}