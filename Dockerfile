## Use Node Slim image
FROM node:18-slim

WORKDIR /app

## Copy source code
COPY . .

RUN npm install -g @angular/cli
RUN npm install
RUN ng build && ng run utm2023-frontend:server

EXPOSE 4000

## Start the application
CMD ["node", "dist/utm2023-frontend/server/main.js"]
