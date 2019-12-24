const isDev = require('electron-is-dev');
if (isDev) { 
  const {app, BrowserWindow} = require('electron');
} else {
  const {app, autoUpdater, BrowserWindow} = require('electron');
  const server = "https://hazel-pi-flame.now.sh/";
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
  autoUpdater.setFeedURL(feed);
}

const {app, BrowserWindow} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'flash/pepflashplayer64_32_0_0_303.dll'
    break
  case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'flash/libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function clearCache() {
  mainWindow.webContents.session.clearCache();
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Club Penguin Back is loading...",
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      plugins: true
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadURL('http://play.cpback.club/desktop_game.html');
  clearCache();

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

setInterval(clearCache, 1000*60*5);
if (isDev === false) {
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000);
}