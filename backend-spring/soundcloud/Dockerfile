# Stage 1: Build the application
FROM gradle:8.7-jdk17 AS build
COPY --chown=gradle:gradle . /devtaycode/soundcloud
WORKDIR /devtaycode/soundcloud

#skip task: test
RUN gradle clean build -x test --no-daemon

# Stage 2: Run the application
FROM openjdk:17-slim

# instal ffmpeg (process track)
# instal curl (healthcheck)
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8081
COPY --from=build /devtaycode/soundcloud/build/libs/*.jar /devtaycode/spring-boot-soundcloud.jar
ENTRYPOINT ["java", "-jar", "/devtaycode/spring-boot-soundcloud.jar"]