import { Router } from "express";
import { enterUser } from "./controllers";
import { auth } from "./middlewares";
const router = Router();

router.get("/enter", enterUser);
router.get("/", auth, (req, res) => res.send(JSON.stringify(req.user)));

export default router;
