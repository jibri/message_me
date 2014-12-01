module.exports.Messages = Messages;

function Messages() {

  // Server messages
  this.server_not_allowed = "Vous n'êtes pas autorisé à accéder à cette ressource.";
  this.server_generic_error = "Une erreur s'est produite. Veuillez réessayer plus tard, ou bien contacter un administrateur.";

  // Buttons
  this.button_connection = "Connexion";
  this.button_create = "Créer";
  this.button_edit = "Modifier";
  this.button_close_popup = "Fermer";

  // Validation messages
  this.validation_generic = "Certains champs du formulaire ne sont pas renseignés correctement.";
  this.validation_required_field = "Doit être renseigné.";
  this.validation_under_min_field = "Doit être supérieur à {0}.";
  this.validation_above_max_field = "Doit être inférieur à {0}";
  this.validation_bad_type_field = "La valeur n'est pas conforme.";

  // Header
  this.header_index_tooltip = "Retour à l'accueil";
  this.header_my_account = "Bienvenue {0}";
  this.header_my_account_tootip = "Modifier mes informations";
  this.header_didyouknow = "Le saviez-vous ?";
  this.header_logout = "Déconnexion";

  // Menu
  this.menu_home = "Accueil";
  this.menu_messages = "Messages";
  this.menu_logout = "Déconnexion";

  // Footer
  this.footer_copyright = "Anec.me 2014";
  this.footer_contact = "Contacts";
  this.footer_copyright_content = "<b>Anec.me</b><br/><ul><li>Version : v0.1.0</li><li>Auteur : Jérémie Briand</li><li>License : OpenSource (MIT)</li><li>Repertoire Git : <a href=\"http://github.com/jibri/message_me\">http://github.com</a></li></ul>";
  this.footer_contact_content = "Support de l'application : Jérémie Briand \"anec.me@outlook.com\"";

  // Login page
  this.login_connection_frame_title = "Connexion";
  this.login_newAccount_frame_title = "Je n'ai pas de compte";
  this.login_newAccount_frame_content = "Bienvenue sur <b>Anec.me</b>.<br/><br/>Malheureusement, l'application est actuellement fermée aux inscriptions. Un compte de démo va être mis en place sous peu pour vous permettre de découvrir les fonctionnalités disponibles.<br/><br/>A bientôt sur <b>Anec.me</b>.";
  this.login_login_label = "Identifiant";
  this.login_password_label = "Mot de passe";
  this.login_connexion_failed = "Les informations saisies n'ont pas permi de vous identifier. Vérifiez vos identifiants de connexion et réessayez.";

  // Index page
  this.index_greating_message = "Bienvenue dans l'application <b>Anec.me</b>, prononcez 'anec dot me'.<br/>Cette appli est destinée à des groupes de personnes qui souhaitent pouvoir discuter ensemble sur divers sujets, sans pour autant ouvrir des usines à gaz qui possèdent 36 autres applications et qui gènes la navigation.<br/><br/>Anec.me est une application open source.Elle est actuellement en version beta, et toute suggestion est la bienvenue. De même toute erreur peut être remontée via l'adresse mail située dans contact en bas de page, ou bien dans les 'report issues' du repertoire Git indiqué dans les informations de l'application.";
  this.index_information_frame_title = "Information";

  // Messages page
  this.message_conversations_frame_title = "Mes conversations";
  this.message_conversations_envelope = "Conversation du {0}";
  this.message_conversations_chatters = "Avec ";
  this.message_conversations_create_tootip = "Créer une nouvelle conversation";

  this.message_messages_frame_title = "Messages";
  this.message_messages_noMsg = "Aucun message à afficher.";
  this.message_messages_envelope = "De {0}, {1}";

  this.message_form_add = "Ajouter le message";
  this.message_form_placeHolder = "Entrez un message";

  // Conversation popup
  this.conversation_form_frame_title = "Créer une nouvelle conversation";
  this.conversation_form_title_label = "Titre";
  this.conversation_form_messages_content_label = "Votre message";
  this.conversation_form_users_label = "Avec";
  this.conversation_form_create = "Créer la conversation";

  // Emails
  this.mail_new_conversation_header = "[Anec.me] Nouvelle conversation";
  this.mail_new_conversation_content = "Bonjour,<br/><br/>[[USER]] vient de démarrer une nouvelle conversation.<br/><br/><hr/><a href=\"[[URL]]\"><b>[[TITLE]]</b><br/>[[CONTENT]]</a><hr/>";
  this.mail_new_message_header = "[Anec.me] Nouveau message";
  this.mail_new_message_content = "<html><body>Bonjour,<br/><br/>[[USER]] vient de déposer un nouveau \"message\" dans la conversation <b>[[TITLE]]</b><br/><br/><hr/><a href=\"[[URL]]\">[[CONTENT]]</a><hr/></body></html>";

  // User popup
  this.user_form_name_label = "Nom";
  this.user_form_firstname_label = "Prénom";
  this.user_form_password_label = "Mot de passe";
  this.user_form_mail_label = "Mail";

  // Password popup
  this.password_form_frame_title = "Modifier mon mot de passe";
  this.password_form_info = "Entrez un nouveau mot de passe afin de finaliser votre inscription.";
  this.password_form_password_label = "Nouveau mot de passe";
  this.password_form_confirm_label = "Confirmer";

}