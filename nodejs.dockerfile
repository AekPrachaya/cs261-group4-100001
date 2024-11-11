
# Use the official Node.js image from Docker Hub
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present) into the container
COPY package*.json ./

# Install the dependencies for the Node.js app
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the app using npm
CMD ["npm", "run", "dev"]
