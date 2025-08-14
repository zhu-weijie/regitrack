import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the RegiTrack API!');
});

app.listen(port, () => {
  console.log(`API server is listening on http://localhost:${port}`);
});
