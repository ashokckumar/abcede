FROM node:18-alpine
 
WORKDIR /usr/src/app
COPY package*.json ./
# install only production deps in image
RUN npm ci --only=production
 
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]

