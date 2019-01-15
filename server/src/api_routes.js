import { Router } from 'express';

import code from './api/code';

const api = Router();

api.use('/code', code);

export default api;
