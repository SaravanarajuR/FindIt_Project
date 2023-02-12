const tf = require("@tensorflow/tfjs");

const Home = require("../models/homeModel");

async function pred(rent, type, city) {
  const data = await Home.find({})
    .where("regio1")
    .equals(city)
    .where("typeOfFlat")
    .equals(type)
    .where("totalRent")
    .ne("0")
    .exec();

  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [1],
      activation: "linear",
    })
  );

  const predictions = [];
  for (const item of data) {
    const inputs = [Number(rent)];
    const tensor = tf.tensor2d([inputs]);
    predictions.push(model.predict(tensor).dataSync()[0]);
  }
  return Math.ceil(Math.abs(predictions[1]));
}

module.exports = pred;
