const express = require('express');
const app = express();
const cors = require('cors');

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
	console.log('received');
 return res.send(JSON.stringify('pong'));
});


app.listen(process.env.PORT || 8080);