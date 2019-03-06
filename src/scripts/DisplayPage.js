const {ipcRenderer} = require("electron");
ipcRenderer.on('data', (event, message) => {
  //  console.log(message);
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
var popById = {};
function createElements(container,elem){
  var jobContainer = document.getElementsByClassName("jobContainer");
  var cloned = jobContainer[0].cloneNode("deep");
  var objs = ["https://ca.indeed.com"+elem["href"]];
  //console.log(objs);
  popById[elem["id"]] = objs;
  cloned.id = elem["id"];
  console.log(cloned.id);
  //why am i doing this? There most be a library... too lazy to get library... Torture...
  cloned.firstElementChild.firstElementChild.firstElementChild.innerHTML += " " + elem["jobTitle"];
  cloned.firstElementChild.firstElementChild.children[1].innerHTML += " " + elem["compName"];
  console.log(cloned.children[1]);
  cloned.children[1].firstElementChild.innerHTML=elem["jobSummary"];
  container.appendChild(cloned);
  if (elem["jobTitle"] == "Not Stated")
  cloned.firstElementChild.firstElementChild.firstElementChild.style.color="crimson";
}

function POPup(self){
  popup = document.getElementById("popup");
  popup.style.display="visible";
  parentNodeId=self.parentNode.parentNode.id;
  popup.src=popById[parentNodeId][0];
  popup.target='_top';
}
