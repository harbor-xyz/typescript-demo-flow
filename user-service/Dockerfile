# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

ENV PORT=3000

EXPOSE $PORT

# Start the app when the container is run
CMD ["npm", "start"]
