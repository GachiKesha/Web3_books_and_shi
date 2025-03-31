# Cloud Microservices Architecture Documentation

## General Description

The system consists of a set of microservices that ensure data storage, processing, and results delivery to users. Inter-service communication is handled via RabbitMQ (the primary message broker). Each service is implemented using Nest.js, and data is stored in PostgreSQL.

## Description of Services

### 1. API Gateway
- **Purpose:** Receives requests from the mobile application, routes them to the appropriate services, and returns results
- **Interaction:** HTTP REST API with the client; RabbitMQ with other services

### 2. Data Storage Microservice
- **Purpose:** Receives raw data from the API Gateway and saves it in PostgreSQL
