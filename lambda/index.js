const Alexa = require('ask-sdk-core');
const util = require('./util');

const moment = require('moment-timezone');
const languageStrings = require('./localisation');
const interceptors = require('./interceptors');
const constants = require('./constants');
const logic = require('./logic');

const skillBuilder = Alexa.SkillBuilders.custom();

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
        speechText += handlerInput.t('REGISTER_FIRST_DEADLINE');

       
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};
/*const SaveIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SaveIntent';
    },
    
    async handle(handlerInput) {
        const {attributesManager, requestEnvelope, responseBuilder, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const name = sessionAttributes['name'];
        const timezone = sessionAttributes['timezone'];
        if (!timezone) {
            return responseBuilder.speechText(t('NO_TIMEZONE_MSG')).getResponse();
        }
       let outputSpeech = ''

   await logic.postRemoteData()
      .then((response) => {
        const data = JSON.parse(response);
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
      });
      
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(handlerInput.t('REPROMPT_MSG'))
      .getResponse();
  },
};*/
const RegisterDeadlineIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterDeadlineIntent';
    },
    async handle(handlerInput) {
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
            
            const timezone = sessionAttributes['timezone'];
            if  (logic.isDateInPast(day,month,year,timezone)) {
                 return handlerInput.responseBuilder
                    .speak(handlerInput.t('ERROR_DATE_IN_PAST'))
                    .reprompt(handlerInput.t('REPROMPT_MSG'))
                    .getResponse();
            }
            else{
                var data = {
              	"title": nameDeadline,
            	"day": day,
            	"month": monthName,
            	"year": year 
                };
                await logic.postRemoteData(constants.API_URL, data)
                  .then((response) => {
                    const data = JSON.parse(response);
                  })
                  .catch((err) => {
                    console.log(`ERROR: ${err.message}`);
                  });
                
                return SayDeadlineIntentHandler.handle(handlerInput);
            }  
               
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
            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
            sessionAttributes['year'] = year;
            
           let speechText = handlerInput.t('DAYS_LEFT_MSG', {count: year});
           const timezone = sessionAttributes['timezone'];
            if (logic.isDateInPast(day,month,year,timezone)){
                 return handlerInput.responseBuilder
                    .speak(handlerInput.t('ERROR_DATE_IN_PAST'))
                    .reprompt(handlerInput.t('REPROMPT_MSG'))
                    .getResponse();
            }
            else   return SayDeadlineIntentHandler.handle(handlerInput);
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
        const timezone = sessionAttributes['timezone'];
        const name = sessionAttributes['name'];

        let speechText = '';
        const dateAvailable = nameDeadline && day && month && year;
        if (dateAvailable){
            if (!timezone) {
                return responseBuilder.speak(t('NO_TIMEZONE_MSG')).getResponse();
            }
            const birthdayData = logic.getdaysUntilDeadline(day, month, year, timezone);
            speechText = handlerInput.t('DAYS_LEFT_MSG', {name, count: birthdayData});
            speechText += handlerInput.t('WILL_TURN_MSG', {count: nameDeadline});
            if (!birthdayData) { 
                speechText = handlerInput.t('GREET_MSG', {count: nameDeadline});
            }
            speechText += handlerInput.t('CHANGE_DEADLINE');
            speechText += handlerInput.t('POST_SAY_HELP_MSG');
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'RegisterDateIntent',
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
        const {attributesManager, requestEnvelope, responseBuilder, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const name = sessionAttributes['name'];
        const timezone = sessionAttributes['timezone'];
        if (!timezone) {
            return responseBuilder.speechText(t('NO_TIMEZONE_MSG')).getResponse();
        }
       let outputSpeech = ''
      

         await logic.getRemoteData(constants.API_URL)
          .then((response) => {
            const data = JSON.parse(response);
             outputSpeech += logic.listDeadlinesTitlesResponse(data, handlerInput)
          })
          .catch((err) => {
            console.log(`ERROR: ${err.message}`);
            outputSpeech += t('API_ERROR_MSG') + t('POST_SAY_HELP_MSG');
          });
          
        return handlerInput.responseBuilder
          .speak(outputSpeech)
          .reprompt(handlerInput.t('REPROMPT_MSG'))
          .getResponse();
   },
};

const GetNextDeadlineIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetNextDeadlineIntent');
  },
  async handle(handlerInput) {
       const {attributesManager, requestEnvelope, responseBuilder, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const name = sessionAttributes['name'];
        const timezone = sessionAttributes['timezone'];
        if (!timezone) {
            return responseBuilder.speechText(t('NO_TIMEZONE_MSG')).getResponse();
        }
       let outputSpeech = ''
 
   await logic.getRemoteData(constants.API_URL)
      .then((response) => {
        const data = JSON.parse(response);
         const Nextdeadline = logic.getNextDeadline(data, timezone).nextDeadline;
         const daysUntilNextDeadline = logic.getNextDeadline(data,timezone).minDaysUntil;
         
         outputSpeech += t('NEXT_DEADLINE', {nameDeadline: Nextdeadline.title});
         outputSpeech += t('DATE_DEADLINE_UNTIL', {count: daysUntilNextDeadline});
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
    return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetDateDeadlineIntent';
  },
  async handle(handlerInput) {
        const {attributesManager, requestEnvelope, responseBuilder, t} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const name = sessionAttributes['name'];
        const timezone = sessionAttributes['timezone'];
        if (!timezone) {
            return responseBuilder.speechText(t('NO_TIMEZONE_MSG')).getResponse();
        }
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


const RemindDeadlineIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindDeadlineIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] || '';
        let timezone = sessionAttributes['timezone'];
        const message = Alexa.getSlotValue(requestEnvelope, 'message');
        
        

        if (intent.confirmationStatus !== 'CONFIRMED') {
            return handlerInput.responseBuilder
                .speak(handlerInput.t('CANCEL_MSG') + handlerInput.t('REPROMPT_MSG'))
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
        }

        let speechText = '';
        speechText += timezone;
        const dateAvailable = day && month && year;
        if (dateAvailable){
            if (!timezone){
                //timezone = 'Europe/Rome'; 
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }

            const daysUntilDeadline = logic.getdaysUntilDeadline(day, month, year, timezone);

            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken)){
                    throw {status: 401, message: 'No permission available'};
                }
                
                const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
                const remindersList = await reminderServiceClient.getReminders();
                console.log('Current reminders: ' + JSON.stringify(remindersList));
                const previousReminder = sessionAttributes['reminderId'];
                if (previousReminder){
                    try {
                        if (remindersList.totalCount !== "0") {
                            await reminderServiceClient.deleteReminder(previousReminder);
                            delete sessionAttributes['reminderId'];
                            console.log('Deleted previous reminder token: ' + previousReminder);
                        }
                    } catch (error) {
                        console.log('Failed to delete reminder: ' + previousReminder + ' via ' + JSON.stringify(error));
                    }
                }
     
                const reminder = logic.createDeadlineReminder(
                    daysUntilDeadline,
                    timezone,
                    Alexa.getLocale(requestEnvelope),
                    message);
                const reminderResponse = await reminderServiceClient.createReminder(reminder); 
                sessionAttributes['reminderId'] = reminderResponse.alertToken;
                console.log('Reminder created with token: ' + reminderResponse.alertToken);
                speechText = handlerInput.t('REMINDER_CREATED_MSG', {name: name});
                speechText += handlerInput.t('POST_REMINDER_HELP_MSG');
            } catch (error) {
                console.log(JSON.stringify(error));
                switch (error.statusCode) {
                    case 401: 
                        handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                        speechText = handlerInput.t('MISSING_PERMISSION_MSG');
                        break;
                    case 403: 
                        speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                        break;
                    default:
                        speechText = handlerInput.t('REMINDER_ERROR_MSG');
                }
                speechText += handlerInput.t('REPROMPT_MSG');
            }
        } else {
            speechText += handlerInput.t('MISSING_MSG');
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
        const {t, attributesManager} = handlerInput
        const sessionAttributes = attributesManager.getSessionAttributes();
        const name = sessionAttributes['name']
        const speechText = handlerInput.t('GOODBYE_MSG', {name});

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
        return handlerInput.responseBuilder.getResponse(); 
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
        RemindDeadlineIntentHandler,
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
        interceptors.LoadAttributesRequestInterceptor,
         interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
   .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/my_deadlines/')
    .lambda();