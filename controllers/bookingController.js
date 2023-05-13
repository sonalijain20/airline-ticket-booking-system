"use-strict";

const { knex } = require("../schema/utils/knex");

module.exports = class BookingController {
  constructor() {
    this.table = "bookings";
  }

  async bookSeats(req, res) {
    try {
        const validationErrors =await  this.validatePayload(req.body);

        if (validationErrors.errors.length) {
          return res.status(400).json(validationErrors);
        }else{
            const bookingInfo=await knex(this.table).insert({
                passengerId: req.user.id,
                flightId: req.body.flightId,
                seatNo: (req.flightInfo.totalSeats- req.flightInfo.availableSeats)+1
            })

            await knex('flights').where('flightId', req.body.flightId).decrement('availableSeats', 1);
            return res.status(200).json({
                message: "Seat booked successfully!"
            })
        }
    } catch (error) {
        console.error("Error while booking seat: ", error)
    }
  }

  async validatePayload(payload){
    const validationErrors = {
        errors: [],
      };
      if(!payload.flightId){
        validationErrors.errors.push({
            field: "flightId",
            error: "Flight id is missing"
        })
      }
      else if(typeof payload.flightId!='number'){
        validationErrors.errors.push({
            field:"flightId",
            error:"Flight id must an integer"
        })
      }else{
        const flightInfo = await knex('flights').select(`*`).where({id: payload.flightId});
        req.flightInfo= flightInfo;
        if(!flightInfo.length){
            validationErrors.errors.push({
                error:"flightId",
                error: "Flight id must be valid"
            })
        }else{
            if(flightInfo[0].availableSeats<=0){
                validationErrors.errors.push({
                    error:"flightId",
                    error: "All seats are booked"
                })
            }
        }
      }

      return validationErrors;
  }
};
