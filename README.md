# Angular Shift Controller

A comprehensive worker shift management system built with Angular. Features include user registration, login, token-based authentication, role-based navigation, and secure API integration.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- User registration and login with JWT authentication
- Role-based routing and navigation
- Token storage and validation
- Dynamic components for login and logout
- CanDeactivate guards for secure logout management
- Schedule and User management

## Technologies Used

- Angular
- TypeScript
- RxJS
- Angular Router
- Angular Route Guards
- Bootstrap
- JSON Web Tokens (JWT)
- RESTful APIs

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/angular-user-management.git
   ```
2. Navigate to the project directory
   cd client
3. Install dependencies
   npm install
4. Run the development server
   ng serve

5. Navigate to https://localhost:4200

## Usage

1. Register a new user via the registration form.
2. Log in using your credentials.
3. Access admin or worker dashboards based on your role.
4. Logout functionality clears tokens and secures the application.

# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.15.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
