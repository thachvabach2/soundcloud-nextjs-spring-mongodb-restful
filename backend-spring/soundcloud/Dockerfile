# Stage 1: Build the application
FROM gradle:8.7-jdk17 AS build
COPY --chown=gradle:gradle . /devtaycode/soundcloud
WORKDIR /devtaycode/soundcloud

#skip task: test
RUN gradle clean build -x test --no-daemon

# Stage 2: Run the application
FROM openjdk:17-slim
EXPOSE 8080
COPY --from=build /devtaycode/soundcloud/build/libs/*.jar /devtaycode/spring-boot-soundcloud.jar
ENTRYPOINT ["java", "-jar", "/devtaycode/spring-boot-soundcloud.jar"]