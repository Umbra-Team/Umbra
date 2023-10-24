# Use an official Node runtime as base image
FROM node:18

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
