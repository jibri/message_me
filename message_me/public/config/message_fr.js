/**
 * French translation of I18N.
 */
var messages = {

	// Server messages
	server_not_allowed : "Vous n'êtes pas autorisé à accéder à cette ressource.",
	server_generic_error : "Une erreur s'est produite. Veuillez réessayer plus tard, ou bien contacter un administrateur.",

	// Buttons
	button_connection : "Connexion",
	button_create : "Créer",
	button_edit : "Modifier",
	button_close_popup : "Fermer",

	// Validation messages
	validation_generic : "Certains champs du formulaire ne sont pas renseignés correctement.",
	validation_required_field : "Doit être renseigné.",
	validation_under_min_field : "Doit être supérieur à {0}.",
	validation_above_max_field : "Doit être inférieur à {0}",
	validation_bad_type_field : "La valeur n'est pas conforme.",

	// Header
	header_index_tooltip : "Retour à l'accueil",
	header_my_account : "Bienvenue {0}",
	header_my_account_tootip : "Modifier mes informations",
	header_didyouknow : "Le saviez-vous ?",
	header_logout : "Déconnexion",

	// Menu
	menu_home : "Accueil",
	menu_messages : "Messages",
	menu_logout : "Déconnexion",

	// Footer
	footer_copyright : "Anec.me 2014",
	footer_contact : "Contacts",
	footer_copyright_content : "<b>Anec.me</b><br/><ul><li>Version : v0.1.0</li><li>Auteur : Jérémie Briand</li><li>License : OpenSource (MIT)</li><li>Repertoire Git : <a href:\"http://github.com/jibri/message_me\">http://github.com</a></li></ul>",
	footer_contact_content : "Support de l'application : Jérémie Briand \"anec.me@outlook.com\"",

	// Login page
	login_connection_frame_title : "Connexion",
	login_newAccount_frame_title : "Je n'ai pas de compte",
	login_newAccount_frame_content : "Bienvenue sur <b>Anec.me</b>.<br/><br/>Malheureusement, l'application est actuellement fermée aux inscriptions. Un compte de démo va être mis en place sous peu pour vous permettre de découvrir les fonctionnalités disponibles.<br/><br/>A bientôt sur <b>Anec.me</b>.",
	login_login_label : "Identifiant",
	login_password_label : "Mot de passe",
	login_connexion_failed : "Les informations saisies n'ont pas permi de vous identifier. Vérifiez vos identifiants de connexion et réessayez.",

	// Index page
	index_greating_message : "Bienvenue dans l'application <b>Anec.me</b>, prononcez 'anec dot me'.<br/>Cette appli est destinée à des groupes de personnes qui souhaitent pouvoir discuter ensemble sur divers sujets, sans pour autant ouvrir des usines à gaz qui possèdent 36 autres applications et qui gènes la navigation.<br/><br/>Anec.me est une application open source.Elle est actuellement en version beta, et toute suggestion est la bienvenue. De même toute erreur peut être remontée via l'adresse mail située dans contact en bas de page, ou bien dans les 'report issues' du repertoire Git indiqué dans les informations de l'application.",
	index_information_frame_title : "Information",

	// Messages page
	message_conversations_frame_title : "Mes conversations",
	message_conversations_envelope : "Conversation du {0}",
	message_conversations_chatters : "Avec ",
	message_conversations_create_tootip : "Créer une nouvelle conversation",

	message_messages_frame_title : "Messages",
	message_messages_noMsg : "Aucun message à afficher.",
	message_messages_envelope : "De {0}, {1}",

	message_form_add : "Ajouter le message",
	message_form_placeHolder : "Entrez un message",

	// Conversation popup
	conversation_form_frame_title : "Créer une nouvelle conversation",
	conversation_form_title_label : "Titre",
	conversation_form_messages_content_label : "Votre message",
	conversation_form_users_label : "Avec",
	conversation_form_create : "Créer la conversation",

	// Emails
	mail_new_conversation_header : "[Anec.me] Nouvelle conversation",
	mail_new_conversation_content : "Bonjour,<br/><br/>[[USER]] vient de démarrer une nouvelle conversation.<br/><br/><hr/><a href:\"[[URL]]\"><b>[[TITLE]]</b><br/>[[CONTENT]]</a><hr/>",
	mail_new_message_header : "[Anec.me] Nouveau message",
	mail_new_message_content : "<html><body>Bonjour,<br/><br/>[[USER]] vient de déposer un nouveau \"message\" dans la conversation <b>[[TITLE]]</b><br/><br/><hr/><a href:\"[[URL]]\">[[CONTENT]]</a><hr/></body></html>",

	// User popup
	user_form_name_label : "Nom",
	user_form_firstname_label : "Prénom",
	user_form_password_label : "Mot de passe",
	user_form_mail_label : "Mail",

	// Password popup
	password_form_frame_title : "Modifier mon mot de passe",
	password_form_info : "Entrez un nouveau mot de passe afin de finaliser votre inscription.",
	password_form_password_label : "Nouveau mot de passe",
	password_form_confirm_label : "Confirmer",

};

// MODULE EXPORTS
module.exports = messages;
