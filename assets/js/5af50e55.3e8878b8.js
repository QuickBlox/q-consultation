"use strict";(self.webpackChunk_qc_doc_docusaurus=self.webpackChunk_qc_doc_docusaurus||[]).push([[480],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=s(n),c=i,h=d["".concat(p,".").concat(c)]||d[c]||m[c]||r;return n?a.createElement(h,o(o({ref:t},u),{},{components:n})):a.createElement(h,o({ref:t},u))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=c;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[d]="string"==typeof e?e:i,o[1]=l;for(var s=2;s<r;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},2076:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>s});var a=n(7462),i=(n(7294),n(3905));const r={sidebar_label:"Overview",sidebar_position:1},o="API application",l={unversionedId:"dev/development/apps/api/overview",id:"dev/development/apps/api/overview",title:"API application",description:"API application implements the API for the Client and Provider applications,",source:"@site/docs/dev/development/apps/api/overview.md",sourceDirName:"dev/development/apps/api",slug:"/dev/development/apps/api/overview",permalink:"/q-consultation/dev/development/apps/api/overview",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/dev/development/apps/api/overview.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_label:"Overview",sidebar_position:1},sidebar:"docPagesSidebar",previous:{title:"Applications",permalink:"/q-consultation/dev/development/apps"},next:{title:"OpenAI",permalink:"/q-consultation/dev/development/apps/api/openai"}},p={},s=[{value:"Structure",id:"structure",level:2},{value:"Plugins",id:"plugins",level:2},{value:"Schemas &amp; Models",id:"schemas--models",level:2},{value:"Services",id:"services",level:2},{value:"Routing",id:"routing",level:2},{value:"Endpoints",id:"endpoints",level:2}],u=(d="Image",function(e){return console.warn("Component "+d+" was not imported, exported, or provided by MDXProvider as global scope"),(0,i.kt)("div",e)});var d;const m={toc:s},c="wrapper";function h(e){let{components:t,...n}=e;return(0,i.kt)(c,(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"api-application"},"API application"),(0,i.kt)("p",null,"API application implements the API for the ",(0,i.kt)("a",{parentName:"p",href:"/dev/development/apps/provider-and-client/overview"},"Client and Provider applications"),",\nas well as integration with them.\nThe application does not have its own database and uses ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/"},"QuickBlox")," to store and share data.\nWithin this application, an API has been implemented that extends the capabilities of QuickBlox,\nadapting them to the features of QConsultation.\nHowever, all other ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/reference/overview"},"QuickBlox methods")," can be used without modification."),(0,i.kt)("admonition",{title:"Prerequisites",type:"info"},(0,i.kt)("ul",{parentName:"admonition"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Programming language"),": ",(0,i.kt)("a",{parentName:"li",href:"https://www.typescriptlang.org/"},"TypeScript")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Framework"),": ",(0,i.kt)("a",{parentName:"li",href:"https://www.fastify.io/"},"Fastify")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Chat & Video calling platform"),": ",(0,i.kt)("a",{parentName:"li",href:"https://docs.quickblox.com/"},"QuickBlox")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"AI platform"),": ",(0,i.kt)("a",{parentName:"li",href:"https://platform.openai.com/docs/api-reference"},"OpenAI")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Request library"),": ",(0,i.kt)("a",{parentName:"li",href:"https://axios-http.com/"},"Axios")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Utility library"),": ",(0,i.kt)("a",{parentName:"li",href:"https://lodash.com/"},"Lodash")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"JSON Schema"),": ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/sinclairzx81/typebox"},"TypeBox")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Code Linting"),": ",(0,i.kt)("a",{parentName:"li",href:"https://prettier.io/"},"Prettier"),", ",(0,i.kt)("a",{parentName:"li",href:"https://eslint.org/"},"ESLint")))),(0,i.kt)("h2",{id:"structure"},"Structure"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"apps\n\u2514\u2500\u2500\u2500\u2500 api\n      \u251c\u2500\u2500\u2500\u2500 node_modules # npm packages used by the package\n      \u251c\u2500\u2500\u2500\u2500 dist # build of the package\n      \u251c\u2500\u2500\u2500\u2500 src # business logic of the package split into subfolders per API\n      \u2502     \u251c\u2500\u2500\u2500\u2500 constants\n      \u2502     \u251c\u2500\u2500\u2500\u2500 models\n      \u2502     \u251c\u2500\u2500\u2500\u2500 plugins\n      \u2502     \u251c\u2500\u2500\u2500\u2500 routes\n      \u2502     \u251c\u2500\u2500\u2500\u2500 services\n      \u2502     \u251c\u2500\u2500\u2500\u2500 types\n      \u2502     \u251c\u2500\u2500\u2500\u2500 utils\n      \u2502     \u2514 app.ts\n      \u2502\n      \u251c .eslintignore\n      \u251c .eslintrc\n      \u251c package.json\n      \u2514 tsconfig.json\n")),(0,i.kt)("h2",{id:"plugins"},"Plugins"),(0,i.kt)("p",null,"Plugins define behavior that is common to all the routes in your\napplication. Authentication, caching, templates, and all the other cross\ncutting concerns should be handled by plugins placed in this folder."),(0,i.kt)("p",null,"Files in ",(0,i.kt)("inlineCode",{parentName:"p"},"src/plugins")," folder are typically defined through the\n",(0,i.kt)("a",{parentName:"p",href:"https://github.com/fastify/fastify-plugin"},(0,i.kt)("inlineCode",{parentName:"a"},"fastify-plugin"))," module,\nmaking them non-encapsulated. They can define decorators and set hooks\nthat will then be used in the rest of your application."),(0,i.kt)("p",null,"Check out:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.fastify.io/docs/latest/Guides/Plugins-Guide/"},"The hitchhiker's guide to plugins")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.fastify.io/docs/latest/Reference/Decorators/"},"Fastify decorators"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.fastify.io/docs/latest/Reference/Lifecycle/"},"Fastify lifecycle"),".")),(0,i.kt)("p",null,"Connected plugins:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/fastify/fastify-cors"},"cors"))," - enables the use of ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Cross-origin_resource_sharing"},"CORS"),".")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/fastify/fastify-env"},"env"))," - fastify plugin to check environment variables.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/fastify/fastify-multipart"},"multipart"))," - plugin to parse the multipart content-type.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/fastify/fastify-sensible"},"sensible"))," - plugin adds some useful utilities to your Fastify instance.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/fastify/fastify-swagger"},"swagger"))," - automatically generated from your route schemas, or from an existing OpenAPI schema")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/fastify/fastify-type-provider-typebox"},"typebox"))," - set TypeBox validator compiler")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"auth")," - implements a decorator for getting a token.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"error")," - plugin to parse errors.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"quickblox")," - produces QuickBlox SDK initialization and provide authentication strategies for different roles of users."),(0,i.kt)("p",{parentName:"li"},"The ",(0,i.kt)("inlineCode",{parentName:"p"},"fastify.verify")," performs verification of the authorization strategy.\nEach strategy checks the validity of the token in an ",(0,i.kt)("inlineCode",{parentName:"p"},"Authorization")," HTTP header."),(0,i.kt)("p",{parentName:"li"},"Implemented the following strategies:"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"BearerToken")," - Checks the validity of ",(0,i.kt)("inlineCode",{parentName:"li"},"BEARER_TOKEN")," from the application configuration.\nThis strategy executes requests on behalf of the owner of the QuickBlox account."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ProviderSessionToken")," - checks the validity of the provider's session token."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"ClientSessionToken")," - checks the validity of the client's session token."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"SessionToken")," - checks the validity of the session token of the provider or client.")),(0,i.kt)("p",{parentName:"li"},"An endpoint can use multiple authorization strategies."),(0,i.kt)("p",{parentName:"li"},"In the following example, you will find a very simple implementation that should help you understand how to use this module:"),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"fastify.get(\n  '/',\n  {\n    onRequest: fastify.verify(\n      fastify.BearerToken,\n      fastify.ProviderSessionToken,\n    ),\n  },\n  async (request, reply) => {\n    /* handler */\n  },\n)\n")))),(0,i.kt)("h2",{id:"schemas--models"},"Schemas & Models"),(0,i.kt)("p",null,"Fastify uses a schema-based approach, and even if it is not mandatory we recommend using ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/sinclairzx81/typebox"},"TypeBox")," to validate your routes and serialize your outputs. Internally, Fastify compiles the schema into a highly performant function."),(0,i.kt)("p",null,"The supported validations are:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"body"),": validates the body of the request if it is a ",(0,i.kt)("inlineCode",{parentName:"li"},"POST"),", ",(0,i.kt)("inlineCode",{parentName:"li"},"PUT"),", or ",(0,i.kt)("inlineCode",{parentName:"li"},"PATCH")," method."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"querystring"),": validates the query string."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"params"),": validates the route params."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"headers"),": validates the request headers.")),(0,i.kt)("p",null,"In addition, the scheme supports other properties:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"tags")," - allows grouping endpoints by tag"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"description")," - description of the endpoint"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"consumes")," - specifies the MIME Types for the request body.",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Default: ",(0,i.kt)("inlineCode",{parentName:"li"},'["application/json"]'),"."),(0,i.kt)("li",{parentName:"ul"},"To upload files: ",(0,i.kt)("inlineCode",{parentName:"li"},'["multipart/form-data"]'),"."))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"security")," - indicates the authorization method.\nThis schema parameter must be used in conjunction with the definition of an authorization strategy.",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"{ apiKey: [] }")," - matches the ",(0,i.kt)("inlineCode",{parentName:"li"},"BearerToken")," strategy"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"{ providerSession: [] }")," - matches the ",(0,i.kt)("inlineCode",{parentName:"li"},"ProviderSessionToken")," strategy"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"{ clientSession: [] }")," - matches the ",(0,i.kt)("inlineCode",{parentName:"li"},"ClientSessionToken")," strategy")))),(0,i.kt)("p",null,"Models (",(0,i.kt)("inlineCode",{parentName:"p"},"src/models"),") are generic TypeBox schemas that are used to validate requests and responses."),(0,i.kt)("p",null,"Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"// Model from models folder\nconst UserModal = Type.Object(\n  {\n    id: Type.Integer(),\n    full_name: Type.String(),\n    email: Type.String({ format: 'email' }),\n    created_at: Type.String({ format: 'date-time' }),\n    updated_at: Type.String({ format: 'date-time' }),\n  },\n  { $id: 'QBUser' },\n)\n\n// Schema for endpoint\nconst updateUserSchema = {\n  tags: ['Users'],\n  description: 'Update user by id',\n  params: Type.Object({\n    id: Type.Integer(),\n  }),\n  body: Type.Object({\n    full_name: Type.String(),\n    email: Type.String({ format: 'email' }),\n  }),\n  response: {\n    200: Type.Ref(UserModal),\n  },\n  security: [{ apiKey: [] }] as Security,\n}\n\n// ...\n")),(0,i.kt)("h2",{id:"services"},"Services"),(0,i.kt)("p",null,"A service is a set of functions that implement business logic for a particular entity."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"src/services")," directory implements functionality for working with OpenAI and QuickBlox entities."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Read more information on OpenAI integration in the ",(0,i.kt)("a",{parentName:"p",href:"/dev/development/apps/api/openai"},"OpenAI")," section.")),(0,i.kt)("h2",{id:"routing"},"Routing"),(0,i.kt)("p",null,"Routes define endpoints within your application."),(0,i.kt)("p",null,"In ",(0,i.kt)("inlineCode",{parentName:"p"},"src/routes")," folder you should define all the routes that define the endpoints\nof your web application.\nEach service is a ",(0,i.kt)("a",{parentName:"p",href:"https://www.fastify.io/docs/latest/Reference/Plugins/"},"Fastify plugin"),", it is\nencapsulated (it can have its own independent plugins) and it is\ntypically stored in a file; be careful to group your routes logically,\ne.g. all ",(0,i.kt)("inlineCode",{parentName:"p"},"/users")," routes in a ",(0,i.kt)("inlineCode",{parentName:"p"},"users.js")," file."),(0,i.kt)("p",null,"Folders prefixed with ",(0,i.kt)("inlineCode",{parentName:"p"},"_")," will be turned into route parameters."),(0,i.kt)("p",null,"If you want to use mixed route parameters use a double underscore ",(0,i.kt)("inlineCode",{parentName:"p"},"__"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml"},"\u251c\u2500\u2500 routes\n\u251c\u2500\u2500 __country-__language\n\u2502   \u2502  \u2514\u2500\u2500 actions.ts\n\u2502   \u2514\u2500\u2500 users\n\u2502       \u251c\u2500\u2500 _id\n\u2502       \u2502   \u2514\u2500\u2500 actions.ts\n\u2502       \u251c\u2500\u2500 __country-__language\n\u2502       \u2502   \u2514\u2500\u2500 actions.ts\n\u2502       \u2514\u2500\u2500 index.ts\n\u2514\u2500\u2500 app.ts\n#\n# routes/users/_id/actions.js will be loaded with prefix /users/:id\n# routes/__country-__language/actions.js will be loaded with prefix /:country-:language\n\n# curl http://localhost:3000/users/index\n# { userIndex: [ { id: 7, username: 'example' } ] }\n\n# curl http://localhost:3000/users/7/details\n# { user: { id: 7, username: 'example' } }\n\n# curl http://localhost:3000/be-nl\n# { country: 'be', language: 'nl' }\n")),(0,i.kt)("p",null,"If a single file become too large, create a folder and add a ",(0,i.kt)("inlineCode",{parentName:"p"},"index.js")," file there:\nthis file must be a Fastify plugin, and it will be loaded automatically\nby the application. You can now add as many files as you want inside that folder.\nIn this way you can create complex routes within a single monolith,\nand eventually extract them."),(0,i.kt)("p",null,"If you need to share functionality between routes, place that\nfunctionality into the ",(0,i.kt)("inlineCode",{parentName:"p"},"plugins")," folder, and share it via\n",(0,i.kt)("a",{parentName:"p",href:"https://www.fastify.io/docs/latest/Reference/Decorators/"},"decorators"),"."),(0,i.kt)("h2",{id:"endpoints"},"Endpoints"),(0,i.kt)("p",null,"All information on API endpoints can be found on the ",(0,i.kt)("a",{parentName:"p",href:"/api"},"API Server page"),".\nThere you can download the OpenAPI specification and see the description of all available endpoints."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"When studying api endpoints, pay attention to Authorization methods, MIME Type and fields of the request body."),(0,i.kt)("p",{parentName:"admonition"},"The Authorization section specifies the authorization method.\nEach of the methods indicates which token should be passed in an ",(0,i.kt)("inlineCode",{parentName:"p"},"Authorization")," HTTP header.\nAuthorization header must be in the format ",(0,i.kt)("inlineCode",{parentName:"p"},"Bearer <token>"),"."),(0,i.kt)("p",{parentName:"admonition"},"There are 3 authorization methods available:"),(0,i.kt)("ul",{parentName:"admonition"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"apiKey")," - ",(0,i.kt)("inlineCode",{parentName:"li"},"BEARER_TOKEN")," set in app config. Used for API integration."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"providerSession")," - provider session token."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"clientSession")," - client session token.")),(0,i.kt)("p",{parentName:"admonition"},"The Request section will specify the MIME Type of the request body:"),(0,i.kt)("ul",{parentName:"admonition"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"application/json")," - used to send json in the body of the request.\nUse header: ",(0,i.kt)("inlineCode",{parentName:"li"},'"Content-Type": "application/json"'),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"multipart/form-data")," - used to send files in the body request.\nUse ",(0,i.kt)("a",{parentName:"li",href:"https://developer.mozilla.org/en-US/docs/Web/API/FormData"},"FormData")," in JavaScript.")),(0,i.kt)(u,{src:"/img/api-endpoints.jpg",mdxType:"Image"})))}h.isMDXComponent=!0}}]);