module.exports = {
    en: {
        translation: {
            WELCOME_MSG: `Welcome to Happy Birthday. Let's have some fun with your birthday! `,
            WELCOME_BACK_MSG: 'Welcome back! ',
            REJECTED_MSG: 'No problem. Please say the date again so I can get it right.',
            DAYS_LEFT_MSG: `There's {{count}} day left `,
            DAYS_LEFT_MSG_plural: 'There are {{count}} days left ',
            WILL_TURN_MSG: `until you're {{count}} year old. `,
            WILL_TURN_MSG_plural: `until you're {{count}} years old. `,
            GREET_MSG: `Happy birthday! You're now {{count}} year old! `,
            GREET_MSG_plural: `Happy birthday! You're now {{count}} years old! `,
            MISSING_MSG: `It looks like you haven't told me your birthday yet. `,
            POST_SAY_HELP_MSG: `If you want to change the date, try saying, register my birthday. Or just say the date directly. What would you like to do next? `,
            HELP_MSG: 'I can remember your birthday if you tell me the date. Or I can tell you the remaining days until your next birthday. Which one would you like to try? ',
            REPROMPT_MSG: `If you're not sure what to do next try asking for help. If you want to leave just say stop. What would you like to do next? `,
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, there was an error. Please try again.'
        }
    },
    fr: {
        translation: {
            WELCOME_MSG: 'Bienvenue sur la Skill des échéances! ',
            WELCOME_BACK_MSG: 'Content de vous revoir ! ',
            REJECTED_MSG: 'D\'accord, je ne vais pas prendre en compte cette échéances. Dites-moi une autre date pour que je puisse l\'enregistrer.',
            DAYS_LEFT_MSG: 'Il vous reste {{count}} jour',
            DAYS_LEFT_MSG_plural: 'Il vous reste {{count}} jours',
            WILL_TURN_MSG: ' pour le  {{count}}. ',
            WILL_TURN_MSG_plural: 'pour le {{count}}. ',
            GREET_MSG: 'Aujourd\'hui, c\'est votre date d\'échéance de  {{count}} !',
            GREET_MSG_plural: 'Aujourd\'hui, c\'est votre date d\'échéance de  {{count}}! ',
            MISSING_MSG: 'Il me semble que vous ne m\'avez pas encore dit votre date d\'échéance. ',
            POST_SAY_HELP_MSG: ' Si vous voulez changer votre date d\'échéance, dites simplement Change ma date d\'échéance ou enregistre une nouvelle échéance pour ajouter une échéance ou lister mes échéances pour récupérer vos échéances dans l\'api,ou  la prochaine échéance  ou donner la date d\'échéance. Quel est votre choix? ',
            HELP_MSG: 'Je peux me souvenir de votre date d\'échéance et vous dire le nombre de jours restant. Quel est votre choix ?',
            REPROMPT_MSG: `Pour obtenir plus d'informations sur ce que je peux faire pour vous, demandez-moi de l'aide. Si vous voulez quitter la Skill, dites simplement "stop". Quel est votre choix ?`,
            GOODBYE_MSG: 'Au revoir! ',
            
            YOURS_DEADLINES: " Vos échéances sont: ",
            DATE_DEADLINE: " La date d\'échéance de {{nameDeadline}} est le {{day}} / {{month}} / {{year}}. ",
            DATE_DEADLINE_UNTIL: " Il vous reste {{count}} jours avant cette date. ",
            NO_DEADLINE_NAME: " Aucune échéance trouvé avec ce nom.",
            
           
            REFLECTOR_MSG: 'Vous avez invoqué l\'intention {{intent}}',
            FALLBACK_MSG: 'Désolé, je ne sais pas répondre à votre demande. Pouvez-vous reformuler?. ',
            ERROR_MSG: 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler? ',
            NO_TIMEZONE_MSG: "Je n'ai pas réussi à déterminer votre fuseau horaire. Veuillez vérifier les paramètres de votre appareil et réessayez. ",
            REMINDER_ERROR_MSG: "Il y a eu un problème lors de la création du rappel.",
            UNSUPPORTED_DEVICE_MSG: "Votre appareil ne supporte pas la création de rappels. ",
            CANCEL_MSG: "OK, j'ai annulé la demande de rappel. ",
            MISSING_PERMISSION_MSG: "Je n'ai pas accès à la création de rappels. Veuillez accéder à votre application Alexa et suivez les instructions depuis la card que je vous ai envoyé. ",
            POST_REMINDER_HELP_MSG: "Pour connaître quand votre rappel se déclenchera, il suffit de me dire 'combien de jours reste-t-il avant mon anniversaire'. Que voulez-vous faire ?",
            PROGRESSIVE_MSG: "Je recherche des célébrités nées aujourd'hui. ",
            API_ERROR_MSG: "Désolé, je n'arrive pas à me connecter à l'API externe pour obtenir des résultats. Veuillez réessayer plus tard. ",
            CONJUNCTION_MSG: ' et ',
            ALSO_TODAY_MSG: "C'est aussi l'anniversaire de : ",
            POST_CELEBRITIES_HELP_MSG: "Voulez-vous connaitre le nombre de jours avant votre anniversaire ou bien enregistrer un rappel: quel est votre choix ? "
        }
    }
   
}