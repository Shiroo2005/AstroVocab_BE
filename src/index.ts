config()

import 'reflect-metadata'
import express from 'express'
import { config } from 'dotenv'
import { errorHandler, notFoundHandler } from './utils/handler'
import { morganMiddleware } from './middlewares/morgan.middlewares'
import helmet from 'helmet'
import compression from 'compression'
import router from './routes'
import { corsConfig } from './config/cors.config'
import { servingStaticConfig } from './config/static.config'
import { syncDatabase } from './services/database.service'
import { seedData } from './core/seeds'
import './services/redis.service'
import { redisConnect } from './services/redis.service'
const app = express()
const port = process.env.PORT || 8081

async function initApp() {
  //MIDDLE_WARES

  // cors
  app.use(corsConfig)

  // log by morgan
  app.use(morganMiddleware)

  // protected by helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  )

  // optimize by compression request
  app.use(compression())

  // convert request to json
  app.use(express.json())
  //////////////////////////////

  // DATABASE

  //redis
  await redisConnect()

  // init db
  await syncDatabase()
  await seedData()
  //////////////////////////////

  // Serving static image
  servingStaticConfig(app)

  //ROUTES
  app.use(router)
  //////////////////////////////

  //init swagger
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  //DEFAULT HANDLER
  //not found handler
  app.use(notFoundHandler)

  // error handler
  app.use(errorHandler)
  //////////////////////////////

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

initApp()
