
# Online HAC Compiler

The Online HAC Compiler is a web-based platform designed to provide Hadassah Academic College students with a local code compilation environment, eliminating the need to rely on the college's server infrastructure.

## Features

- **In-Browser Code Editing**: Utilizes the Monaco Editor for a rich code editing experience.
- **Frontend**: Built with React and TypeScript Mantine (UI library).
- **Backend**: Implemented using Node.js to handle compilation requests.
- **Compiler Service**: Includes a Node.js server that manages code execution in a CentOS 8 environment with GCC 8.5.
- **Docker Integration**: Employs Docker to containerize the frontend, backend, and compiler services.

## Getting Started

To set up and run the project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/YanivGabay/Online-HAC-Compiler.git
   cd Online-HAC-Compiler
   ```

2. **Run the Application**:

   Ensure you have [Docker](https://www.docker.com/) installed. Then, start the application using:

   ```bash
   docker-compose up --build
   ```

   This will build and start the following containers:
   - **Frontend**: A React + TypeScript application served by Nginx.
   - **Backend**: A Node.js API for handling compilation requests.
   - **Compiler**: A Node.js server running in a Docker container, replicating CentOS 8 with GCC 8.5.

3. **Access the Application**:

   Open your browser and navigate to `http://localhost:3000` to use the Online HAC Compiler.

## Project Structure

- **compiler/**: Contains a Node.js server and Docker configuration for the GCC-based code execution environment.
- **backend/**: Implements the Node.js API that handles compilation requests and communicates with the compiler service.
- **frontend/**: Includes the React + TypeScript project files and Monaco Editor configuration for the user interface.
- **docker-compose.yml**: Configures the multi-container application setup, tying together the frontend, backend, and compiler environments.

## Future Improvements/Plans

- **User Authentication**: Implement user accounts to save and manage code snippets.
- **Loading Files**: Allow users to load and save code files from their local machine.
- **AI Assistance**: Integrate AI-based code completion and error detection features.
- **Premium Features/Donations**: Offer premium features or donation options to support the project.
- **Hosting**: Deploy the application to a cloud platform for public access, a VPS like ocean digital or AWS.
---

