FROM node:18.12.1

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

CMD ["node", "--watch", "app.js"]