FROM node:23-alpine
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm rebuild bcrypt --build-from-source
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start"]