//REQUIREMENTS
const {app, BrowserWindow, ipcMain} = require("electron");
const cheerio = require("cheerio");
const MongoClient = require("mongodb").MongoClient;
const req = require("request");
const fs = require("fs");



//WINDOW CREATION
function createWindow(){
  win = new BrowserWindow({width:800,height:600});
  win.loadFile('main.html');
}

app.on('ready', createWindow);

//Database Definition
var url = "mongodb://localhost:27017/";

const database = new MongoClient(url);

//Database handler... trying to code in a DRY way(pragmatic programmer)
//it DEFINATELY makes coding more puzzle like.
//Also requires insight, so it'll hone my skills for long term.
function dbQueryRouter(caller,collection,args){
  database.connect(function(err){
    console.log("Qe in dbQR nyakke");
    let db  = database.db("iaa");
    if(err) console.log(err);
    switch(caller){
      case "SJ":
        SJ_db_qHandler(db,collection,args);
        break;
    }
  })
}

//dbHandlers

function SJ_db_qHandler(db,collection,args){
//  console.log(collection);
//  console.log(args);
  collec = db.collection(collection);
  for(i = 0; i < args.length;i++){
    collec.insert(args[i]);
  }
  collec.find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
}



//Main "interface" that handles scraping...
//Will add ipcMain call in this... to send data back to user
function scrapeJobs(body,params){
  // JAvascript can discern which param belongs to which argument... how? it cant... not clear atm... NVM IT CANT... STILL LOOK TO CLARIFY
 let $ = cheerio.load(body);
  //console.log(body);
   // ?var x = fs.createReadStream(); CANT BE READ...NAME TOO LONG?

  console.log("greetings");
  var JSCards = $(".jobsearch-SerpJobCard");
  var allObj =[];
  JSCards.each((i,JSC) => {
    var dbObj ={};
    if (0 >= 1) return
    element = cheerio.load($.html(JSC)),
    dbObj["compName"] = element(".company").text().trim(),
    dbObj["jobTitle"]   = element("h2.jobtitle").text().trim(),
    dbObj["jobSummary"] = element("span.summary").text().trim();
    // console.log("--------------------------------");
    // console.log(dbObj["compName"] + "  " + dbObj["jobTitle"]);
    // console.log(dbObj["jobSummary"]);
    // console.log("_________________________________");
    allObj[i]=dbObj;
  });
  dbQueryRouter("SJ",params["collection"],allObj);
}

//asynchronous message from renderer is sent here... !!REFACTOR...find  a way to hand
// off messages to respective functions !!
ipcMain.on('asynchronous-message', (event, args) =>{
  let params = {};
  console.log(args);
  //when argss are recieved from renderer process, loop through the values[a list] for key args["q"].
  if(args["Method"] === "Scrape"){
    let qString = "";
    //REFACTOR THIS SHIT!!!!!!!!!!!!!!!!!!!!!!!!!
    for(i = 0; i < args["q"].length; i++){
      if(i == 0){
        qString +=  args["q"][i];
        continue;
      }
      qString += " " + args["q"][i]; //string together elements
    }
    params["collection"] = args["collection"];
    //requestjs method used to get indeed's webpage, uses argsuments gotten from user input on renderer.
    req({method:'GET',url:'https://www.indeed.ca/jobs',qs:{'q':qString,'l':args["l"]}},
    (err,res,body) => {
      scrapeJobs(body,params);
    });
  }
  // else if(args["Method"] === "Login"){
  //   req({method:'get', url:'https://indeed.com/account/login'}, (err,res,body) => {
  //   //  console.log(body);
  //     paramArray = ["input","form"];
  //     scrapeMain(body,paramArray);
  //   });
  //
  // }

});
