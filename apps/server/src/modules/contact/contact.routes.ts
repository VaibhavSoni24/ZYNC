import { Router } from 'express';
import { contactController } from './contact.controller';

const router = Router();

router.post('/', (req, res, next) => contactController.submit(req, res, next));

export const contactRoutes = router;
