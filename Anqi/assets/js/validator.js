//CHECK NAME
function check_name(){
	var string = $("#name").val().trim();
	var string_length = string.length;
	if (string_length >= 2 && string_length <= 70) {
		return true;
	}else{
		return false;
	}
}

//CHECK EMAIL
function check_email(){
	var email = $("#email").val().trim();
	var email_length = email.length;
	var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email_length >= 3 && email_length <= 255 && email_regex.test(email)) {
		return true;
	}else{
		return false;
	}
}

//CHECK MESSAGE
function check_msg(){
	var msg = $("#msg").val().trim();
	var msg_length = msg.length;
	if (msg_length >= 3) {
		if (msg_length <= 2083) {
			return 'ok';
		}else{
			return 'too_long';
		}
	}else{
		if (msg_length == 0) {
			return 'blank';
		}else{
			return 'too_short';
		}
	}
}