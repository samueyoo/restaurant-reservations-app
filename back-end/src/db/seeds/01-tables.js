const tables = require("./01-tables.json");

exports.seed = async function(knex) {
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(() => knex("tables").insert(tables))
};
