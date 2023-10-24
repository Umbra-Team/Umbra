# Build stage for React app
FROM node:18 AS react-build
WORKDIR /app
COPY code-editor-client/package*.json ./
RUN npm install
COPY code-editor-client/ ./
RUN npm run build

# Build stage for Express server
FROM node:18
WORKDIR /app
COPY code-editor-server/package*.json ./
RUN npm install
COPY code-editor-server/ ./
COPY --from=react-build /app/dist ./build

# Build the server
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]