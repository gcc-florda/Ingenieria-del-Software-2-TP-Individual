FROM node:lts-alpine AS app
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
CMD ["node", "app.js"]