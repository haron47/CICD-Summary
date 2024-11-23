FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the application JAR file
COPY build/libs/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]