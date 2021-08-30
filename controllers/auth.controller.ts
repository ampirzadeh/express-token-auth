import { Handler } from "express";
import { hash, compare } from "bcrypt";
import { sign as signJWT } from "jsonwebtoken";
import createError from "http-errors";
import { User } from "../db";
import { httpDebug } from "../debug";
import { tokenKey } from "../config";

/**
 * @swagger
 * /enter:
 *   post:
 *     summary: Signup or Signin the user
 *     description: If a user with the given email exists, sign them in, otherwise create an account and sign them in afterwards
 *     requestBody:
 *       description: Properties of the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           examples:
 *             me:
 *               summary: An example of user signup/signin
 *               value:
 *                 email: am.pirzadeh@gmail.com
 *                 password: amp@API
 *     responses:
 *       200:
 *         description: Auth token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: BCrypt auth token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtLnBpcnphZGVoQGdtYWlsLmNvbSIsImlhdCI6MTYzMDMyNjExNSwiZXhwIjoxNjMyOTE4MTE1fQ.K7icHMX1Wesc7su_DjnP3IlJQKICE0CbKPauEXtuFFQ
 */
export const enterUser: Handler = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body as {
      email: string;
      password: string;
    };

    if (!(email && password))
      throw new createError.BadRequest("Please provide an email and password");
    email.toLowerCase();

    let usr = await User.findOne({ email });

    if (!usr) {
      const encryptedPassword = await hash(password, 10);
      usr = await User.create({ email, password: encryptedPassword });
    }
    if (!(await compare(password, usr.password)))
      throw new createError.Forbidden("Wrong password");

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

    return res.status(200).send({ token });
  } catch (error) {
    httpDebug(error);
    return next(error);
  }
};
