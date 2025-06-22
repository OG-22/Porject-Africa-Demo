# Use Node.js as base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the port Cloud Run will use
EXPOSE 8080

# Start the server (Cloud Run will set $PORT to 8080)
CMD ["node", "server.js"]
