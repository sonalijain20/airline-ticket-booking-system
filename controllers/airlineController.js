"use-strict";

module.exports = class AirlineController {
  constructor() {
    this.table = "airlines";
  }

  async addAirline(req, res) {
    return res.status(200).json({
      statusCode: 200,
      message: "heyyyyyyyyyyyyyyyyyyyyy",
    });
  }
};
