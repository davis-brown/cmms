const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

const app = express();

// Behind a reverse proxy (nginx in docker compose), trust its X-Forwarded-For
// so rate limits see each visitor's address instead of the proxy's. Set to the
// number of proxies in front of the app, e.g. TRUST_PROXY=1.
if (process.env.TRUST_PROXY) {
  const hops = Number(process.env.TRUST_PROXY);
  app.set("trust proxy", Number.isNaN(hops) ? process.env.TRUST_PROXY : hops);
}

// Standard security headers. Images are served to the frontend, which in
// development runs on another port of the same host, so allow same-site.
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

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
// Uploaded family photos are stored here; make sure the folder exists.
fs.mkdirSync(path.join(__dirname, "public/images"), { recursive: true });
app.use('/api/images', express.static(path.join(__dirname , '/public/images')));

const db = require("./models");
const seed = require("./seed");
const ensureUniqueIndexes = require("./unique-indexes");
const ensureApprovedColumn = require("./approved-column");
const contactPrivacy = require("./middleware/contactPrivacy");

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Hide other members' phone, email and address from regular users
app.use("/api", contactPrivacy);

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



// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Create any missing tables and seed roles (and demo data, if enabled) before accepting requests.
db.sequelize
  .sync()
  .then(ensureUniqueIndexes)
  .then(ensureApprovedColumn)
  .then(seed)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Failed to start: could not set up the database.", err);
    process.exit(1);
  });
