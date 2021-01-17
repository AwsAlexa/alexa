const Alexa = require('ask-sdk-core');
//const util = require('./util');

const moment = require('moment-timezone');
const languageStrings = require('./localisation');
const interceptors = require('./interceptors');
const constants = require('./constants');
const logic = require('./logic');

const skillBuilder = Alexa.SkillBuilders.custom();

var persistenceAdapter = getPersistenceAdapter();

function getPersistenceAdapter(tableName) {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } 
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const nameDeadline = sessionAttributes['nameDeadline'];
        const day = sessionAttributes['day'];
        const monthName = sessionAttributes['monthName'];
        const year = sessionAttributes['year'];
        const sessionCounter = sessionAttributes['sessionCounter'];

        const dateAvailable = nameDeadline && day && monthName && year;
        if (dateAvailable){
            return SayDeadlineIntentHandler.handle(handlerInput);
        }
        let speechText = !sessionCounter ? handlerInput.t('WELCOME_MSG') : handlerInput.t('WELCOME_BACK_MSG');
        speechText += handlerInput.t('MISSING_MSG');

        // we use intent chaining to trigger the birthday registration multi-turn
        return handlerInput.responseBuilder
            .speak(speechText)
            // we use intent chaining to trigger the birthday registration multi-turn
            .addDelegateDirective({
                name: 'RegisterDeadlineIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const RegisterDeadlineIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterDeadlineIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        if (intent.confirmationStatus === 'CONFIRMED') {
             const nameDeadline = Alexa.getSlotValue(requestEnvelope, 'nameDeadline');
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
            
            sessionAttributes['nameDeadline'] = nameDeadline;
            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
            sessionAttributes['year'] = year;
            // we can't use intent chaining because the target intent is not dialog based
            return SayDeadlineIntentHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const ChangeDateIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeDateIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        if (intent.confirmationStatus === 'CONFIRMED') {
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            
           // sessionAttributes['nameDeadline'] = nameDeadline;
            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
            sessionAttributes['year'] = year;
           let speechText = handlerInput.t('DAYS_LEFT_MSG', {count: year});
            return SayDeadlineIntentHandler.handle(handlerInput);
        }
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const SayDeadlineIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayBirthdayIntent';
    },
    async handle(handlerInput) {
        const {t, responseBuilder, attributesManager} = handlerInput
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const nameDeadline = sessionAttributes['nameDeadline'];
        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const year = sessionAttributes['year'];

        let speechText = '';
        const dateAvailable = nameDeadline && day && month && year;
        if (dateAvailable){
            
            const timezone = 'Europe/Paris'; // provide yours here. we'll change this later to retrieve the timezone from the device
            const birthdayData = logic.getdaysUntilDeadline(day, month, year, timezone);
            speechText = handlerInput.t('DAYS_LEFT_MSG', {count: birthdayData});
            speechText += handlerInput.t('WILL_TURN_MSG', {count: nameDeadline});
            if (birthdayData === 0) { 
                speechText = handlerInput.t('GREET_MSG', {count: nameDeadline});
            }
            speechText += handlerInput.t('POST_SAY_HELP_MSG');
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'ChangeDateIntent',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};


const GetDeadlinesListDataHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');
  },
  async handle(handlerInput) {
       const timezone = 'Europe/Paris';
       let outputSpeech = ''
 
   await logic.getRemoteData(constants.API_URL)
      .then((response) => {
        const data = JSON.parse(response);
         outputSpeech += logic.listDeadlinesTitlesResponse(data, handlerInput)
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
      });
      
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(handlerInput.t('REPROMPT_MSG'))
      .getResponse();
      //.speak(outputSpeech)
      //.getResponse();
  },
};

const GetNextDeadlineIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetNextDeadlineIntent');
  },
  async handle(handlerInput) {
       const timezone = 'Europe/Paris';
       let outputSpeech = ''
 
   await logic.getRemoteData(constants.API_URL)
      .then((response) => {
        const data = JSON.parse(response);
         const Nextdeadline = logic.getNextDeadline(data, timezone).nextDeadline;
         
         const daysUntilNextDeadline = logic.getNextDeadline(data,timezone).minDaysUntil;
         outputSpeech += "il reste ";
         outputSpeech += daysUntilNextDeadline;
         outputSpeech += "pour  ";
         outputSpeech += Nextdeadline.title;
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
      });
      
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(handlerInput.t('REPROMPT_MSG'))
      .getResponse();
      
  },
};
const GetDateDeadlineIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetDateDeadlineIntent');
  },
  async handle(handlerInput) {
       const {attributesManager, requestEnvelope} = handlerInput;
       const {intent} = requestEnvelope.request;
       const timezone = 'Europe/Paris';
       let outputSpeech = ''
       
           const nameDeadline = Alexa.getSlotValue(requestEnvelope, 'nameDeadline');
            await logic.getRemoteData(constants.API_URL)
           .then((response) => {
                const data = JSON.parse(response);
                const res = logic.getDeadline(data, nameDeadline, handlerInput, timezone);
                outputSpeech += res;
            })
            .catch((err) => {
                console.log(`ERROR: ${err.message}`);
            });
      
            return handlerInput.responseBuilder
            .speak(outputSpeech)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
      
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterDeadlineIntentHandler,
        SayDeadlineIntentHandler,
        ChangeDateIntentHandler,
        GetDeadlinesListDataHandler,
        GetNextDeadlineIntentHandler,
        GetDateDeadlineIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/happy-birthday/mod4')
    .lambda();