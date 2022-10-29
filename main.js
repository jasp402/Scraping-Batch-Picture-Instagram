const electron = require('electron');
const ipcMain = electron.ipcMain;
const dailog = electron.dialog;

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1400, height: 768,
      webPreferences: {
    nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
  }

  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.setMenu(null);
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// code. You can also put them in separate files and require them here.
let dir;

ipcMain.on('selectDirectory', function(event, arg) {
  dailog.showOpenDialog({properties: ['openDirectory'] }).then(function (response) {
    if (!response.canceled) {
      // handle fully qualified file name
      console.log(response.filePaths[0]);
      dir = response.filePaths[0];
      event.sender.send('variable-reply', dir);
    } else {
      console.log("no file selected");
    }
  });
});


