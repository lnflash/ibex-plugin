# Stage 1: Build the Node.js application
FROM node:20
WORKDIR /app

# Copy package.json and package-lock.json to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port used by the application
EXPOSE 4000

RUN chmod +x /app/entrypoint.sh

# Start the Node.js application
ENTRYPOINT ["/app/entrypoint.sh"]
