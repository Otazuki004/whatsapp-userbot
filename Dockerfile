FROM node:18

WORKDIR /root/otazuki

COPY package.json ./
RUN apt update && apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon-x11-0 libpangocairo-1.0-0 libgbm1
RUN npm run build

COPY . .

CMD ["npm", "start"]
