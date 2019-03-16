
/*
  -Modulate into a lib folder
  -Gain an appreciation for asyn awaits(better understanding as well)
*/
//REQUIREMENTS
const {app, BrowserWindow, ipcMain} = require("electron");
const cheerio = require("cheerio");
const MongoClient = require("mongodb").MongoClient;
const req = require("request");


//WINDOW CREATION
var window;
function createWindow(){
  win = new BrowserWindow({width:800,height:600});
  window = win;
  win.loadFile('./ScrapePage.html');
}

app.on('ready', createWindow);

//Display Page
function displaycollection(collecObj){
  console.log("we creating tings");
  window.loadFile("./DisplayPage.html");
  window.webContents.on('did-finish-load', () => {
  collecObj.find({}).toArray((err,results)=>{
    console.log(results);
    window.webContents.send('data', results);
  });
});
  console.log(2);
}
//Database Definition
var url = "mongodb://localhost:27017/";

const database = new MongoClient(url);

//Database handler... trying to code in a DRY way(pragmatic programmer)
//it DEFINATELY makes coding more puzzle like.
//Also requires insight, so it'll hone my skills for long term.
function dbQueryRouter(caller,collection,args){
  database.connect(function(err){
    let db  = database.db("iaa");
    if(err) console.log(err);
    switch(caller){
      case "SJ":
        SJ_db_qHandler(db,collection,args);
        break;
    }
  });
}

//dbHandlers
function SJ_db_qHandler(db,collection,args){
  console.log("we got called from dbqHandler");
  var collec = db.collection(collection);
  //console.log(collec)
  console.log(args);
  args.forEach(function (elem,i){
    collec.findOne({"id" : elem.id}, function (err,results){
      if(results === null)
      collec.insert(elem);
    });
    if( i == args.length-1){
      console.log("we running");
      displaycollection(collec);
    }
  })
}

//Main "interface" that handles scraping...
//Will add ipcMain call in this... to send data back to user
function scrapeJobs(body,params) {
 let $ = cheerio.load(body);
  
  var JSCards = $(".jobsearch-SerpJobCard");
  var allObj =[];

  JSCards.each(async (i,JSC) => {
    var dbObj ={};
    element = cheerio.load($.html(JSC));
    let href = element("a").first().attr("href");
    
    dbObj.href = href;
    dbObj.compName = element(".company").text().trim() || "Not Stated",
    dbObj.jobTitle   = element("h2.jobtitle").text().trim() || "Not Stated",
    dbObj.jobSummary = element("span.summary").text().trim() || "Not Stated";
    dbObj.id = element(".jobsearch-SerpJobCard").attr("id") || "Not Stated";
    allObj[i]=dbObj;
    dbObj.summary= await getfullSummary(href);
    
  });
  
   dbQueryRouter("SJ",params["collection"],allObj);
}

const getfullSummary = async (href) => {
  try {
    let url = "https://ca.indeed.com";
    return new Promise((resolve, reject) => {
      req({method:'GET', url:url+href} , (err,res,body) => {
        if (err) { reject(err) }
        let $ = cheerio.load(body);
        summary = $(".jobsearch-JobComponent-description").html();
        //allObj[i]["summary"] = summary;
        resolve(summary);
      });
    })
  }
catch(err){ throw err }
}

//asynchronous message from renderer is sent here... !!REFACTOR...find  a way to hand
// off messages to respective functions !!
ipcMain.on('asynchronous-message', (event, args) =>{
  let params = {};
//  console.log(args);
  //when argss are recieved from renderer process, loop through the values[a list] for key args["q"].
  if(args.Method === "Scrape"){
    let qString = "";
    //REFACTOR THIS SHIT!!!!!!!!!!!!!!!!!!!!!!!!!
    for(i = 0; i < args.q.length; i++){
      if(i == 0){
        qString +=  args.q[i];
        continue;
      }
      qString += " " + args.q[i]; //string together elements
    }
    params["collection"] = args["collection"];
    //requestjs method used to get indeed's webpage, uses argsuments gotten from user input on renderer.
    req({method:'GET',url:'https://www.indeed.ca/jobs',qs:{'q':qString,'l':args.l}},
    (err,res,body) => {
      if(err){reject (err)}
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
