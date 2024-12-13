FROM node:16

RUN npm install -g cypress

WORKDIR /e2e

COPY . .

RUN npm install

CMD ["npm", "test"]