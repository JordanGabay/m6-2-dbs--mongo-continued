"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTechnology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  const data = await db.collection("seats").find().toArray();
  let seats = {};
  data.forEach((seat) => {
    seats[seat._id] = seat;
  });
  console.log(seats);
  client.close();
  res.status(200).json({ seats: seats, numOfRows: 8, seatsPerRow: 12 });
  return seats;
};

const seatPurchase = async (req, res) => {
  const _id = req.body.seatId;
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercise_1");
    const newValues = {
      $set: { isBooked: true, user: req.body.fullName, email: req.body.email },
    };
    if (req.body === undefined) {
      throw new Error("Need more Info");
    }
    console.log("SEAT_ID", _id);
    const greetings = await db
      .collection("seats")
      .updateOne({ _id }, newValues);
    res.status(200).json({ status: 200, data: { _id } });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, data: { ...req.body }, message: err.message });
  }
  client.close();
};

module.exports = { getSeats, seatPurchase };
