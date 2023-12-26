FROM node:18-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install dependencies based on the preferred package manager

COPY ./frontend ./

RUN npm install
RUN npm run build
ENV PUBLIC_URL=/

EXPOSE 3000 8080

CMD ["npm", "start"]

