# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

# Production stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

# Production server stage
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

RUN npm install --only=production serve

EXPOSE 4173

CMD ["npx", "serve", "-s", "dist", "-l", "4173"]
