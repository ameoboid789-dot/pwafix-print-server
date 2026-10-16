FROM mcr.microsoft.com/playwright:v1.58.0-noble
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.mjs ./
ENV PORT=3000
CMD ["npm","start"]
