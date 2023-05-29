"use strict";(self.webpackChunkq_consultation_doc=self.webpackChunkq_consultation_doc||[]).push([[678],{876:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>m});var n=r(2784);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),d=l(r),m=o,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||a;return r?n.createElement(f,i(i({ref:t},s),{},{components:r})):n.createElement(f,i({ref:t},s))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8970:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>f,frontMatter:()=>a,metadata:()=>p,toc:()=>l});var n=r(7896),o=(r(2784),r(876));const a={},i=void 0,p={unversionedId:"snippets/scripts/build",id:"snippets/scripts/build",title:"build",description:"This command creates a production build",source:"@site/docs/snippets/scripts/build.md",sourceDirName:"snippets/scripts",slug:"/snippets/scripts/build",permalink:"/q-consultation/snippets/scripts/build",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/snippets/scripts/build.md",tags:[],version:"current",frontMatter:{}},c={},l=[],s=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",t)},u=s("Tabs"),d=s("TabItem"),m={toc:l};function f(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)(u,{groupId:"yarn-npm",mdxType:"Tabs"},(0,o.kt)(d,{value:"npm",label:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm run build\n"))),(0,o.kt)(d,{value:"yarn",label:"yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn run build\n")))),(0,o.kt)("p",null,"This command creates a production build"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"in ",(0,o.kt)("inlineCode",{parentName:"li"},"build")," directory for the provider and client packages"),(0,o.kt)("li",{parentName:"ul"},"in ",(0,o.kt)("inlineCode",{parentName:"li"},"dist")," directory for the api package")),(0,o.kt)("p",null,"See the section about ",(0,o.kt)("a",{parentName:"p",href:"https://facebook.github.io/create-react-app/docs/deployment"},"deployment")," for more information."),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Be sure to use HTTPS on the server, otherwise video calls will not work for you.")))}f.isMDXComponent=!0}}]);