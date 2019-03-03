const {ipcRenderer} = require('electron');
function clearValue(formEl){
  if(!formEl.beenChanged){
    console.log("we working");
    formEl.value="";
  }
  formEl.beenChanged = true;
}

// while input is being filled out the data must be sent to the main process so
// that the main process can query database and send back info to the renderer.
//IMPLEMENT LATER!!!!!!!!!!!!!!!
function autoFill(){

}

// var qArray = [];
// var loc = "";

//This code can(DEFINATELY) be optimized; ITS U-G-L-Y !!!!! .. I dont like ugly ;).
function ProcessData(){
  q = [];
  inputFields = document.getElementsByClassName('q');
  for(i = 0; i < inputFields.length; i++){
    if(inputFields[i].type == "number"){
      q.push("$"+inputFields[i].value);
    }
    else if(inputFields[i].type=="radio"){
      if(!inputFields[i].checked){
        continue
      }
      q.push(inputFields[i].value);
    }
    else{
      q.push(inputFields[i].value);
    }
  }
  loc = document.getElementById('l').value;
  collection = document.getElementById("collection").value
  //qArray=q;
  var args = {
    "Method":"Scrape",
    "l":loc,
    "q":q,
    "collection":collection
  }
  sendToMain(args);
}

function sendToMain(args){
  ipcRenderer.send('asynchronous-message',args);
}
