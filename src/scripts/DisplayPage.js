const {ipcRenderer} = require("electron");
ipcRenderer.on('data', (event, message) => {
    console.log(message);
    var container = document.getElementById("display");
    message.forEach((elem,i) => {
    createElements(container,elem,i);
    })
  })


// function createElements(){
//   //Create the objects
//   var display = document.getElementById("display"),
//    jobContainer = document.createElement("div"),
//    jobTitle = document.createElement("li"),
//    applyForm = document.createElement("form"),
//    label = document.createElement("label"),
//    company = document.createElement("li"),
//    summayContainer= document.createElement("div");
//    sumParagraph = document.createElement("p");
//   //Populate(lackabettertermsyndrome) elements
//   jobTitle.innerHTML=elem["jobTitle"];
//   company.innerHTML = elem["company"];
//   label.innerHTML = "Apply";
//
// }
var poppedUp = false;
var popById = {};
var body = document.getElementsByTagName("body")[0];
function createElements(container,elem){
  var jobContainer = document.getElementsByClassName("jobContainer");
  var cloned = jobContainer[0].cloneNode("deep");
  console.log(elem["summary"]);
  var objs = ["https://ca.indeed.com"+elem["href"],elem["fullSummary"]||"<div id='I/A'><h1 >No Summary Provided by Indeed</h1></div>"];
  //console.log(objs);
  popById[elem.id] = objs;

  cloned.id = elem.id;
  //why am i doing this? There most be a library... too lazy to get library... Torture...
  cloned.firstElementChild.firstElementChild.firstElementChild.innerHTML += " " + elem.jobTitle;
  cloned.firstElementChild.firstElementChild.children[1].innerHTML += " " + elem.compName;
  cloned.children[1].firstElementChild.innerHTML=elem.summary;
  container.appendChild(cloned);
  if (elem["jobTitle"] == "Not Stated")
  cloned.firstElementChild.firstElementChild.firstElementChild.style.color="crimson";
}

// function DropDown(){
//   popup.style.display="none";
//   poppedUp=false;
//   console.log("howdy")
// }
function POPup(self){
  popup = document.getElementById("popup");
  popup.innerHTML="";
  parentNodeId=self.parentNode.parentNode.id;
  popup.style.display="block";
  popup.innerHTML+=popById[parentNodeId][1];
//  poppedUp = true;
}
