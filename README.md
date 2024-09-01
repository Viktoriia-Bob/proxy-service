# Proxy Service Project
This project is built using the NestJS framework and includes multiple services that
communicate via RabbitMQ. The project leverages WebSocket for broadcasting messages,
HTTP for API requests, and PostgreSQL with TypeORM for database management.


## Project Structure
- apps: Contains the different services such as proxy, read-api, and write-api.
- libs: Shared libraries used across different services.
- config: Configuration files for the project.
- docker-compose.yaml: Configuration for running the project using Docker.


## Prerequisites
- Node.js (version 16 or later)
- npm (version 7 or later)
- Docker and Docker Compose
- PostgreSQL database instance


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Viktoriia-Bob/proxy-service.git
    cd proxy-service
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```


## Running the Application

### Using npm

To run different parts of the application using npm scripts:

- Proxy Service:

```bash
npm run start
```

- Read API:

```bash
npm run start:read
```

- Write API:

```bash
npm run start:write
```

### Using Docker Compose

To run the entire application using Docker Compose, use the following command:

```bash
docker-compose up --build
```
This command will build the Docker images and start the services defined in the 
docker-compose.yaml file.


## Environment Variables
Configure environment variables by creating a .env file in the root directory, 
using .env.example as a reference.


## Libraries and Tools Used
- NestJS: A progressive Node.js framework for building efficient and scalable 
server-side applications.
- TypeORM: An ORM for TypeScript and JavaScript, used here with PostgreSQL.
- RabbitMQ: Used for communication between services.
- WebSocket: For broadcasting real-time updates.
- HTTP Requests: Standard RESTful APIs for communication.


## Additional Information
- Use `npm run build` to compile the TypeScript code into JavaScript.
- Lint your code using `npm run lint`.
- Run tests using `npm run test`.