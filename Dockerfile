FROM node:16

RUN npm install -g cypress

RUN groupadd -r node && useradd -r -g node node

RUN mkdir -p /root/.cache/Cypress && chown -R node:node /root/.cache

WORKDIR /e2e

COPY . .

RUN npm install

USER node

CMD ["npm", "test"]