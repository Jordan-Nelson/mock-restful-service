# Mock Restful Service
Simple to use express middleware for creating mock REST services. Define routes (sets of requests and responses) as json objects and configure the express middleware to use the routes.

## Features
* Create custom responses for each route (request path and method)
* Create custom responses based on the requests body (headers coming soon!) as well as creating a default response
* URL (request path) pattern matching with Regex
* Create required fields for a request body and specify response status/body if fields are not met

* Specify '404 Not Found' response (status/body) OR pass through if route is not founc

## Sample Use
Below is the most basic use of mock-restful-service

```javascript
const express = require('express');
const mockRestfulSerice = require('mock-restful-service');

const app = express();

const routes = [
        {
            path: '/sample',
            method: 'get',
            defaultResponse: {
                status: 200,
                body: { message: 'Hello World!' }
            }
        },
    ]

app.use(mockRestfulSerice(routes));

app.listen(8002, () => {
    console.log('server now listening on 8002. Open http://localhost:8002');
});

```

## Route Definition

| key                    | Type(s)        | Required?   | Description                        |
| ---------------------- |:---------------|:-----------:|------------------------------------|
| path                   | string, regex  | true        | Partial URL of request             |
| regex                  | boolean        | false       | True if using regex for path param |
| method                 | string         | true        | HTTP method (get, post, put, delete, etc.) |
| requiredFields         | Array          | false       | An array of the required fields (not applicable to get method) |
| requiredFieldsResponse | Object         | false       | The status and the body if any of the required fields are missing |
| defaultResponse        | Object         | true        | The status and body if none of the responseMappings are matched (see below) |
| responseMappings       | Array          | false       | An array of request/response pairs. If the request is received, then the response will be returned |

### Example

```javascript
{
        path: '/user',
        regex: false,
        method: 'post', 
        requiredFields: ['username'],
        requiredFieldsResponse: {
            status: 400,
            body: { error: 'Required field validation'}
        },
        defaultResponse: {
            status: 201,
            body: { message: 'created'}
        },
        responseMappings: [
            {
                request: {
                    body: { username: 'jdoe' }
                },
                response: {
                    status: 400,
                    body: { error: 'this username already exists' }
                }
            }
        ]
    },
```