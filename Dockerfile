# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Enable BuildKit for faster builds
ENV DOCKER_BUILDKIT=1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install && npm install -g npm@latest

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3009

# Define the command to run your Node.js application
CMD ["npm", "start"]
