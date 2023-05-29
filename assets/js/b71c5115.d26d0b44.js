"use strict";(self.webpackChunkq_consultation_doc=self.webpackChunkq_consultation_doc||[]).push([[213,769,120],{876:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(2784);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),m=o,k=d["".concat(s,".").concat(m)]||d[m]||u[m]||i;return n?a.createElement(k,r(r({ref:t},c),{},{components:n})):a.createElement(k,r({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,r[1]=l;for(var p=2;p<i;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3229:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>p,toc:()=>u});var a=n(7896),o=(n(2784),n(876)),i=n(1945),r=n(5580);const l={sidebar_label:"Configurations",sidebar_position:2},s="Configurations",p={unversionedId:"dev/setup-and-deployment/configurations",id:"dev/setup-and-deployment/configurations",title:"Configurations",description:"Configure application",source:"@site/docs/dev/setup-and-deployment/configurations.md",sourceDirName:"dev/setup-and-deployment",slug:"/dev/setup-and-deployment/configurations",permalink:"/q-consultation/dev/setup-and-deployment/configurations",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/dev/setup-and-deployment/configurations.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_label:"Configurations",sidebar_position:2},sidebar:"docPagesSidebar",previous:{title:"Scripts",permalink:"/q-consultation/dev/setup-and-deployment/scripts"},next:{title:"Project structure",permalink:"/q-consultation/dev/setup-and-deployment/project-structure"}},c={},u=[{value:"Configure application",id:"configure-application",level:2},{value:"Upload schema",id:"upload-schema",level:2}],d={toc:u};function m(e){let{components:t,...l}=e;return(0,o.kt)("wrapper",(0,a.Z)({},d,l,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"configurations"},"Configurations"),(0,o.kt)("h2",{id:"configure-application"},"Configure application"),(0,o.kt)(i.default,{components:l.components,mdxType:"ScriptConfig"}),(0,o.kt)("p",null,"You can also manually add the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/qconsultation_config/.env"},(0,o.kt)("strong",{parentName:"a"},'".env"'))," file to the ",(0,o.kt)("strong",{parentName:"p"},'"qconsultation_config"')," folder."),(0,o.kt)("p",null,"You will need to set the following keys with your credentials:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},' # [Required] QuickBlox application Id\n QB_SDK_CONFIG_APP_ID=-1\n # [Required] QuickBlox application Auth Key\n QB_SDK_CONFIG_AUTH_KEY=""\n # [Required] QuickBlox application Auth Secret\n "QB_SDK_CONFIG_AUTH_SECRET=""\n # [Required] QuickBlox account key\n QB_SDK_CONFIG_ACCOUNT_KEY=""\n # Should QuickBlox JS SDK work in debug mode (logging enabled)\n QB_SDK_CONFIG_DEBUG=false\n # QuickBlox JS SDK custom API endpoint\n QB_SDK_CONFIG_ENDPOINT_API="api.quickblox.com"\n # QuickBlox JS SDK custom chat endpoint\n QB_SDK_CONFIG_ENDPOINT_CHAT="chat.quickblox.com"\n # [Optional if you use QuickBlox Basic Plan] QuickBlox JS SDK custom ICE servers\n QB_SDK_CONFIG_ICE_SERVERS=[]\n # [Required if you need integration with your API] Bearer token\n BEARER_TOKEN=""\n # [Required if you need integration with your API] QuickBlox account owner email\n QB_ADMIN_EMAIL=""\n # [Required if you need integration with your API] QuickBlox account owner password\n QB_ADMIN_PASSWORD=""\n # [Required if you need AI features] OpenAI API Key\n OPENAI_API_KEY=""\n # Enable AI Quick answer feature\n AI_QUICK_ANSWER=true\n # Enable AI Suggest provider feature\n AI_SUGGEST_PROVIDER=true\n # Enable AI Record analytics feature\n AI_RECORD_ANALYTICS=true\n # Enable redux-logger\n ENABLE_REDUX_LOGGER=false\n # URL of the client application. Used by Share Link modal. (If not set, then Share Link will not be displayed in the application)\n CLIENT_APP_URL="https://localhost:3001"\n # URL API.\n SERVER_APP_URL="http://localhost:4000"\n # Default language (en / ua)\n DEFAULT_LANGUAGE="en"\n # File upload limit in bytes\n FILE_SIZE_LIMIT=10485760\n # Available for upload expansion files\n FILE_EXTENSIONS_WHITELIST="gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif"\n')),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"em"},"[Required]")," denotes that these variables must be set. Without them, the application will not work correctly.")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"em"},"[Optional if you use QuickBlox Basic Plan]")," denotes that these variables may not be set only for the QuickBlox Basic Plan, otherwise they are required.")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"em"},"[Required if you need integration with your API]")," denotes that these variables must be set to enable integration with your API. Enabling this integration will make it easier to work with available queries from your API.")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"em"},"[Required if you need AI features]")," denotes that these variables must be set to enable and operate the AI feature..")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},(0,o.kt)("inlineCode",{parentName:"p"},"FILE_SIZE_LIMIT")," is used to initially check the size of uploaded files and display an error if it is exceeded. Modify it according to the limitations of your QuickBlox Plan."),(0,o.kt)("table",{parentName:"admonition"},(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Basic"),(0,o.kt)("th",{parentName:"tr",align:null},"Startup"),(0,o.kt)("th",{parentName:"tr",align:null},"Growth"),(0,o.kt)("th",{parentName:"tr",align:null},"HIPAA"),(0,o.kt)("th",{parentName:"tr",align:null},"Enterprise"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"10 Mb"),(0,o.kt)("td",{parentName:"tr",align:null},"25 Mb"),(0,o.kt)("td",{parentName:"tr",align:null},"50 Mb"),(0,o.kt)("td",{parentName:"tr",align:null},"50 Mb"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"https://quickblox.com/enterprise/#get"},"Contact our sales team")))))),(0,o.kt)("p",null,"If you have QuickBlox Basic plan (Shared server), you can skip the following step. In case you have QuickBlox Enterprise plan, to specify custom Ice Servers instead of default ones you can set value for key ",(0,o.kt)("strong",{parentName:"p"},'"QB_SDK_CONFIG_ICE_SERVERS"'),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'[\n  {\n    "urls": "stun:stun.services.mozilla.com",\n    "username": "louis@mozilla.com",\n    "credential": "webrtcdemo"\n  },\n  {\n    "urls": ["stun:stun.example.com", "stun:stun-1.example.com"]\n  }\n]\n')),(0,o.kt)("p",null,"For more details on the format see ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer"},"RTCIceServer docs"),"."),(0,o.kt)("h2",{id:"upload-schema"},"Upload schema"),(0,o.kt)(r.default,{components:l.components,mdxType:"ScriptSchema"}),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"If you have created a QuickBlox account via Google or GitHub and you do not have a password, then this option for adding a schema is not suitable for you and you need to add it manually.")),(0,o.kt)("p",null,"You can also add a scheme manually through the ",(0,o.kt)("a",{parentName:"p",href:"https://admin.quickblox.com"},"Admin Panel"),"."),(0,o.kt)("p",null,"You will find the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/qconsultation_config/schema.yml"},(0,o.kt)("strong",{parentName:"a"},"schema.yml"))," file in the ",(0,o.kt)("strong",{parentName:"p"},"qconsultation_config")," folder of the project directory."),(0,o.kt)("p",null,"To import this file to the QuickBlox admin panel, follow the steps below:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"If you have the QuickBlox application open in the admin panel, go to the tab ",(0,o.kt)("strong",{parentName:"li"},"Custom"),"."),(0,o.kt)("li",{parentName:"ol"},"In the top-right corner, you will find the ",(0,o.kt)("strong",{parentName:"li"},"Import")," tab."),(0,o.kt)("li",{parentName:"ol"},"There, click ",(0,o.kt)("strong",{parentName:"li"},"Browse")," for the ",(0,o.kt)("strong",{parentName:"li"},"Import schema File"),"."),(0,o.kt)("li",{parentName:"ol"},"Once the file is added, click ",(0,o.kt)("strong",{parentName:"li"},"Import Schema"),".")),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(5349).Z,width:"1602",height:"885"})),(0,o.kt)("p",null,"If something goes wrong, you can also manually create a custom class (",(0,o.kt)("strong",{parentName:"p"},"Appointment")," and ",(0,o.kt)("strong",{parentName:"p"},"Record"),") in the way described below:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"In the top-right corner, choose ",(0,o.kt)("strong",{parentName:"li"},"List")," of the ",(0,o.kt)("strong",{parentName:"li"},"Custom")," tab."),(0,o.kt)("li",{parentName:"ol"},"There, click ",(0,o.kt)("strong",{parentName:"li"},"Add")," and choose ",(0,o.kt)("strong",{parentName:"li"},"Add new class")," from the drop-down menu.")),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(822).Z,width:"1602",height:"885"})),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"A modal window will appear where you need to specify the class name and create and create its fields:")),(0,o.kt)("p",null,"Appointment"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"  provider_id: Integer\n  client_id: Integer\n  dialog_id: String\n  description: String\n  priority: Integer\n  notes: String\n  conclusion: String\n  language: String\n  date_end: Date\n")),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(6409).Z,width:"623",height:"753"})),(0,o.kt)("p",null,"Record"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"  name: String\n  appointment_id: String\n  transcription: String_a\n  summary: String\n  actions: String\n  uid: String\n")),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(39).Z,width:"1228",height:"1122"})),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"After all the fields added, click ",(0,o.kt)("strong",{parentName:"li"},"Create class"),"."),(0,o.kt)("li",{parentName:"ol"},"Once done, the modal window will close. You need to choose ",(0,o.kt)("strong",{parentName:"li"},"Edit permission"),", set the permissions as shown on the below screenshot and click ",(0,o.kt)("strong",{parentName:"li"},"Edit permissions"),":")),(0,o.kt)("p",null,"Appointment"),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(586).Z,width:"623",height:"431"})),(0,o.kt)("p",null,"Record"),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(9307).Z,width:"1224",height:"838"})))}m.isMDXComponent=!0},1945:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>k,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=n(7896),o=(n(2784),n(876));const i={},r=void 0,l={unversionedId:"snippets/script-config",id:"snippets/script-config",title:"script-config",description:"In order to work correctly application need to know a set of configs.",source:"@site/docs/snippets/script-config.md",sourceDirName:"snippets",slug:"/snippets/script-config",permalink:"/q-consultation/snippets/script-config",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/snippets/script-config.md",tags:[],version:"current",frontMatter:{}},s={},p=[],c=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",t)},u=c("Tabs"),d=c("TabItem"),m={toc:p};function k(e){let{components:t,...i}=e;return(0,o.kt)("wrapper",(0,a.Z)({},m,i,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"In order to work correctly application need to know a set of configs.\nYou can create a configuration file by running this command and following the instructions in the terminal:"),(0,o.kt)(u,{groupId:"yarn-npm",mdxType:"Tabs"},(0,o.kt)(d,{value:"npm",label:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm run init:config\n"))),(0,o.kt)(d,{value:"yarn",label:"yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn run init:config\n")))),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(7560).Z,width:"1258",height:"1202"})))}k.isMDXComponent=!0},5580:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>k,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var a=n(7896),o=(n(2784),n(876));const i={},r=void 0,l={unversionedId:"snippets/script-schema",id:"snippets/script-schema",title:"script-schema",description:"To make online appointments and video records work in the Q-Consultation app, it\u2019s necessary to import an appointment schema file to the QuickBlox admin panel.",source:"@site/docs/snippets/script-schema.md",sourceDirName:"snippets",slug:"/snippets/script-schema",permalink:"/q-consultation/snippets/script-schema",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/snippets/script-schema.md",tags:[],version:"current",frontMatter:{}},s={},p=[],c=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",t)},u=c("Tabs"),d=c("TabItem"),m={toc:p};function k(e){let{components:t,...i}=e;return(0,o.kt)("wrapper",(0,a.Z)({},m,i,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"To make online appointments and video records work in the Q-Consultation app, it\u2019s necessary to import an appointment schema file to the QuickBlox admin panel."),(0,o.kt)("p",null,"You can add the schema automatically by running this command and following the instructions in the terminal."),(0,o.kt)(u,{groupId:"yarn-npm",mdxType:"Tabs"},(0,o.kt)(d,{value:"npm",label:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm run init:schema\n"))),(0,o.kt)(d,{value:"yarn",label:"yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn run init:schema\n")))),(0,o.kt)("p",null,(0,o.kt)("img",{src:n(7380).Z,width:"1076",height:"388"})))}k.isMDXComponent=!0},5349:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/008-52312a141e92898f1ebe4451894c0b19.png"},822:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/009-a4be9c708ee6eb1586db1e97014d362a.png"},6409:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/010-4b83e465be082210e83e3ae02112a1a9.png"},586:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/011-e16042dcae5740223d3d64b688517937.png"},39:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/012-ef7c77064f6a469e2113fb67fc17bbcc.jpg"},9307:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/013-ea30c71d0f9c4a967992b3dce053b8d3.jpg"},7560:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/config-1607cea16413bffe381bebdc0d71fb28.jpeg"},7380:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/schema-f3280481447de55e51b65971ad655f71.jpeg"}}]);