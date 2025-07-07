# ---------- Step 1: Build ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    COPY package.json package-lock.json* ./
    RUN npm install
    
    COPY . .
    
    RUN npm run build
    
    # ---------- Step 2: Run ----------
    FROM node:22-alpine AS runner
    
    WORKDIR /app
    
    COPY package.json package-lock.json* ./
    RUN npm install --omit=dev
    
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    
    # Removed line that causes error
    # COPY --from=builder /app/next.config.js ./next.config.js
    
    ENV NODE_ENV=production
    ENV PORT=3000
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    