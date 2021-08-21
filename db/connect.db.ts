import { connect } from "mongoose";
import { MongoURI } from "../config";
import { dbDebug } from "../debug";

export const dbConnect = () =>
  connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
    .then(() => {
      dbDebug("Successfully connected to database");
    })
    .catch((error) => {
      dbDebug("Database connection failed. exiting now...");
      dbDebug(error);
      process.exit(1);
    });
