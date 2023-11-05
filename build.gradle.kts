import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.9.0"
    id("java")
    application
    id("com.github.johnrengelman.shadow") version "7.0.0"
}

group = "solutions.wisely"
version = System.getenv("VERSION") ?: "SNAPSHOT"

repositories {
    mavenCentral()
    jcenter()
    maven("https://software.r3.com/artifactory/corda")
}

dependencies {
    implementation("ch.qos.logback:logback-classic:1.3.11")
    implementation("commons-codec:commons-codec:1.16.0")
    implementation("org.reflections:reflections:0.10.2")
    implementation("io.ktor:ktor-server-core:2.3.5")
    implementation("io.ktor:ktor-server-netty:2.3.5")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.5")
    implementation("io.ktor:ktor-serialization-jackson:2.3.5")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.15.3")
    implementation("io.ktor:ktor-server-status-pages:2.3.5")
    implementation("org.jetbrains.exposed:exposed-core:0.35.1")
    implementation("org.jetbrains.exposed:exposed-dao:0.35.1")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.35.1")
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:4.11.0")
    implementation("net.corda:corda-rpc:4.9.8") {
        exclude(group = "co.paralleluniverse")
    }

    testImplementation("io.ktor:ktor-server-tests:2.3.5")
}

application {
    mainClass = "solutions.wisely.corda.navigator.MainKt"
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}

java {
    targetCompatibility = JavaVersion.VERSION_1_8
    sourceCompatibility = JavaVersion.VERSION_1_8
}
