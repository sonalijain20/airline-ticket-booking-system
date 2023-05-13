"use-strict";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("flights", function (table) {
    table.increments("id").primary();
    table.string("name", 255);
    table
      .integer("airlineId")
      .unsigned()
      .notNullable()
      .references("airlines.id");
    table.string("origin", 255);
    table.string("destination", 255);
    table.timestamp("arrivalTime");
    table.timestamp("departureTime");
    table.integer("totalSeats").unsigned();
    table.integer("availableSeats").unsigned();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("flights");
};
