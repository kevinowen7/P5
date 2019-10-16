function startContentLoad() {
	
	$("#loadingContent").fadeIn(250, function() {
		$(this).show();
	});
	
}

function stopContentLoad() {

	$("#loadingContent").fadeOut(250, function() {
		$(this).hide();
	});

}

function capitalize(string) {
	
    return string.charAt(0).toUpperCase() + string.slice(1);

}

function lockForm() {
	
	$("#addUserForm").find("input,button").prop("disabled",true);
	
}

function unlockForm() {
	
	$("#addUserForm").find("input,button").prop("disabled",false);

}

function addUser() {
	
	lockForm();
	startContentLoad();
	
	// Retrieve data in form
	var userName = $("#name").val();
	var userEmail = $("#email").val();
	var userPassword = sha256($("#confpassword").val());
	var userContact = $("#contactno").val();
	const dbRefPresence = firebase.database().ref("presence");
	
	// Check if user is registered on database
	var userCount = 0;
	var checkCount = 0;
	var emailValidity = true;
	
	dbRefPresence.once('value', function(snapshot) {
		userCount = snapshot.child("userCount").val();
		
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key != "userCount") {
				++checkCount;
				var dbEmail = childSnapshot.val().email;
				if (userEmail == dbEmail) { // Email registered
					emailValidity = false;
					addNotification("Error","Email already registered.");
					unlockForm();
					stopContentLoad();
				} else if ((userEmail != dbEmail) && (checkCount == userCount) && emailValidity) { // Email unregistered
					// Add user in database (temporary)
					firebase.database().ref("temp_user").child(sha256(userEmail)).update({
						contactNo : userContact,
						email : userEmail,
						name : userName,
					}).then(function onSuccess(res) {
						// Create account in auth
						firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function(newUser) {
							stopContentLoad();
							addNotification("User Added","New user added successfully");
						}).catch(function(err) {
							addNotification("Error",err.code+" : "+err.message);
							stopContentLoad();
							unlockForm();
						});
					}).catch(function onError(err) {
						addNotification("Error",err.code+" : "+err.message);
						stopContentLoad();
						unlockForm();
					});
				}
			}
		});
	});

}

firebase.auth().onAuthStateChanged(function(user) {
	
	if (user) { // User signed in
		// Get current user data
		var userEmail = user.email;
		var userID = user.uid;
		const dbRefPresence = firebase.database().ref("presence");
		
		// Check if user has the privilege
		dbRefPresence.child(userID).once('value', function(snapshot) {
			if (snapshot.child("privilege").val() != "admin") { // User has no privilege
				window.location = "home.html";
			} else { // User has privilege
				// Start datatables
				var table = $('#data-table').DataTable({
					"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
					"iDisplayLength": -1,
					"sPaginationType": "full_numbers",
					"order": [[ 4,"asc"],[ 1,"asc"]],
					"columnDefs": 
					[{
						targets: -1,
						orderable: false, 
						width: "10%"
					},
					{
						targets: 0,
						visible: false,
						searchable: false
					},
					{
						targets: 1, 
						width: "25%"
					},
					{
						targets: 2, 
						width: "25%"
					},
					{
						targets: 3, 
						width: "20%"
					}]
				});
				stopPageLoad();
				
				// Retrieve data from database to table
				dbRefPresence.on('child_added', function(snapshot) {
					if (snapshot.key != "userCount") {
						startContentLoad();
						var userID = snapshot.key;
						var userName = snapshot.child("name").val();
						var userEmail = snapshot.child("email").val();
						var userContact = snapshot.child("contactNo").val();
						var userRole = capitalize(snapshot.child("privilege").val());
						var userTerminated = capitalize(snapshot.child("terminated").val().toString());
						
						if (userRole == "Admin" || userTerminated == "True") { // Super Admin or Terminated
							table.row.add([userID,userName,userEmail,userContact,userRole,userTerminated,null]).node().id = "table-"+userID;
							table.draw();
						} else {  // Standard Admin
							table.row.add([userID,userName,userEmail,userContact,userRole,userTerminated,"<button id='terminateUser' class='btn btn-xs btn-danger' title='Terminate User'><i class='fa fa-trash-o'></i></button>"]).node().id = "table-"+userID;
							table.draw();
						}
						stopContentLoad();
					}
				});
				
				// Replace changed data from database to table
				dbRefPresence.on('child_changed', function(snapshot) {
					if (snapshot.key != "userCount") {
						startContentLoad();
						var userID = snapshot.key;
						var userName = snapshot.child("name").val();
						var userEmail = snapshot.child("email").val();
						var userContact = snapshot.child("contactNo").val();
						var userRole = capitalize(snapshot.child("privilege").val());
						var userTerminated = capitalize(snapshot.child("terminated").val().toString());
						var userStatus = capitalize(snapshot.child("userStatus").val());
						
						var row = table.row('#table-'+userID);
						row.remove();
						
						if (userRole == "Admin" || userTerminated == "True") { // Super Admin or Terminated
							table.row.add([userID,userName,userEmail,userContact,userRole,userTerminated,null]).node().id = "table-"+userID;
							table.draw(false);
						} else {  // Standard Admin
							table.row.add([userID,userName,userEmail,userContact,userRole,userTerminated,"<button id='terminateUser' class='btn btn-xs btn-danger' title='Terminate User'><i class='fa fa-trash-o'></i></button>"]).node().id = "table-"+userID;
							table.draw(false);
						}
						stopContentLoad();
					}
				});
				
				// Terminate button listener
				$('#data-table tbody').on('click', '#terminateUser', function () {
					var conf = confirm("Are you sure you want to terminate this user? There is no going back.")
					if (conf) {
						startContentLoad();
						// Get row data
						var row = table.row($(this).parents('tr'));
						var data = row.data();
						// Variables for reference
						var userID = data[0];
						var dbRefPresence = firebase.database().ref("presence");
						// Delete profile picture in storage
						dbRefPresence.child(userID).once('value', function(snapshot) {
							if (snapshot.child("profileImage").val() != "empty") { // Profile picture exist
								const fileName = userID+".jpg";
								const storageRef = firebase.storage().ref().child("images/profile/"+fileName);
								storageRef.delete().catch(function(err) {
									addNotification("Error",err.code+" : "+err.message);
								});
								// Change terminated status in database
								dbRefPresence.child(userID).update({
									profileImage : "empty",
									profilepic : null,
									terminated : true
								}).catch(function onError(err) {
									addNotification("Error",err.code+" : "+err.message);
								});
							} else {
								// Change terminated status in database
								dbRefPresence.child(userID).update({
									terminated : true
								}).catch(function onError(err) {
									addNotification("Error",err.code+" : "+err.message);
								});
							}
							stopContentLoad();
						});
					}
				});
			}
		});
	}
});

//jquery form validation
$().ready(function() {
	
	$("#addUserForm").validate({
		submitHandler: function() {
			//what to do after submit
			addUser();
		},
		rules: {
			name: {
				required: true
			},
			email: {
				required: true
			},
			password: {
				required: true,
				minlength: 8
			},
			confpassword: {
				required: true,
				minlength: 8,
				equalTo: "#password"
			},
			contactno: {
				required: true
			}
		},
		messages: {
			name: {
				required: "Please provide a name"
			},
			email: {
				required: "Please provide an email"
			},
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long"
			},
			confpassword: {
				required: "Please provide a password",
				minlength: "Your password must be at least 8 characters long",
				equalTo: "Password is not the same as above"
			},
			contactno: {
				required: "Please provide a contact number"
			}
		}
	});

})