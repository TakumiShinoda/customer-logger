const ipcRenderer = require('electron').ipcRenderer;
const Validator = require('validatorjs')

window.onbeforeunload = () => {
    ipcRenderer.send('closeServer');
};

function openModal(name){
  $('.' + name).modal();
}

function closeModal(name){
  $('.' + name).modal('hide');
}

ipcRenderer.on('alert', (ev, mes) => {
  alert(mes);
});

function cur_view(){
  var url = location.pathname;
  var urlArr = url.split('/');
  return urlArr[urlArr.length - 2];
}

function load(url){
  ipcRenderer.send('move_to_url', url);
}
