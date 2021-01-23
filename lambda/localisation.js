module.exports = {
    
    en: {
        translation: {
       
            WELCOME_MSG: 'Welcome to deadlines',
            WELCOME_BACK_MSG: 'Welcome back! ',
            REJECTED_MSG: 'No problem. Please say the date again so I can get it right.',
            DAYS_LEFT_MSG: `There's {{count}} day left `,
            DAYS_LEFT_MSG_plural: 'There are {{count}} days left ',
            WILL_TURN_MSG: `until {{count}}. `,
            WILL_TURN_MSG_plural: `until {{count}}. `,
            GREET_MSG: 'Today is the deadline of {{count}} ',
            MISSING_MSG: `It looks like you haven't told me your deadline yet. `,    
            CHANGE_DEADLINE: 'To edit your deadline, say "Change my deadline date". ',
            POST_SAY_HELP_MSG: ' You can tell me  "create a new deadline" , "list my deadlines", "The next deadline"  ou "Give me the date for the deadline". What would you like to do? ',
            HELP_MSG: 'I can remember your deadline if you tell me the date. Or I can tell you the remaining days until your next deadline. Which one would you like to try? ',
            REPROMPT_MSG: `If you're not sure what to do next try asking for help. If you want to leave just say stop. What would you like to do next? `,
            GOODBYE_MSG: 'Goodbye {{name}} !',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, there was an error. Please try again.',
            REGISTER_FIRST_DEADLINE: 'To save your first deadline, please say "create a new deadline"',
            YOURS_DEADLINES: "Your deadlines are : ",
            DATE_DEADLINE: " The deadline for {{nameDeadline}} is {{month}} {{day}} {{year}}. ",
            DATE_DEADLINE_UNTIL: " You have {{count}} day before this date. ",
            DATE_DEADLINE_UNTIL_plural: "You have {{count}} days before this date. ",
            NO_DEADLINE_NAME: "No deadline found with this name. ",
            NO_TIMEZONE_MSG: 'I could not determine your timezone. PLease check your device\'s settings and try again. ',
            REMINDER_CREATED_MSG: '{{name}} Your reminder has been succesfully created. ',
            REMINDER_ERROR_MSG: 'There was a problem encountered in the creation of the reminder probleme. ',
            UNSUPPORTED_DEVICE_MSG: 'You device does not support the creation of reminders. ',
            CANCEL_MSG: 'Ok, I cancelled the reminder. ',
            MISSING_PERMISSION_MSG: 'I do not have access to create reminders. Please access your Alexa app and follow the instructions from the card that has been sent to you. ',
            POST_REMINDER_HELP_MSG: 'To know when you\'ll get your reminder, just say, "how many days left before my deadline". What do you want to do? ',
            API_ERROR_MSG: "Sorry, I\'m having trouble connecting to the external API in order to get the results. Please try again later. ",
            CONJUNCTION_MSG: ' and ',
            NEXT_DEADLINE: " The next deadline is {{nameDeadline}}. ",
            ERROR_DATE_IN_PAST: "This date is in the past. Give me a valid date. "
            
        }
    },
    fr: {
        translation: {
            
            WELCOME_MSG: 'Bienvenue sur la Skill des échéances! ',
            WELCOME_BACK_MSG: 'Content de vous revoir ! ',
            REJECTED_MSG: 'D\'accord, je ne vais pas prendre en compte cette échéances. Dites-moi une autre date pour que je puisse l\'enregistrer.',
            DAYS_LEFT_MSG: ' {{name}} il vous reste {{count}} jour',
            DAYS_LEFT_MSG_plural: ' {{name}} il vous reste {{count}} jours',
            WILL_TURN_MSG: ' pour le  {{count}}. ',
            WILL_TURN_MSG_plural: 'pour le {{count}}. ',
            GREET_MSG: 'Aujourd\'hui, c\'est votre date d\'échéance de  {{count}} !',
            MISSING_MSG: 'Il me semble que vous ne m\'avez pas encore dit votre date d\'échéance. ',
            CHANGE_DEADLINE: 'Pour changer votre date d\'échéance dites simplement "Change ma date d\'échéance"',
            POST_SAY_HELP_MSG: ' Vous pouvez me dire "enregistre une nouvelle échéance" , "lister mes échéances", "la prochaine échéance"  ou "donner la date d\'échéance". Quel est votre choix? ',
            HELP_MSG: 'Je peux me souvenir de votre date d\'échéance et vous dire le nombre de jours restant. Quel est votre choix ?',
            REPROMPT_MSG: `Pour obtenir plus d'informations sur ce que je peux faire pour vous, demandez-moi de l'aide. Si vous voulez quitter la Skill, dites simplement "stop". Quel est votre choix ?`,
            GOODBYE_MSG: 'Au revoir {{name}} ! ',         
            REGISTER_FIRST_DEADLINE: "Pour enregistrer votre première échéances dites enregistre une nouvelle échéance ",
            YOURS_DEADLINES: " Vos échéances sont: ",
            DATE_DEADLINE: " La date d\'échéance de {{nameDeadline}} est le {{day}} / {{month}} / {{year}}. ",
            DATE_DEADLINE_UNTIL: " Il vous reste {{count}} jour avant cette date. ",
            DATE_DEADLINE_UNTIL_plural: " Il vous reste {{count}} jours avant cette date. ",
            NO_DEADLINE_NAME: " Aucune échéance trouvé avec ce nom.",
            NEXT_DEADLINE: " La prochaine échéance est le {{nameDeadline}}",
            ERROR_DATE_IN_PAST: "Cette date est déjà passée. Donnez moi une date valide. ",   
            NO_TIMEZONE_MSG: 'Je n\'ai pas réussi à déterminer votre fuseau horaire. Veuillez vérifier les paramètres de votre appareil et réessayez.',
            REMINDER_CREATED_MSG: '{{name}} Votre rappel vient d\'être créé avec succès. ',
            REMINDER_ERROR_MSG: 'Il y a eu un problème pendant la création du rappel. ',
            UNSUPPORTED_DEVICE_MSG: 'Votre appareil ne supporte pas la création de rappels. ',
            CANCEL_MSG: 'Ok, J\'ai annulé la demande de rappel. ',
            MISSING_PERMISSION_MSG: 'Je n\'ai pas accès à la création de rappels. Veuillez accéder à votre application Alexa et suivez les instructions depuis la card que je vous ai envoyé. ',
            POST_REMINDER_HELP_MSG: `Pour connaître quand votre rappel se déclenchera, il suffit de me dire "combien de jours reste-t-il avant mon échéance". Que voulez-vous faire ?`,  
            REFLECTOR_MSG: 'Vous avez invoqué l\'intention {{intent}}',
            FALLBACK_MSG: 'Désolé, je ne sais pas répondre à votre demande. Pouvez-vous reformuler?. ',
            ERROR_MSG: 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler? ',
            API_ERROR_MSG: "Désolé, je n'arrive pas à me connecter à l'API externe pour obtenir des résultats. Veuillez réessayer plus tard. ",
            CONJUNCTION_MSG: ' et '
            
 
      
        }
    }
   
}