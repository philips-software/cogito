FROM node:9
LABEL description="Faucet for private blockchain"
RUN mkdir /usr/src/faucet
WORKDIR /usr/src/faucet
COPY package.json /usr/src/faucet
COPY . /usr/src/faucet
RUN npm install
EXPOSE 3001
CMD [ "npm", "start-prod" ]
