//imports
const express = require("express"); 
//const { database } = require("./Keys");
const routes = require("./routes/index");

//app config
const app = express();
const port = process.env.PORT || 8000;




//middlewares
app.use(express.json());


//database config


// API routes(call routes)
app.use("/", routes);


// Server Listening
app.listen(port, () => console.log(`Listening on port ${port}`));