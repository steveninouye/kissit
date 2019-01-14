import '@babel/polyfill';
import express from 'express';
import passport from 'passport';
import bp from 'body-parser';
import mongoose from 'mongoose';
import { resolve } from 'path';

// import passportConfig from './config/passport';
// import { dbUri } from './config/keys';
// import apiRoutes from './api_routes';

const app = express();
mongoose
  .connect(
    dbUri,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => console.log('Connected to Mongo DB'))
  .catch((err) => console.log(`DB Error: ${err}`));

const clientPath =
  process.env.NODE_ENV === 'production'
    ? resolve(__dirname, '../../client/dist')
    : resolve(__dirname, '../../client/src');

app.use(morgan('combined'));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(passport.initialize());
app.use(express.static(clientPath));

passportConfig(passport);

app.use('/api', apiRoutes);

app.get('*', (req, res) => {
  res.sendFile(resolve(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`you are running in ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server listening on port ${PORT}`);
});
