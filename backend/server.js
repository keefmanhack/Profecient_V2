const mongoose = require('mongoose'),
	  cors 	   = require('cors');

const app = require('./src/app.js');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('configured');
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let mongoUrl = process.env.PROF_MONGO_DB;

mongoose.connect(mongoUrl);

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);


app.listen(process.env.PORT || 8080, () => {
	console.log('Server running');
});