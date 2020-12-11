const newAssFunc = require('./Format Functions/NewAssignment');
const newConnectionFunc = require('./Format Functions/NewConnection');

let myMap = new Map();

myMap.set('NewAssignment', newAssFunc);
myMap.set('NewConnection', newConnectionFunc);


module.exports = myMap;

