FROM node:20-alpine
WORKDIR /app

# 1. Manifests
COPY package*.json ./
RUN npm ci                       

# 2. Prisma
COPY prisma ./prisma
RUN npx prisma generate

# 3. Code + build
COPY . .
RUN npm run build                  
ENV NODE_ENV=production
EXPOSE 10000

CMD ["sh", "-c", "npm run migrate:deploy && exec npm start"]