const AWS = require('aws-sdk');

const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v1'
});

const getS3PreSignedUrl = (s3ObjectKey) =>{
    const bucketName = process.env.S3_PERSISTENCE_BUCKET;
    const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: s3ObjectKey,
        Expires: 60*1 
    });
    console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
    return s3PreSignedUrl;
    };
const getPersistenceAdapter = (tableName) =>{
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } 
     
};
const createReminder = (requestMoment, scheduledMoment, timezone, locale, message) => (
    {
        requestTime: requestMoment.format('YYYY-MM-DDTHH:mm:00.000'),
        trigger: {
            type: 'SCHEDULED_ABSOLUTE',
            scheduledTime: scheduledMoment.format('YYYY-MM-DDTHH:mm:00.000'),
            timeZoneId: timezone
        },
        alertInfo: {
            spokenInfo: {
                content: [{
                    locale,
                    text: message
                }]
            }
        },
        pushNotification: {
            status: 'ENABLED'
        }
    }
);

module.exports =  {
    getS3PreSignedUrl, 
    getPersistenceAdapter,
    createReminder
}