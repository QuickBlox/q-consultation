const fs = require('fs');
const yaml = require('js-yaml');
const https = require('https');
const crypto = require('crypto');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const qbDefaultApiEndpoint = 'api.quickblox.com';
const qcConfigFileLoaction  = './qconsultation_config/config.json';
const qcAppointmentSchemaFileLocation = './qconsultation_config/schema.yml';

(async function main()  {
    try {
        let config = getConfigFromConfigFile(qcConfigFileLoaction);
        let schema = getAppointmentsSchema(qcAppointmentSchemaFileLocation);
        let credentials = await getAccountOwnerCredentials();
        let token = await authorize(credentials, config);
        await createAppointmentSchema(schema, token, config);
        console.log('Appointment data scheme created successfully.');
    } catch (e) {
        console.log("Error:");
        console.error(e);
    } finally {
        process.exit(0);
    }
})();

function getAccountOwnerCredentials() {
    return new Promise(resolve => {
        readline.question(`Please enter your QuickBlox account owner email:\n`, email => {
            readline.question(`Please enter your QuickBlox account owner password:\n`, password => {
                readline.close();
                resolve({'email': email, 'password': password});
            });
            // Hide password
            readline._writeToOutput = function _writeToOutput(stringToWrite) {
                if(stringToWrite !== '\r\n'){
                    readline.output.write("*");
                } else {
                    readline.output.write(stringToWrite);
                }  
            };
        });
    });
}

function getConfigFromConfigFile(configLocation) {
    let rawConfig = fs.readFileSync(configLocation);
    let config = JSON.parse(rawConfig);
    // Check config
    if(config.QB_SDK_CONFIG_APP_ID === -1 || 
        config.QB_SDK_CONFIG_AUTH_KEY.length == 0 ||
        config.QB_SDK_CONFIG_AUTH_SECRET.length == 0) {
            console.error('qconsultation_config/config.json file is empty.');
            process.exit(1);
    }
    // Check api endpoint
    if(config.QB_SDK_CONFIG_ENDPOINTS_API.length == 0){
        config.QB_SDK_CONFIG_ENDPOINTS_API = qbDefaultApiEndpoint;
    }
    
    return {
        appId: config.QB_SDK_CONFIG_APP_ID,
        authKey: config.QB_SDK_CONFIG_AUTH_KEY,
        authSecret: config.QB_SDK_CONFIG_AUTH_SECRET,
        apiEndpoint: config.QB_SDK_CONFIG_ENDPOINTS_API
    };
}

function getAppointmentsSchema(schemaLocation){
    const doc = yaml.load(fs.readFileSync(schemaLocation, 'utf8'));
    return doc.qb_schema.custom_class_Appointment;
}

function authorize(authCreds, config) {
    let message = generateAuthMsg(authCreds, config);
    let signedMessage = signMessage(message, config.authSecret);
    message.signature = signedMessage;
    return new Promise((resolve, reject) => {
        let options = {
            hostname: config.apiEndpoint,
            port: 443,
            path: '/session.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        let req = https.request(options, (res) => {
            res.on('data', (data) => {
                if(res.statusCode == 200 || res.statusCode == 201){
                    resolve(JSON.parse(data).session.token);
                } else {
                    parsedData = JSON.parse(data);
                    parsedData.statusCode = res.statusCode;
                    reject(parsedData);
                }
            });
          });
          
          req.on('error', (e) => {
            reject(e);
          });
          req.write(JSON.stringify(message));
          req.end();
    });
}

function generateAuthMsg(authCreds, config) {
    return message = {
        application_id: config.appId,
        auth_key: config.authKey,
        nonce: Math.floor(Math.random() * 10000),
        timestamp: Math.floor(Date.now() / 1000),
        user: {
            email: authCreds.email,
            password: authCreds.password
        }
    };
}

function signMessage(message, secret) {
    let sessionMsg = Object.keys(message).map(function(val) {
        if (typeof message[val] === 'object') {
            return Object.keys(message[val]).map(function(val1) {
                return val + '[' + val1 + ']=' + message[val][val1];
            }).sort().join('&');
        } else {
            return val + '=' + message[val];
        }
    }).sort().join('&');

    let signedMessage = crypto.createHmac('sha256', secret).update(sessionMsg).digest('hex').toString();
    return signedMessage;
}

function createAppointmentSchema(schema, token, config) {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: config.apiEndpoint,
            port: 443,
            path: '/class.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'QB-Token': token
            }
        }
        let req = https.request(options, (res) => {
            res.on('data', (data) => {
                if(res.statusCode == 200 || res.statusCode == 201){
                    resolve();
                } else if(res.statusCode  == 422){
                    if(JSON.parse(data).name == 'is already taken'){
                        resolve();
                    } else {
                        parsedData = JSON.parse(data);
                        parsedData.statusCode = res.statusCode;
                        reject(parsedData);
                    }
                } else  {
                    parsedData = JSON.parse(data);
                    parsedData.statusCode = res.statusCode;
                    reject(parsedData);
                }
            });
          });
          
          req.on('error', (e) => {
            reject(e);
          });
          req.write(JSON.stringify(schema));
          req.end();
    });
}
