import { Router } from '@oak/oak';
import { allMsgs, deleteMsg, editMsg, newMsg } from '../controllers/msgController.ts';

const router = new Router();

router.get('/all', allMsgs);
router.post('/new', newMsg);
router.put('/edit/:msgId', editMsg);
router.delete('/delete/:msgId', deleteMsg);

export default router;
