const {ipcRenderer} = require('electron');

//Function to send login credentials to the ipcmain(from renderer)

function sendCred(){
  var credOb = {'Method':"Login"};
  var creds = document.getElementById("passCreds");
  credOb[creds.children.loginKey.name] = creds.children.loginKey.value;
  credOb[creds.children.ps.name] = creds.children.ps.value;
  console.log(credOb);
  ipcRenderer.send("asynchronous-message",credOb);
}
