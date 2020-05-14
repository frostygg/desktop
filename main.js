const {app, BrowserWindow, dialog, Menu, MenuItem} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const DiscordRPC = require('discord-rpc');

//const {app, BrowserWindow} = require('electron');
const path = require('path');

let pluginName;
switch (process.platform) {
  case 'win32':
    pluginName = 'flash/pepflashplayer64_32_0_0_303.dll';
    break;
  case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin';
    break;
  case 'linux':
    pluginName = 'flash/libpepflashplayer.so';
    break;
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
autoUpdater.checkForUpdatesAndNotify();
let mainWindow;

function clearCache() {
  if (mainWindow !== null) {mainWindow.webContents.session.clearCache();}
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Frosty is loading...',
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      plugins: true
    }
  });

  mainWindow.setMenu(null);
  clearCache();
  mainWindow.loadURL('https://play.frosty.gg/desktop_re.html');

  // RICH PRESENCE START
  const clientId = '668459813264424961'; DiscordRPC.register(clientId); const rpc = new DiscordRPC.Client({ transport: 'ipc' }); const startTimestamp = new Date();
  rpc.on('ready', () => {
    rpc.setActivity({
      details: 'frosty.gg', 
      state: 'Desktop Client',
      startTimestamp,
      largeImageKey: 'favicon_512'//,
      //largeImageText: "LARGE IMAGE TEXT",
      //smallImageKey: "favicon_512",
      //smallImageText: "SMALL IMAGE TEXT"
    });
  });
  rpc.login({ clientId }).catch(console.error);

  //mainWindow.webContents.openDevTools();
  
  let fsmenu = new Menu();
  fsmenu.append(new MenuItem({
    label: 'About',
    click: () => { 
      dialog.showMessageBox({
        type: "info",
        buttons: ["Ok"],
        title: "About Frosty Desktop",
        message: "Frosty Desktop Client\nDeveloped by the Frosty Team\nWe hold no copyright for any of the files\nfrosty.gg\ndiscord.gg/clubpenguin"
      });
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Fullscreen',
    accelerator: 'CmdOrCtrl+F',
    click: () => { 
      let fsbool = (mainWindow.isFullScreen() ? false : true);
      mainWindow.setFullScreen(fsbool);
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Log Out',
    click: () => { 
      mainWindow.reload();
    }
  }));

  mainWindow.setMenu(fsmenu);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {app.quit();}
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {createWindow();}
});


setInterval(clearCache, 1000*60*5);
