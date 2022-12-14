const router = require("express").Router();
const notFound = require("../errors/notFound");
const controller = require("./tables.controller");

router
    .route("/:table_id/seat")
    .put(controller.assign)
    .delete(controller.unassign)
    .all(notFound);

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(notFound);

module.exports = router;