FROM node:18

WORKDIR /root/otazuki

COPY package.json ./
RUN npm run build

COPY . .

CMD ["npm", "start"]
