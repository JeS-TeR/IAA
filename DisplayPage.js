const {ipcRenderer} = require("electron");
ipcRenderer.on('data', (event, message) => {
    // var colours = ["red","blue","purple"]
    var container = document.getElementById("display");
    message.forEach((elem,i) => {
    var arrObjs = [];
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

function createElements(container,elem){
  var jobContainer = document.getElementsByClassName("jobContainer");
  var cloned = jobContainer[0].cloneNode("deep");
  //why am i doing this? There most be a library... too lazy to get library... Torture...
  cloned.firstElementChild.firstElementChild.firstElementChild.innerHTML += " " + elem["jobTitle"];
  cloned.firstElementChild.firstElementChild.children[1].innerHTML += " " + elem["compName"];

  console.log(cloned.children[1]);
  cloned.children[1].firstElementChild.innerHTML=elem["jobSummary"];
  container.appendChild(cloned);
}
