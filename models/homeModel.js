const mongoose = require("mongoose");

const homeSchema = {
  regio1: String,
  serviceCharge: String,
  telekomTvOffer: Number,
  newlyConst: String,
  balcony: String,
  totalRent: String,
  yearConstructed: String,
  scoutId: Number,
  noParkSpaces: String,
  hasKitchen: String,
  cellar: String,
  houseNumber: String,
  livingSpace: String,
  condition: String,
  petsAllowed: String,
  street: String,
  lift: String,
  typeOfFlat: String,
  noRooms: String,
  floor: String,
  numberOfFloors: String,
  garden: String,
  regio2: String,
  regio3: String,
  description: String,
  facilities: String,
  lastRefurbish: String,
  Rating: Number,
  mail: String,
  GrLivArea: Number,
  FullBath: Number,
  GarageCars: Number,
  new: {
    type: "Object",
    created: {
      value: "TRUE",
      createdAt: {
        expiresAt: 1000 * 60 * 60 * 24 * 2,
        default: Date.now(),
      },
    },
  },
};

module.exports = mongoose.model("Home", homeSchema);
