# Build stage for React App
FROM node:18 as react-build
WORKDIR /app
COPY code-editor-client/package*.json ./
RUN npm install
COPY code-editor-client/ ./
RUN printenv
RUN npm run build

# Build stage for Express server
FROM node:18 as express-server
WORKDIR /app
COPY code-editor-server/package*.json ./
RUN npm install
COPY code-editor-server ./
COPY --from=react-build /app/dist ./build
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]