
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./localisation');
const constants = require('./constants');

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const loadedThisSession = sessionAttributes['loaded'];
        if (Alexa.isNewSession(requestEnvelope) || !loadedThisSession){ 
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            persistentAttributes['loaded'] = true;
            attributesManager.setSessionAttributes(persistentAttributes); 
        }
    }
};
  
 const SaveAttributesResponseInterceptor = {
      async process(handlerInput, response) {
          if (!response) return;
          const {attributesManager, requestEnvelope} = handlerInput;
          const sessionAttributes = attributesManager.getSessionAttributes();
          const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true: response.shouldEndSession);
          const loadedThisSession = sessionAttributes['loaded'];
          if ((shouldEndSession || Alexa.getRequestType(requestEnvelope) === "SessionEndedRequest") && loadedThisSession) {
              sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1: 1;
              for (var key in sessionAttributes) {
                  if (!constants.PERSISTENT_ATTRIBUTES_NAMES.includes(key))
                  delete sessionAttributes[key]
                }
              console.log('Saving to persistent storage: ', JSON.stringify(sessionAttributes));
              attributesManager.setPersistentAttributes(sessionAttributes)
              await attributesManager.savePersistentAttributes();
          }
      }
  }
const LoadNameRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if (!sessionAttributes['name']){
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken))
                    throw { statusCode: 401, message: 'No permissions available' }; 
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileGivenName();
                if (profileName) { 
                    sessionAttributes['name'] = profileName;
                }
            } catch (error) {
                console.log(JSON.stringify(error));
                if (error.statusCode === 401 || error.statusCode === 403) {
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.GIVEN_NAME_PERMISSION);
                }
            }
        }
    }
};

const LoadTimezoneRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const deviceId = Alexa.getDeviceId(requestEnvelope);

        if (!sessionAttributes['timezone']){
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const timezone = await upsServiceClient.getSystemTimeZone(deviceId);
                if (timezone) { 
                    console.log('Got timezone from device: ' + timezone);
                    
                    sessionAttributes['timezone'] = timezone;
                }
            } catch (error) {
                console.log(JSON.stringify(error));
            }
        }
    }
};



module.exports = {
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor,
    LoadAttributesRequestInterceptor,
    SaveAttributesResponseInterceptor,
    LoadNameRequestInterceptor,
    LoadTimezoneRequestInterceptor
}
