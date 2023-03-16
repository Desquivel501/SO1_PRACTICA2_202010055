# Version node
FROM node:19.7

#Creacion del directorio de trabajo
WORKDIR /app

#Copiando archivos con las librerias necesarias
COPY package.json ./
COPY package-lock.json ./

#Comando para instalar dependencias
RUN npm install

#Copiar las dependencias y archivos
COPY . .

#Puerto a exponer
EXPOSE 3000

CMD ["npm", "start"]