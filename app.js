const express = require('express');
const fs = require('fs');
const app = express();

const visitsFile = '/data/visits';

// Middleware to ensure the visits file exists
app.use((req, res, next) => {
  fs.access(visitsFile, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, create it with an initial value of 0
      fs.writeFile(visitsFile, '0', (err) => {
        if (err) {
          return res.status(500).send('Error initializing visits file.');
        }
        next();
      });
    } else {
      next();
    }
  });
});

app.get('/', (req, res) => {
  fs.readFile(visitsFile, 'utf8', (err, data) => {
    if (err) return res.send('Error reading visits file.');
    let visits = parseInt(data);
    visits++;
    fs.writeFile(visitsFile, visits.toString(), (err) => {
      if (err) return res.send('Error writing visits file.');
      res.send(`Welcome! This page has been visited ${visits} times.`);
    });
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});

