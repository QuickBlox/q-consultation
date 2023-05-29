"use strict";(self.webpackChunkq_consultation_doc=self.webpackChunkq_consultation_doc||[]).push([[566,614,913,730],{876:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(2784);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=i,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||r;return n?a.createElement(f,o(o({ref:t},c),{},{components:n})):a.createElement(f,o({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var p=2;p<r;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},2703:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>p,default:()=>f,frontMatter:()=>l,metadata:()=>c,toc:()=>d});var a=n(7896),i=(n(2784),n(876)),r=n(4258),o=n(3052),s=n(7282);const l={sidebar_label:"\ud83d\udc4b Introduction",sidebar_position:1,slug:"/"},p="Welcome to the Q-Consultation Lite Developer Docs!",c={unversionedId:"dev/intro",id:"dev/intro",title:"Welcome to the Q-Consultation Lite Developer Docs!",description:"This documentation contains all technical documentation related to the setup, deployment, update and customization of your Q-Consultation Lite application.",source:"@site/docs/dev/intro.md",sourceDirName:"dev",slug:"/",permalink:"/q-consultation/",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/dev/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_label:"\ud83d\udc4b Introduction",sidebar_position:1,slug:"/"},sidebar:"docPagesSidebar",next:{title:"\ud83d\ude80 Quick Start Guide",permalink:"/q-consultation/dev/quick-start"}},u={},d=[{value:"Features list",id:"features-list",level:2},{value:"Interface",id:"interface",level:2},{value:"How to contribute",id:"how-to-contribute",level:2},{value:"License",id:"license",level:2}],m={toc:d};function f(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"welcome-to-the-q-consultation-lite-developer-docs"},"Welcome to the Q-Consultation Lite Developer Docs!"),(0,i.kt)("p",null,"This documentation contains all technical documentation related to the setup, deployment, update and customization of your ",(0,i.kt)("strong",{parentName:"p"},"Q-Consultation Lite")," application."),(0,i.kt)("admonition",{title:"Can't wait to start using Q-Consultation Lite?",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"You can directly head to the ",(0,i.kt)("a",{parentName:"p",href:"/q-consultation/dev/quick-start"},"Quick Start"),"!")),(0,i.kt)("p",null,"Q-Consultation is a web application for online chat and video consultations. The app provides code to build a secure means to hold virtual private meetings and video calls and messaging across a multitude of use cases including telehealth, recruitment, social engagement, finance, online education, e-commerce, and more. The application is built on ",(0,i.kt)("strong",{parentName:"p"},"React JS")," and consists of three major parts: QuickBlox back-end and two web applications for ",(0,i.kt)("a",{parentName:"p",href:"#client-application-interface"},"Client")," and ",(0,i.kt)("a",{parentName:"p",href:"#provider-application-interface"},"Provider"),"."),(0,i.kt)("admonition",{title:"Supported",type:"tip"},(0,i.kt)(o.default,{components:n.components,mdxType:"Supported"})),(0,i.kt)("h2",{id:"features-list"},"Features list"),(0,i.kt)(r.default,{components:n.components,mdxType:"FeaturesList"}),(0,i.kt)("h2",{id:"interface"},"Interface"),(0,i.kt)(s.default,{components:n.components,mdxType:"Interface"}),(0,i.kt)("h2",{id:"how-to-contribute"},"How to contribute"),(0,i.kt)("p",null,"See more information at ",(0,i.kt)("a",{parentName:"p",href:"/q-consultation/dev/contributing"},"CONTRIBUTING")),(0,i.kt)("h2",{id:"license"},"License"),(0,i.kt)("p",null,"See the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/LICENSE"},"LICENSE")," file for licensing information."))}f.isMDXComponent=!0},4258:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var a=n(7896),i=(n(2784),n(876));const r={},o=void 0,s={unversionedId:"snippets/features-list",id:"snippets/features-list",title:"features-list",description:"Communication features:",source:"@site/docs/snippets/features-list.md",sourceDirName:"snippets",slug:"/snippets/features-list",permalink:"/q-consultation/snippets/features-list",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/snippets/features-list.md",tags:[],version:"current",frontMatter:{}},l={},p=[],c={toc:p};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Communication features:")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Real-time Chat & Messaging"),(0,i.kt)("li",{parentName:"ul"},"Video & audio calling"),(0,i.kt)("li",{parentName:"ul"},"File sharing"),(0,i.kt)("li",{parentName:"ul"},"Call recording"),(0,i.kt)("li",{parentName:"ul"},"Camera Input selection"),(0,i.kt)("li",{parentName:"ul"},"Private chat rooms"),(0,i.kt)("li",{parentName:"ul"},"Screen Sharing")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"User Management features:")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"User authentication"),(0,i.kt)("li",{parentName:"ul"},"Real-time customer queue"),(0,i.kt)("li",{parentName:"ul"},"Virtual waiting & meeting rooms"),(0,i.kt)("li",{parentName:"ul"},"Customer and provider profiles"),(0,i.kt)("li",{parentName:"ul"},"Invitation sharing by link, email, & text"),(0,i.kt)("li",{parentName:"ul"},"Capture user data, add, share, send notes, and share files"),(0,i.kt)("li",{parentName:"ul"},"Appointment, message, and call history")))}u.isMDXComponent=!0},7282:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var a=n(7896),i=(n(2784),n(876));const r={},o=void 0,s={unversionedId:"snippets/interface",id:"snippets/interface",title:"interface",description:"Client application interface",source:"@site/docs/snippets/interface.md",sourceDirName:"snippets",slug:"/snippets/interface",permalink:"/q-consultation/snippets/interface",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/snippets/interface.md",tags:[],version:"current",frontMatter:{}},l={},p=[{value:"Client application interface",id:"client-application-interface",level:3},{value:"Provider application interface",id:"provider-application-interface",level:3}],c={toc:p};function u(e){let{components:t,...r}=e;return(0,i.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h3",{id:"client-application-interface"},"Client application interface"),(0,i.kt)("p",null,"Main screen:\n",(0,i.kt)("img",{src:n(6238).Z,width:"1440",height:"900"})),(0,i.kt)("p",null,"Waiting room:\n",(0,i.kt)("img",{src:n(4082).Z,width:"1440",height:"900"})),(0,i.kt)("p",null,"Video call:\n",(0,i.kt)("img",{src:n(9019).Z,width:"1440",height:"900"})),(0,i.kt)("h3",{id:"provider-application-interface"},"Provider application interface"),(0,i.kt)("p",null,"Main screen:\n",(0,i.kt)("img",{src:n(8732).Z,width:"1440",height:"900"})),(0,i.kt)("p",null,"Video call:\n",(0,i.kt)("img",{src:n(3226).Z,width:"1440",height:"900"})))}u.isMDXComponent=!0},3052:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var a=n(7896),i=(n(2784),n(876));const r={},o=void 0,s={unversionedId:"snippets/supported",id:"snippets/supported",title:"supported",description:"Supported operating systems:",source:"@site/docs/snippets/supported.md",sourceDirName:"snippets",slug:"/snippets/supported",permalink:"/q-consultation/snippets/supported",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/snippets/supported.md",tags:[],version:"current",frontMatter:{}},l={},p=[],c={toc:p};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Supported operating systems"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Windows 10"),(0,i.kt)("li",{parentName:"ul"},"macOS Mojave"),(0,i.kt)("li",{parentName:"ul"},"Ubuntu LTS/Debian 9.x")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Supported browsers:")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Chrome (Desktop & Mobile): ",(0,i.kt)("inlineCode",{parentName:"li"},"(Current - 1) and Current")),(0,i.kt)("li",{parentName:"ul"},"Firefox (Desktop & Mobile): ",(0,i.kt)("inlineCode",{parentName:"li"},"(Current - 1) and Current")),(0,i.kt)("li",{parentName:"ul"},"Safari (Desktop & Mobile): ",(0,i.kt)("inlineCode",{parentName:"li"},"(Current - 1) and Current")),(0,i.kt)("li",{parentName:"ul"},"Opera (Desktop): ",(0,i.kt)("inlineCode",{parentName:"li"},"(Current - 1) and Current")),(0,i.kt)("li",{parentName:"ul"},"Edge (Desktop): ",(0,i.kt)("inlineCode",{parentName:"li"},"(Current - 1) and Current"))),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"em"},"(Current - 1) and Current")," denotes that we support the current stable version of the browser and the version that preceded it. For example, if the current version of a browser is 24.x, we support the 24.x and 23.x versions.")),(0,i.kt)("p",null,"Please note that Q-Consultation Lite may work on other browsers and operating systems, but these are not tested nor officially supported at this time."))}u.isMDXComponent=!0},6238:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/001-4c098696084e2b3b3cc7be1ae8197ee5.png"},4082:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/002-06de7885634e2109375488698c3e5166.png"},9019:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/003-ed8ec5adff6efa15f0108d2a0902b9c5.png"},8732:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/004-8897a783d71abf516827e7f5796b0962.png"},3226:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/005-470feeead86169c91e71a2df6bd26a18.png"}}]);