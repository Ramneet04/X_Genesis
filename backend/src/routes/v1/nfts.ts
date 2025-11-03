import { Router } from "express";
import { createNft } from "../../controllers/nfts";
import { auth, isUser } from "../../middlewares/auth";
const router: Router = Router();
router.post("/create",auth,isUser,createNft);
export default router;