
const moment = require('moment-timezone');
const util = require('./util');
const constants = require('./constants');

const getdaysUntilDeadline = (day, month, year, timezone) => {
    const today = moment().tz(timezone).startOf('day');
    const nextDeadline = moment(`${month}/${day}/${today.year()}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    if (today.isAfter(nextDeadline)) {
        nextDeadline.add(1, 'years');
    }
    const daysUntilDeadline = nextDeadline.startOf('day').diff(today, 'days');
    return daysUntilDeadline;
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



const listDeadlinesTitlesResponse = (data, handlerInput) => {
    
     const {t} = handlerInput;
     let speechResponse = t('YOURS_DEADLINES');
     const deadlineCount = data.length;
     data.forEach((deadline, index) =>{
         if( deadline.title && deadlineCount !== 0){
            speechResponse += deadline.title;
            if (index === deadlineCount - 2) {
                speechResponse += t('CONJUNCTION_MSG') ;
            } else {
                speechResponse += '. ';
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

module.exports = {
    getdaysUntilDeadline,
    getRemoteData,
    listDeadlinesTitlesResponse,
    getDeadline,
    getNextDeadline
}    