import { Router } from "express";
import { createNft, getUsersNfts } from "../../controllers/nfts";
import { auth, isUser } from "../../middlewares/auth";
const router: Router = Router();
router.post("/create",auth,isUser,createNft);
router.get("/user-nfts",auth,isUser,getUsersNfts);
export default router;