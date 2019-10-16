//firebase auth listener
firebase.auth().onAuthStateChanged(function(user) {
	//user signed in
	if (user) {
		window.location = "home.html";
	} else {
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}
})

//limit attempt
var attempt = 3;

function login(){
	
	//when user still have attempt
	if (attempt != 0) {
		//get email and password(encrypted sha256)
		var userEmail = $("#email1").val();
		var userPass = sha256($("#password1").val());
		//login through firebase auth
		firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(result) {
			//jump to input page
			window.location = "home.html";
		}).catch(function(err) {
			var errorCode = err.code;
			if (errorCode == "auth/user-not-found" || errorCode == "auth/wrong-password") {
				//decrease attempt
				attempt = attempt-1;
				//stop loading icon
				$("#loadingGrp").fadeOut(300, function() {
					$(this).hide();
				})
				//unlock form
				$("input,button").prop("disabled",false);
				//add notification
				$.gritter.add({
					title: 'Error',
					text: 'Invalid email or password.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				})
			} else {
				//stop loading icon
				$("#loadingGrp").fadeOut(300, function() {
					$(this).hide();
				})
				//unlock form
				$("input,button").prop("disabled",false);
				//add notification
				$.gritter.add({
					title: 'Error',
					text: err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				})
			}
		})
	//when user have no more attempt
	} else {
		//stop loading icon
		$("#loadingGrp").fadeOut(300, function() {
			$(this).hide();
		})
		//unlock form
		$("input,button").prop("disabled",false);
		//add notification
		$.gritter.add({
			title: 'Error',
			text: 'No more login attempts.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	}

}

function showPass() {

	var x = document.getElementById("password1");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }

}	

//jquery form validation
$().ready(function() {

	$("#loginForm").validate({
		submitHandler: function() {
			//start loading icon
			$("#loadingGrp").fadeIn(300, function() {
				$(this).removeClass("hide");
			})
			//lock form
			$("input,button").prop("disabled",true);
			//start login script
			login();
		},
		rules: {
			email1: {
				required: true,
				email: true
			},
			password1: {
				required: true
			}
		},
		messages: {
			email1: {
				required: "Please enter email address.",
				email: "Please enter a valid email address."
			},
			password1: {
				required: "Please enter password."
			}
		}
	});

});