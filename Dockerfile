FROM node:20.9.0
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY  package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["sh", "-c", "npm run" ]