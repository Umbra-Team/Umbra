# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 1234

# Define the command to run the app
CMD [ "npm", "start" ]