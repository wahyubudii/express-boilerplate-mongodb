import express from 'express'
import config from '../../config/config.js'
import docsRoute from './docs/docs.route.js'
import authRoute from './auth/auth.route.js'
import userRoute from './users/users.route.js'

const router = express.Router()

const defaultRouter = [
    {
        path: "/auth",
        route: authRoute
    },
    {
        path: "/users",
        route: userRoute
    }
]

const devRoutes = [
    {
        path: "/docs",
        route: docsRoute
    }
]

defaultRouter.forEach((route) => {
    router.use(route.path, route.route)
})

if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route)
    })
}

export default router