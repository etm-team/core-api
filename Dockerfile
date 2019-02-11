FROM node:10

WORKDIR /var/build
COPY src ./src
COPY package.json package.json package-lock.json ./

RUN npm install && npm run build

FROM keymetrics/pm2:10-slim

WORKDIR /var/service
COPY --from=0 /var/build/dist .
COPY --from=0 /var/build/package.json .
COPY --from=0 /var/build/package-lock.json .

RUN npm install --production

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["etm-api"]
