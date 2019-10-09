# Noah
[![Build Status](https://travis-ci.org/deepakpathania/Noah.svg?branch=development)](https://travis-ci.org/deepakpathania/Noah) [![Coverage Status](https://coveralls.io/repos/github/deepakpathania/Noah/badge.svg)](https://coveralls.io/github/deepakpathania/Noah) ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

Noah is a **scheduling service** that allows you to register tasks for making an *outbound request* after a *recurring interval*.
- It allows you to configure the request to accept query params, headers and request body and accepts a human-readable interval to invoke the request.
- It exposes a REST API for CRUD on schedules backed with a MySQL database for persistence. Refer to API section below for details.

### Usage
Noah is supposed to be used as a self-hosted service for your scheduling needs. Here's how you can set it up.
1. After cloning, install the dependencies.
	```js
    npm i
    ```
2. Create a `.env` file in the root directory and add the following environment variables.

    ```
    MYSQL_HOST
    MYSQL_USER
    MYSQL_PASSWORD
    MYSQL_DB_NAME
    MYSQL_TEST_DB_NAME
    ```
3. Create the databases you have specified in the `.env` file. 
	```mysql
    CREATE DATABASE IF NOT EXISTS MYSQL_DB_NAME;
    ```
   You don't need to create the tables explicitly, `sails` does that for you based on the models when you lift the server.

3. Lift the server.
    ```js
    node app.js
    ```

4. Test whether the server was lifted properly by making a call to the health check endpoint : `{{url}}/knockknock`

### API
Noah exposes the following APIs to interact with the system.
1. **Create Schedule** - Allows you to register a schedule with the system.
    - Endpoint - `/v1/schedules`
    - Method - `POST`
    - Request Body:
      ```js
      {
        "request": {
          "url": "{{targetUrl}}",
          "method": "{{method}}",
          "data": {
            "params": {
                "key": "value"
            },
            "headers": {},
            "body": {}
          }
        },
        "period": {
          "every": 2,
          "interval": "{{interval}}"
        },
        "start": true,
        "storeResponseBody": true
      }
      ```
        - `request` is a required field. It includes the following required fields:
            - `url` (string)- specifies the target URL to be called.
            - `method` (string)- specifies the request method for calling the URL, eg. `GET`. 
    Accepts one of the following values `['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE']`
            - `data` (object) - specifies the request data to be sent with the request. Send `{}` in case of no data. Each data item is an object that accepts key-value pairs.

            **Note** - `body` accepts only raw format for now with json data, `application/json` header is added implicitly.
 
        - `period` is a required field. It includes the following required fields:
          - `every` (integer) - represents the frequency of invocation, for eg. every 2 hours.
          - `interval` (string) - represents the time interval between invocations.
    Accepts one of the following values `['hours', 'days', 'weeks', 'months']`

        - `start` is an optional boolean field, false by default. Represents whether or not a request should be made at the time of registering the schedule.

        - `storeResponseBody` is an optional boolean field, false by default. Represents whether or not the response body should be stored while making request.
    - Returns - unique identfier for the created schedule.
      ```js
      {
        "data": {
          "id": "88b6ba474b76df6ab866111fc3284ab0"
        },
        "meta": {}
      }
      ``` 
 
2. **Update Schedule** - Allows updating the existing schedules based on their unique identifiers.
  - Endpoint - `/v1/schedules/{{identifier}}`
  - Method - `PUT`
  - Request body is similar to create schedule with the following exceptions:
    - `start` is not accepted.
    - In case you want to edit a `request`, `storeResponseBody` or `period` field, entire object needs to be sent.
    For example, for updating period from every 2 hours, to every 3 hours, request body would be:
      ```js
      {
        "period": {
          "every": 3,
          "interval": "hours"
        }
      }
      ```
      **Note** Period changes would start reflecting from next cycle onwards.

3. **Get all schedules** - Fetches all active schedules.
  - Endpoint - `/v1/schedules`
  - Method - `GET`
  - Returns - An array of all active schedules.
    ```js
    {
      "data": [
        {
          "identifier": "64a623fd6b35f435dfb5fde03df2d4ed",
          "nextRunningTime": 1570435680068,
          "request": {
            "url": "http://localhost:3000/v1/blogs/29",
            "method": "GET",
            "data": {
              "params": {},
              "headers": {},
              "body": {}
            }
          },
          "period": {
            "every": 2,
            "interval": "hours"
          },
          "storeResponseBody": true
        }
      ],
      "meta": {
        "filter": "active"
      }
    }
    ```

4. **Get run history of schedule** - Fetches all the run histories for the specified schedule.
  - Endpoint - `/v1/schedules/{{identifier}}`
  - Method - `GET`
  - Returns - An array of run history for the schedule.
    ```js
    {
      "data": [
        {
          "id": 1,
          "runTime": 1570428480068,
          "responseStatusCode": 200,
          "responseBody": "hello i am a response body."
        }
      ],
      "meta": {}
    }
    ```

5. **Delete a schedule** - Marks a schedule as inactive.
  - Endpoint - `/v1/schedules/{{identifier}}`
  - Method - `DELETE`


### Contributing
Please refer to the [issue tracker](https://github.com/deepakpathania/Noah/issues) in case you'd like to contribute. Also, feel free to open feature requests/bug reports in case you face any.

