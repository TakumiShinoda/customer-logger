var port = null;
var customerInfo = [];

$(document).ready(() => {
  openModal('inputLoginPortModal');
  function getIP(){
    const os = require('os');
    const interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses[0];
  }

  $('.IPAdress')[0].textContent = "IP: " + getIP();
  setInterval(() => {
    for(var i = 0;i < customerInfo.length;i++){
      customerInfo[0].time -= 1;
      $('span.timer' + customerInfo[i].id)[0].textContent = customerInfo[0].time;
    }
  }, 60000);
});

function openServer(){
  var port = $('.loginPort')[0].value;
  ipcRenderer.send('run_clientServer', port);
}

ipcRenderer.on('serverOpend', (ev, port) => {
  $('.serverPort')[0].textContent = " | Port: " + port;
  closeModal('inputLoginPortModal');
})

ipcRenderer.on('addCustomer', (ev, id) => {
  customerInfo.push({'id': id, 'time': 120})
  $('ul#content').append('<li id=customerList class='+ id +'><span class='+ id +'>'+ id +'</span> - <span class=timer'+id+'>120</span>分</li>')
});

ipcRenderer.on('deleteCustomer', (ev, id) => {
  var contentList = $('li#customerList').children('span');
  var idList = [];

  for(var i = 0;i < contentList.length; i++){
    idList.push(contentList[i].textContent);
  }

  if(idList.indexOf(String(id)) >= 0){
    $('.'+String(id)).remove();
  }else{
    console.log('can not find')
  }

  for(var i = 0;i < customerInfo.length;i++){
    console.log(id)
    if(customerInfo[i].id == id){
      customerInfo.splice(i, 1);
    }
  }
});
