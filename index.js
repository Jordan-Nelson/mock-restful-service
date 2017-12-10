const deepEqual = require('deep-equal');
const colors = require('colors');

const server = (routes, config) => {

    return (req, res, next) => {

        if (config && config.displayRoot && req.path === '/' && req.method.toLowerCase() === 'get') {
            return res.status(200).json(routes);
        }

        const log = (req, res) => {
            if (!config || config.verbose === undefined || config.verbose === true) {
                const method = req.method.toUpperCase()[req.method] || req.method.toUpperCase();
                const path = req.path.toUpperCase();
                const status = res.status.toString()[`s${res.status.toString()[0]}`] || res.status.toString();
                console.log(`${'INFO: '.cyan} ${new Date().toISOString()} ${method} ${path} ${status}`);
            }
        }
        const warn = (message) => {
            console.log(`${'WARN: '.yellow} ${new Date().toISOString()} ${message.yellow}`);
        }

        const matchPathAndMethod = (req, route) => {
            const methodMatch = req.method.toLowerCase() === route.method.toLowerCase();
            if (!methodMatch) { return false; }
            const exactPathMatch = (req.path === route.path);
            if (!exactPathMatch && !route.regex) { return false; }
            const regexPathMatch = (req.path.match(route.path))
            if (!regexPathMatch && route.regex) { return false; }
            return true;
        }

        const hasRequiredFieldsError = (req, route) => {
            return route.requiredFields && !route.requiredFields.every(elem => Object.keys(req.body).indexOf(elem) > -1); 
        }

        const containsResponseMappings = (route) => {
            return route.responseMappings && route.responseMappings.length;
        }

        const buildResponse = (req, res, status, body) => {
            returned = true;
            log(req, { status });
            return res.status(status).json(body);
        }

        let returned = false;
        routes.forEach(route => {
            if (matchPathAndMethod(req, route)) {
                if (hasRequiredFieldsError(req, route)) {
                    if (route.requiredFieldsResponse.status && route.requiredFieldsResponse.body) {
                        return buildResponse(req, res, route.requiredFieldsResponse.status, route.requiredFieldsResponse.body);
                    } else {
                        let warning = 'if requiredFields are specified, requiredFieldsResponse must contain a status and body';
                        warn(warning);
                        return buildResponse(req, res, 500, {warning});
                    }
                } else {
                    
                }
                if (containsResponseMappings(route)) {
                    route.responseMappings.forEach((mapping) => {
                        if (deepEqual(mapping.request.body, req.body)) {
                            return buildResponse(req, res, mapping.response.status, mapping.response.body)
                        }
                    })
                }
                if (!returned) {
                    return buildResponse(req, res, route.defaultResponse.status, route.defaultResponse.body);                    
                }
            }
        });

        if (!returned) {
            if (config && config.notFound) {
                if (!config.notFound.status || !config.notFound.body) {
                    let warning = 'the notFound config must contain a status and a body';
                    warn(warning);
                    return buildResponse(req, res, 500, {warning});
                } else {
                    return buildResponse(req, res, config.notFound.status, config.notFound.body);      
                }
            }
        } else {
            next();
        }

    }
}

colors.setTheme({
    GET: 'green',
    POST: 'yellow',
    PUT: 'orange',
    DELETE: 'red',
    s2: 'green',
    s3: 'yellow',
    s4: 'red',
    s5: 'red',
});

module.exports = server;