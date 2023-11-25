# Project setup

-   npm init -y

# devDependencie (npm install -D)

- typescript
- tsc-watch
- eslint
- prettier
- eslint-config-prettier
- eslint-plugin-prettier
- @typescript-eslint/parser
- @typescript-eslint/eslint-plugin
- @types/node
- @types/express
- @types/compression
- @types/cors
- @types/morgan

# dependencies (npm install)
- express
- dotenv
- mongoose
- compression (For compressing request)
- cors
- morgan
- helmet
- envalid
- npm install module-alias (this must be installed and include the "Path" in the package.json as moduleAlias)
 "_moduleAliases": {
    "@/resources": "dist/resources",
    "@/utils": "dist/utils",
    "@/middleware": "dist/middleware"
  }

# Configuring File for typescript
- npx tsc --init
- baseUrl: './src' // all files are going to be in the source folder
- Outdir: 'dist'
- "paths": {
      "@/resources/*" : ["resources/*"], this is where controllers, models etc will be
      "@/utils/*" : ["utils/*"],
      "@/middleware/*" : ["middleware/*"],
    },  

    - index.ts is the entry point
    - app.ts is where everything is going to be setup like initializing mongodb etc...