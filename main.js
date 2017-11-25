'use strict'

var express = require('express')
var ex = express();
var bodyParser = require('body-parser')

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

ex.use(bodyParser.urlencoded({
    extended: true
}));
ex.use(bodyParser.json());

ex.listen(4126);

ex.post('/', (req, res) => {
    var data = req.body;

    switch(data.task){
      case 'add':
        mainWindow.webContents.send('addCustomer', data.id);
        res.send('Your requests sent\n');
        break;
      case 'delete':
        mainWindow.webContents.send('deleteCustomer', data.id);
        res.send('Your requests sent\n');
        break;
      case 'log':
        mainWindow.webContents.send('ipc_log', data.id);
        res.send('Your requests sent\n');
        break;
      default:
        res.send('Your requests did not send\n');
    }
});
