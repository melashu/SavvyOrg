const mongoose = require("mongoose");

// connect to the mongoDB collection
// const connectDB = () => {
//   mongoose
//     .connect(
//       "mongodb+srv://yilkalayinalem:Ayinalem1234@cluster0.q4703.mongodb.net/savvybridge?retryWrites=true&w=majority",
//       {
//         useUnifiedTopology: true,
//         useNewUrlParser: true,
//       }
//     )
//     .then((res) => console.log(`MongoDB Connected: ${res.connection.host}`))
//     .catch((err) => {
//       console.error(`Error: ${err.message}`);
//       process.exit(1);
//     });
// };

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/savvybridge", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((res) => console.log(`MongoDB Connected: ${res.connection.host}`))
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connectDB;
