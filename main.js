const {app, BrowserWindow, ipcMain} = require('electron');
const {download} = require('electron-dl');
const mongoService = require('./app/mongoService.js')

let win

function createWindow () {
  win = new BrowserWindow();

  win.loadURL(`file://${__dirname}/index.html`)
  win.toggleDevTools();
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', ()=> {
  mongoService.init().then(() => {
    createWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

// Events

ipcMain.on('download-btn', (e, args) => {
  const downloadOptions = { directory: './data' };
  download(BrowserWindow.getFocusedWindow(), args.url, downloadOptions)
      .then(dl => console.log(dl.getSavePath()))
      .catch(console.error);
})

ipcMain.on('toggle-devtools', (e, args) => {
  win.toggleDevTools();
})

ipcMain.on('save-sqwaks', (e, args) => {
  mongoService.save(args.data).then(r => {
    r && console.log(r);
    console.log('Success!');
  });
})

