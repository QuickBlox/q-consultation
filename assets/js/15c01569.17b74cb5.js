"use strict";(self.webpackChunkq_consultation_doc=self.webpackChunkq_consultation_doc||[]).push([[651],{876:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>g});var a=n(2784);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),g=i,m=d["".concat(l,".").concat(g)]||d[g]||u[g]||o;return n?a.createElement(m,r(r({ref:t},p),{},{components:n})):a.createElement(m,r({ref:t},p))}));function g(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,r[1]=s;for(var c=2;c<o;c++)r[c]=n[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5977:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7896),i=(n(2784),n(876));const o={sidebar_label:"Authorization",sidebar_position:4},r="Authorization",s={unversionedId:"dev/development/authorization",id:"dev/development/authorization",title:"Authorization",description:"Q-Consultation comprises two types of users Client and Provider, along with an API.",source:"@site/docs/dev/development/authorization.md",sourceDirName:"dev/development",slug:"/dev/development/authorization",permalink:"/q-consultation/dev/development/authorization",draft:!1,editUrl:"https://github.com/QuickBlox/q-consultation/tree/master/packages/documentation/docs/dev/development/authorization.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_label:"Authorization",sidebar_position:4},sidebar:"docPagesSidebar",previous:{title:"Integration pages",permalink:"/q-consultation/dev/development/integration-pages"},next:{title:"\ud83d\udcbb Contributing",permalink:"/q-consultation/dev/contributing"}},l={},c=[{value:"QuickBlox SDK Methods",id:"quickblox-sdk-methods",level:2},{value:"How do we utilize the QuickBlox SDK?",id:"how-do-we-utilize-the-quickblox-sdk",level:2},{value:"Client &amp; Provider Applications",id:"client--provider-applications",level:3},{value:"API Application",id:"api-application",level:3},{value:"Implementation details of Client &amp; Provider.",id:"implementation-details-of-client--provider",level:2},{value:"Login",id:"login",level:3},{value:"Logout",id:"logout",level:3},{value:"Registration",id:"registration",level:3},{value:"API Authentication",id:"api-authentication",level:2},{value:"Endpoints",id:"endpoints",level:3},{value:"Node.js Implementation",id:"nodejs-implementation",level:3},{value:"Replacing login with email",id:"replacing-login-with-email",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"authorization"},"Authorization"),(0,i.kt)("p",null,"Q-Consultation comprises two types of users: Clients (users who receive a specific service) or Providers (users who offer a certain service). Separate applications have been developed for each user type: ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/client"},"Client")," and ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/provider"},"Provider"),", along with an ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/api"},"API"),"."),(0,i.kt)("p",null,"For implementing authorization within the application, the functionality of QuickBlox was utilized, which offers various authentication options. Currently, the app features email and password-based authentication, although QuickBlox supports additional authentication methods."),(0,i.kt)("p",null,"You can delve into the relevant documentation through the following link: ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com"},"https://docs.quickblox.com"),". Additionally, more detailed information about the authentication process in QuickBlox can be found at this link: ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/js-authentication"},"https://docs.quickblox.com/docs/js-authentication"),"."),(0,i.kt)("h2",{id:"quickblox-sdk-methods"},"QuickBlox SDK Methods"),(0,i.kt)("p",null,"First, let's briefly go over the QuickBlox SDK methods necessary for authentication."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"SDK Initialization: The ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/js-setup#initialize-quickblox-sdk"},"QB.init")," method allows initializing the SDK using the application's credentials.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Session Creation: The ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/js-authentication#create-session"},"QB.createSession")," method establishes a user session.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Session Termination: You can end the current session using the ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/js-authentication#destroy-session-token"},"QB.destroySession")," method.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"User Authentication: The ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/js-authentication#log-in-user"},"QB.login")," method facilitates the user authentication process.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"New User Creation: The ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/docs/js-users#create-user."},"QB.users.create")," method is used to create a new user and requires an active session."))),(0,i.kt)("h2",{id:"how-do-we-utilize-the-quickblox-sdk"},"How do we utilize the QuickBlox SDK?"),(0,i.kt)("p",null,"To simplify the usage of SDK methods, we've created wrappers in the form of promises, enabling convenient interaction with QuickBlox SDK methods. Additional details about wrapper functions are available through the following paths:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/client/src/qb-api-calls"},"Client")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/src/qb-api-calls"},"Provider")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/api/src/services/quickblox"},"API"))),(0,i.kt)("p",null,"Below, you will find the functions that we use for authentication using the SDK."),(0,i.kt)("h3",{id:"client--provider-applications"},"Client & Provider Applications"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function QBInit"',title:'"Function','QBInit"':!0},"declare function QBInit(params: QBInitParams): void\n\ntype QBInitParams = {\n  appIdOrToken: string | number\n  authKeyOrAppId: string | number\n  authSecret?: string\n  accountKey: string\n  config?: {\n    debug: boolean\n    endpoints: {\n      chat?: string\n      api?: string\n    }\n    webrtc: {\n      iceServers?: RTCIceServer[]\n    }\n  }\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function QBCreateSession"',title:'"Function','QBCreateSession"':!0},"declare function QBCreateSession():  new Promise<QBSession>\n\ninterface QBSession {\n  _id: string\n  application_id: number\n  /** Date ISO string */\n  created_at: string\n  id: number\n  nonce: string\n  token: string\n  ts: number\n  /** Date ISO string */\n  updated_at: string\n  user_id: QBUser['id']\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function loginToQuickBlox"',title:'"Function','loginToQuickBlox"':!0},"declare function loginToQuickBlox(params: QBLoginParams): Promise<QBUser>\n\ntype QBLoginParams =\n  | {\n      login: string\n      password: string\n    }\n  | {\n      email: string\n      password: string\n    }\n\ninterface QBUser {\n  id: number\n  full_name: string\n  email: string\n  login: string\n  phone: string\n  website: string\n  /** Date ISO string */\n  created_at: string\n  /** Date ISO string */\n  updated_at: string\n  /** Date ISO string */\n  last_request_at: string\n  external_user_id: null\n  facebook_id: string | null\n  blob_id: null\n  custom_data: string | null\n  age_over16: boolean\n  allow_statistics_analysis: boolean\n  allow_sales_activities: boolean\n  parents_contacts: string\n  user_tags: string | null\n  password?: string\n  old_password?: string\n}\n")),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"It's also important to note that logging into the system requires the presence of a previously created session, as mentioned earlier.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function registrationAccount"',title:'"Function','registrationAccount"':!0},"declare function registrationAccount(\n  params: QBCreateUserParams,\n): Promise<QBUser>\n\ntype QBLoginParams =\n  | {\n      login: string\n      password: string\n    }\n  | {\n      email: string\n      password: string\n    }\n\ninterface QBUser {\n  id: number\n  full_name: string\n  email: string\n  login: string\n  phone: string\n  website: string\n  /** Date ISO string */\n  created_at: string\n  /** Date ISO string */\n  updated_at: string\n  /** Date ISO string */\n  last_request_at: string\n  external_user_id: null\n  facebook_id: string | null\n  blob_id: null\n  custom_data: string | null\n  age_over16: boolean\n  allow_statistics_analysis: boolean\n  allow_sales_activities: boolean\n  parents_contacts: string\n  user_tags: string | null\n  password?: string\n  old_password?: string\n}\n")),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"Just like with the login method, it's also essential here to have a pre-created session.")),(0,i.kt)("h3",{id:"api-application"},"API Application"),(0,i.kt)("p",null,"In the API application, we extended the QuickBlox class."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"class QBApi extends QuickBlox {\n  public axios: AxiosInstance\n  public init(): void\n}\n")),(0,i.kt)("p",null,"This class also includes axios for sending requests using ",(0,i.kt)("a",{parentName:"p",href:"https://docs.quickblox.com/reference/overview"},"QuickBlox API endpoints"),", as well as a overridden init method that is used without parameters."),(0,i.kt)("p",null,"Within our API, there are two instances that are used for making requests on behalf of an administrator and a user:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const QBUserApi: QBApi\nconst QBAdminApi: QBApi\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"QBUserApi")," creates an instance of the ",(0,i.kt)("inlineCode",{parentName:"p"},"QBApi")," class, which is intended for user session operations. The session data is obtained from the Authorization header in the request. When using this instance, initialization and the authentication process (login) occur automatically before each request."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"QBAdminApi")," also creates an instance of the ",(0,i.kt)("inlineCode",{parentName:"p"},"QBApi")," class and is designed for operations on behalf of an administrator. In this case, all operations (including initialization and authentication) need to be performed manually in the places where they are required."),(0,i.kt)("p",null,"More detailed information about the implementation can be found at this ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/api/src/plugins/quickblox"},"link"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function qbCreateSession"',title:'"Function','qbCreateSession"':!0},"declare const qbCreateSession = (QB: QBApi, credentials?: QBLoginParams) =>\n  Promise<QBSession>\n\ntype QBLoginParams =\n  | {\n      login: string\n      password: string\n    }\n  | {\n      email: string\n      password: string\n    }\n  | {\n      provider: 'firebase_phone'\n      firebase_phone: { access_token: string; project_id: string }\n    }\n\ninterface QBSession {\n  _id: string\n  application_id: number\n  /** Date ISO string */\n  created_at: string\n  id: number\n  nonce: string\n  token: string\n  ts: number\n  /** Date ISO string */\n  updated_at: string\n  user_id: QBUser['id']\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function qbGetSession"',title:'"Function','qbGetSession"':!0},"declare const qbGetSession = (QB: QBApi) => Promise<QBSession>\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function qbLogin"',title:'"Function','qbLogin"':!0},"declare const qbLogin = (QB: QBApi, credentials: LoginCredentials) =>\n  Promise<QBSession>\n\ntype LoginCredentials =\n  | {\n      login: string\n      password: string\n    }\n  | {\n      email: string\n      password: string\n    }\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="Function qbCreateUser"',title:'"Function','qbCreateUser"':!0},"declare const qbCreateUser = <\n  T = QBCreateUserWithLogin | QBCreateUserWithEmail,\n>(\n  QB: QBApi,\n  data: T,\n) => Promise<QBUser>\n\ntype QBCreateUserWithLogin = {\n  login: string\n  password: string\n  blob_id?: number\n  custom_data?: string\n  email?: string\n  external_user_id?: string | number\n  facebook_id?: string\n  full_name?: string\n  phone?: string\n  tag_list?: string | string[]\n  twitter_id?: string\n  website?: string\n}\ntype QBCreateUserWithEmail = {\n  email: string\n  password: string\n  blob_id?: number\n  custom_data?: string\n  external_user_id?: string | number\n  facebook_id?: string\n  full_name?: string\n  login?: string\n  phone?: string\n  tag_list?: string | string[]\n  twitter_id?: string\n  website?: string\n}\n\ninterface QBUser {\n  id: number\n  full_name: string\n  email: string\n  /** Date ISO string */\n  created_at: string\n  /** Date ISO string */\n  updated_at: string\n  /** Date ISO string */\n  last_request_at: string\n  custom_data: string | null\n  user_tags: string | null\n  password?: string\n  old_password?: string\n}\n")),(0,i.kt)("h2",{id:"implementation-details-of-client--provider"},"Implementation details of Client & Provider."),(0,i.kt)("p",null,'As mentioned above, Q-Consultation includes two applications for login and supports "email + password" authentication. Below are examples of authentication implementation for application versions using ',(0,i.kt)("a",{parentName:"p",href:"https://react.dev"},"React")," and ",(0,i.kt)("a",{parentName:"p",href:"https://redux-saga.js.org"},"Redux Saga"),"."),(0,i.kt)("p",null,"In Q-Consultation, login, logout, and registration functionalities are handled through the ",(0,i.kt)("inlineCode",{parentName:"p"},"auth")," saga using the following paths:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"For the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/client/src/sagas/auth.ts"},"client application"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"For the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/src/sagas/auth.ts"},"provider application")))),(0,i.kt)("h3",{id:"login"},"Login"),(0,i.kt)("p",null,"To perform a login in the application, you need to call the ",(0,i.kt)("inlineCode",{parentName:"p"},"emailLogin")," action. This can be done using the action creator."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function emailLogin(payload: {\n  email: string\n  password: string\n}): QBEmailLoginRequestAction\n\ninterface QBEmailLoginRequestAction extends Action {\n  type: typeof QB_LOGIN_REQUEST\n  payload: { email: string; password: string }\n}\n")),(0,i.kt)("p",null,"Subsequently, this action will be processed using the ",(0,i.kt)("inlineCode",{parentName:"p"},"emailLoginWatcher")," generator function."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"function* emailLoginWatcher (action:Types.QBEmailLoginRequestAction) => void\n")),(0,i.kt)("p",null,"There, the ",(0,i.kt)("inlineCode",{parentName:"p"},"QBLogin")," function is called, which authorizes the user."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const result: { session: QBSession; user: QBUser } = yield call(\n  QBLogin,\n  action.payload,\n)\n")),(0,i.kt)("p",null,"The result of the saga's work is the invocation of action creators ",(0,i.kt)("inlineCode",{parentName:"p"}," loginSuccess")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"loginError"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"In the case of successful authentication.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function loginSuccess(payload: {\n  session: QBSession\n  user: QBUser\n}): QBLoginSuccessAction\n\ninterface QBLoginSuccessAction extends Action {\n  type: typeof QB_LOGIN_SUCCESS\n  payload: { session: QBSession; user: QBUser }\n}\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"In case of an error occurring.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function loginError(error: string): QBLoginFailureAction\n\ninterface QBLoginFailureAction extends Action {\n  type: typeof QB_LOGIN_FAILURE\n  error: string\n}\n")),(0,i.kt)("p",null,"The functions in the sagas for both the provider and the client are essentially the same, with the difference being only in the check of whether the given user is a provider or not. In the event that a user who usually operates from the client side attempts to log in as a provider, this action will be unsuccessful. Similarly, a provider won't be able to authenticate as a client."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"if (userIsProvider(result.user)) {\n  // code\n}\n")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"userIsProvider")," function is a utility function that returns the result of checking whether the given user is a provider or not. You can review it at the following path:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/client/src/utils/user.ts"},"/packages/client/src/utils/user.ts")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/src/utils/user.ts"},"/packages/provider/src/utils/user.ts"))),(0,i.kt)("h3",{id:"logout"},"Logout"),(0,i.kt)("p",null,"To perform a logout from the system, you need to call the action creator ",(0,i.kt)("inlineCode",{parentName:"p"},"logout"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function logout(\n  then?: (data: Types.LogoutSuccessAction) => void,\n): LogoutRequestAction\n\ninterface LogoutRequestAction extends Action {\n  type: typeof LOGOUT_REQUEST\n  payload: { then?: (data: LogoutSuccessAction) => void }\n}\n")),(0,i.kt)("p",null,"Then, this action will be processed using the ",(0,i.kt)("inlineCode",{parentName:"p"},"logout")," generator function, within which a call to ",(0,i.kt)("inlineCode",{parentName:"p"},"QBLogout")," will be executed:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function* logout(action: Types.LogoutRequestAction)=> void\n")),(0,i.kt)("p",null,"The result of the saga's work is the invocation of action creators ",(0,i.kt)("inlineCode",{parentName:"p"},"logoutSuccess")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"logoutFailure"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Upon successful completion of the logout process.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function logoutSuccess(): LogoutSuccessAction\n\ninterface LogoutSuccessAction extends Action {\n  type: typeof LOGOUT_SUCCESS\n}\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"In case an error occurs")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function logoutFailure(error: string): LogoutFailureAction\n\ninterface LogoutFailureAction extends Action {\n  type: typeof LOGOUT_FAILURE\n  error: string\n}\n")),(0,i.kt)("h3",{id:"registration"},"Registration"),(0,i.kt)("p",null,"The process of registering new users is implemented exclusively in the client application. To register a new user, an action creator named ",(0,i.kt)("inlineCode",{parentName:"p"},"createAccount")," is used:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function createAccount(\n  data: Types.CreateAccount,\n  then?: (data: Types.QBAccountCreateSuccessAction) => void,\n): QBAccountCreateRequestAction\n\ninterface QBAccountCreateRequestAction extends Action {\n  type: typeof QB_ACCOUNT_CREATE_REQUEST\n  payload: {\n    data: CreateAccount\n    then?: (data: QBAccountCreateSuccessAction) => void\n  }\n}\n")),(0,i.kt)("p",null,"This action triggers the ",(0,i.kt)("inlineCode",{parentName:"p"},"createAccount")," generator function, within which the ",(0,i.kt)("inlineCode",{parentName:"p"},"QBUserCreate")," function is called. This function is responsible for creating new users:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"function* createAccount(action: Types.QBAccountCreateRequestAction) => void\n")),(0,i.kt)("p",null,"The result of the function's execution is the invocation of action creators ",(0,i.kt)("inlineCode",{parentName:"p"},"createAccountSuccess")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"createAccountFailure"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Upon successful registration")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function createAccountSuccess(payload: {\nsession: QBSession\nuser: QBUser\n})QBAccountCreateSuccessAction\n\ninterface QBAccountCreateSuccessAction extends Action {\ntype: typeof QB_ACCOUNT_CREATE_SUCCESS\npayload: { session: QBSession; user: QBUser }\n}\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"In case an error occurs")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare function createAccountFailure(\n  error: string,\n): QBAccountCreateFailureAction\n\ninterface QBAccountCreateFailureAction extends Action {\n  type: typeof QB_ACCOUNT_CREATE_FAILURE\n  error: string\n}\n")),(0,i.kt)("h2",{id:"api-authentication"},"API Authentication"),(0,i.kt)("p",null,"Before starting to work with API authentication in Q-Consultation, you need to familiarize yourself with the ",(0,i.kt)("a",{parentName:"p",href:"https://quickblox.github.io/q-consultation/api"},"API reference"),". There, you will find a detailed description of all endpoints."),(0,i.kt)("p",null,'The API also utilizes a session-based authentication method, which returns information about a "session". Users can authenticate themselves as either a "client" or a "provider".'),(0,i.kt)("h3",{id:"endpoints"},"Endpoints"),(0,i.kt)("p",null,"The following API endpoints are used for authentication:"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Method"),(0,i.kt)("th",{parentName:"tr",align:null},"URL"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"POST"),(0,i.kt)("td",{parentName:"tr",align:null},"/api/auth/login"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"https://quickblox.github.io/q-consultation/api/#tag/Auth/paths/~1auth~1login/post"},"Login"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"POST"),(0,i.kt)("td",{parentName:"tr",align:null},"/api/auth/logout"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"https://quickblox.github.io/q-consultation/api/#tag/Auth/paths/~1auth~1logout/delete"},"Logout"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"POST"),(0,i.kt)("td",{parentName:"tr",align:null},"/api/users/client"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"https://quickblox.github.io/q-consultation/api#tag/Users/paths/~1users~1client/post"},"Create client"))),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"POST"),(0,i.kt)("td",{parentName:"tr",align:null},"/api/users/provider"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"https://quickblox.github.io/q-consultation/api#tag/Users/paths/~1users~1provider/post"},"Create provider"))))),(0,i.kt)("h3",{id:"nodejs-implementation"},"Node.js Implementation"),(0,i.kt)("p",null,"For interacting with the API, we use ",(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/en"},"Node.js")," with the ",(0,i.kt)("a",{parentName:"p",href:"https://fastify.dev"},"Fastify")," framework. Responsible for API authentication, the ",(0,i.kt)("inlineCode",{parentName:"p"},"login")," function:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"declare const login: FastifyPluginAsyncTypebox = async (fastify) =>\n{ session: QBSession, data: QBUser } | string\n")),(0,i.kt)("p",null,"To ensure request validation, we will use the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/sinclairzx81/typebox#typebox"},"TypeBox")," library. It provides tools for strict data typing, which helps avoid errors related to passing incorrect information. This offers a more reliable way to validate data that enters our system."),(0,i.kt)("p",null,"TypeBox is a library that creates JSON schema objects for TypeScript types at runtime. These schemas are automatically derived from TypeScript types. The generated schemas adhere to the rules of TypeScript's static type checking provided by the TypeScript compiler. TypeBox provides a unified type that can be statically checked in TypeScript and validated at runtime using standard JSON Schema validation tools."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const loginSchema = {\n  tags: ['Auth'],\n  summary: 'User login',\n  body: Type.Object({\n    role: Type.Union([\n      Type.Literal('client', { title: 'Client' }),\n      Type.Literal('provider', { title: 'Provider' }),\n    ]),\n    email: Type.String({ format: 'email' }),\n    password: Type.String(),\n  }),\n  response: {\n    200: Type.Object({\n      session: Type.Ref(QBSession),\n      data: Type.Ref(QBUser),\n    }),\n  },\n}\n")),(0,i.kt)("p",null,"Inside the function, we retrieve user data mentioned earlier and call the authentication methods from the QuickBlox SDK: ",(0,i.kt)("inlineCode",{parentName:"p"},"qbCreateSession")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"qbLogin"),"."),(0,i.kt)("p",null,"The function responsible for handling logout is named ",(0,i.kt)("inlineCode",{parentName:"p"},"logout"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const logoutSchema = {\n  tags: ['Auth'],\n  summary: 'User logout',\n  response: {\n    204: Type.Null({ description: 'No content' }),\n  },\n  security: [{ providerSession: [] }, { clientSession: [] }] as Security,\n}\n\ndeclare const logout: FastifyPluginAsyncTypebox = async (fastify) =>\n  string | undefined\n")),(0,i.kt)("p",null,"Before performing the logout process, the ",(0,i.kt)("inlineCode",{parentName:"p"},"handleResponse")," function calls QuickBlox SDK methods that send a notification to the UI application, informing the user that the session will be terminated, and subsequently perform the logout from the application."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"await qbChatConnect(session.user_id, session.token)\nconst dialogId = QB.chat.helpers.getUserJid(session.user_id)\n\n\nawait qbChatSendSystemMessage(dialogId, {\nextension: {\nnotification_type: CLOSE_SESSION_NOTIFICATION,\n  },\n}\n")),(0,i.kt)("p",null,"After pre-processing the request, we call the QuickBlox SDK method ",(0,i.kt)("inlineCode",{parentName:"p"},"qbLogout")," which leads to the termination of the session in the API."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"signup")," function is responsible for registering in the API, and it is used for both clients and providers. These functions have a similar structure with some minor differences, as described below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const signUpSchema = {\n  tags: ['Users', 'Client'],\n  summary: 'Signup client',\n  consumes: ['multipart/form-data'],\n  body: Type.Intersect([\n    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),\n    Type.Object({\n    password: Type.String(),\n    avatar: Type.Optional(MultipartFile),\n    }),\n  ]),\n  response: {\n    200: Type.Object({\n    session: Type.Ref(QBSession),\n    user: Type.Ref(QBUser),\n    }),\n  },\n}\n\n\ndeclare const signup: FastifyPluginAsyncTypebox = async (fastify) =>\n{ session: QBSession, data: QBUser } | string\n")),(0,i.kt)("p",null,'To register as a provider, you need to provide the following additional parameters in the request body: "profession" and "description". The data types for each parameter will be detailed in the request schema.'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const { profession, description, avatar, email, password } = request.body\n")),(0,i.kt)("p",null,"For registering as a client:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const { avatar, email, password } = request.body\n")),(0,i.kt)("p",null,"After successfully obtaining the data, the process involves creating a session with ",(0,i.kt)("inlineCode",{parentName:"p"},"qbCreateSession"),", registering the new user as a service provider with ",(0,i.kt)("inlineCode",{parentName:"p"},"qbCreateUser"),", and then logging into the system with this account using ",(0,i.kt)("inlineCode",{parentName:"p"},"qbLogin"),"."),(0,i.kt)("h2",{id:"replacing-login-with-email"},"Replacing login with email"),(0,i.kt)("p",null,"To change the authentication method from using email to login, you will need to replace the parameter ",(0,i.kt)("inlineCode",{parentName:"p"},"email")," with ",(0,i.kt)("inlineCode",{parentName:"p"},"login")," in the SDK methods such as ",(0,i.kt)("inlineCode",{parentName:"p"},"login")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"createSession"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"var params = { login: 'garry', password: 'garry5santos' }\n\nQB.login(params, function (error, result) {\n  // callback function\n})\n\nQB.createSession(params, function (error, result) {\n  // callback function\n})\n")),(0,i.kt)("p",null,"Next, when working with the UI component, we pass the following object type to the ",(0,i.kt)("inlineCode",{parentName:"p"},"emailLoginWatcher")," function:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"payload: {\n  login: string\n  password: string\n}\n")),(0,i.kt)("p",null,"If we are talking about the API, the first step is to make changes to the ",(0,i.kt)("inlineCode",{parentName:"p"},"loginSchema")," to replace the ",(0,i.kt)("inlineCode",{parentName:"p"},"email")," field with the ",(0,i.kt)("inlineCode",{parentName:"p"},"login")," field. Then, the data that will be sent should look as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'{\n"role": "string",\n"login": "string",\n"password": "string"\n}\n')))}u.isMDXComponent=!0}}]);