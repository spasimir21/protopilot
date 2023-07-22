const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });

  window.loadURL('http://localhost:1234/');
}

app.whenReady().then(() => {
  createWindow();

  // const template = [
  //   {
  //     label: 'Project',
  //     submenu: [
  //       {
  //         label: 'Open'
  //       }
  //     ]
  //   }
  // ];

  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
