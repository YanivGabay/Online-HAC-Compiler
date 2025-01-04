FROM rockylinux:8

# Install dependencies: curl, gcc, g++, make
RUN dnf install -y curl gcc gcc-c++ make

# Install Node.js from NodeSource
RUN curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && dnf install -y nodejs

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
