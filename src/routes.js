import express from 'express';
import oAuth from './middlewares/oAuth.js';
import {
  handleLogin,
  unreadMailCount,
  reply,
  saveOption
} from './controller/index.js';

export default router = express.Router();

router.post('/mails/count', oAuth, unreadMailCount);
router.post('/mails/reply', oAuth, reply);

router.post('/user/login', handleLogin);
router.post('/reply/option', saveOption);