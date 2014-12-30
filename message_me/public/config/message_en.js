/**
 * French translation of I18N.
 */
var messages = {

	// Server messages
	server_not_allowed : "Your are not allowed to access this resource.",
	server_generic_error : "An error occured. Please try again later or contact the application admin.",

	// Buttons
	button_connection : "Connection",
	button_create : "Create",
	button_edit : "Edit",
	button_close_popup : "Close",

	// Validation messages
	validation_generic : "The form is not correctly filled.",
	validation_required_field : "Must be filled",
	validation_under_min_field : "Must be greater than {0}",
	validation_above_max_field : "Must be lower than {0}",
	validation_bad_type_field : "The value is not conform",

	// Header
	header_index_tooltip : "Back to the home page",
	header_my_account : "Welcome {0}",
	header_my_account_tootip : "Edit my informations",
	header_didyouknow : "Did you know ?",
	header_logout : "Logout",

	// Menu
	menu_home : "Home",
	menu_messages : "Messages",
	menu_logout : "Logout",

	// Footer
	footer_copyright : "Anec.me 2014",
	footer_contact : "Contacts",
	footer_copyright_content : "<b>Anec.me</b><br/><ul><li>Version : v0.2.0</li><li>Author : Jérémie Briand</li><li>License : WTFPL – Do What the Fuck You Want to Public License</li><li>Git Repository : <a href:\"http://github.com/jibri/message_me\">http://github.com</a></li></ul>",
	footer_contact_content : "Application feedback : Jérémie Briand \"anec.me@outlook.com\"",

	// Login page
	login_connection_frame_title : "Connection",
	login_newAccount_frame_title : "I have no account",
	login_newAccount_frame_content : "Welcome on <b>Anec.me</b>.<br/><br/>Unfortunatly, the app is currently closed to new registration. A demo account will be soon be set up to allow you to browse the available features.<br/><br/>See ya on <b>Anec.me</b>.",
	login_login_label : "Login",
	login_password_label : "Password",
	login_connexion_failed : "The given date did not allow us to identify yourself. Check out your credentials and try again.",
    
	// Index page
	index_greating_message : "Welcome on the application <b>Anec.me</b>",
	index_information_frame_title : "Information",

	// Messages page
	message_conversations_frame_title : "My chats",
	message_conversations_envelope : "Chat since {0}",
	message_conversations_chatters : "With",
	message_conversations_create_tootip : "Create a new chat",
    
	message_messages_frame_title : "Messages",
	message_messages_noMsg : "No message to print.",
	message_messages_envelope : "From {0}, {1}",

	message_form_add : "Add a message",
	message_form_placeHolder : "Your message here",

	// Conversation popup
	conversation_form_frame_title : "Create a new chat",
	conversation_form_title_label : "Title",
	conversation_form_messages_content_label : "Votre anecdote",
	conversation_form_users_label : "With",
	conversation_form_create : "Create the chat",

	// Emails
	mail_new_conversation_header : "[Anec.me] New chat",
	mail_new_conversation_content : "Hello,<br/><br/>[[USER]] just created a new chat.<br/><br/><hr/><a href:\"[[URL]]\"><b>[[TITLE]]</b><br/>[[CONTENT]]</a><hr/>",
	mail_new_message_header : "[Anec.me] New anecdote",
	mail_new_message_content : "<html><body>Hello,<br/><br/>[[USER]] just added a new \"anecdote\" in the chat <b>[[TITLE]]</b><br/><br/><hr/><a href:\"[[URL]]\">[[CONTENT]]</a><hr/></body></html>",

	// User popup
	user_form_name_label : "Name",
	user_form_firstname_label : "Firstname",
	user_form_password_label : "Password",
	user_form_mail_label : "Mail",

	// Password popup
	password_form_frame_title : "Edit my password",
	password_form_info : "Enter a new password in order to finalize.",
	password_form_password_label : "New password",
	password_form_confirm_label : "Confirm",

};

// MODULE EXPORTS
module.exports = messages;
