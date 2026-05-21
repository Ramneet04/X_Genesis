import { Router } from 'express';
import nftsRouter from './nfts';
import userRouter from './user';
import uploadRouter from './upload';

const router = Router();

router.use('/nfts', nftsRouter);
router.use('/user', userRouter);
router.use('/upload', uploadRouter);

export default router;
