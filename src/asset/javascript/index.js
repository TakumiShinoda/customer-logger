ipcRenderer.on('ipc_log', (ev, mes) => {
  console.log(mes)
});
