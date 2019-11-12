// Start loading icon
$("#loadingUserHead,#loadingSearchBlock").fadeIn(250, function() {
	$(this).removeClass("hide");
})


// NOTIFIKASI FUNCTION
function addNotif(){
	$("#notifModal").modal();
}

function getToday(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = mm + '/' + dd + '/' + yyyy;
	return today
}

function reformatDate(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	inputBroke=inputDate.split("/");
	inputDay=parseInt(inputBroke[1]);
	inputMonth=parseInt(inputBroke[0]);
	inputYear=inputBroke[2];
	outputDay=inputDay;
	outputMonth=months[inputMonth-1];
	outputYear=inputYear.split("")[2]+inputYear.split("")[3];
	return (outputDay+"-"+outputMonth+"-"+outputYear);
	
}

function reformatDate3(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	months2=["01","02","03","04","05","06","07","08","09","10","11","12"];
	inputBroke=inputDate.split("-");
	inputDay=inputBroke[0];
	inputMonth=inputBroke[1];
	inputYear=inputBroke[2];
	if (parseInt(inputDay) < 10) {
		outputDay = inputDay;
	} else {
		outputDay = inputDay;
	}
	for (var i=0;i<months.length;i++) {
		if (inputMonth == months[i]) {
			outputMonth = months2[i];
			break
		}
	}
	outputYear = "20"+inputYear;
	return (outputMonth+"/"+outputDay+"/"+outputYear);
	
}

function date_diff_indays(d1, d2) {
	
	var diff = Date.parse(d2) - Date.parse(d1);
	return Math.floor(diff / 86400000);
	
}

function addNotifButton(){
	firebase.auth().onAuthStateChanged(function(user) {
		var uid = user.uid;
		//validasi jika Message tidak kosong
		if ($("#notifMessage").val()!="" && $("#notifTitleMessage").val()!=""){
			
			//notifikasi ref
			var notifRef = firebase.database().ref().child("presence");
			//notifikasi ref user yang membuat notif
			var notifThisRef = firebase.database().ref().child("presence/"+uid+"/notification");
			//push notif
			notifThisRef.push({
				"title" : $("#notifTitleMessage").val(),
				"message" : $('#notifMessage').val(),
				"date" : reformatDate(getToday())
			}).then((keyId) => {
				//push notif ke smua admin dengan key push yang sama
				notifRef.on('child_added', function(snapshot) {
					if (snapshot.key!="userCount"){
						//push notif
						notifRef.child(snapshot.key+"/notification/"+keyId.key).update({
							"title" : $("#notifTitleMessage").val(),
							"message" : $('#notifMessage').val(),
							"date" : reformatDate(getToday())
						}).then((keyId) => {
						//close
						$("#notifTitleMessage").val('')
						$('#notifMessage').val('');
						});
					}
				});
			});
			$('#notifModal').modal('hide');
		}
	});
}

function delNotif(uid,id){
	//write data
	var notifRef = firebase.database().ref().child("presence/"+uid+"/notification/"+id);
	notifRef.set({
		"title" : null
	})
}

function onPin(uid,id,title,message){
	var notifRef = firebase.database().ref().child("presence");
	notifRef.on('child_added', function(snapshot) {
		if (snapshot.key!="userCount"){
			//push notif
			notifRef.child(snapshot.key+"/notification/"+id).set({
				"title" : null
			})
		}
	});
	var pin = firebase.database().ref().child("pin-notif");
	//push notif
	pin.child(id).set({
		"title" : title,
		"message" : message,
		"date" : reformatDate(getToday()),
		"add_by": uid
	})
}

function delPinNotif(uid,id){
	//write data
	var notifRef = firebase.database().ref().child("pin-notif/"+id);
	notifRef.set({
		"title" : null
	})
}

