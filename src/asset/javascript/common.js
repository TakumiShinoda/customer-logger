window.onbeforeunload = () => {
    ipcRenderer.send('closeServer');
};

window.openModal = (name) => {
  $('.' + name).modal();
}

window.closeModal = (name) => {
  $('.' + name).modal('hide');
}

ipcRenderer.on('alert', (ev, mes) => {
  alert(mes);
});

window.load = (url) => {
  ipcRenderer.send('move_to_url', url);
}

window.quit = () => {
  ipcRenderer.send('quit');
}
