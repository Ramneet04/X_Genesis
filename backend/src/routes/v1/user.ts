import { Router } from "express";
import { signup, login, sendotp } from "../../controllers/auth";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendotp);

export default router;