function offPin(uid,id,title,message){
	//notifikasi ref
	var notifRef = firebase.database().ref().child("presence");
	//notifikasi ref user yang membuat notif
	var notifThisRef = firebase.database().ref().child("presence/"+uid+"/notification");
	//push notif
	notifThisRef.push({
		"title" : title,
		"message" : message,
		"date" : reformatDate(getToday())
	}).then((keyId) => {
		//push notif ke smua admin dengan key push yang sama
		notifRef.on('child_added', function(snapshot) {
			if (snapshot.key!="userCount"){
				//push notif
				notifRef.child(snapshot.key+"/notification/"+keyId.key).update({
					"title" : title,
					"message" : message,
					"date" : reformatDate(getToday())
				})
			}
		});
	});
	delPinNotif(uid,id);
}
// END NOTIFIKASI FUNCTION


firebase.auth().onAuthStateChanged(function(user) {
	if (user) { // User signed in
		var userEmail = user.email;
		var userID = user.uid;
		const isOnline = firebase.database().ref(".info/connected");
		const dbRefPresence = firebase.database().ref("presence");
		const dbRefTempUser = firebase.database().ref("temp_user");
		
		//untuk jumlah notifikasi
		var numNotif=0
		//notifikasi ref
		
		var notifRef = firebase.database().ref().child("presence/"+userID+"/notification");
		// LIST NOTIFIKASI
		notifRef.on('child_added', function(snapshot) {
			if (date_diff_indays(reformatDate3(snapshot.child("date").val()),getToday())>=1){
				notifRef.child(snapshot.key).set({
					"title":null
				})
			} else {
				m =`<div id="`+snapshot.key+`" class="alert alert-warning">
						<strong style="font-size:60%">`+snapshot.child("date").val()+`</strong>
						</br>
						<strong>`+snapshot.child("title").val()+` </strong> : <span>`+snapshot.child("message").val()+`</span>
						<a href="javascript:void(0)" style="font-size:20px" onClick="onPin('`+userID+`','`+snapshot.key+`','`+snapshot.child("title").val()+`','`+snapshot.child("message").val()+`')"><i class="fa fa-thumb-tack pull-right" style="color:red"></i></a>
					</div>`
				$("#notifList").hide().delay(500).show('slow');
				$("#notifList").prepend(m);
			
				numNotif=numNotif+1
				$("#numNotif").html(numNotif);
			}
		});

		notifRef.on('child_removed', function(snapshot) {
			$("#"+snapshot.key).hide('slow');
			//mengurangi jumlah notif
			numNotif=numNotif-1
			$("#numNotif").html(numNotif);
		});
		
		var notifPinRef = firebase.database().ref().child("pin-notif");
		notifPinRef.on('child_added', function(snapshot) {
			if (snapshot.child("add_by").val()!=userID){
				// menghilangkan fungsi delete jika user bukan pembuat notifnya
				m =`<div id="`+snapshot.key+`" class="alert alert-success">
						<strong style="font-size:60%">`+snapshot.child("date").val()+`</strong>
						</br>
						<strong>`+snapshot.child("title").val()+` </strong> : <span>`+snapshot.child("message").val()+`</span>
					</div>`
				$("#notifListPin").hide().delay(500).show('slow');
				$("#notifListPin").prepend(m);
				
				numNotif=numNotif+1
				$("#numNotif").html(numNotif);
			} else {
				// memabahkan delete pada notif pin yang ditambah oleh pembuat notifnya sendiri
				m =`<div id="`+snapshot.key+`" class="alert alert-success">
						<strong style="font-size:60%">`+snapshot.child("date").val()+`</strong>
						</br>
						<strong>`+snapshot.child("title").val()+` </strong> : <span>`+snapshot.child("message").val()+`</span>
						<a href="javascript:void(0)" style="font-size:20px" onClick="offPin('`+userID+`','`+snapshot.key+`','`+snapshot.child("title").val()+`','`+snapshot.child("message").val()+`')"><i class="fa fa-thumb-tack pull-right" style="color:green"></i></a>
					</div>`
				$("#notifListPin").hide().delay(500).show('slow');
				$("#notifListPin").prepend(m);
				
				numNotif=numNotif+1
				$("#numNotif").html(numNotif);
			}
		});

		notifPinRef.on('child_removed', function(snapshot) {
			$("#"+snapshot.key).hide('slow');
			//mengurangi jumlah notif
			numNotif=numNotif-1
			$("#numNotif").html(numNotif);
		});
		// END LIST NOTIFIKASI
		
		
		
		// Check if user is in database
		dbRefTempUser.child(sha256(userEmail)).once('value', function(snapshot) {
			var tempName = snapshot.child("name").val();
			if (tempName != null) {	// User in temporary database
				var tempContact = snapshot.child("contactNo").val();
				var tempEmail = snapshot.child("email").val();
				// Add user in database
				dbRefPresence.child(userID).update({
					contactNo : tempContact,
					email : tempEmail,
					name : tempName,
					privilege : "user",
					profileImage : "empty",
					terminated : false
				}).then(function onSuccess(res) {
					dbRefTempUser.child(sha256(userEmail)).remove(
					).then(function() {
						dbRefPresence.once('value', function(snapshot) {
							var userCount = snapshot.child("userCount").val();
							dbRefPresence.update({
								userCount : ++userCount
							}).then(function onSuccess(res) {
								location.reload();
							}).catch(function(err) {
								addNotification("Error",err.code+" : "+err.message);
							});
						});
					}).catch(function(err) {
						addNotification("Error",err.code+" : "+err.message);
					});
				}).catch(function onError(err) {
					addNotification("Error",err.code+" : "+err.message);
				});
			} else { // User in database
				// Check if user is terminated
				dbRefPresence.child(userID).on('value', function(snapshot) {
					var isTerminated = snapshot.child("terminated").val()
					var userPrivilege = snapshot.child("privilege").val()
					var userPhoto = snapshot.child("profileImage").val();
					
					if (isTerminated) { // User terminated
						firebase.auth().signOut();
					} else { // User active
						$("#nama").html(userEmail);
						
						//if User is Super Admin
						if (userPrivilege == "admin") {
							$("#admManage").removeClass("hidden");
						}
						
						// Check if photo exist
						if (userPhoto != "empty") {  // Photo exist
							// Download image from storage
							var strRef = firebase.storage().ref().child('images/profile/'+userPhoto);
							strRef.getDownloadURL().then(function(url) {
								$("#imgcircle").prop("src",url);
							}).catch(function(err) {
								addNotification("Error",err.code+" : "+err.message);
							});
						}
						
						// Listen to user connection
						isOnline.on('value', function(snapshot) {
							if (snapshot.val()) {
								dbRefPresence.child(userID).onDisconnect().update({
									userStatus : "offline"
								});
								dbRefPresence.child(userID).update({
									userStatus : "online"
								});
							}
						});
						document.onIdle = function () {
							dbRefPresence.child(userID).update({
								userStatus : "idle"
							});
						}
						document.onAway = function () {
							dbRefPresence.child(userID).update({
								userStatus : "away"
							});
						}
						document.onBack = function (isIdle, isAway) {
							dbRefPresence.child(userID).update({
								userStatus : "online"
							});
						}
						
						// Load Online List into Sidebar
						dbRefPresence.on('child_added', function(snapshot) {
							if ((snapshot.key != "userCount") && !snapshot.child("terminated").val()) {
								var userID = snapshot.key;
								var userName = snapshot.child("name").val();
								var userStatus = snapshot.child("userStatus").val();
								var userPhoto = snapshot.child("profileImage").val();
								$("#presenceList").append('<li id="'+userID+'"><img class="img-circle" src="img/empty-photo-square.jpg" width="32px">'+userName+'</li>');
								
								if (userPhoto != "empty") {
									// Download image from storage
									var strRef = firebase.storage().ref().child('images/profile/'+userPhoto);
									strRef.getDownloadURL().then(function(url) {
										$("#"+userID).children("img").prop("src",url);
									}).catch(function(err) {
										addNotification("Error",err.code+" : "+err.message);
									});
								}

								if (userStatus == "online") {
									$("#"+userID).children("img").addClass("online");
								} else if (userStatus == "idle" || userStatus == "away") {
									$("#"+userID).children("img").addClass("away");
								} else if (userStatus == "offline") {
									$("#"+userID).children("img").addClass("offline");
								}
								$("#"+userID).fadeIn(250, function() {
									$(this).show();
								});
								// Listen for user data changes
								dbRefPresence.child(userID).on('child_changed', function(snapshot) {
									if (snapshot.key == "userStatus") { // User status changed
										var userStatus = snapshot.val();
										if (userStatus == "online") {
											$("#"+userID).children("img")
												.removeClass("away")
												.removeClass("offline");
											$("#"+userID).children("img").addClass("online");
										} else if (userStatus == "idle" || userStatus == "away") {
											$("#"+userID).children("img")
												.removeClass("online")
												.removeClass("offline");
											$("#"+userID).children("img").addClass("away");
										} else if (userStatus == "offline") {
											$("#"+userID).children("img")
												.removeClass("online")
												.removeClass("away");
											$("#"+userID).children("img").addClass("offline");
										}
									} else if ((snapshot.key == "profileImage") && (snapshot.val() != "empty")) { // User profile image added
										// Download image from storage
										var strRef = firebase.storage().ref().child('images/profile/'+snapshot.val());
										strRef.getDownloadURL().then(function(url) {
											$("#"+userID).children("img").prop("src",url);
										}).catch(function(err) {
											addNotification("Error",err.code+" : "+err.message);
										});
									} else if ((snapshot.key == "terminated") && snapshot.val()) { // User terminated
										$("#"+userID).remove();
									}
								});
							}
						});
						
						// Stop loading icon
						$("#loadingUserHead").fadeOut(250, function() {
							$(this).hide();
							// Show user head
							$("#userHead").fadeIn(250, function() {
								$(this).removeClass("hide");
							});
						});
						
						// Array for search bar autocomplete
						var tenantNames = [];
						
						// Retrieve approved and active tenant from database into list
						var trRef = firebase.database().ref().child("tenant-room");
						trRef.on('child_added', function(snapshot) {
							var tenantID = snapshot.key;
							trRef1=trRef.child(snapshot.key);
							trRef1.once('child_added', function(snapshot) {
								// Get starting date , building address , status occupy , ref id
								var statingDate=snapshot.child("start_date").val();
								var propAddr=snapshot.child("prop_addr").val();
								var statOccupy=snapshot.child("stat_occupy").val();
								var refN = snapshot.child("ref_number").val();
								var refN1= refN.split(" ");
								var refNumber=refN1[0]+refN[1]+refN[2];
								if ((statOccupy=="approved") || (statOccupy=="active")){ // Status approved or active
									var tenantRef = firebase.database().ref().child("tenant/"+tenantID);
									tenantRef.once('value', function(snapshot) {
										var full_name=snapshot.child("full_name").val();
										newObj = {
											"label":full_name +' ('+refN+')',
											"tenantid":tenantID,
											"refnumber":refNumber
										}
										tenantNames.push(newObj);
										// Start search bar autocomplete
										$("#searchbar").autocomplete({
											source: function(request, response) {
												var results = $.ui.autocomplete.filter(tenantNames, request.term);
												response(results.slice(0, 10));
											},
											select: function(event, ui) {
												window.location = "tenant_details.html?id="+ui.item.tenantid;
												return false;
											}
										});
										$("#bsearch").on("click", function() {
											$("#searchbar").autocomplete("search");
										});
									});
								}
							});
						});
						trRef.on('child_changed', function(snapshot) {
							var tenantID = snapshot.key;
							trRef1=trRef.child(snapshot.key);
							trRef1.on('value', function(snapshot) {
								// Get starting date , building address , status occupy , ref id
								var statingDate=snapshot.child("start_date").val();
								var propAddr=snapshot.child("prop_addr").val();
								var statOccupy=snapshot.child("stat_occupy").val();
								var refN = snapshot.child("ref_number").val();
								console.log(refN)
								var refN1= refN.split(" ");
								var refNumber=refN1[0]+refN[1]+refN[2];
								if ((statOccupy=="approved") || (statOccupy=="active")){ // Status approved or active
									var tenantRef = firebase.database().ref().child("tenant/"+tenantID);
									tenantRef.once('value', function(snapshot) {
										var full_name=snapshot.child("full_name").val();
										var i=0;
										// Check if changed data already in list
										for (;i<tenantNames.length;i++){
											if(tenantNames[i].refnumber==refNumber){
												newObj = {
													"label":full_name +' ('+refN+')',
													"tenantid":tenantID,
													"refnumber":refNumber
												}
												tenantNames[i]=newObj;
												break
											}
										}
										
										if (i==tenantNames.length){ // Data not in list
											newObj = {
												"label":full_name +' ('+refN+')',
												"tenantid":tenantID,
												"refnumber":refNumber
											}
											tenantNames.push(newObj);	
										}
										
										// Start search bar autocomplete
										$("#searchbar").autocomplete({
											source: function(request, response) {
												var results = $.ui.autocomplete.filter(tenantNames, request.term);
												response(results.slice(0, 10));
											},
											select: function(event, ui) {
												window.location = "tenant_details.html?id="+ui.item.tenantid;
												return false;
											}
										});
										$("#bsearch").on("click", function() {
											$("#searchbar").autocomplete("search");
										});
									});
								} else { // Status other
									for (i=0;i<tenantNames.length;i++){
										if(tenantNames[i].refnumber==refNumber){
											tenantNames.splice(i,1);
											// Start search bar autocomplete
											$("#searchbar").autocomplete({
												source: function(request, response) {
													var results = $.ui.autocomplete.filter(tenantNames, request.term);
													response(results.slice(0, 10));
												},
												select: function(event, ui) {
													window.location = "tenant_details.html?id="+ui.item.tenantid;
													return false;
												}
											});
											$("#bsearch").on("click", function() {
												$("#searchbar").autocomplete("search");
											});
											break
										}
									}
								}
							});
						});
						
						trRef.on('child_removed', function(snapshot) {
							var tenantID = snapshot.key;
							trRef1=trRef.child(snapshot.key);
							trRef1.once('value', function(snapshot) {
								// Get starting date , building address , status occupy , ref id
								var statingDate=snapshot.child("start_date").val();
								var propAddr=snapshot.child("prop_addr").val();
								var statOccupy=snapshot.child("stat_occupy").val();
								var refN = snapshot.child("ref_number").val();
								var refN1= refN.split(" ");
								var refNumber=refN1[0]+refN[1]+refN[2];
								
								// Status not approved or active
								for (i=0;i<tenantNames.length;i++){
									if(tenantNames[i].refnumber==refNumber){
										tenantNames.splice(i,1);
										// Start search bar autocomplete
										$("#searchbar").autocomplete({
											source: function(request, response) {
												var results = $.ui.autocomplete.filter(tenantNames, request.term);
												response(results.slice(0, 10));
											},
											select: function(event, ui) {
												window.location = "tenant_details.html?id="+ui.item.tenantid;
												return false;
											}
										});
										$("#bsearch").on("click", function() {
											$("#searchbar").autocomplete("search");
										});
										break
									}
								}
							});
						});

						
						// Sort array ascending based on name
						tenantNames.sort(function(a, b){
							var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase();
							if (nameA < nameB) //sort string ascending
								return -1;
							if (nameA > nameB)
								return 1;
							return 0; //default return value (no sorting)
						});
						// Start search bar autocomplete
						$("#searchbar").autocomplete({
							source: function(request, response) {
								var results = $.ui.autocomplete.filter(tenantNames, request.term);
								response(results.slice(0, 10));
							},
							select: function(event, ui) {
								window.location = "tenant_details.html?id="+ui.item.tenantid;
								return false;
							}
						});
						$("#bsearch").on("click", function() {
							$("#searchbar").autocomplete("search");
						});
						setTimeout(function(){
							// Stop loading icon
							$("#loadingSearchBlock").fadeOut(250, function() {
								$(this).hide();
								// Show search bar
								$("#searchBlock").fadeIn(250, function() {
									$(this).removeClass("hide");
								})
							})
						}, 1000);
					}
				});
			}
		});
	// No user signed in
	} else {
		window.location = "index.html";
	}
});