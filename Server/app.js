var createError = require('http-errors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');  // log requests to the console 
var cors = require('cors');
const MongoClient=require('mongodb').MongoClient;
const ObjectID=require('mongodb').ObjectID;
const dbname="hush_chat";
const url="mongodb://localhost:27017";  //default Mongo URL
const mongoOptions= {useNewUrlParser: true};

var express = require('express');
app= express();


app.use(logger('dev'));  //log every request to the console
app.use(express.json());    // parse application/json
app.use(express.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  // set the static files location
app.use(cors());


var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 2000;

const state = {
  db: null
}


const connect= (callback) => {
  if (state.db) {                 //if we have a db connection
      callback();
  }
  else {                          //else make the connection
      MongoClient.connect(url,mongoOptions,(err,client)=> {
          if (err)
          callback(err);
          else{
              
              callback();  

              io.on('connection', function (socket) {
                  console.log(' %s sockets connected', io.engine.clientsCount);
                  socket.on('disconnect', function() {
                    console.log("disconnect: ", socket.id);
                     });
                  state.db=client.db(dbname);
                  
                  let chat=state.db.collection('chats');

                  //function to send status
                  sendStatus= function (s) {
                      socket.emit('status',s);
                  }

                  //get chats from mongo DB
                  chat.find().limit(100).sort({_id:1}).toArray(function(err,res) {
                      if(err) throw err
                      else {
                          //emit the messages
                          socket.emit('output',res);
                      }
                  });

                  //handle input events
                  socket.on('input',function(data) {
                    console.log("recieved in server:",data);
                      let name=data.name;
                      let message=data.message;

                      if (name=='' || message=='') {
                          sendStatus('Please enter name and message!');
                      }

                      else {
                          //insert message
                          chat.insertOne({name:name,message:message}, ()=> {
                              socket.emit('output',data);
                              sendStatus({
                                  message: 'Message Sent',
                                  clear: true
                              });
                          })
                      }
                  })

                  //handle clear
                  socket.on('clear',(data)=> {
                      //remove all chats from collection
                      chat.remove({},()=> {
                          socket.emit('cleared');
                      })

                  })


    });
          }
      });
  }
}


const getPrimaryKey= (_id) => {
  return ObjectID(_id);  //id object used to query db by primary key

}

const getDB = () => {
  return state.db;  //returns current state of db
}




//connecting to db
connect((err)=> {
  if (err)  {
    console.log("Unable to connect to DB");
    process.exit(1);
  }
  else  {
    server.listen(port, () => {
      console.log("Connected to Database and listening on 2000!");
      
    })
  }
});


/* GET home page. */
app.get('/', function (req, res) {
  res.send('dujjj');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
