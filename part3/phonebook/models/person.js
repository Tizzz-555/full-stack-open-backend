const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: [true, "Name missing"] },
  number: {
    type: String,
    minLength: 8,
    required: [true, "Number missing"],
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message:
        "Numbers must be formatted with 2 or 3 digits before the separator",
    },
    // Imo, easier, cleaner way to do this
    // match: [
    //   /^\d{2,3}-\d+$/,
    //   "Numbers must be formatted with 2 or 3 digits before the separator",
    // ],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
