const {app, BrowserWindow, ipcMain} = require('electron');
const {download} = require('electron-dl');

let win

function createWindow () {
  win = new BrowserWindow();
  win.maximize();

  win.loadURL(`file://${__dirname}/index.html`)

  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
  win.webContents.session.on('will-download', () => {
    console.log('download downlaod');
  });
}

app.on('ready', createWindow)

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

