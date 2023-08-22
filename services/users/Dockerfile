FROM node:18.12.1

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["nodemon", "--ignore", "node_modules/", "--exec", "app.js"]