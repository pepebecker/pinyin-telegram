FROM node:dubnium-alpine as builder

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

# Install leveldown build dependencies
RUN apk add --update python make g++

# Install app dependencies
WORKDIR /app
COPY package.json .
RUN npm install --production

# Install pm2
RUN npm install pm2

FROM node:dubnium-alpine
WORKDIR /app

# bundle app files
COPY --from=builder /app ./
COPY index.js .
COPY ecosystem.config.js .

# Expose ports needed to use Keymetrics.io
EXPOSE 80 443 43554

CMD [ "./node_modules/.bin/pm2-runtime", "start", "ecosystem.config.js" ]
