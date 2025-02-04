FROM ghcr.io/puppeteer/puppeteer:21.4.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
RUN apt install -y nodejs
RUN apt install -y npm
WORKDIR /root/otazuki

COPY package*.json ./

RUN npm install
COPY . .
CMD ["npm", "start"]
