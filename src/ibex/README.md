# Ibex 

As of now we have the **Auth API**, **Account API**, **Lightning Address API** in place

## Prerequisites

Before setting up the project, ensure you have the following prerequisites installed on your machine:

- Node.js (version 20.4.0)
- NPM (Node Package Manager)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/lnflash/ibex-plugin.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ibex-plugin
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Customization

Feel free to customize the project structure based on the specific needs of your application. You can add additional directories, split files into subdirectories, or introduce other conventions that fit your development process. Just ensure to update the relevant configurations and scripts accordingly.

## Configuration

The project require some configuration to run properly. Check for the following files and make necessary adjustments:

- `.env.example` file, copy it and rename it to `.env`, then fill in the necessary values.


## Running the Project

Once you have completed the setup and configuration, it's time to run the project:

```bash
npm start-ibex
```

This command will start the server, and the project will be accessible at `http://localhost:8760/`. You can change the port number in the `.env` file if necessary.

