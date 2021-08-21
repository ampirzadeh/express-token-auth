declare global {
  declare namespace Express {
    export interface Request {
      user: string;
      //  import("./db").IUser;
    }
  }
}
