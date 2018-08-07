// let { app, BrowserWindow } = require('electron')

// let window = null
// const createWindow = () => {
//   window = new BrowserWindow({ fullscreen: true })
//   window.openDevTools()
//   window.on('closed', function() {
//     window = null
//   })
// }

// app.on('window-all-closed', () => {
//   if (process.platform != 'darwin') {
//     app.quit()
//   }
// })

// if (app.isReady()) {
//   createWindow()
// } else {
//   app.on('ready', createWindow)
// }

// compiler.watch(
//   {
//     aggregateTimeout: 500,
//     poll: 100,
//   },
//   (err) => {
//     if (window && !err) {
//       console.log('refreshing')
//       window.loadFile(`${__dirname}/../dist/index.bundle.html`)
//     }
//   },
// )
