var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors');
var path = require("path")

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const db = require("./app/models/");

db.sequelize.sync()
    .then(() => {
        console.log("synced db.");
    })
    .catch(err => {
        console.log("Failed to sync db: " + err.message);
    })

app.use(express.static(path.resolve(__dirname, './client/build')));

// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to survey application."});
// })

require("./app/routes")(app);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

// set port, listen for requests
// const PORT = process.env.PORT || 8081;
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
