## Use Node Slim image
FROM node:22-slim

WORKDIR /app

## Copy source code
COPY . .

RUN npm install -g @angular/cli
RUN npm install
RUN npm run build

EXPOSE 4000

## Start the application
CMD ["node", "dist/server/server.mjs"]
