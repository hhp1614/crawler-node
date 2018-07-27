const express = require('express');
const app = express();

app.use(express.static('./'));

// app.get('/', function(req, res) {
//     res.send('Hello World!');
// });

app.listen(8888);
console.log('static server is listening at http://127.0.0.1:8888');
