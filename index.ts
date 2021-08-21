import app from "./app";
import http from "http";
import { PORT } from "./config";
import { httpDebug } from "./debug";

const server = http.createServer(app);

server.listen(PORT, () => {
  httpDebug(`Server running on port ${PORT}`);
});
