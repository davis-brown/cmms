const express = require("express");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Comma-separated list of frontend URLs allowed to call the API
var corsOptions = {
  origin: (process.env.CORS_ORIGIN || "http://localhost:8081").split(",").map(o => o.trim())
};

app.use(cors(corsOptions));
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  createParentPath: true
}));
app.use('/api/images', express.static(path.join(__dirname , '/public/images')));

const db = require("./models");
const Role = db.role;


db.sequelize.sync()
  .then(() => initial())
  .catch(err => {
    console.error("Database setup failed:", err);
    process.exit(1);
  });


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Make sure the roles exist; safe to run on every start
function initial() {
  const roles = [
    { id: 1, name: "user" },
    { id: 2, name: "moderator" },
    { id: 3, name: "admin" },
    { id: 4, name: "leader" }
  ];

  return roles.reduce((prev, role) => prev.then(() =>
    Role.findOrCreate({ where: { id: role.id }, defaults: role })
  ), Promise.resolve());
}


require("./routes/communication.routes")(app);
require("./routes/person.routes")(app);
require("./routes/family.routes")(app);
require("./routes/familyperson.routes")(app);
require("./routes/event.routes")(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require("./routes/congregation.routes")(app);
require("./routes/personcontact.routes")(app);
require("./routes/group.routes")(app);
require("./routes/groupmember.routes")(app);
require("./routes/attendee.routes")(app);
require("./routes/lifeevent.routes")(app);
require("./routes/lifeeventperson.routes")(app);
//require("./routes/personcontact.routes")(app);
//require("./routes/communication.routes")(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});