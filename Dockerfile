# 1. Base image
FROM node:20.15.0-alpine AS base

# 2. Instalación de dependencias
FROM base AS deps
# libc6-compat es necesaria para algunas dependencias de Node en Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 3. Constructor (Builder)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- ARGUMENTOS DE CONSTRUCCIÓN (De tu .env.local) ---
# Next.js necesita estos valores durante el 'npm run build' 
# para inyectarlos en el JS que va al navegador.
ARG NEXT_PUBLIC_MQTT_WEBSOCKET_URL
ARG NEXT_PUBLIC_INFLUXDB_URL
ARG NEXT_PUBLIC_INFLUXDB_ORG
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_URL_USERS
ARG NEXT_PUBLIC_INFLUXDB_TOKEN

# --- CONVERTIR ARGs EN ENVs PARA EL PROCESO DE BUILD ---
ENV NEXT_PUBLIC_MQTT_WEBSOCKET_URL=$NEXT_PUBLIC_MQTT_WEBSOCKET_URL
ENV NEXT_PUBLIC_INFLUXDB_URL=$NEXT_PUBLIC_INFLUXDB_URL
ENV NEXT_PUBLIC_INFLUXDB_ORG=$NEXT_PUBLIC_INFLUXDB_ORG
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL_USERS=$NEXT_PUBLIC_API_URL_USERS
ENV NEXT_PUBLIC_INFLUXDB_TOKEN=$NEXT_PUBLIC_INFLUXDB_TOKEN

ENV NEXT_TELEMETRY_DISABLED 1

# Ejecutar el build de Next.js
RUN npm run build

# 4. Imagen de Producción (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Seguridad: No ejecutar como root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configurar permisos para la caché de Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar el output del modo standalone (reduce mucho el tamaño de la imagen)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# El comando para arrancar la app usando el server.js generado por standalone
CMD ["node", "server.js"]