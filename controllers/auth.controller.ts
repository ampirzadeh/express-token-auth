import { Handler } from "express";
import { hash, compare } from "bcrypt";
import { sign as signJWT } from "jsonwebtoken";
import { User } from "../db";
import { httpDebug } from "../debug";
import { tokenKey } from "../config";

export const enterUser: Handler = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body as {
      email: string;
      password: string;
    };

    if (!(email && password)) throw "400";
    email.toLowerCase();

    let usr = await User.findOne({ email });

    if (!usr) {
      const encryptedPassword = await hash(password, 10);
      usr = await User.create({ email, password: encryptedPassword });
    }
    if (!(await compare(password, usr.password))) throw "403";

    const token = signJWT({ email }, tokenKey, {
      expiresIn: "30d",
    });
    await User.updateOne(
      {
        _id: usr._id,
      },
      {
        token,
      }
    );

    return res.status(200).send(token);
  } catch (error) {
    httpDebug(error);
    res.sendStatus(parseInt(error));
  }
};
