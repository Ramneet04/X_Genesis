import { Router } from "express";
import { signup, login, sendotp, checkUserName } from "../../controllers/auth";

const router: Router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendotp);
router.get("/check-username", checkUserName);

export default router;
