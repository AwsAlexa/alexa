
const moment = require('moment-timezone'); // will help us do all the dates math while considering the moment-timezone
const util = require('./util');
const constants = require('./constants');


///// faut enlever le title et simplifier params
const getdaysUntilDeadline = (nameDeadline, day, month, year, timezone) => {
    const today = moment().tz(timezone).startOf('day');
    const wasBorn = moment(`${month}/${day}/${year}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    const nextBirthday = moment(`${month}/${day}/${today.year()}`, 'MM/DD/YYYY').tz(timezone).startOf('day');
    if (today.isAfter(nextBirthday)) {
        nextBirthday.add(1, 'years');
    }
    const age = today.diff(wasBorn, 'years');
    const daysAlive = today.diff(wasBorn, 'days');
    const daysUntilDeadline = nextBirthday.startOf('day').diff(today, 'days'); //same day returns 0
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
     let speechResponse = 'vos échéances sont:';
     const deadlineCount = data.length;
     data.forEach((deadline, index) =>{
         if( deadline.title && deadlineCount !== 0){
                    speechResponse += deadline.title;
                //speechResponse += t('TURNING_YO_MSG', {count: daysUntilDeadline});
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
    let exist = false;
   
    let res = '';
   data.forEach((deadline, index) => {
         if (deadline.title === nameDeadline){
             exist = true;
            let daysUntil = getdaysUntilDeadline(deadline.title, deadline.day, deadline.month, deadline.year, timezone);
            
             
             res = '  la date de ';
             res += nameDeadline;
             res += ' est le ';
             res += deadline.day;
             res += ' / ';
             res += deadline.month;
              res += ' / ';
             res += deadline.year;
             res += ' il reste ';
             res += daysUntil;
             res +=" jours avant cette date  "  ;
            res  += handlerInput.t('POST_SAY_HELP_MSG');
             
         }
     })
     
     if(!exist){
         res += ' Il existe aucune échéance avec ce nom ';
         res  += handlerInput.t('POST_SAY_HELP_MSG');
     }
     return res;
};

const getNextDeadline = (data, timezone) =>{
   let minDaysUntil = getdaysUntilDeadline(data[0].title, data[0].day, data[0].month, data[0].year, timezone);
   let nextDeadline = data[0];
   data.forEach((deadline, index) => {
       const  daysUntil= getdaysUntilDeadline(deadline.title, deadline.day, deadline.month, deadline.year,timezone);
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