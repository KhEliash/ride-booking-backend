import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://eliashebrahim:eliashEbrahim@cluster0.xzzvi9v.mongodb.net/ride-booking-app?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DB!!");

    server = app.listen(5000, () => {
      console.log("Server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

//signal error
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//uncaught rejection error
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
