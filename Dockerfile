FROM FROM node:18

WORKDIR /root/otazuki

COPY . .

RUN npm install

CMD ["nede", "app"]
