'use strict'

const electron = require("electron");
const ipc = electron.ipcMain;
const express = require('express')
const http = require('http')
const ex = express();
const bodyParser = require('body-parser')

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var port = null;
let mainWindow;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.setFullScreen(true);
  mainWindow.loadURL('file://' + __dirname + '/dist/views/index/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ex.use(bodyParser.urlencoded({
      extended: true
  }));
  ex.use(bodyParser.json());

  ipc.on('run_clientServer', (ev, request) => {
    let server = http.createServer(ex);
    port = request
    if(request && parseInt(port) < 65536){
      server.listen(port, () => {
        mainWindow.webContents.send('serverOpend', port);
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
              case 'act':
                res.send('アクティベートに成功しました。');
              default:
                res.send('Your requests did not send\n');
            }
        });
        ipc.on('closeServer', (ev) => {
          server.close(() => {
            console.log("server closed");
          });
        });
      });
    }else if(parseInt(port) >= 65536){
      mainWindow.webContents.send('alert', 'ポート番号は65536未満で入力してください。');
    }else{
      mainWindow.webContents.send('alert', 'ポートが入力されていません');
    }
    server.on('error', (e) => {
      mainWindow.webContents.send('alert', 'このポートはすでに使用されています。');
    });
  });

  ipc.on('move_to_url', (ev, url) => {
    mainWindow.loadURL('file://' + __dirname + '/dist/views/' + url);
  });

  // for process debug
  ipc.on('processLog', (ev, mes) => {
    console.log(mes);
  })
});
