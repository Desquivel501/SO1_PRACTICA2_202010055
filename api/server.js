const express = require("express");
const mysql = require('mysql')
var cors = require('cors')
var router = express.Router();

var movies = [
    {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
    {id: 102, name: "Inception", year: 2010, rating: 8.7},
    {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
    {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
 ];
  

const connection = mysql.createConnection({
    host: '34.121.112.46',
    user: 'root',
    password: 'password',
    database: 'TASK_MANAGER'
  })

// New app using express module
const app = express();
app.use(express.json());
app.use(cors())

app.get("/", function(req, res) {
    res.send("<html><body><p>Hello World</p></body></html>");
  });


app.get("/monitor", function(req, res) {
    connection.query("SELECT * FROM MONITOR ORDER BY ID DESC LIMIT 1", function (err, data, fields) {
        if(err) return next(new AppError(err))
        res.status(200).json({
          status: "success",
          length: data?.length,
          data: data,
        });
      });
});

app.get("/processes", function(req, res) {
  connection.query("SELECT * FROM PROCESSES", function (err, data, fields) {
      if(err) return next(new AppError(err))
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    });
});


app.get("/processes/:id", function(req, res) {
  connection.query("SELECT * FROM PROCESSES WHERE PARENT = " + req.params.id + " AND PID != PARENT", function (err, data, fields) {
      if(err) return next(new AppError(err))
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    });

    // console.log(req.params.id)

    // res.status(200).json({
    //   status: "success"
    // });


});


app.listen(5000, function(){
    console.log("server is running on port 5000");
})