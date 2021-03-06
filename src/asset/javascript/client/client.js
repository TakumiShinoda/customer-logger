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

  $('.IPAdress')[0].textContent = " | IP: " + getIP();
  setInterval(() => {
    for(var i = 0;i < customerInfo.length;i++){
      customerInfo[i].time -= 1;
      $('span.timer' + customerInfo[i].id)[0].textContent = customerInfo[i].time;
    }
  }, 60000);
});

window.openServer =  () => {
  var port = $('.loginPort')[0].value;
  if(new Validator({port: port}, {port: 'required'}).fails()){
    alert('ポート番号を入力してください。');
  }else if(new Validator({port: port}, {port: 'numeric'}).fails()){
    alert('数字以外はポート番号に指定できません。');
  }else if(new Validator({port: port}, {port: ['numeric', {'min': 1024}, {'max': 65535}]}).fails()){
    alert('ポート番号は1024以上、65536未満で入力してください。');
  }else{
    ipcRenderer.send('run_clientServer', port);
  }
}

ipcRenderer.on('serverOpend', (ev, port) => {
  $('.serverPort')[0].textContent = " | Port: " + port;
  $('.serverStatus')[0].textContent = 'Idle'
  $('.serverStatus').css('color', 'rgb(209, 150, 90)')
  closeModal('inputLoginPortModal');
});

ipcRenderer.on('comp_activate', (ev, id) => {
  $('.serverStatus')[0].textContent = 'Connected'
  $('.serverStatus').css('color', 'rgb(152, 195, 121)')
});

ipcRenderer.on('addCustomer', (ev, id) => {
  customerInfo.push({'id': id, 'time': 120})
  var table = document.getElementById('table');
  var row = table.insertRow(-1);

  row.className = id
  row.insertCell(-1).innerHTML = '<span class="customerList '+ id +'"><span class='+ id +'>'+ id +'</span>'
  row.insertCell(-1).innerHTML = '<span class=timer'+id+'>120</span>分</span>';
});

ipcRenderer.on('deleteCustomer', (ev, id) => {
  var idList = [];
  var contentList = $('.customerList').children('span');

  ipcRenderer.send('delete', id);
  for(var i = 0;i < contentList.length; i++){
    idList.push(contentList[i].textContent);
  }

  if(idList.indexOf(String(id)) > -1){
    $('.'+String(id)).remove();
  }else{
    console.log('can not find')
  }

  for(var i = 0;i < customerInfo.length;i++){
    if(customerInfo[i].id == id){
      customerInfo.splice(i, 1);
    }
  }
});

ipcRenderer.on('disconected', (ev) => {
  $('.serverStatus')[0].textContent = 'Idle';
  $('.serverStatus').css('color', 'rgb(209, 150, 90)');
  alert('接続先から切断されました。');
});
