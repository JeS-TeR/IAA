const {ipcRenderer} = require('electron');

let clearValue = formEl => {
  if(!formEl.beenChanged)
    formEl.value="";
  formEl.beenChanged = true;
}

function ProcessData(){
  
  let q = [];
  let inputFields = document.getElementsByClassName('q');
  let collection,loc,website = "";

  for(i = 0; i < inputFields.length; i++){
    if(inputFields[i].type == "number"){
      q.push("$"+inputFields[i].value);
      continue;
    }
    else if(inputFields[i].type=="radio"){
      if(inputFields[i].checked){
        q.push(inputFields[i].value);
      }
      continue;
    }
    q.push(inputFields[i].value);
  }

  loc = document.getElementById('l').value;
  collection = document.getElementById("collection").value;
  website = document.getElementById("site").value;

  let args = {"location":loc,"query":q,"collection":collection,"website":website};
  sendToMain(args);
}

function sendToMain(args){
  ipcRenderer.send('asynchronous-message',args);
}
