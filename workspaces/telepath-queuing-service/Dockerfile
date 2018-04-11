FROM node:8
RUN mkdir /usr/src/telepath-queuing-service
WORKDIR /usr/src/telepath-queuing-service
COPY package.json /usr/src/telepath-queuing-service
RUN npm install
COPY . /usr/src/telepath-queuing-service
EXPOSE 3000
CMD [ "npm", "start" ]
