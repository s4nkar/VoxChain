FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]