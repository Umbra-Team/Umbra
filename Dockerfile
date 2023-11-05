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
COPY .env .env  
RUN npm run build

# Install CloudWatch Agent
# COPY config.json /opt/aws/amazon-cloudwatch-agent/etc/
# RUN curl https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -O
# RUN dpkg -i -E ./amazon-cloudwatch-agent.deb

EXPOSE 3001

CMD ["npm", "start"]