import express from 'express';

const form = `
<form action='/station' method='post'>
  <label for='station'>The Express Train 🚂</label>
  <input id='station' name='station' />
  <button>All Aboard</button>
<form/>`;

const app = express();

// replaces bodyparser.urlencoded
app.use(express.urlencoded({ extended: false }));

app.use('/express-train', (req, res, next) => {
  res.send(form);
});

app.post('/station', (req, res, next) => {
  console.log(req.body);
  // res.redirect('/');
  const station = req.body.station;
  res.redirect(`/?station=${station}`); // Attach 'station' as a query parameter and redirect
});

app.use('/', (req, res, next) => {
  const { station } = req.query;
  res.send(
    `<h1>${station ? station + '🏭' : 'You are Home 🏡'}</h1><a href='/express-train'>Take the Express</a>`
  );
});

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.log('Server is on track to port 3000');
});
