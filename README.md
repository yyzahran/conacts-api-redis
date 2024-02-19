<a name="readme-top"></a>
<h1 align="center">NodeJS and Redis App</h1>

  <p align="center">
    

  </p>
</div>

  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#setup">Setup</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>

## About The Project

This is an API for an app where a user can register/login and CRUD contacts.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This section is to walk you through the setup for running the automation tests.

### Prerequisites

You'll need NodeJS and a functioning Redis server to run this app.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/yyzahran/conacts-api-redis.git
   ```
2. Install requirements
   ```sh
   npm i
   ```
3. Update the parameters in `.env`

4. Run the command
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Setup

### Project Structure

- The controllers for auth and contacts can be found at `/controllers`
- Different error types are at `/errors`
- Middleware for authentication and error handling are at `/middleware`
- There are two routes for the app, `/auth` and `/contacts` that are at `/routes`
- Services include the Redis setup, including keys and types
- Helper methods are at `/services/utils.js`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Import the Postman collection at `contacts-api-redis.postman_collection.json` to Postman and start testing the endpoints.

## Contact

Youssef Zahran - youssefyzahran@gmail.com - [LinkedIn](https://www.linkedin.com/in/yzahran/)

Project link: [https://github.com/yyzahran/conacts-api-redis](https://github.com/yyzahran/conacts-api-redis)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
