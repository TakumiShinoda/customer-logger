'use strict'

const electron = require("electron");
const ipc = electron.ipcMain;
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const ex = express();

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
let mainWindow;

var customerIds = [];

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: 'rgb(40, 44, 52)'
  });
  mainWindow.hide();
  mainWindow.setFullScreen(true);
  mainWindow.loadURL('file://' + __dirname + '/dist/views/index/index.html');

  mainWindow.webContents.on('did-finish-load', ()=>{
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ex.use(bodyParser.urlencoded({extended: true}));
  ex.use(bodyParser.json());

  ipc.on('run_clientServer', (ev, port) => {
    let server = http.createServer(ex);

    set_customerIds('init', 1);
    server.listen(port, () => {
      mainWindow.webContents.send('serverOpend', server.address().port);
      ex.post('/', (req, res) => {
          let data = req.body;
          switch(data.task){
            case 'add':
              if(customerIds.indexOf(data.id) < 0){
                mainWindow.webContents.send('addCustomer', data.id);
                set_customerIds('add', data.id);
                res.send('送信完了');
              }else{
                res.send('このIDは既に登録されています。');
              }
              break;
            case 'delete':
              if(customerIds.indexOf(data.id) > -1){
                mainWindow.webContents.send('deleteCustomer', data.id);
                set_customerIds('delete', data.id);
                res.send('送信完了');
              }else{
                res.send('このIDは登録されていません。');
              }
              break;
            case 'log':
              mainWindow.webContents.send('ipc_log', data.id);
              res.send('Your requests sent\n');
              break;
            case 'act':
              mainWindow.webContents.send('comp_activate', data.id);
              res.send('アクティベートに成功しました。');
              break;
            case 'dis':
              mainWindow.webContents.send('disconected');
              res.send('切断されました。');
              break;
            default:
              res.send('Your requests did not send\n');
          }
      });
    });

    server.on('error', (e) => {
      mainWindow.webContents.send('alert', 'このポートはすでに使用されています。');
    });

    ipc.on('closeServer', (ev) => {
      server.close(() => {
        console.log("server closed");
      });
    });
  });

  ipc.on('move_to_url', (ev, url) => {
    mainWindow.loadURL('file://' + __dirname + '/dist/views/' + url);
  });

  ipc.on('quit', (ev) => {
    app.quit();
  });
});

// methods

function set_customerIds(t, v){
  switch(t){
    case 'init':
      if(v == 1){customerIds = [];}
      break;
    case 'add':
      customerIds.push(v);
      break;
    case 'delete':
      let index = customerIds.indexOf(v);
      if(index > -1){
        customerIds.splice(index, 1);
      }
      break;
    default:
      break;
  }
}
