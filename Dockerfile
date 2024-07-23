FROM node:22-alpine
WORKDIR /usr/local/app

COPY . . 
RUN npm i

RUN npx prisma db push 

CMD ["npm", "run", "dev"]