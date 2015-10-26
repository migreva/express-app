import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';

import router from './router';

let app = express();

// Template language
app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Favicon
app.use(favicon(`${__dirname}/../public/img/theDudeBathroom.jpg`));

// Static file path
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use(router);

export default app;