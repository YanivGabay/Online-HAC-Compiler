# Online HAC Compiler

A web-based C/C++ compiler designed for Hadassah Academic College students. This project provides a local\online compilation environment, eliminating dependency on the college's server infrastructure.

## Project Overview

This is version 0.1.0 of the Online HAC Compiler. The initial version focuses on establishing the core functionality and basic UI components.

### Tech Stack

- **Frontend**: 
  - React with TypeScript
  - [Mantine v7](https://mantine.dev/) for UI components
  - Monaco Editor for code editing
  - Vite for development and building

- **Backend**: 
  - Node.js with Express
  - Rate limiting and error handling
  - Request queue management

- **Compiler Service**: 
  - CentOS 8 with GCC 8.5.0.22 Red Hat, exatcly as the college's server
 - Input/Output handling

### Features

- **Modern UI**: Clean, responsive interface using Mantine components
- **Theme Support**: Light/Dark mode switching
- **Code Editor**: Full-featured Monaco editor with syntax highlighting
- **Compilation**: Real-time compilation status and output
- **Docker Integration**: Containerized services for easy deployment

## Development

1. **Clone and Setup**:
   ```bash
   git clone https://github.com/YanivGabay/Online-HAC-Compiler.git
   cd Online-HAC-Compiler
   ```

2. **Development Mode**:
   ```bash
   docker compose up
   ```
   Access at `http://localhost:3000`
   
   Features:
   - Hot reloading

3. **Production Build**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```
   You can create your own docker-compose.prod.yml file to fit your needs.
   Optionally, you can use the docker-compose.prod.yml as a github action to deploy to a VPS.
   I personally use a VPS from [ocean digital](https://ocean.digital/) and deploy the docker-compose.prod.yml 
   through github actions (ssh) to the VPS.



## Environment Setup

- **Development**:
  - Frontend: Port 3000 (Vite server on 5173)
  - Backend API: Port 3001
  - Compiler Service: Port 3002

- **Production**:
  - Frontend: Port 80
  - Backend API: Port 3001
  - Compiler Service: Port 3002
  - Automatic container restart

## Future Plans

- Supabase & Drizzle ORM
- User authentication
- Code snippet saving
- File upload/download
- AI-powered code assistance
- Premium features

## Contributing

This is a personal project for HAC students. Feel free to open issues or submit PRs if you'd like to contribute.

---

Built with ❤️ by Yaniv Gabay

