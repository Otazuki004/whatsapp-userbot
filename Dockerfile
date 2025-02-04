FROM node:18

WORKDIR /root/otazuki

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["node", "app/index.js"]

