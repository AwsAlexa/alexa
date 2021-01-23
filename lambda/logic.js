const moment = require('moment-timezone');
const util = require('./util');
const constants = require('./constants');
const axios = require('axios');
const getdaysUntilDeadline = (day, month, year, timezone) => {
    const today = moment().tz(timezone).startOf('day');
    const nextDeadline = moment(`${month}/${day}/${today.year()}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    if (today.isAfter(nextDeadline)) {
        nextDeadline.add(1, 'years');
    }
    const daysUntilDeadline = nextDeadline.startOf('day').diff(today, 'days');
    return daysUntilDeadline;
};
const isDateInPast = ( day, month, year, timezone) =>{
    const today = moment().tz(timezone).startOf('day');
    const nextDeadline = moment(`${month}/${day}/${today.year()}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    if (today.isAfter(nextDeadline)) {
        return true;
    }
    return false;
};

const getRemoteData = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? require('https') : require('http');
  const request = client.get(url, (response) => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      reject(new Error(`Failed with status code: ${response.statusCode}`));
    }
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => resolve(body.join('')));
  });
  request.on('error', (err) => reject(err));
});
const postRemoteData = (url, data) => {
    async function postJson(url, data) {
        const res = await axios.post(url, data);
        return res;
    }
    return postJson(url, data)
        .then((result) => result)
        .catch((error) => null)
};
const listDeadlinesTitlesResponse = (data, handlerInput) => {
     const {t} = handlerInput;
     let speechResponse = t('YOURS_DEADLINES');
     const deadlineCount = data.length;
                   
     data.forEach((deadline, index) =>{
         if( deadline.title && deadlineCount !== 0){
                     speechResponse += deadline.title;
                if(index === (deadlineCount - 1)){
                     speechResponse += '.';
                }
               
                else if (index === deadlineCount - 2) {
                    speechResponse += handlerInput.t('CONJUNCTION_MSG') ;
                } else {
                    speechResponse += ', ';
                }
           }
     })
    speechResponse += handlerInput.t('POST_SAY_HELP_MSG');
    return speechResponse;
};
const getDeadline = (data, nameDeadline, handlerInput, timezone) =>{
    const {t} = handlerInput;
    let exist = false;
    let result = '';
   data.forEach((deadline, index) => {
         if (deadline.title === nameDeadline){
             exist = true;
            let daysUntil = getdaysUntilDeadline(deadline.day, deadline.month, deadline.year, timezone);
            result += t('DATE_DEADLINE',{ nameDeadline: nameDeadline, day: deadline.day, month: deadline.month, year: deadline.year});
           
            if(!daysUntil){
                result += t('GREET_MSG',{count: nameDeadline});
            }
            else 
            result += t('DATE_DEADLINE_UNTIL',{ count: daysUntil});
             result  += handlerInput.t('POST_SAY_HELP_MSG');
         }
     })
     
     if(!exist){
         result += t('NO_DEADLINE_NAME');
         result  += handlerInput.t('POST_SAY_HELP_MSG');
     }
     return result;
};
const getNextDeadline = (data, timezone) =>{
   let minDaysUntil = getdaysUntilDeadline(data[0].day, data[0].month, data[0].year, timezone);
   let nextDeadline = data[0];
   data.forEach((deadline, index) => {
       const  daysUntil= getdaysUntilDeadline(deadline.day, deadline.month, deadline.year,timezone);
         if (minDaysUntil > daysUntil){
             minDaysUntil = daysUntil;
             nextDeadline = deadline;
         }
     })
    return {
        nextDeadline,
        minDaysUntil
    }
};
const createDeadlineReminder = (daysUntilBirthday, timezone, locale, message) => {
        moment.locale(locale);
        const createdMoment = moment().tz(timezone);
        let triggerMoment = createdMoment.startOf('day').add(daysUntilBirthday, 'days');
        if (daysUntilBirthday === 0) {
            triggerMoment = createdMoment.startOf('day').add(1, 'years'); 
        }
        console.log('Reminder schedule: ' + triggerMoment.format('YYYY-MM-DDTHH:mm:00.000'));
        return util.createReminder(createdMoment, triggerMoment, timezone, locale, message);
}

module.exports = {
    getdaysUntilDeadline,
    getRemoteData,
    postRemoteData,
    isDateInPast,
    listDeadlinesTitlesResponse,
    getDeadline,
    getNextDeadline,
    createDeadlineReminder
}    