const Alexa = require('ask-sdk-core');
const util = require('./util'); // utility functions
const interceptors = require('./interceptors');
const moment = require('moment-timezone'); // will help us do all the deadline math


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        const moduleName = sessionAttributes['moduleName'];
        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const year = sessionAttributes['year'];
        const sessionCounter = sessionAttributes['sessionCounter'];

        const dateAvailable = moduleName && day && month && year;
        if (dateAvailable){
            // we can't use intent chaining because the target intent is not dialog based
            return SayDeadlineIntentHandler.handle(handlerInput);
        }

        let speechText = !sessionCounter ? handlerInput.t('WELCOME_MSG') : handlerInput.t('WELCOME_BACK_MSG');
        speechText += handlerInput.t('MISSING_MSG');

        // we use intent chaining to trigger the deadline registration multi-turn
        return handlerInput.responseBuilder
            .speak(speechText)
            // we use intent chaining to trigger the deadline registration multi-turn
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
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        if (intent.confirmationStatus === 'CONFIRMED') {
            
             
            // we get the slot instead of the value directly as we also want to fetch the id
            const moduleSlot = Alexa.getSlot(requestEnvelope, 'module');
            const moduleName = moduleSlot.value;
            const module = moduleSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
            
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const month = Alexa.getSlotValue(requestEnvelope, 'month');
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            
            sessionAttributes['module'] = module; //MM
            sessionAttributes['moduleName'] = moduleName;
            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month;
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

const SayDeadlineIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayDeadlineIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let module = sessionAttributes['module'];
        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] || '';
        let timezone = sessionAttributes['timezone'];

        let speechText = '';
        const dateAvailable = day && month && year;
        if (dateAvailable){
            if (!timezone){
                //timezone = 'Europe/Rome';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }
            const today = moment().tz(timezone).startOf('day');
            const wasDead = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            const nextDeadline = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            if (today.isAfter(nextDeadline)){
                nextDeadline.add(1, 'years');
            }
            //const interval = today.diff(wasDead, 'years');
            const daysUntilDeadline = nextDeadline.startOf('day').diff(today, 'days'); // same days returns 0
            speechText = handlerInput.t('DAYS_LEFT_MSG', {count: daysUntilDeadline});
            //speechText += handlerInput.t('WILL_TURN_MSG', {count: age + 1});
            if (daysUntilDeadline === 0) { // it's the user's deadline!
                speechText = handlerInput.t('GREET_MSG', {count: module});
            }
            speechText += handlerInput.t('POST_SAY_HELP_MSG');
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            // we use intent chaining to trigger the deadline registration multi-turn
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'RegisterDeadlineIntent',
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
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] || '';
        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
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
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
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
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
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



/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterDeadlineIntentHandler,
        SayDeadlineIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
        
    .addErrorHandlers(
        ErrorHandler)
        
    .addRequestInterceptors(
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
        
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/my-deadlines')
    .lambda();