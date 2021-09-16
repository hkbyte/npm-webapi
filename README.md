# @hkbyte/webapi

> **A WebAPI oriented NodeJS server**

**Features :**

-   Built-in validation support
-   Multipart/Form-data support
-   HTTP friendly errors
-   Express middleware support
-   Built-in typescript declarations

<br>

**Let's Create Server :**

```ts
import { WebApiServer } from '@hkbyte/webapi'

const port = 3000
const server = new WebApiServer(port)

server.start().then((port) => {
    console.log(`Server listening on port: ${port}`)
})
```

<br>
WebApiServer options:

```ts
const server = new WebApiServer(port, {
    cors?: boolean, // enable cors, default false
    corsOptions?: {
            origin?: boolean | string | RegExp | (string | RegExp)[] | CustomOrigin; // default *
            methods?: string | string[]; // default: ['GET','HEAD','PUT','PATCH','POST','DELETE']
            allowedHeaders?: string | string[];
            exposedHeaders?: string | string[];
            credentials?: boolean;
            maxAge?: number;
            preflightContinue?: boolean; // default false
            optionsSuccessStatus?: number; // default 204
    },
    helmet?: boolean, // apply express-helmet plugin, default false,
    helmetOptions?: {
        contentSecurityPolicy?: boolean | IHelmetContentSecurityPolicyConfiguration;
        dnsPrefetchControl?: boolean | IHelmetDnsPrefetchControlConfiguration;
        featurePolicy?: IFeaturePolicyOptions;
        frameguard?: boolean | IHelmetFrameguardConfiguration;
        hidePoweredBy?: boolean | IHelmetHidePoweredByConfiguration;
        hpkp?: boolean | IHelmetHpkpConfiguration;
        hsts?: boolean | IHelmetHstsConfiguration;
        ieNoOpen?: boolean;
        noCache?: boolean;
        noSniff?: boolean;
        referrerPolicy?: boolean | IHelmetReferrerPolicyConfiguration;
        xssFilter?: boolean | IHelmetXssFilterConfiguration;
        expectCt?: boolean | IHelmetExpectCtConfiguration;
        permittedCrossDomainPolicies?: boolean | IHelmetPermittedCrossDomainPoliciesConfiguration;
    }
})
```

<br>

**Register Express Middleware :**

```ts
const server = new WebApiServer(port)
server.addMiddlewares(middleware_1, middleware_2, ..., middleware_n)
```

<br>

**Create WebAPI (REST-API) :**

```ts
import { WebApiServer, WebApi } from '@hkbyte/webapi'

const server = new WebApiServer(port)

const apiAdminList = new WebApi({
    method: 'GET',
    endpoint: '/admin/list',
    handler: async () => {
        const adminList = await db.fetchAllAdmins()
        return adminList
    },
})

/**
 * Register webApi into our server
 * */
server.addWebApis(apiAdminList, ...)
```

_handler()_ function takes responsibility of sending response data.
By default if request executes successfully it will send HTTP Status Code 200.

<br>
WebApi options:

```ts
const api1 = new WebApi(port, {
    method: 'POST', // 'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
    endpoint: 'product/add' // path with params,
    requestType: 'JSON' // optional 'JSON'(default), 'FORM_DATA_MULTIPART',
    requestBodySchema: TypeObject // body validation schema
    hideErrorStack: false // default true when NODE_ENV = 'production'
    middlewares: [middleware1, middleware2] // API level middlewares
    handler: (context) => {
        const params = context.params // request path params
        const query = context.query // request query string in object
        const body = context.body // request body

        /**
         * Logic goes here
         */

        return responseData
    }
})
```

<br>
WebApi example:

```ts
import { T, WebApi} from '@hkbyte/webapi'

const apiStudentAdd = new WebApi(port, {
    method: 'POST',
    endpoint: 'student/add'
    requestType: 'JSON'
    requestBodySchema: T.object({
		name: T.string().max(50),
		age: T.number().positive(),
	})
    handler: ({ body }) => {
        const newStudent = db.createStudent({
            name: body.name,
            age: body.age,
        })

        return newStudent
    }
})
```
