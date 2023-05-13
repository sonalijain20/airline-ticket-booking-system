"use-strict";

const { knex } = require("../schema/utils/knex");

module.exports = class AirlineController {
  constructor() {
    this.table = "airlines";
  }

  async addAirline(req, res) {
    try {
      const validationErrors = this.validatePayload(req.body);

      if (validationErrors.errors.length) {
        return res.status(400).json(validationErrors);
      } else {
        const { name } = req.body;
        await knex(this.table).insert({ name });
        return res.status(200).json({
          statusCode: 200,
          message: "Airline added",
        });
      }
    } catch (error) {
      console.error("Error while adding airline: ", error);
    }
  }

  validatePayload(payload) {
    const validationErrors = {
      errors: [],
    };

    if (!payload.hasOwnProperty("name")) {
      validationErrors.errors.push({
        field: "name",
        error: "name is mising",
      });
    } else if (typeof payload.name != "string") {
      validationErrors.errors.push({
        field: "name",
        error: "name must be a string",
      });
    } else if (payload.name.length < 0 || payload.name.length > 255) {
      validationErrors.errors.push({
        field: "name",
        error: "length of name must be between 0 and 255",
      });
    }
    return validationErrors;
  }

  async getList(req, res) {
    try {
      const airlines = await knex(this.table).select(`*`);

      if (!airlines.length) {
        return res.status(200).json({ message: "No airlines Found" });
      } else {
        const airlineList = airlines.map((airline) => {
          return {
            id: airline.id,
            name: airline.name,
          };
        });
        return res.status(200).json(airlineList);
      }
    } catch (error) {
      console.error("Error while fetching airlines list: ", error);
    }
  }
};
