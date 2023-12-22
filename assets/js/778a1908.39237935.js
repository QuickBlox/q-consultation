"use strict";(self.webpackChunk_qc_doc_docusaurus=self.webpackChunk_qc_doc_docusaurus||[]).push([[857,861,842,769,884,381,120],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),s=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(l.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=s(n),m=o,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return n?a.createElement(h,r(r({ref:t},c),{},{components:n})):a.createElement(h,r({ref:t},c))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=m;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p[d]="string"==typeof e?e:o,r[1]=p;for(var s=2;s<i;s++)r[s]=n[s];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7434:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>h,contentTitle:()=>u,default:()=>N,frontMatter:()=>d,metadata:()=>m,toc:()=>k});var a=n(7462),o=(n(7294),n(3905)),i=n(6322),r=n(7968),p=n(47),l=n(4926),s=n(9618),c=n(8123);const d={sidebar_label:"\ud83d\ude80 Quick Start Guide",sidebar_position:2},u="Quick Start Guide",m={unversionedId:"dev/quick-start",id:"dev/quick-start",title:"Quick Start Guide",description:"Q-Consultation offers a lot of flexibility. Whether you want to go fast and quickly see the final result, or would rather dive deeper into the product, we got you covered. For this tutorial, we'll go for the DIY approach and build a project and data structure from scratch.",source:"@site/docs/dev/quick-start.md",sourceDirName:"dev",slug:"/dev/quick-start",permalink:"/q-consultation/dev/quick-start",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/dev/quick-start.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_label:"\ud83d\ude80 Quick Start Guide",sidebar_position:2},sidebar:"docPagesSidebar",previous:{title:"\ud83d\udc4b Introduction",permalink:"/q-consultation/"},next:{title:"Scripts",permalink:"/q-consultation/dev/setup-and-deployment/scripts"}},h={},k=[{value:"Step 1: Install dependencies",id:"step-1-install-dependencies",level:2},{value:"Step 2: Register QuickBlox account",id:"step-2-register-quickblox-account",level:2},{value:"Step 3: Create QuickBlox application",id:"step-3-create-quickblox-application",level:2},{value:"Step 4: Configure application",id:"step-4-configure-application",level:2},{value:"Step 5: Upload Schema",id:"step-5-upload-schema",level:2},{value:"Step 6: Run application",id:"step-6-run-application",level:2},{value:"Step 7: Create users",id:"step-7-create-users",level:2},{value:"Provider",id:"provider",level:3},{value:"Client",id:"client",level:3},{value:"\u23e9 What to do next?",id:"-what-to-do-next",level:2}],f=(g="Image",function(e){return console.warn("Component "+g+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)});var g;const v={toc:k},y="wrapper";function N(e){let{components:t,...n}=e;return(0,o.kt)(y,(0,a.Z)({},v,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"quick-start-guide"},"Quick Start Guide"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Q-Consultation")," offers a lot of flexibility. Whether you want to go fast and quickly see the final result, or would rather dive deeper into the product, we got you covered. For this tutorial, we'll go for the DIY approach and build a project and data structure from scratch."),(0,o.kt)("admonition",{title:"Prerequisites",type:"tip"},(0,o.kt)(i.default,{components:n.components,mdxType:"InstallPrerequisites"})),(0,o.kt)("admonition",{title:"Video Demo",type:"info"},(0,o.kt)("p",{parentName:"admonition"},"If demos are more your thing, we have a video demo:"),(0,o.kt)("div",{style:{textAlign:"center"}},(0,o.kt)("iframe",{allowFullScreen:!0,frameBorder:"0",title:"YouTube video player",src:"https://www.youtube.com/embed/-nEoba8vq_I",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",style:{height:"315px",width:"100%",maxWidth:"560px"}}))),(0,o.kt)("h2",{id:"step-1-install-dependencies"},"Step 1: Install dependencies"),(0,o.kt)("p",null,"You will need to clone the repository or download it as a zip archive. Once you have cloned/dowloaded this repo you need to install dependencies running the following command in a terminal:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn\n")),(0,o.kt)("h2",{id:"step-2-register-quickblox-account"},"Step 2: Register QuickBlox account"),(0,o.kt)("p",null,"Next, you need to have a QuickBlox account. You can sign up here: ",(0,o.kt)("a",{parentName:"p",href:"https://admin.quickblox.com/signup"},"https://admin.quickblox.com/signup"),". Feel free to skip this step in case you already have an account."),(0,o.kt)("h2",{id:"step-3-create-quickblox-application"},"Step 3: Create QuickBlox application"),(0,o.kt)("p",null,"After registering the QuickBlox account, you need to create an application in your QuickBlox admin panel that will allow you to connect the Q-Consultation app to the QuickBlox server. Follow the steps below:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Log into QuickBlox account (if you are not yet there) ",(0,o.kt)("a",{parentName:"li",href:"https://admin.quickblox.com/signin"},"https://admin.quickblox.com/signin"),"."),(0,o.kt)("li",{parentName:"ol"},"On the main page, click + sign to add a new application."),(0,o.kt)("li",{parentName:"ol"},"Fill in the required fields: ",(0,o.kt)("strong",{parentName:"li"},"App title")," and ",(0,o.kt)("strong",{parentName:"li"},"App type"),", and create app.")),(0,o.kt)("p",null,"Once done, you will be redirected to the ",(0,o.kt)("strong",{parentName:"p"},"Overview")," page of your newly created application. There, you will find application credentials necessary to connect Q-Consultation application to the QuickBlox server. We will get back to them later."),(0,o.kt)(f,{src:"/img/quick-start/001.gif",mdxType:"Image"}),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"You can read more about working with applications here: ",(0,o.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/application"},"QuickBlox Application"))),(0,o.kt)("h2",{id:"step-4-configure-application"},"Step 4: Configure application"),(0,o.kt)("p",null,"Now, let\u2019s get back to the application credentials which you saw in the QuickBlox admin panel."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"If you have registered your QuickBlox account via Google or GitHub and you do not have a password,\nyou can recover it on the ",(0,o.kt)("a",{parentName:"p",href:"https://admin.quickblox.com/forgot"},"Forgot password")," page or use another method to configure the application.")),(0,o.kt)(p.default,{components:n.components,mdxType:"ScriptConfig"}),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"For detailed application configuration information,\nyou can visit the ",(0,o.kt)("a",{parentName:"p",href:"/dev/setup-and-deployment/configurations#configure-application"},"Configuration")," page.\nThere you will find other ways to configure and a description of all configuration options.")),(0,o.kt)("h2",{id:"step-5-upload-schema"},"Step 5: Upload Schema"),(0,o.kt)(l.default,{components:n.components,mdxType:"ScriptSchema"}),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"For details on uploading schema into applications,\nyou can visit the ",(0,o.kt)("a",{parentName:"p",href:"/dev/setup-and-deployment/configurations#upload-schema"},"Configuration")," page.\nThere you will find other ways to upload the schema.")),(0,o.kt)("h2",{id:"step-6-run-application"},"Step 6: Run application"),(0,o.kt)(r.default,{components:n.components,mdxType:"RunDev"}),(0,o.kt)("h2",{id:"step-7-create-users"},"Step 7: Create users"),(0,o.kt)("h3",{id:"provider"},"Provider"),(0,o.kt)(s.default,{components:n.components,mdxType:"CreateProvider"}),(0,o.kt)("h3",{id:"client"},"Client"),(0,o.kt)(c.default,{components:n.components,mdxType:"CreateClient"}),(0,o.kt)("h2",{id:"-what-to-do-next"},"\u23e9 What to do next?"),(0,o.kt)("p",null,"After you complete the step with running the project in develop mode, Client and Provider apps should be automatically open in your default browser. Now, your Q-Consultation app is ready to be used for your goals."),(0,o.kt)("p",null,"How to proceed with app integration, you can find detailed instructions here: \u200b",(0,o.kt)("a",{parentName:"p",href:"/dev/development"},"Development"),"."))}N.isMDXComponent=!0},8123:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>f,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={},r=void 0,p={unversionedId:"snippets/create-client",id:"snippets/create-client",title:"create-client",description:"The client application has a self-registration option, so you can either create a client via the web application or via API.",source:"@site/docs/snippets/create-client.md",sourceDirName:"snippets",slug:"/snippets/create-client",permalink:"/q-consultation/snippets/create-client",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/create-client.md",tags:[],version:"current",frontMatter:{}},l={},s=[],c=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",t)},d=c("Image"),u=c("Tabs"),m=c("TabItem"),h={toc:s},k="wrapper";function f(e){let{components:t,...n}=e;return(0,o.kt)(k,(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The client application has a self-registration option, so you can either create a client via the web application or via ",(0,o.kt)("a",{parentName:"p",href:"/api#tag/Client/paths/~1users~1client/post"},"API"),"."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Registration via web application")),(0,o.kt)("p",{parentName:"li"}," To create a client, navigate to the registration page by accessing the following URL: ",(0,o.kt)("a",{parentName:"p",href:"https://localhost:3001/signup"},"https://localhost:3001/signup"),".\nFill in the required information and submit form."),(0,o.kt)(d,{src:"/img/snippets/create-client.jpg",mdxType:"Image"})),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Console method")),(0,o.kt)("p",{parentName:"li"},"Enter the following command, replacing the values in angle brackets with the actual data:"),(0,o.kt)(u,{groupId:"request",mdxType:"Tabs"},(0,o.kt)(m,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'curl --request POST \\\n  --url http://localhost:4000/users/client \\\n  --header \'Content-Type: application/json\' \\\n  --data \'{\n    "full_name": "<Full name>",\n    "email": "<Email>",\n    "password": "<Password>",\n    "birthdate": "<Birthdate>",\n    "gender": "<Gender>"\n}\'\n'))),(0,o.kt)(m,{value:"httpie",label:"HTTPie",mdxType:"TabItem"},(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'echo \'{\n    "full_name": "<Full name>",\n    "email": "<Email>",\n    "password": "<Password>",\n    "birthdate": "<Birthdate>",\n    "gender": "<Gender>"\n}\' |  \\\n  http POST http://localhost:4000/users/client \\\n  Content-Type:application/json\n'))))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Using an HTTP client (such as ",(0,o.kt)("a",{parentName:"strong",href:"https://www.postman.com"},"Postman")," or ",(0,o.kt)("a",{parentName:"strong",href:"https://insomnia.rest"},"Insomnia"),")")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Open your preferred HTTP client."),(0,o.kt)("li",{parentName:"ul"},"Create a new request with the ",(0,o.kt)("inlineCode",{parentName:"li"},"POST")," method."),(0,o.kt)("li",{parentName:"ul"},"Set the request URL to ",(0,o.kt)("inlineCode",{parentName:"li"},"http://localhost:4000/users/client"),"."),(0,o.kt)("li",{parentName:"ul"},'Go to the "Body" tab and select "JSON".'),(0,o.kt)("li",{parentName:"ul"},"Add the following form options with the actual data:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"full_name")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"email")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"password")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"birthdate")," (value in ",(0,o.kt)("inlineCode",{parentName:"li"},"YYYY-MM-DD")," format)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"gender")," (value: ",(0,o.kt)("inlineCode",{parentName:"li"},"male")," or ",(0,o.kt)("inlineCode",{parentName:"li"},"female"),")"))),(0,o.kt)("li",{parentName:"ul"},"Send the request.")))),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"In 2 and 3 methods, the request will be sent to the specified URL with the provided data about the client. Make sure to replace ",(0,o.kt)("inlineCode",{parentName:"p"},"<Full name>"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<Email>"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<Password>"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<Birthdate>"),", and ",(0,o.kt)("inlineCode",{parentName:"p"},"<Gender>")," with the actual values you want to use for creating the client.")))}f.isMDXComponent=!0},9618:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>k,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={},r=void 0,p={unversionedId:"snippets/create-provider",id:"snippets/create-provider",title:"create-provider",description:"There is no registration in the provider's application, so to create a user you need to use the API.",source:"@site/docs/snippets/create-provider.md",sourceDirName:"snippets",slug:"/snippets/create-provider",permalink:"/q-consultation/snippets/create-provider",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/create-provider.md",tags:[],version:"current",frontMatter:{}},l={},s=[],c=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",t)},d=c("Tabs"),u=c("TabItem"),m={toc:s},h="wrapper";function k(e){let{components:t,...n}=e;return(0,o.kt)(h,(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"There is no registration in the provider's application, so to create a user you need to use the ",(0,o.kt)("a",{parentName:"p",href:"/api#tag/Provider/paths/~1ai~1providers~1suggestions/post"},"API"),"."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Console method")),(0,o.kt)("p",{parentName:"li"},"Enter the following command, replacing the values in angle brackets with the actual data:"),(0,o.kt)(d,{groupId:"request",mdxType:"Tabs"},(0,o.kt)(u,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'curl --request POST \\\n  --url http://localhost:4000/users/provider \\\n  --header \'Content-Type: application/json\' \\\n  --data \'{\n    "full_name": "<Full name>",\n    "email": "<Email>",\n    "profession": "<Profession>",\n    "password": "<Password>"\n}\'\n'))),(0,o.kt)(u,{value:"httpie",label:"HTTPie",mdxType:"TabItem"},(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'echo \'{\n    "full_name": "<Full name>",\n    "email": "<Email>",\n    "profession": "<Profession>",\n    "password": "<Password>"\n}\' |  \\\n  http POST http://localhost:4000/users/provider \\\n  Content-Type:application/json\n'))))),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},"Using an HTTP client (such as ",(0,o.kt)("a",{parentName:"strong",href:"https://www.postman.com"},"Postman")," or ",(0,o.kt)("a",{parentName:"strong",href:"https://insomnia.rest"},"Insomnia"),")")),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Open your preferred HTTP client."),(0,o.kt)("li",{parentName:"ul"},"Create a new request with the ",(0,o.kt)("inlineCode",{parentName:"li"},"POST")," method."),(0,o.kt)("li",{parentName:"ul"},"Set the request URL to ",(0,o.kt)("inlineCode",{parentName:"li"},"http://localhost:4000/users/provider"),"."),(0,o.kt)("li",{parentName:"ul"},'Go to the "Body" tab and select "JSON".'),(0,o.kt)("li",{parentName:"ul"},"Add the following form options with the actual data:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"full_name")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"email")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"profession")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"password")))),(0,o.kt)("li",{parentName:"ul"},"Send the request.")))),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"In both methods, the request will be sent to the specified URL with the provided data about the provider. Make sure to replace ",(0,o.kt)("inlineCode",{parentName:"p"},"<Full name>"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<Email>"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<Profession>")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"<Password>")," with the actual values you want to use for creating the provider.")),(0,o.kt)("p",null,"Choose the preferred method based on your development environment and tools."))}k.isMDXComponent=!0},6322:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={},r=void 0,p={unversionedId:"snippets/installation-prerequisites",id:"snippets/installation-prerequisites",title:"installation-prerequisites",description:"Before installing Q-Consultation, the following requirements must be installed on your computer:",source:"@site/docs/snippets/installation-prerequisites.md",sourceDirName:"snippets",slug:"/snippets/installation-prerequisites",permalink:"/q-consultation/snippets/installation-prerequisites",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/installation-prerequisites.md",tags:[],version:"current",frontMatter:{}},l={},s=[],c={toc:s},d="wrapper";function u(e){let{components:t,...n}=e;return(0,o.kt)(d,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Before installing ",(0,o.kt)("strong",{parentName:"p"},"Q-Consultation"),", the following requirements must be installed on your computer:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org"},"Node.js"),": Only Maintenance and LTS versions are supported (",(0,o.kt)("inlineCode",{parentName:"p"},"v16"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"v18")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"v20"),").")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://yarnpkg.com"},"Yarn"),": The preferred way to manage Yarn is by-project and through\n",(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/dist/latest/docs/api/corepack.html"},"Corepack"),", a tool shipped by default with Node.js.\nModern releases of Yarn aren't meant to be installed globally, or from npm. "),(0,o.kt)("p",{parentName:"li"},"  Enable Corepack, if it isn't already: "),(0,o.kt)("pre",{parentName:"li"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"corepack enable\n")))))}u.isMDXComponent=!0},47:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={},r=void 0,p={unversionedId:"snippets/script-config",id:"snippets/script-config",title:"script-config",description:"In order to work correctly application need to know a set of configs.",source:"@site/docs/snippets/script-config.md",sourceDirName:"snippets",slug:"/snippets/script-config",permalink:"/q-consultation/snippets/script-config",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/script-config.md",tags:[],version:"current",frontMatter:{}},l={},s=[],c=(d="Image",function(e){return console.warn("Component "+d+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)});var d;const u={toc:s},m="wrapper";function h(e){let{components:t,...n}=e;return(0,o.kt)(m,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"In order to work correctly application need to know a set of configs.\nYou can create a configuration file by running this command and following the instructions in the terminal:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn init:config\n")),(0,o.kt)(c,{src:"/img/snippets/config.gif",mdxType:"Image"}))}h.isMDXComponent=!0},4926:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={},r=void 0,p={unversionedId:"snippets/script-schema",id:"snippets/script-schema",title:"script-schema",description:"To make online appointments and video records work in the Q-Consultation app, it\u2019s necessary to import an appointment schema file to the QuickBlox admin panel.",source:"@site/docs/snippets/script-schema.md",sourceDirName:"snippets",slug:"/snippets/script-schema",permalink:"/q-consultation/snippets/script-schema",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/script-schema.md",tags:[],version:"current",frontMatter:{}},l={},s=[],c=(d="Image",function(e){return console.warn("Component "+d+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)});var d;const u={toc:s},m="wrapper";function h(e){let{components:t,...n}=e;return(0,o.kt)(m,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"To make online appointments and video records work in the Q-Consultation app, it\u2019s necessary to import an appointment schema file to the QuickBlox admin panel."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"If you have registered your QuickBlox account via Google or GitHub and you do not have a password,\nyou can recover it on the ",(0,o.kt)("a",{parentName:"p",href:"https://admin.quickblox.com/forgot"},"Forgot password")," page or use another method to upload schema into application.")),(0,o.kt)("p",null,"You can add the schema automatically by running this command and following the instructions in the terminal."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn init:schema\n")),(0,o.kt)(c,{src:"/img/snippets/schema.gif",mdxType:"Image"}))}h.isMDXComponent=!0},7968:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var a=n(7462),o=(n(7294),n(3905));const i={},r=void 0,p={unversionedId:"snippets/scripts/dev",id:"snippets/scripts/dev",title:"dev",description:"The app is using self-signed certificate since WebRTC supports only HTTPS connection so your web-browser will likely warn you about untrusted certificate. Feel free to skip this warning.",source:"@site/docs/snippets/scripts/dev.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/dev",permalink:"/q-consultation/snippets/scripts/dev",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/dev.md",tags:[],version:"current",frontMatter:{}},l={},s=[],c={toc:s},d="wrapper";function u(e){let{components:t,...n}=e;return(0,o.kt)(d,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"The app is using self-signed certificate since WebRTC supports only HTTPS connection so your web-browser will likely warn you about untrusted certificate. Feel free to skip this warning.")),(0,o.kt)("p",null,"To start the application in a development mode, run the following command in the project folder:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn dev\n")),(0,o.kt)("p",null,"The application will automatically open in the browser after running script."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Provider: ",(0,o.kt)("a",{parentName:"li",href:"https://localhost:3000"},"https://localhost:3000")),(0,o.kt)("li",{parentName:"ul"},"Client: ",(0,o.kt)("a",{parentName:"li",href:"https://localhost:3001"},"https://localhost:3001")),(0,o.kt)("li",{parentName:"ul"},"API: ",(0,o.kt)("a",{parentName:"li",href:"http://localhost:4000"},"http://localhost:4000"))),(0,o.kt)("p",null,"The page will reload if you make edits."))}u.isMDXComponent=!0}}]);