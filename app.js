const express  = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/user-routes');
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('public'));
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});