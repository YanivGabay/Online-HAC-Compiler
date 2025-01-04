# Online HAC Compiler

The Online HAC Compiler is a web-based platform designed to provide Hadassah Academic College students with a local code compilation environment, eliminating the need to rely on the college's server infrastructure.

## Features

- **In-Browser Code Editing**: Utilizes the Monaco Editor for a rich code editing experience.
- **Frontend**: Built with React and TypeScript Mantine (UI library).
- **Backend**: Implemented using Node.js to handle compilation requests.
- **Compiler Service**: Includes a Node.js server that manages code execution in a CentOS 8 environment with GCC 8.5.
- **Docker Integration**: Employs Docker to containerize the frontend, backend, and compiler services.

## Getting Started

To set up and run the project, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YanivGabay/Online-HAC-Compiler.git
   cd Online-HAC-Compiler
   ```

2. **Development Setup**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```
   Access the application at `http://localhost:3000`

3. **Production Deployment**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
   Access the application at `http://your-domain` or `http://your-ip`

## Environment Configuration

- **Development**:
  - Frontend runs on port 3000
  - Backend runs on port 3001
  - Compiler service runs on port 3002

- **Production**:
  - Frontend runs on port 80 (HTTP)
  - Backend runs on port 3001
  - Compiler service runs on port 3002
  - Includes automatic container restart

## Project Structure

- **compiler/**: Contains the GCC-based code execution environment
- **backend/**: Implements the Node.js API for compilation requests
- **frontend/**: React + TypeScript project with Monaco Editor
- **docker-compose.dev.yml**: Development environment configuration
- **docker-compose.prod.yml**: Production environment configuration

## Future Improvements/Plans

- **User Authentication**: Implement user accounts to save and manage code snippets
- **Loading Files**: Allow users to load and save code files from their local machine
- **AI Assistance**: Integrate AI-based code completion and error detection features
- **Premium Features/Donations**: Offer premium features or donation options to support the project
- **Hosting**: Deploy the application to a cloud platform for public access, a VPS like ocean digital or AWS

---

