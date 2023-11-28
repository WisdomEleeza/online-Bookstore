# Use the official Node.js 20.9.0 image as the base image
FROM node:21.2.0

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

COPY prisma /.prisma/

COPY .env ./

COPY tsconfig.json ./


# Copy the entire application code to the working directory
COPY . .

# Install Node.js dependencies based on the package.json and package-lock.json files
RUN npm install

# Run the build script specified in your package.json
RUN npm run build

RUN npx prisma generate

# Expose port 5000 to the outside world
EXPOSE 5000

# Set the default command to start the application
CMD ["npm", "run", "server"]
