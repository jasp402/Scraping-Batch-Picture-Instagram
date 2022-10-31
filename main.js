const electron      = require('electron');
const ipcMain       = electron.ipcMain;
const dailog        = electron.dialog;
const app           = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1400, height: 768,
      webPreferences: {
    nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
  }

  })

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null);
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

let dir;

ipcMain.on('selectDirectory', function(event, arg) {
  dailog.showOpenDialog({properties: ['openDirectory'] }).then(function (response) {
    if (!response.canceled) {
      console.log(response.filePaths[0]);
      dir = response.filePaths[0];
      event.sender.send('variable-reply', dir);
    } else {
      console.log("no file selected");
    }
  });
});


