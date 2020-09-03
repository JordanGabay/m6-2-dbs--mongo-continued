const router = require("express").Router();
const {MongoClient} = require("mongodb");
const {getSeats, seatPurchase} = require('./handlers')

require ("dotenv").config();
const {MONGO_URI} = process.env
const options = {
  useNewUrlParser: true,
  useUnifiedTechnology: true
}


const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    };
  }
}

// let Seats = Object.values(seats);
// const SeatsImport = async () => {
//   try {
//     const client = await MongoClient(MONGO_URI, options);
//     await client.connect();
//     const db = client.db("exercise_1");
//     const r = await db.collection("seats").insertMany(Seats);
//     assert.equal(1, r.insertedCount);
//     client.close();

//      console.log("Testing");
//   } catch (err) {
//     console.log(err, "Not working")
//   }
// }
// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

let state;

// router.get("/api/seat-availability", async (req, res) => {
//   if (!state) {
//     state = {
//       bookedSeats: randomlyBookSeats(30),
//     };
//   }



//   return res.json({
//     seats: seats,
//     bookedSeats: state.bookedSeats,
//     numOfRows: 8,
//     seatsPerRow: 12,
//   });
// });

router.get("/api/seat-availability", getSeats);

let lastBookingAttemptSucceeded = false;

router.post("/api/book-seat", seatPurchase)

module.exports = router;
