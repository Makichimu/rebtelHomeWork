FROM node:16

RUN npm install -g cypress

RUN mkdir -p /root/.cache/Cypress && chown -R node:node /root/.cache

WORKDIR /e2e

COPY . .

RUN npm install

USER node

CMD ["npm", "test"]