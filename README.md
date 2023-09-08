# Thermal Centering Simulations

Welcome to the Thermal Centering Simulations! These simulations aims to showcase various strategies for centering in thermals by relying solely on a variometer, which measures your vertical speed in real-time.

## What you are seeing

- **Not Banking**: In this context, "not banking" means maintaining a 40-degree bank angle, which serves as the default or neutral state.
- **Banking**: When the glider decides to bank, it will switch to a 60-degree bank angle, representing a more aggressive turn into the thermal.

In the simulations, dots represent gliders circling within thermals. The objective is to understand how different banking decisions affect the glider's ability to stay within the thermal's core and gain altitude.

## View Online

The simulations can be accessed and interacted with via the following link: [https://thermal-sim.netlify.app/](https://thermal-sim.netlify.app/)

## Running the Project Locally

For those interested in running the simulation on their local machine, please follow the steps below:

### Pre-requisites

- Node.js and npm installed
- Clone the project repository

### Setup and Running

1. **Navigate to the Project Folder**: Open a terminal and navigate to the root folder where you've cloned the project.
2. **Install Dependencies**: Run the command `npm install` to install all the required dependencies listed in `package.json`.
3. **Start the Development Server**: Run `npm run dev` to start the Vite development server.
4. **Build for Production**: To create a production-ready build, execute `npm run build`.
5. **Code Linting**: To check the code for any linting issues, run `npm run lint`.
6. **Preview Build**: To preview the production build locally, execute `npm run preview`.

### Package Scripts Overview

- `dev`: Starts the Vite development server
- `build`: Compiles TypeScript files and builds the project for production using Vite
- `lint`: Executes ESLint for code quality checks
- `preview`: Runs the Vite preview command to preview the production build
