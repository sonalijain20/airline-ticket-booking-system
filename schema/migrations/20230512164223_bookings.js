"use-strict";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("bookings", function (table) {
    table.increments("id").primary();
    table
      .integer("passengerId")
      .unsigned()
      .notNullable()
      .references("users.id");
    table
      .integer("flightId")
      .unsigned()
      .notNullable()
      .references("flights.id");
    table.integer("seatNo").unsigned();
    table.timestamp("bookedAt").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("bookings");
};
