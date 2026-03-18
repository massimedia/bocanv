import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const redisUrl = process.env.REDIS_URL
const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: redisUrl || undefined,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:8000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000',
      authCors: process.env.AUTH_CORS || 'http://localhost:8000',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:9000',
    path: '/app',
  },
  modules: [
    ...(redisUrl
      ? [
          {
            resolve: '@medusajs/medusa/event-bus-redis',
            options: { redisUrl },
          },
          {
            resolve: '@medusajs/medusa/caching',
            options: {
              providers: [
                {
                  resolve: '@medusajs/caching-redis',
                  id: 'caching-redis',
                  is_default: true,
                  options: { redisUrl },
                },
              ],
            },
          },
          {
            resolve: '@medusajs/medusa/workflow-engine-redis',
            options: {
              redis: { redisUrl },
            },
          },
        ]
      : []),
    ...(cloudinaryConfigured
      ? [
          {
            resolve: '@medusajs/medusa/file',
            options: {
              providers: [
                {
                  resolve:
                    '@tsc_tech/medusa-plugin-cloudinary/providers/file-cloudinary',
                  id: 'cloudinary',
                  options: {
                    apiKey: process.env.CLOUDINARY_API_KEY,
                    apiSecret: process.env.CLOUDINARY_API_SECRET,
                    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                    folderName: 'medusa',
                    secure: true,
                  },
                },
              ],
            },
          },
        ]
      : []),
  ],
})
