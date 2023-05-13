"use-strict";

const { knex } = require("../schema/utils/knex");

module.exports = class FlightController {
  constructor() {
    this.table = "flights";
  }
  validateFilters(filters) {
    const validationErrors = {
      errors: [],
    };
    if (!filters.hasOwnProperty("origin")) {
      validationErrors.errors.push({
        field: "origin",
        error: "origin is mising",
      });
    } else if (typeof filters.origin != "string") {
      validationErrors.errors.push({
        field: "origin",
        error: "origin must be a string",
      });
    }

    if (!filters.hasOwnProperty("destination")) {
      validationErrors.errors.push({
        field: "destination",
        error: "destination is mising",
      });
    } else if (typeof filters.destination != "string") {
      validationErrors.errors.push({
        field: "destination",
        error: "destination must be a string",
      });
    }

    return validationErrors;
  }
  async getFights(req, res) {
    try {
      let flights = [];
      if (req.query) {
        const queryParams = JSON.parse(req.query[`$filters`]);
        const validationErrors = this.validateFilters(queryParams);

        if (validationErrors.errors.length) {
          return res.status(400).json(validationErrors);
        } else {
          const origin = queryParams.origin;
          const destination = queryParams.destination;
          flights = await knex(this.table)
            .select(
              `flights.*`,
              `airlines.name as airlineName`,
              `flights.name as flightName`
            )
            .join("airlines", "flights.airlineId", "=", "airlines.id")
            .where("departureTime", ">", new Date())
            .andWhere("destination", "ILIKE", destination)
            .andWhere("origin", "ILIKE", origin);
        }
      } else {
        flights = await knex(this.table)
          .select(
            `flights.*`,
            `airlines.name as airlineName`,
            `flights.name as flightName`
          )
          .join("airlines", "flights.airlineId", "=", "airlines.id")
          .where("departureTime", ">", new Date());
      }
      if (!flights.length) {
        return res.status(200).json({
          message: "No flights found!",
        });
      } else {
        const flightsList = flights.map((flight) => {
          return {
            name: flight.flightName,
            airline: { id: flight.airlineId, name: flight.airlineName },
            totalSeats: flight.totalSeats,
            arrivalTime: flight.arrivalTime,
            departureTime: flight.departureTime,
            origin: flight.origin,
            destination: flight.destination,
            name: flight.flightName,
          };
        });

        return res.status(200).json(flightsList);
      }
    } catch (error) {
      console.error("Error while searching: ", error);
    }
  }

  async addFlight(req, res) {
    try {
      const validationErrors = await this.validatePayload(req.body);

      if (validationErrors.errors.length) {
        return res.status(400).json(validationErrors);
      } else {
        const {
          name,
          airlineId,
          origin,
          destination,
          arrivalTime,
          departureTime,
          totalSeats,
        } = req.body;

        await knex(this.table).insert({
          name,
          airlineId,
          origin,
          destination,
          arrivalTime,
          departureTime,
          totalSeats,
          availableSeats: totalSeats,
        });
        return res.status(200).json({
          statusCode: 200,
          message: "Flight added successfully!",
        });
      }
    } catch (error) {
      console.error("Error while adding flight: ", error);
    }
  }

  async validatePayload(payload) {
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

    if (!payload.hasOwnProperty("airlineId")) {
      validationErrors.errors.push({
        field: "airlineId",
        error: "Airline id is mising",
      });
    } else if (typeof payload.airlineId != "number") {
      validationErrors.errors.push({
        field: "airlineId",
        error: "Airline id must be an integer",
      });
    } else {
      const airlineInfo = await knex("airlines")
        .select(`*`)
        .where({ id: payload.airlineId });
      if (!airlineInfo.length) {
        validationErrors.errors.push({
          field: "airlineId",
          error: "Airline id is not valid",
        });
      }
    }

    if (!payload.hasOwnProperty("totalSeats")) {
      validationErrors.errors.push({
        field: "totalSeats",
        error: "Total number of seats is missing",
      });
    } else if (typeof payload.totalSeats != "number") {
      validationErrors.errors.push({
        field: "totalSeats",
        error: "Total number of seats must be an integer",
      });
    }

    if (!payload.hasOwnProperty("origin")) {
      validationErrors.errors.push({
        field: "origin",
        error: "origin is mising",
      });
    } else if (typeof payload.name != "string") {
      validationErrors.errors.push({
        field: "origin",
        error: "origin must be a string",
      });
    } else if (payload.origin.length < 0 || payload.origin.length > 255) {
      validationErrors.errors.push({
        field: "origin",
        error: "length of origin must be between 0 and 255",
      });
    }

    if (!payload.hasOwnProperty("destination")) {
      validationErrors.errors.push({
        field: "destination",
        error: "destination is mising",
      });
    } else if (typeof payload.destination != "string") {
      validationErrors.errors.push({
        field: "destination",
        error: "destination must be a string",
      });
    } else if (
      payload.destination.length < 0 ||
      payload.destination.length > 255
    ) {
      validationErrors.errors.push({
        field: "destination",
        error: "length of destination must be between 0 and 255",
      });
    }

    if (!payload.hasOwnProperty("arrivalTime")) {
      validationErrors.errors.push({
        field: "arrivalTime",
        error: "Arrival Time is missing",
      });
    } else {
      if (!this.isValidateDate(payload.arrivalTime)) {
        validationErrors.errors.push({
          field: "arrivalTime",
          error: "Arrival Time is not valid",
        });
      }
    }

    if (!payload.hasOwnProperty("departureTime")) {
      validationErrors.errors.push({
        field: "departureTime",
        error: "Departure Time is missing",
      });
    } else {
      if (!this.isValidateDate(payload.departureTime)) {
        validationErrors.errors.push({
          field: "departureTime",
          error: "Departure Time is not valid",
        });
      }
    }

    if (!this.compareDateTime(payload.arrivalTime, payload.departureTime)) {
      validationErrors.errors.push({
        field: "arrival",
        error: "Arrival Time must be ahead of departure time",
      });
    }
    return validationErrors;
  }

  isValidateDate(dateTime) {
    const date = new Date(dateTime);
    return !isNaN(date) && date.getTime().toString() !== "NaN";
  }

  compareDateTime(arrival, departure) {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);

    if (arrivalTime.getTime() > departureTime.getTime()) {
      return true;
    } else if (arrivalTime.getTime() < departureTime.getTime()) {
      return false;
    } else {
      return false;
    }
  }
};
