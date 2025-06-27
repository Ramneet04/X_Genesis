import { Router } from "express";
import { nftsRouter } from "./nfts";

export const router = Router();

router.use('/nfts', nftsRouter);