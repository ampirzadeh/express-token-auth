import debug from "debug";

const bugger = debug(process.env.npm_package_version || "bugger");
export const dbDebug = bugger.extend("db");
export const httpDebug = bugger.extend("http");
export { bugger };
