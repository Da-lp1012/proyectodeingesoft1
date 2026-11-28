FROM node:22-alpine

WORKDIR /app

# Primero solo los manifiestos: mientras no cambien las dependencias, Docker
# reutiliza la capa de "npm ci" y las reconstrucciones son rápidas (cache de capas).
COPY package.json package-lock.json ./

# npm ci instala exactamente lo que dice package-lock.json (reproducible y falla
# si el lock no coincide con package.json); npm install podría variar versiones.
RUN npm ci

# Recién ahora el código; en desarrollo además se monta como volumen desde compose.
COPY . .

EXPOSE 5173
# --host 0.0.0.0: sin esto Vite solo escucha dentro del contenedor y no se puede abrir desde el navegador.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
