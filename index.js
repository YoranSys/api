const app = require('./src/app')
const models = require('./src/models')

require('./src/bot')

models.database
  .sync()
  .then(() => {
    app
      .listen(process.env.port || 3001, '0.0.0.0')
      .then(address => {
        console.log(`API lancée sur ${address}`)
      })
      .catch(err => {
        app.log.error(err)
        process.exit(1)
      })
  })
  .catch(console.error)
