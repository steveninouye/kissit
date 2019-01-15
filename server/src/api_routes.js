import express from 'express';

import code from './api/code';

// import users from './api/users_routes';
// import places from './api/places_routes';
// import itineraries from './api/itineraries_routes';
// import google from './api/google_routes';

const api = express.Router();

api.use('/code', code);
// api.use('/places', places);
// api.use('/google', google);
// api.use('/itineraries', itineraries);

export default api;
