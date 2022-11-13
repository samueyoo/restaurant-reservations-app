const router = require("express").Router();
const notFound = require("../errors/notFound");
const controller = require("./tables.controller");

router
    .route("/")
    .get(controller.list)
    .all(notFound);

module.exports = router;