/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const notFound = require("../errors/notFound");
const controller = require("./reservations.controller");

router 
    .route("/:reservationId/status")
    .put(controller.updateStatus)
    .all(notFound);

router
    .route("/:reservationId")
    .get(controller.read)
    .all(notFound);

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(notFound);

module.exports = router;
