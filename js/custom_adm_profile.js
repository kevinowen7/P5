function changePass() {
	$("#changethepass").prop("disabled",true);
	firebase.auth().onAuthStateChanged(function(currentUser) {
		if (currentUser) { // User signed in
			// Get passwords
			var currentPassword = sha256($("#userpass").val());
			var newPassword = sha256($("#confpass").val());
			
			// Create credential of current user
			var credentials = firebase.auth.EmailAuthProvider.credential(
				currentUser.email,
				currentPassword
			);
			
			// Re-authenticate current user
			currentUser.reauthenticateAndRetrieveDataWithCredential(credentials).then(function() {
				// User re-authenticated.
				currentUser.updatePassword(newPassword).then(function() {
					addNotification("Password Changed","Your password was changed successfully");
					$("#changePassModal").modal("hide");
					$('#changePassForm')[0].reset();
					$("#changethepass").prop("disabled",false);
				}).catch(function(err) {
					addNotification("Error",err.code+" : "+err.message);
				});
			}).catch(function(err) {
				addNotification("Error",err.code+" : "+err.message);
			});
		}
	})
	
}

function triggerHappy() {
	
	// Trigger file browser when picture is clicked
	$("#fileButton").trigger("click");
	if ($("#fileButton").val() != "") {
		$("#bfinish").prop("disabled",false);
	}
	
}

function updateProfilePic() {
	
	// Hide button
	$("#bfinish")
		.css("display","none")
		.prop("disabled",true);
	// Collect required data for upload
	var photo = $("#prepiew1").attr("src");
	var userID = $("#currentUserID").val();
	var realname = $("#fileName2").val();
	var filename = userID+".jpg";
	var storageRef = firebase.storage().ref("images/profile/"+filename);
	var task = storageRef.putString(photo,'data_url');
	$("#progBared1").fadeIn(250, function() {
		$(this).show();
	});
	// Upload image to storage
	task.on('state_changed',
		function progress(snapshot) {
			var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
			$("#progBar1").css("width",percentage+"%");
		},
		function error(err) {
			addNotification("Error",err.code+" : "+err.message);
		},
		function complete() {
			// Cache control
			var newMetadata = {
				cacheControl: 'public,max-age=300',
				contentType: 'image/jpeg'
			}
			storageRef.updateMetadata(newMetadata).then(function(metadata) {
				// Update to database
				const dbRef = firebase.database().ref("presence/"+userID);
				dbRef.update({
					profileImage : filename
				}).then(function onSuccess(res) {
					location.reload();
				}).catch(function onError(err) {
					addNotification("Error",err.code+" : "+err.message);
				});
			}).catch(function(err) {
				addNotification("Error",err.code+" : "+err.message);
			});
		}
	)
	
}

$(document).ready(function() {
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) { // User signed in
			var userID = user.uid;
			const dbRefUser = firebase.database().ref("presence/"+userID);
			$("#currentUserID").val(userID);
			
			// Check if photo exist
			dbRefUser.once('value', function(snapshot) {
				var userName = snapshot.child("name").val();
				var userEmail = snapshot.child("email").val();
				var userContact = snapshot.child("contactNo").val();
				$("#breadName,#userName").html(userName);
				$("#userEmail").html(userEmail);
				$("#userContact").html(userContact);
				
				var userPhoto = snapshot.child("profileImage").val();
				if (userPhoto != "empty") { // Photo exist
					// Download image from storage
					var strRef = firebase.storage().ref().child('images/profile/'+userPhoto);
					strRef.getDownloadURL().then(function(url) {
						$("#prepiew1").prop("src",url);
						$("#fileName1").val(url);
						stopPageLoad();
					}).catch(function(err) {
						addNotification("Error",err.code+" : "+err.message);
					});
				} else { // Photo empty
					$("#fileName1").val("img/empty-photo.jpg");
					stopPageLoad();
				}
				
				// Start datatables
				var table = $('#historyTable').DataTable({
					"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
					"iDisplayLength": -1,
					"order": [ 1,"asc"],
					"columnDefs": 
					[{
						targets: 0,
						width: "30%"
					}]
				});
			});
		}
	});
	
	// Change password button listener
	$('#userChangePass').on('click', function () {
		$("#changePassModal").modal();
	});
	
	// Picture listener
	$('#prepiew1').on('load', function () {
		if (($(this).attr('src') != "img/empty-photo.jpg") && ($(this).attr('src') != $("#fileName1").val())) {
			$("#bfinish").prop("disabled",false);
		}
	});
	
	// File input listener
	$("#fileButton").change(function() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#prepiew1').attr('src', e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
			$("#fileName2").val(this.files[0].name);
		}
	});
	
	// Profile update button listener
	$('#bfinish').on('click', function () {
		updateProfilePic();
	});
});

// Form validation
$().ready(function() {
	
	$.validator.addMethod("notEqual", function(value, element, param) {
		return this.optional(element) || value != $(param).val();
	}, "This has to be different.");
	$("#changePassForm").validate({
		submitHandler: function() {
			//what to do after submit
			changePass();
		},
		rules: {
			userpass: {
				required: true,
				minlength: 8
			},
			newpass: {
				required: true,
				minlength: 8,
				notEqual: "#userpass"
			},
			confpass: {
				required: true,
				minlength: 8,
				equalTo: "#newpass"
			}
		},
		messages: {
			userpass: {
				required: "Please provide current password",
				minlength: "Password must be at least 8 characters long"
			},
			newpass: {
				required: "Please provide new password",
				minlength: "Password must be at least 8 characters long",
				notEqual: "New password must be different"
			},
			confpass: {
				required: "Please confirm new password",
				minlength: "Password must be at least 8 characters long",
				equalTo: "Confirmed password is not the same"
			}
		}
	})

});