"use strict";(self.webpackChunk_qc_doc_docusaurus=self.webpackChunk_qc_doc_docusaurus||[]).push([[225],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(n),m=r,h=c["".concat(s,".").concat(m)]||c[m]||d[m]||i;return n?a.createElement(h,o(o({ref:t},p),{},{components:n})):a.createElement(h,o({ref:t},p))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:r,o[1]=l;for(var u=2;u<i;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6390:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>u});var a=n(7462),r=(n(7294),n(3905));const i={sidebar_label:"Contributing",sidebar_position:3},o="Contributing",l={unversionedId:"dev/development/contributing",id:"dev/development/contributing",title:"Contributing",description:"First off, thanks that you help us to make Q-Consultation better.",source:"@site/docs/dev/development/contributing.md",sourceDirName:"dev/development",slug:"/dev/development/contributing",permalink:"/q-consultation/dev/development/contributing",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/documentation/docs/dev/development/contributing.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_label:"Contributing",sidebar_position:3},sidebar:"docPagesSidebar",previous:{title:"Integration pages",permalink:"/q-consultation/dev/development/apps/integration-pages"}},s={},u=[{value:"Contributing Process",id:"contributing-process",level:2},{value:"Proposing a new Issue",id:"proposing-a-new-issue",level:2},{value:"Pull Request Guidelines",id:"pull-request-guidelines",level:2},{value:"Code Guidelines",id:"code-guidelines",level:2},{value:"Code of Conduct",id:"code-of-conduct",level:2},{value:"Our Pledge",id:"our-pledge",level:3},{value:"Our Standards",id:"our-standards",level:3},{value:"Our Responsibilities",id:"our-responsibilities",level:3},{value:"Scope",id:"scope",level:3}],p={toc:u},c="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"contributing"},"Contributing"),(0,r.kt)("p",null,"First off, thanks that you help us to make Q-Consultation better.\nFeedback and suggestions for improvement always welcome :)"),(0,r.kt)("p",null,"Please note we have a ",(0,r.kt)("a",{parentName:"p",href:"#code-of-conduct"},"code of conduct"),", please follow it in all your interactions with the project."),(0,r.kt)("h2",{id:"contributing-process"},"Contributing Process"),(0,r.kt)("p",null,"Once you've found an issue you'd like to work on, please follow these steps to make your contribution:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Comment on it and say you're working on that issue. This is to avoid conflicts with others also working on the issue."),(0,r.kt)("li",{parentName:"ol"},"Write your code and submit your pull request. Be sure to read and follow our ",(0,r.kt)("a",{parentName:"li",href:"#pull-request-guidelines"},"pull request guidelines")," and ",(0,r.kt)("a",{parentName:"li",href:"#code-guidelines"},"code guidelines"),"!"),(0,r.kt)("li",{parentName:"ol"},"Wait for code review and address any issues raised as soon as you can.")),(0,r.kt)("admonition",{title:"A note on collaboration",type:"note"},(0,r.kt)("p",{parentName:"admonition"},"We encourage people to collaborate as much as possible. We especially appreciate contributors reviewing each others pull requests, as long as you are ",(0,r.kt)("a",{parentName:"p",href:"https://medium.com/@otarutunde/comments-during-code-reviews-2cb7791e1ac7"},"kind and constructive")," when you do so.")),(0,r.kt)("h2",{id:"proposing-a-new-issue"},"Proposing a new Issue"),(0,r.kt)("p",null,"If you want to work on something that there is no GitHub issue for, follow these steps:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a new GitHub issue associated with the relevant repository and propose your change there. Be sure to include implementation details and the rationale for the proposed change.",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"We are very reluctant to accept random pull requests without a related issue created first."))),(0,r.kt)("li",{parentName:"ol"},"Wait for a project maintainer to evaluate your issue and decide whether it's something that we will accept a pull request for."),(0,r.kt)("li",{parentName:"ol"},'Once the project maintainer has approved the issue, you may start work on code as described in the "',(0,r.kt)("a",{parentName:"li",href:"#contributing-process"},"Contribution process"),'" section above.')),(0,r.kt)("h2",{id:"pull-request-guidelines"},"Pull Request Guidelines"),(0,r.kt)("p",null,"Read and follow the contributing guidelines and code of conduct for the project."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Make A Branch")),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Please create a separate branch for each issue that you're working on. Do not make changes to the default branch (e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"master"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"develop"),") of your fork."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Push Your Code ASAP")),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},'Push your code as soon as you can. Follow the "',(0,r.kt)("a",{parentName:"li",href:"https://www.worklytics.co/blog/commit-early-push-often/"},"early and often"),'" rule.'),(0,r.kt)("li",{parentName:"ul"},"Make a pull request as soon as you can and ",(0,r.kt)("strong",{parentName:"li"},'mark the title with a "',"[WIP]",'"'),". You can create a ",(0,r.kt)("a",{parentName:"li",href:"https://help.github.com/en/articles/about-pull-requests#draft-pull-requests"},"draft pull request"),"."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Describe Your Pull Request")),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Use the format specified in pull request template for the repository. ",(0,r.kt)("strong",{parentName:"li"},"Populate the stencil completely")," for maximum verbosity.",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Tag the actual issue number by replacing ",(0,r.kt)("inlineCode",{parentName:"li"},"#[issue_number]")," e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"#42"),". This closes the issue when your PR is merged."),(0,r.kt)("li",{parentName:"ul"},"Tag the actual issue author by replacing ",(0,r.kt)("inlineCode",{parentName:"li"},"@[author]")," e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"@issue_author"),". This brings the reporter of the issue into the conversation."),(0,r.kt)("li",{parentName:"ul"},"Mark the tasks off your checklist by adding an ",(0,r.kt)("inlineCode",{parentName:"li"},"x")," in the ",(0,r.kt)("inlineCode",{parentName:"li"},"[ ]")," e.g. ",(0,r.kt)("inlineCode",{parentName:"li"},"[x]"),". This checks off the boxes in your to-do list. The more boxes you check, the better."))),(0,r.kt)("li",{parentName:"ul"},"Describe your change in detail. Too much detail is better than too little."),(0,r.kt)("li",{parentName:"ul"},"Describe how you tested your change."),(0,r.kt)("li",{parentName:"ul"},"Check the Preview tab to make sure the Markdown is correctly rendered and that all tags and references are linked. If not, go back and edit the Markdown."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Request Review")),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Once your PR is ready, ",(0,r.kt)("strong",{parentName:"li"},'remove the "',"[WIP]",'" from the title')," and/or change it from a draft PR to a regular PR."),(0,r.kt)("li",{parentName:"ul"},"If a specific reviewer is not assigned automatically, please ",(0,r.kt)("a",{parentName:"li",href:"https://help.github.com/en/articles/requesting-a-pull-request-review"},"request a review")," from the project maintainer and any other interested parties manually."))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Incorporating feedback")),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"If your PR gets a 'Changes requested' review, you will need to address the feedback and update your PR by pushing to the same branch. You don't need to close the PR and open a new one."),(0,r.kt)("li",{parentName:"ul"},"Be sure to ",(0,r.kt)("strong",{parentName:"li"},"re-request review")," once you have made changes after a code review."),(0,r.kt)("li",{parentName:"ul"},"Asking for a re-review makes it clear that you addressed the changes that were requested and that it's waiting on the maintainers instead of the other way round.")))),(0,r.kt)("h2",{id:"code-guidelines"},"Code Guidelines"),(0,r.kt)("p",null,"Don't try to prematurely optimize your code, keep it readable and understandable. All code in any code-base should look like a single person typed it, even when many people are contributing to it. Strictly enforce the agreed-upon style."),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://eslint.org/"},"ESLint")," and ",(0,r.kt)("a",{parentName:"p",href:"https://prettier.io/"},"Prettier")," are used to maintain the same code style in the project."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Prettier config: ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/.prettierrc"},".prettierrc")),(0,r.kt)("p",{parentName:"admonition"},"ESLint config:"),(0,r.kt)("ul",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/apps/api/.eslintrc"},"API config")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/apps/client/.eslintrc"},"Client config")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/apps/provider/.eslintrc"},"Provider config")))),(0,r.kt)("h2",{id:"code-of-conduct"},"Code of Conduct"),(0,r.kt)("h3",{id:"our-pledge"},"Our Pledge"),(0,r.kt)("p",null,"In the interest of fostering an open and welcoming environment, we as\ncontributors and maintainers pledge to making participation in our project and\nour community a harassment-free experience for everyone, regardless of age, body\nsize, disability, ethnicity, gender identity and expression, level of experience,\nnationality, personal appearance, race, religion, or sexual identity and\norientation."),(0,r.kt)("h3",{id:"our-standards"},"Our Standards"),(0,r.kt)("p",null,"Examples of behavior that contributes to creating a positive environment\ninclude:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Using welcoming and inclusive language"),(0,r.kt)("li",{parentName:"ul"},"Being respectful of differing viewpoints and experiences"),(0,r.kt)("li",{parentName:"ul"},"Gracefully accepting constructive criticism"),(0,r.kt)("li",{parentName:"ul"},"Focusing on what is best for the community"),(0,r.kt)("li",{parentName:"ul"},"Showing empathy towards other community members")),(0,r.kt)("p",null,"Examples of unacceptable behavior by participants include:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The use of sexualized language or imagery and unwelcome sexual attention or\nadvances"),(0,r.kt)("li",{parentName:"ul"},"Trolling, insulting/derogatory comments, and personal or political attacks"),(0,r.kt)("li",{parentName:"ul"},"Public or private harassment"),(0,r.kt)("li",{parentName:"ul"},"Publishing others' private information, such as a physical or electronic\naddress, without explicit permission"),(0,r.kt)("li",{parentName:"ul"},"Other conduct which could reasonably be considered inappropriate in a\nprofessional setting")),(0,r.kt)("h3",{id:"our-responsibilities"},"Our Responsibilities"),(0,r.kt)("p",null,"Project maintainers are responsible for clarifying the standards of acceptable\nbehavior and are expected to take appropriate and fair corrective action in\nresponse to any instances of unacceptable behavior."),(0,r.kt)("p",null,"Project maintainers have the right and responsibility to remove, edit, or\nreject comments, commits, code, wiki edits, issues, and other contributions\nthat are not aligned to this Code of Conduct, or to ban temporarily or\npermanently any contributor for other behaviors that they deem inappropriate,\nthreatening, offensive, or harmful."),(0,r.kt)("h3",{id:"scope"},"Scope"),(0,r.kt)("p",null,"This Code of Conduct applies both within project spaces and in public spaces\nwhen an individual is representing the project or its community. Examples of\nrepresenting a project or community include using an official project e-mail\naddress, posting via an official social media account, or acting as an appointed\nrepresentative at an online or offline event. Representation of a project may be\nfurther defined and clarified by project maintainers."))}d.isMDXComponent=!0}}]);