import { Router } from 'express';

const router = Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the backend (via a separate route file)!' });
});

export default router;
