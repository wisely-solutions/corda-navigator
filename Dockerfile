FROM node:20-alpine as frontendBuilder

COPY frontend /code
WORKDIR /code

RUN ls .
RUN npm install
RUN npm run build

FROM openjdk:17-alpine as backendBuilder

WORKDIR /code

COPY . /code

ENV VERSION release

RUN ./gradlew shadowJar

FROM adoptopenjdk/openjdk8:alpine-slim

WORKDIR /navigator

ENV JAVA_OPTS "-Xms128m -Xmx128m"

COPY --from=frontendBuilder /code/build public
COPY --from=backendBuilder /code/build/libs/corda-navigator-release-all.jar app.jar

ENTRYPOINT [ "java", "-jar", "/navigator/app.jar" ]