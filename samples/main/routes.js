const routes = [
    {
        path: /\/user/,
        regex: true,
        method: 'get',
        defaultResponse: {
            status: 200,
            body: [
                { uid: 'cf1f9080-daf5-11e7-9296-cec278b6b50a', username: 'janedoe', firstName: 'jane', lastName: 'doe' },
                { uid: 'b33f39a8-daf8-11e7-9296-cec278b6b50a', username: 'johndoe', firstName: 'john', lastName: 'doe' }
            ]
        }
    },
    {
        path: '/user/1',
        method: 'get',
        defaultResponse: {
            status: 200,
            body: { uid: 'cf1f9080-daf5-11e7-9296-cec278b6b50a', username: 'jdoe', firstName: 'jane', lastName: 'doe' }
        }
    },
    {
        path: '/user',
        method: 'post',
        requiredFields: ['username', 'firstName', 'lastName'],
        requiredFieldsResponse: {
            status: 400,
            body: { error: 'Required field validation. The required fields are: username, firstName, and lastName'}
        },
        defaultResponse: {
            status: 201,
            body: { message: 'created'}
        },
        responseMappings: [
            {
                request: {
                    body: { username: 'jdoe', firstName: 'jane', lastName: 'doe' }
                },
                response: {
                    status: 201,
                    body: { uid: 'cf1f9080-daf5-11e7-9296-cec278b6b50a', username: 'jdoe', firstName: 'jane', lastName: 'doe' }
                }
            },
            {
                request: {
                    body: { username: 'jdoe' }
                },
                response: {
                    status: 400,
                    body: { error: 'Required field validation. Missing fields: firstName, lastName'}
                }
            }
        ]
    }
]

module.exports = routes;