FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src

# Mount a volume at /app/data in production so the SQLite file survives
# redeploys, e.g.: docker run -v fnb_data:/app/data ...
ENV DATABASE_PATH=/app/data/fnb.db
ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/server.js"]
