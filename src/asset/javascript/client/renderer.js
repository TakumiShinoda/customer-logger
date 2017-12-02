$(document).ready(() => {
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

  $('.ipAdress')[0].textContent = "IP: " + getIP();
  ipcRenderer.send('run_clientServer');
});

ipcRenderer.on('addCustomer', (ev, id) => {
  $('ul#content').append('<li id=list class='+ id +'><span class='+ id +'>'+ id +'</span> - 02:00</li>')
});

ipcRenderer.on('deleteCustomer', (ev, id) => {
  var contentList = $('li#list').children('span');
  var idList = [];

  for(var i = 0;i < contentList.length; i++){
    idList.push(contentList[i].textContent);
  }

  if(idList.indexOf(String(id)) >= 0){
    $('.'+String(id)).remove();
  }else{
    console.log('can not find')
  }
});
