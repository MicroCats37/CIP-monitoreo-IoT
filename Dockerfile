# Usar Node.js 20 como base
FROM node:20.15.0

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto al contenedor
COPY . .

# Construir la aplicación Next.js en modo producción
RUN npm run build

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]