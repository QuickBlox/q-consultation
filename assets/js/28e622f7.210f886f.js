"use strict";(self.webpackChunk_qc_doc_docusaurus=self.webpackChunk_qc_doc_docusaurus||[]).push([[675,8,318,487,884,678,974,256,375],{3905:(t,e,n)=>{n.d(e,{Zo:()=>l,kt:()=>f});var i=n(7294);function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){s(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e){if(null==t)return{};var n,i,s=function(t,e){if(null==t)return{};var n,i,s={},o=Object.keys(t);for(i=0;i<o.length;i++)n=o[i],e.indexOf(n)>=0||(s[n]=t[n]);return s}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(i=0;i<o.length;i++)n=o[i],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(s[n]=t[n])}return s}var p=i.createContext({}),c=function(t){var e=i.useContext(p),n=e;return t&&(n="function"==typeof t?t(e):r(r({},e),t)),n},l=function(t){var e=c(t.components);return i.createElement(p.Provider,{value:e},t.children)},d="mdxType",u={inlineCode:"code",wrapper:function(t){var e=t.children;return i.createElement(i.Fragment,{},e)}},m=i.forwardRef((function(t,e){var n=t.components,s=t.mdxType,o=t.originalType,p=t.parentName,l=a(t,["components","mdxType","originalType","parentName"]),d=c(n),m=s,f=d["".concat(p,".").concat(m)]||d[m]||u[m]||o;return n?i.createElement(f,r(r({ref:e},l),{},{components:n})):i.createElement(f,r({ref:e},l))}));function f(t,e){var n=arguments,s=e&&e.mdxType;if("string"==typeof t||s){var o=n.length,r=new Array(o);r[0]=m;var a={};for(var p in e)hasOwnProperty.call(e,p)&&(a[p]=e[p]);a.originalType=t,a[d]="string"==typeof t?t:s,r[1]=a;for(var c=2;c<o;c++)r[c]=n[c];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4053:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>g,contentTitle:()=>f,default:()=>b,frontMatter:()=>m,metadata:()=>h,toc:()=>k});var i=n(7462),s=(n(7294),n(3905)),o=n(7968),r=n(8242),a=n(4842),p=n(7498),c=n(4296),l=n(9171),d=n(8952),u=n(2729);const m={sidebar_label:"Scripts",sidebar_position:1},f="Scripts",h={unversionedId:"dev/setup-and-deployment/scripts",id:"dev/setup-and-deployment/scripts",title:"Scripts",description:"Run application in development mode",source:"@site/docs/dev/setup-and-deployment/scripts.md",sourceDirName:"dev/setup-and-deployment",slug:"/dev/setup-and-deployment/scripts",permalink:"/q-consultation/dev/setup-and-deployment/scripts",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/dev/setup-and-deployment/scripts.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_label:"Scripts",sidebar_position:1},sidebar:"docPagesSidebar",previous:{title:"\ud83d\ude80 Quick Start Guide",permalink:"/q-consultation/dev/quick-start"},next:{title:"Configurations",permalink:"/q-consultation/dev/setup-and-deployment/configurations"}},g={},k=[{value:"Run application in development mode",id:"run-application-in-development-mode",level:2},{value:"Make a production build application",id:"make-a-production-build-application",level:2},{value:"Start API Server",id:"start-api-server",level:2},{value:"Start of documentation development",id:"start-of-documentation-development",level:2},{value:"Start Integration Pages",id:"start-integration-pages",level:2},{value:"Run code linting",id:"run-code-linting",level:2},{value:"Run configuration creation",id:"run-configuration-creation",level:2},{value:"Run schema upload",id:"run-schema-upload",level:2}],v={toc:k},y="wrapper";function b(t){let{components:e,...n}=t;return(0,s.kt)(y,(0,i.Z)({},v,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"scripts"},"Scripts"),(0,s.kt)("h2",{id:"run-application-in-development-mode"},"Run application in development mode"),(0,s.kt)(o.default,{components:n.components,mdxType:"RunDev"}),(0,s.kt)("h2",{id:"make-a-production-build-application"},"Make a production build application"),(0,s.kt)(r.default,{components:n.components,mdxType:"RunBuild"}),(0,s.kt)("h2",{id:"start-api-server"},"Start API Server"),(0,s.kt)(a.default,{components:n.components,mdxType:"RunStartApi"}),(0,s.kt)("admonition",{type:"tip"},(0,s.kt)("p",{parentName:"admonition"},"Before launching the server API, it is necessary to make an ",(0,s.kt)("a",{parentName:"p",href:"#make-a-production-build-application"},"application build"))),(0,s.kt)("h2",{id:"start-of-documentation-development"},"Start of documentation development"),(0,s.kt)(p.default,{components:n.components,mdxType:"RunStartDoc"}),(0,s.kt)("h2",{id:"start-integration-pages"},"Start Integration Pages"),(0,s.kt)(c.default,{components:n.components,mdxType:"RunStartPages"}),(0,s.kt)("h2",{id:"run-code-linting"},"Run code linting"),(0,s.kt)(l.default,{components:n.components,mdxType:"RunLint"}),(0,s.kt)("h2",{id:"run-configuration-creation"},"Run configuration creation"),(0,s.kt)(d.default,{components:n.components,mdxType:"RunInitConfig"}),(0,s.kt)("h2",{id:"run-schema-upload"},"Run schema upload"),(0,s.kt)(u.default,{components:n.components,mdxType:"RunInitSchema"}))}b.isMDXComponent=!0},8242:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/build",id:"snippets/scripts/build",title:"build",description:"This command creates a production build in dist directory for each application.",source:"@site/docs/snippets/scripts/build.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/build",permalink:"/q-consultation/snippets/scripts/build",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/build.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn build\n")),(0,s.kt)("p",null,"This command creates a production build in ",(0,s.kt)("inlineCode",{parentName:"p"},"dist")," directory for each application."),(0,s.kt)("p",null,"See the section about ",(0,s.kt)("a",{parentName:"p",href:"https://facebook.github.io/create-react-app/docs/deployment"},"deployment")," for more information."),(0,s.kt)("admonition",{type:"tip"},(0,s.kt)("p",{parentName:"admonition"},"Be sure to use HTTPS on the server, otherwise video calls will not work for you.")))}u.isMDXComponent=!0},7968:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/dev",id:"snippets/scripts/dev",title:"dev",description:"The app is using self-signed certificate since WebRTC supports only HTTPS connection so your web-browser will likely warn you about untrusted certificate. Feel free to skip this warning.",source:"@site/docs/snippets/scripts/dev.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/dev",permalink:"/q-consultation/snippets/scripts/dev",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/dev.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("admonition",{type:"caution"},(0,s.kt)("p",{parentName:"admonition"},"The app is using self-signed certificate since WebRTC supports only HTTPS connection so your web-browser will likely warn you about untrusted certificate. Feel free to skip this warning.")),(0,s.kt)("p",null,"To start the application in a development mode, run the following command in the project folder:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn dev\n")),(0,s.kt)("p",null,"The application will automatically open in the browser after running script."),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"Provider: ",(0,s.kt)("a",{parentName:"li",href:"https://localhost:3000"},"https://localhost:3000")),(0,s.kt)("li",{parentName:"ul"},"Client: ",(0,s.kt)("a",{parentName:"li",href:"https://localhost:3001"},"https://localhost:3001")),(0,s.kt)("li",{parentName:"ul"},"API: ",(0,s.kt)("a",{parentName:"li",href:"http://localhost:4000"},"http://localhost:4000"))),(0,s.kt)("p",null,"The page will reload if you make edits."))}u.isMDXComponent=!0},8952:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/init-config",id:"snippets/scripts/init-config",title:"init-config",description:"You can create a configuration file by running this command and following the instructions in the terminal:",source:"@site/docs/snippets/scripts/init-config.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/init-config",permalink:"/q-consultation/snippets/scripts/init-config",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/init-config.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"You can create a configuration file by running this command and following the instructions in the terminal:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn init:config\n")))}u.isMDXComponent=!0},2729:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/init-schema",id:"snippets/scripts/init-schema",title:"init-schema",description:"You can add the schema automatically by running this command and following the instructions in the terminal:",source:"@site/docs/snippets/scripts/init-schema.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/init-schema",permalink:"/q-consultation/snippets/scripts/init-schema",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/init-schema.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"You can add the schema automatically by running this command and following the instructions in the terminal:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn init:schema\n")))}u.isMDXComponent=!0},9171:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/lint",id:"snippets/scripts/lint",title:"lint",description:"This will run code linting using eslint which will analyze code to find problematic patterns or code that doesn't adhere to certain style guidelines.",source:"@site/docs/snippets/scripts/lint.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/lint",permalink:"/q-consultation/snippets/scripts/lint",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/lint.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn lint\n")),(0,s.kt)("p",null,"This will run code linting using ",(0,s.kt)("a",{parentName:"p",href:"https://eslint.org"},"eslint")," which will analyze code to find problematic patterns or code that doesn't adhere to certain style guidelines."))}u.isMDXComponent=!0},4842:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/start-api",id:"snippets/scripts/start-api",title:"start-api",description:"Runs the API server in a production mode.",source:"@site/docs/snippets/scripts/start-api.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/start-api",permalink:"/q-consultation/snippets/scripts/start-api",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/start-api.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Runs the API server in a production mode."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn start:api\n")),(0,s.kt)("p",null,"The API server will run on port 4000."),(0,s.kt)("p",null,"See the section about ",(0,s.kt)("a",{parentName:"p",href:"https://www.fastify.io/docs/latest/Guides/Recommendations/"},"deployment")," for more information."))}u.isMDXComponent=!0},7498:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/start-doc",id:"snippets/scripts/start-doc",title:"start-doc",description:"To develop documentation, you can use the following command:",source:"@site/docs/snippets/scripts/start-doc.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/start-doc",permalink:"/q-consultation/snippets/scripts/start-doc",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/start-doc.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"To develop documentation, you can use the following command:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn start:doc\n")))}u.isMDXComponent=!0},4296:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var i=n(7462),s=(n(7294),n(3905));const o={},r=void 0,a={unversionedId:"snippets/scripts/start-pages",id:"snippets/scripts/start-pages",title:"start-pages",description:"This script allows you to run integration pages on .",source:"@site/docs/snippets/scripts/start-pages.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/start-pages",permalink:"/q-consultation/snippets/scripts/start-pages",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/scripts/start-pages.md",tags:[],version:"current",frontMatter:{}},p={},c=[],l={toc:c},d="wrapper";function u(t){let{components:e,...n}=t;return(0,s.kt)(d,(0,i.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-bash"},"yarn start:pages\n")),(0,s.kt)("p",null,"This script allows you to run integration pages on ",(0,s.kt)("a",{parentName:"p",href:"http://localhost:8000"},"http://localhost:8000"),"."),(0,s.kt)("p",null,"You can read more about how to work with integration pages here: ",(0,s.kt)("a",{parentName:"p",href:"/dev/development/apps/integration-pages"},"Integration page")))}u.isMDXComponent=!0}}]);