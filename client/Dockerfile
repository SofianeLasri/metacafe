FROM node:20

WORKDIR /app

COPY ./client ./client

RUN cd ./client && npm install

COPY stack.env ./client/.env

WORKDIR /app/client

CMD ["npm", "run", "dev:host"]
