const ipcRenderer = require( 'electron' ).ipcRenderer;

window.onbeforeunload = () => {
    ipcRenderer.send('closeServer');
};

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
