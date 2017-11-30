'use strict'

const electron = require("electron");
const ipc = electron.ipcMain;
const express = require('express')
const ex = express();
const bodyParser = require('body-parser')

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
let mainWindow;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL('file://' + __dirname + '/dist/views/index/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
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
          mainWindow.webContents.send('alert', 'request id failed. You sent "'+data+'"');
          res.send('Your requests did not send\n');
      }
  });

  ipc.on('move_to_url', function(ev, url){
    mainWindow.loadURL('file://' + __dirname + '/dist/views/' + url);
  });
});
