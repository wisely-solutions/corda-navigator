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

FROM openjdk:17-alpine

WORKDIR /navigator

COPY --from=frontendBuilder /code/build public
COPY --from=backendBuilder /code/build/libs/corda-navigator-release-all.jar app.jar

ENTRYPOINT ["java", "-jar", "/navigator/app.jar"]