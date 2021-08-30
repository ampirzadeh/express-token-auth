import { hash, compare } from "bcrypt";
import { sign as signJWT } from "jsonwebtoken";
import createHttpError from "http-errors";
import { check } from "express-validator";
import { User } from "../db";
import { httpDebug } from "../debug";
import { PasswordValidation, tokenKey } from "../config";
import { Service } from ".";

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
 *             valid:
 *               summary: An example of user signup/signin
 *               value:
 *                 email: am.pirzadeh@gmail.com
 *                 password: amp3@API
 *             valid_password:
 *               summary: An example of invalid password
 *               value:
 *                 email: am.pirzadeh@gmail.com
 *                 password: amp3
 *             invalid_email:
 *               summary: An example of invalid email
 *               value:
 *                 email: am.pirzadeh
 *                 password: amp3@API
 *             wrong_password:
 *               summary: An example of wrong password
 *               value:
 *                 email: am.pirzadeh@gmail.com
 *                 password: amp4@API
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
 *                   description: Auth token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtLnBpcnphZGVoQGdtYWlsLmNvbSIsImlhdCI6MTYzMDMzMDYwNiwiZXhwIjoxNjMyOTIyNjA2fQ.2SyqP4MySY5OVPc_BCSjd5WmfKoVz5nS9jEsnlPXRvA
 *       400:
 *         description: Bad auth credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error
 *             examples:
 *               valid_password:
 *                 summary: An example of invalid password
 *                 value:
 *                   message: InvalidPassword
 *               invalid_email:
 *                 summary: An example of invalid email
 *                 value:
 *                   message: InvalidEmail
 *               wrong_password:
 *                 summary: An example of wrong password
 *                 value:
 *                   message: WrongPassword
 */
export const EnterUser: Service = {
  validation: [
    check("email")
      .trim()
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("InvalidEmail"),
    check("password")
      .trim()
      .exists()
      .notEmpty()
      .isStrongPassword(PasswordValidation)
      .withMessage(
        // ! description should be given on frontend and it should match PasswordValidation (in config.ts)
        "InvalidPassword"
      ),
  ],
  main: async (req, res, next) => {
    try {
      const { email = "", password = "" } = req.body as {
        email: string;
        password: string;
      };

      email.toLowerCase();

      let usr = await User.findOne({ email });

      if (!usr) {
        const encryptedPassword = await hash(password, 10);
        usr = await User.create({ email, password: encryptedPassword });
      }
      if (!(await compare(password, usr.password)))
        throw new createHttpError.Forbidden("WrongPassword");

      const token = signJWT({ email }, tokenKey, {
        expiresIn: "30d",
      });
      usr.token = token;
      usr.save();

      return res.send({ token });
    } catch (error) {
      httpDebug(error);
      return next(error);
    }
  },
};
