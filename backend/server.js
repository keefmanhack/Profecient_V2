const mongoose      = require('mongoose');
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env')});
    console.log('configured');
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let mongoUrl = process.env.PROF_MONGO_DB;

mongoose.connect(mongoUrl);

const app = require('./src/app.js');

app.listen(process.env.BACKEND_PORT, () => {
	console.log('Server running on ' + process.env.BACKEND_PORT);
});