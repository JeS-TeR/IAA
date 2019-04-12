
/*
  -Modulate into a lib folder
  -Gain an appreciation for asyn awaits(better understanding as well)
*/
//REQUIREMENTS
const {app, BrowserWindow, ipcMain} = require("electron");
const req = require("request");
const scrape = require("./lib/scrape");
const  dbOp= require("./lib/dbOps");

let dbOps = new dbOp();

//WINDOW CREATION
let window;

function createWindow(){
  win  = new BrowserWindow({width:800,height:600});
  window = win;
  win.loadFile('./ScrapePage.html');
}

app.on('ready', createWindow);

//Display Page
function displaycollection(document){
  console.log("we creating tings");
  window.loadFile("./DisplayPage.html");
  window.webContents.on('did-finish-load', () => {
      window.webContents.send('data', document);
  });
}

ipcMain.on('asynchronous-message', async (event, args)=>{
  let {location,query,collection,website} = args;
  let qString = "";
  let returnedValue = [];
  
  query.forEach(element => {
    qString += element + " ";
  });

  returnedValue = await scrape(location,qString,website);
  beenStored  = dbOps.storeDB_Info(returnedValue,collection);
  dbOps.retrieveDB_Info(collection);
  displaycollection(returnedValue);
})
