module.exports = {
    en: {
        translation: {
             WELCOME_MSG: 'Welcome to my deadlines ',
            REGISTER_MSG: 'Your deadline {{module}} is {{month}} {{day}} {{year}}.',
            REJECTED_MSG: 'OK. Give me another deadline date',
            HELP_MSG: 'You can say Hello to me ! How can I help ?',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            GOODBYE_MSG: 'Goodbye !',
            FALLBACK_MSG: 'Sorry, I don\t know about that. Please try again',
            ERROR_MSG: 'Sorry, there was an error. Please try again'

        }
    },
    
   

    fr: {
        translation: {
            
            POSITIVE_SOUND : `<audio src = 'soundbank: // soundlibrary / ui / gameshow / amzn_ui_sfx_gameshow_positive_response_02' />` ,
            GREETING_SPEECHCON : `<say-as interpreter-as =" interjection "> bravo </say-as>` ,
            DOUBT_SPEECHCON : `<say-as interpréter-as =" interjection "> hmm </say-as>` ,
            GREET_MSG : '$ t (POSITIVE_SOUND) $ t (GREETING_SPEECHCON) {{name}}. ' ,
            WELCOME_MSG: 'Bienvenue dans la skil des échéances {{name}} ',
            WELCOME_BACK_MSG: 'Content de vous revoir  {{name}} ! ',
            REGISTER_MSG: 'ton échéance de {{module}} est le {{month}} {{day}} {{year}}.',
            REJECTED_MSG: "D accord. Je ne vais pas prendre en compte cette date. Donnez-moi une autre date pour que je puisse enregistrer",
            DAYS_LEFT_MSG: '{{name}} il vous reste {{count}} jour ',
            DAYS_LEFT_MSG_plural: '{{name}} Il vous reste {{count}} jours ',
            NOW_TURN_MSG : ` le {{module}} c est aujourd'hui! ` ,
            NOW_TURN_MSG_plural : `le {{module}} c est aujourd'hui ` ,
            WILL_TURN_MSG: 'avant votre date d échéance du {{module}}. ',
            WILL_TURN_MSG_plural: 'avant votre date d échéance du {{module}}. ',
            GREET_MSG_plural: '$ t (POSITIVE_SOUND) $ t (GREETING_SPEECHCON) {{name}}. ',
            MISSING_MSG: '$ t (DOUBT_SPEECHCON). Il me semble que vous ne m\'avez pas encore dit votre date d\'échéance. ',
            POST_SAY_HELP_MSG: `Si vous souhaitez changez votre date d échéance, dites simplement "enregistre mon échéance" ou bien dites moi directement votre date d'échéance. Quel est votre choix ?`,
            HELP_MSG: "Je peux me souvenir de votre date d échéance de {{module}} . Dites-moi le jour, mois et année de naissance ou bien dites moi simplement \"enregistre mon échéance\". ",
            REFLECTOR_MSG: "Vous avez invoqué l'intention {{intent}}",
            REPROMPT_MSG: `Pour obtenir plus d'informations sur ce que je peux faire pour vous, demandez-moi de l'aide. Si vous voulez quitter la Skill, dites simplement "stop". Quel est votre choix ?`,

            GOODBYE_MSG: [ 'Au revoir {{name}}! ' ,  ' Si longtemps {{name}}! ' ,  ' A plus tard {{name}}! ' ,  ' Cheers {{name}}! ' ] ,
            FALLBACK_MSG: 'Désolé, je ne sais pas. Pouvez vous reformuler ?',
            ERROR_MSG: "Désolé, je n'ai pas compris. Pouvez vous reformuler ?",
            NO_TIMEZONE_MSG : `Je ne peux pas déterminer votre fuseau horaire. Veuillez vérifier les paramètres de votre appareil et vous assurer qu'un fuseau horaire a été sélectionné. Après cela, veuillez rouvrir la compétence et réessayer! ` ,
        }
            
            
    }
}