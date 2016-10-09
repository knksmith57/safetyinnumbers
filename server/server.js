'use strict';

const camera = require('./camera');
const express = require('express');

const STATIC_FILE_DIR = 'static';

const app = module.exports = express();

app.get('/health', (req, res) => res.sendStatus(200));
app.use(express.static(STATIC_FILE_DIR));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Starting web server on port ${port}`);
  console.log(`  serving static files from: ${STATIC_FILE_DIR}`);
});

