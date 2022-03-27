FROM node:17-slim
RUN apt-get update && apt-get install git -y

WORKDIR /srv/bot
EXPOSE 8000
ENV API_PORT=8000
ENV API_HOST=0.0.0.0

COPY . .
RUN yarn --immutable

CMD ["yarn", "start"]
