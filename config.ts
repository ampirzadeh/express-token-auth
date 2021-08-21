export const tokenKey = (process.env.TOKEN_KEY || "SecretKey").toString();
export const PORT = +(process.env.PORT || process.env.API_PORT || 8000);
// TODO Change to your mongoDB connection string
export const MongoURI = (
  process.env.MONGO_URI ||
  `mongodb://127.0.0.1:27017/${process.env.npm_package_version || "dbdbdbdbdb"}`
).toString();
