/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");

async function list(req, res) {
  return res.json({ data: await service.list()});
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  return res.json({ data: response });
}

module.exports = {
  list,
  create,
};
