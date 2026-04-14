FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Copy seeds to dist
RUN cp -r seeds dist/seeds

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
