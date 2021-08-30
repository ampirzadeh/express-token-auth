export const tokenKey = (process.env.TOKEN_KEY || "SecretKey").toString();
export const PORT = +(process.env.PORT || process.env.API_PORT || 8000);
// TODO Change to your mongoDB connection string
export const MongoURI = (
  process.env.MONGO_URI ||
  `mongodb://127.0.0.1:27017/${process.env.npm_package_name || "dbdbdbdbdb"}`
).toString();
export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Api",
    version: "1.0.0",
    contact: {
      name: "AMPirzadeh",
      url: "https://ampirzadeh.github.io",
      email: "am.pirzadeh@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:4001",
      description: "Development server",
    },
  ],
};
export const swaggerConfig = {
  swaggerDefinition,
  apis: ["./controllers/*.ts"],
};
