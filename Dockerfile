FROM node:latest

WORKDIR .

COPY /dist .

EXPOSE 8080

CMD ["node","main.js"]
