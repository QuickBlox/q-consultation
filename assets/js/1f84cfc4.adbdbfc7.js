"use strict";(self.webpackChunk_qc_doc_docusaurus=self.webpackChunk_qc_doc_docusaurus||[]).push([[805],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),l=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},s=function(e){var t=l(e.components);return n.createElement(i.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=l(r),m=o,f=u["".concat(i,".").concat(m)]||u[m]||d[m]||a;return r?n.createElement(f,p(p({ref:t},s),{},{components:r})):n.createElement(f,p({ref:t},s))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,p=new Array(a);p[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[u]="string"==typeof e?e:o,p[1]=c;for(var l=2;l<a;l++)p[l]=r[l];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5530:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>p,default:()=>d,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var n=r(7462),o=(r(7294),r(3905));const a={},p=void 0,c={unversionedId:"snippets/docker/prod",id:"snippets/docker/prod",title:"prod",description:"This command will make a production build and launch applications:",source:"@site/docs/snippets/docker/prod.md",sourceDirName:"snippets/docker",slug:"/snippets/docker/prod",permalink:"/q-consultation/snippets/docker/prod",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/snippets/docker/prod.md",tags:[],version:"current",frontMatter:{}},i={},l=[],s={toc:l},u="wrapper";function d(e){let{components:t,...r}=e;return(0,o.kt)(u,(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker compose -f ./compose.prod.yaml up -d \n")),(0,o.kt)("p",null,"This command will make a production build and launch applications:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Provider: ",(0,o.kt)("a",{parentName:"li",href:"http://localhost:3000"},"http://localhost:3000")),(0,o.kt)("li",{parentName:"ul"},"Client: ",(0,o.kt)("a",{parentName:"li",href:"http://localhost:3001"},"http://localhost:3001")),(0,o.kt)("li",{parentName:"ul"},"API: ",(0,o.kt)("a",{parentName:"li",href:"http://localhost:4000"},"http://localhost:4000"))),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Be sure to use HTTPS on the server, otherwise video calls will not work for you."),(0,o.kt)("p",{parentName:"admonition"},"To configure HTTPS you can use docker images ",(0,o.kt)("a",{parentName:"p",href:"https://hub.docker.com/_/httpd"},"httpd"),", ",(0,o.kt)("a",{parentName:"p",href:"https://hub.docker.com/_/nginx"},"nginx"),", ",(0,o.kt)("a",{parentName:"p",href:"https://hub.docker.com/_/traefik"},"traefik")," or any other.")))}d.isMDXComponent=!0}}]);