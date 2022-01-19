//imports
const express = require("express");
//const { database } = require("./Keys");
const routes = require("./routes/index");

//app config
const app = express();
const port = process.env.PORT || 8000;
app.set('view engine','ejs');
app.set('views',__dirname +'/views');

//middlewares
app.use(express.json());


//database config




// API routes
app.use("/", routes);

app.get('/game',function(req,res){
    res.sendfile(__dirname + '/game.html'); 
});


// Listening
app.listen(port, () => console.log(`Listening on port ${port}`));