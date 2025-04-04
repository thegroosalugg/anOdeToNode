import { Router } from '@oak/oak';
import { allMsgs, deleteMsg, editMsg, newMsg } from '../controllers/msgController.ts';

const router = new Router();

router.get('/', allMsgs);
router.post('/new', newMsg);
router.put('/edit/:msgId', editMsg);
router.delete('/delete/:msgId', deleteMsg);

export default router;
