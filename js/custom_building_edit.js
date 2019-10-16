function getFileName(numb) {
	
	//trigger file browser when picture is clicked
	$("#fileButton").trigger("click");
	document.getElementById("picCount").value = numb;
	document.getElementById("fileButton").value = "";
	maxPhoto(numb);
	return false;
	
}

function imtriggered(numb) {
	
	$("#floorfileBox"+numb).trigger("click");
	
}

function maxPhoto(numb) {
	
	//counts the amount of photo sumbitted
	var pMax = document.getElementById("maxPic").value;
	if (numb>pMax) {
		document.getElementById("maxPic").value = numb;
	}
	
}

function removePhoto(numb) {
	
	var pMax = document.getElementById("maxPic").value;
	//deleted photo is not the last photo
	if (numb<pMax) {
		for(i=numb; i<pMax; i++) {
			document.getElementById("prepiew"+i).src = document.getElementById("prepiew"+(i+1)).src;
			document.getElementById("fileName"+i).value = document.getElementById("fileName"+(i+1)).value;
			document.getElementById("fileName"+i+"replaced").value = document.getElementById("fileName"+(i+1)+"replaced").value;
		}
		document.getElementById("prepiew"+pMax).src = "img/empty-photo.jpg";
		document.getElementById("fileName"+pMax).value = "";
		document.getElementById("fileName"+pMax+"replaced").value = "false";
		$("#removep"+pMax).hide();
		document.getElementById("fileButton").value = "";
		document.getElementById("maxPic").value = (document.getElementById("maxPic").value)-1;
		if (pMax!=7) {
			$("#gambar"+(parseInt(pMax)+1)).fadeOut(250, function() {
				$(this).hide();
			})
		}
	//deleted photo is the last photo
	} else {
		document.getElementById("prepiew"+numb).src = "img/empty-photo.jpg";
		document.getElementById("fileName"+numb).value = "";
		document.getElementById("fileName"+numb+"replaced").value = "false";
		$("#removep"+numb).hide();
		document.getElementById("fileButton").value = "";
		document.getElementById("maxPic").value = (document.getElementById("maxPic").value)-1;
		if (numb!=7) {
			$("#gambar"+(parseInt(numb)+1)).fadeOut(250, function() {
				$(this).hide();
			})
		}
	}
	
}

function getFileExtension(filename) {
	
	//get file extension such as .jpg .png .bmp etc
	return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
	
}

function lockForm() {
	
	//reset progress bar
	for(i=1; i<=7; i++) {
		$("#progBar"+i).css("width","0%");
	}
	//lock submit buttons
	$("#bfinish").prop('disabled', true);
	//lock inputs
	$("input").prop('disabled', true);
	//lock photos
	var pMax = $("#maxPic").val();
	for(i=1; i<=pMax; i++) {
		$("#jump"+i).removeAttr("href");
		$("#jump"+i).removeAttr("onclick");
		$("#removep"+i).hide();
		$("#progBared"+i).removeClass("hidden");
	}
	for(i = parseInt(pMax)+1; i<=7; i++) {
		$("#prepiew"+i).hide();
	}
	
}

function unlockForm() {
	
	//unlock submit buttons
	$("#bfinish").prop('disabled', false);
	//unlock inputs
	$("input").prop('disabled', false);
	//unlock photos
	var pMax = $("#maxPic").val();
	for(i=1; i<=pMax; i++) {
		$("#jump"+i).attr("href","javascript:void(0);");
		$("#jump"+i).attr("onclick","getFileName("+i+")");
		$("#removep"+i).show();
		$("#progBared"+i).addClass("hidden");
	}
	for(i = parseInt(pMax)+1; i<=7; i++) {
		$("#prepiew"+i).show();
	}
	
}

function uploadDB(buildType,buildNo) {
	
	//start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	lockForm();
	if (buildType == "residential") {
		var buildType2 = "1";
	} else {
		var buildType2 = "2";
	}
	const dbRefBuild = firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo);
	dbRefBuild.update({
		coord_latitude : $("#latitude").val(),
		coord_longitude : $("#longitude").val(),
		facilities: {
			bed : $("#bed").prop("checked"),
			wardrb : $("#wardrb").prop("checked"),
			table : $("#table").prop("checked"),
			bthins : $("#bthins").prop("checked"),
			wifi : $("#wifi").prop("checked"),
			ctv : $("#ctv").prop("checked"),
			hwater : $("#hwater").prop("checked"),
			parker : $("#parker").prop("checked"),
			laundy : $("#laundy").prop("checked"),
			pwrtkn : $("#pwrtkn").prop("checked"),
			ac : $("#ac").prop("checked"),
			bedcvr : $("#bedcvr").prop("checked"),
			secury : $("#secury").prop("checked"),
			kitchn : $("#kitchn").prop("checked")
		}
	}).then(function onSuccess(res) {
		var totFloor = $("#total_floor").val();
		var roomInFloor = $("#room_count").val().split(",");
		for(i=1; i<=totFloor; i++) {
			var floorNo = i;
			for(j=1; j<=9; j++) {
				if (floorNo==String(j)) {
					floorNo="0"+String(j);
				}
			}
			for(k=1; k<=parseInt(roomInFloor[i-1]); k++) {
				var roomNo = k;
				for(j=1; j<=9; j++) {
					if (roomNo==String(j)) {
						roomNo="0"+String(j);
					}
				}
				var idRoom = buildType2+buildNo+floorNo+roomNo;
				var d = new Date();
				var dbRefRoom = firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/"+"floor:"+floorNo+"/"+"ID:"+idRoom);
				dbRefRoom.update({
					last_edited: (parseInt(d.getMonth())+1)+"/"+d.getDate()+"/"+d.getFullYear(),
					facilities: {
						bed : $("#bed").prop("checked"),
						wardrb : $("#wardrb").prop("checked"),
						table : $("#table").prop("checked"),
						bthins : $("#bthins").prop("checked"),
						wifi : $("#wifi").prop("checked"),
						ctv : $("#ctv").prop("checked"),
						hwater : $("#hwater").prop("checked"),
						parker : $("#parker").prop("checked"),
						laundy : $("#laundy").prop("checked"),
						pwrtkn : $("#pwrtkn").prop("checked"),
						ac : $("#ac").prop("checked"),
						bedcvr : $("#bedcvr").prop("checked"),
						secury : $("#secury").prop("checked"),
						kitchn : $("#kitchn").prop("checked")
					}
				}).catch(function onError(err) {
					//error notification
					$.gritter.add({
						title: 'Error Ref Room',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					});
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
				});
			}
		}
		$("#thresholdCounter").on("change",function() {
			if ($(this).val() == "7") { //wait until finish uploading
				//stop threshold listener
				$("#thresholdCounter").off();
				setTimeout(function(){
					//success notification
					$.gritter.add({
						title: 'Building Updated',
						text: 'Building was successfully updated to the database.',
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
					setTimeout(function(){
						location.reload();
					}, 1500);
				}, 500);
			}
		});
		//photo 1
		if ($("#fileName1replaced").val() == "true") {
			var photo1 = $("#prepiew1").attr("src");
			var filename1 = buildType2+buildNo+"_1."+getFileExtension($("#fileName1").val());
			var storageRef1 = firebase.storage().ref('images/building/'+filename1);
			var task1 = storageRef1.putString(photo1, 'data_url');
			task1.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar1").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 1',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo1 : filename1
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar1").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 2
		if ($("#fileName2replaced").val() == "true") {
			var photo2 = $("#prepiew2").attr("src");
			var filename2 = buildType2+buildNo+"_2."+getFileExtension($("#fileName2").val());
			var storageRef2 = firebase.storage().ref('images/building/'+filename2);
			var task2 = storageRef2.putString(photo2, 'data_url');
			task2.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar2").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 2',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo2 : filename2
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar2").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 3
		if ($("#fileName3replaced").val() == "true") {
			var photo3 = $("#prepiew3").attr("src");
			var filename3 = buildType2+buildNo+"_3."+getFileExtension($("#fileName3").val());
			var storageRef3 = firebase.storage().ref('images/building/'+filename3);
			var task3 = storageRef3.putString(photo3, 'data_url');
			task3.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar3").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 3',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo3 : filename3
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar3").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 4
		if ($("#fileName4replaced").val() == "true") {
			var photo4 = $("#prepiew4").attr("src");
			var filename4 = buildType2+buildNo+"_4."+getFileExtension($("#fileName4").val());
			var storageRef4 = firebase.storage().ref('images/building/'+filename4);
			var task4 = storageRef4.putString(photo4, 'data_url');
			task4.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar4").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 4',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo4 : filename4
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar4").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 5
		if ($("#fileName5replaced").val() == "true") {
			var photo5 = $("#prepiew5").attr("src");
			var filename5 = buildType2+buildNo+"_5."+getFileExtension($("#fileName5").val());
			var storageRef5 = firebase.storage().ref('images/building/'+filename5);
			var task5 = storageRef5.putString(photo5, 'data_url');
			task5.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar5").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 5',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo5 : filename5
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar5").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 6
		if ($("#fileName6replaced").val() == "true") {
			var photo6 = $("#prepiew6").attr("src");
			var filename6 = buildType2+buildNo+"_6."+getFileExtension($("#fileName6").val());
			var storageRef6 = firebase.storage().ref('images/building/'+filename6);
			var task6 = storageRef6.putString(photo6, 'data_url');
			task6.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar6").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 6',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo6 : filename6
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar6").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 7
		if ($("#fileName7replaced").val() == "true") {
			var photo7 = $("#prepiew7").attr("src");
			var filename7 = buildType2+buildNo+"_7."+getFileExtension($("#fileName7").val());
			var storageRef7 = firebase.storage().ref('images/building/'+filename7);
			var task7 = storageRef7.putString(photo7, 'data_url');
			task7.on('state_changed',
				//progressbar animation
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
					$("#progBar7").css("width",percentage+"%");
				},
				function error(err) {
					//error notification
					$.gritter.add({
						title: 'Error Image 7',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					})
					unlockForm();
					//scroll back to top
					$('html, body').animate({
						scrollTop: 0
					}, 500);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/photos").update({
						photo7 : filename7
					});
					$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
					$("#thresholdCounter").trigger("change");
				}
			)
		} else {
			$("#progBar7").css("width","100%");
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
	}).catch(function onError(err) {
		//error notification
		$.gritter.add({
			title: 'Error Ref Build',
			text: err.code+" : "+err.message,
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
		unlockForm();
		//scroll back to top
		$('html, body').animate({
			scrollTop: 0
		}, 500);
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
	});
	
	/* var pMax = $("#maxPic").val();
	for(i=1; i<=pMax; i++) {
		$("#progBar"+i).css("width","100%");
	} */
	
}

function memutar(count,limit) {
	
	if (count <= limit) {
		var id = window.location.href.split('=').pop();
		var broke = id.split("");
		var buildType0 = broke[0];
		if (buildType0=="1") {
			var buildType = "residential";
		}
		var buildNo = broke[1]+broke[2];
		const check = firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo);
		check.once('value', function(snapshot) {
			var floorNo = count;
			for(j=1; j<=9; j++) {
				if (floorNo==String(j)) {
					floorNo="0"+String(j);
				}
			}
			var floorphoto = snapshot.child("floor:"+floorNo+"/floorplan").val();
			$("#floorfileName"+count).val(floorphoto);
			if (floorphoto != "empty") {
				var strRef = firebase.storage().ref("images/building/"+floorphoto);
				strRef.getDownloadURL().then(function(url) {
					$("#floorplan"+count).prop("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				});
			}
			setTimeout(function(){
				count++;
				memutar(count,limit);
			}, 1000);
		});
	}
	
}

$(document).ready(function() {
	
	//check building
	var id = window.location.href.split('=').pop();
	var broke = id.split("");
	var buildType0 = broke[0];
	if (buildType0=="1") {
		var buildType = "residential";
	}
	var buildNo = broke[1]+broke[2];
	$("#buildno").html(buildNo);
	const check = firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo);
	check.once('value', function(snapshot) {
		//exist
		if (snapshot.child("address_street").val() != null) {
			//fill form with data from database
			$("#adstreet").html(snapshot.child("address_street").val());
			$("#adcity").html(snapshot.child("address_city").val());
			$("#adprov").html(snapshot.child("address_province").val());
			$("#adzip").html(snapshot.child("address_zipcode").val());
			$("#latitude").val(snapshot.child("coord_latitude").val());
			$("#longitude").val(snapshot.child("coord_longitude").val());
			$("#bed").prop("checked",snapshot.child("facilities/bed").val());
			$("#wardrb").prop("checked",snapshot.child("facilities/wardrb").val());
			$("#table").prop("checked",snapshot.child("facilities/table").val());
			$("#bthins").prop("checked",snapshot.child("facilities/bthins").val());
			$("#wifi").prop("checked",snapshot.child("facilities/wifi").val());
			$("#ctv").prop("checked",snapshot.child("facilities/ctv").val());
			$("#hwater").prop("checked",snapshot.child("facilities/hwater").val());
			$("#parker").prop("checked",snapshot.child("facilities/parker").val());
			$("#laundy").prop("checked",snapshot.child("facilities/laundy").val());
			$("#pwrtkn").prop("checked",snapshot.child("facilities/pwrtkn").val());
			$("#ac").prop("checked",snapshot.child("facilities/ac").val());
			$("#bedcvr").prop("checked",snapshot.child("facilities/bedcvr").val());
			$("#secury").prop("checked",snapshot.child("facilities/secury").val());
			$("#kitchn").prop("checked",snapshot.child("facilities/kitchn").val());
			var totalfloor = snapshot.child("total_floor").val();
			var totalroom = snapshot.child("total_room").val();
			$("#total_floor").val(totalfloor);
			$("#total_room").val(totalroom);
			$("#room_count").val(snapshot.child("room_count").val());
			$("#floorPlanBlock").empty();
			for (i=1;i<=totalfloor;i++) {
				var floorplanBlock = `
				<div class="form-group">
					<label for="mylabel" class="control-label col-lg-2">Floor ${i}</label>
					<div class="col-lg-2">
						<img id="floorplan${i}" src="img/empty-photo.jpg" class="img-responsive" alt="empty image" />
						<button id='remfloor${i}' type="button" onclick="alert('fukoffagain_${i}')" class='btn btn-xs btn-danger' title='remove picture' style="display:none;position:absolute;top:0;"><i class='fa fa-times'></i></button>
						<input id="floorfileName${i}" type="hidden" value="">
						<input id="floorfileBox${i}" type="file" accept=".jpg,.jpeg" style="display:none;"/>
					</div>
				</div>`;
				$("#floorPlanBlock").append(floorplanBlock);
			}
			memutar(1,totalfloor);
			var photo1 = snapshot.child("photos/photo1").val();
			$("#fileName1replaced").val("false");
			if (photo1 != "empty") {
				$("#fileName1").val(photo1);
				$("#maxPic").val(1);
				var strRef1 = firebase.storage().ref().child('images/building/'+photo1);
				strRef1.getDownloadURL().then(function(url) {
					$("#prepiew1").attr("src",url);
					$("#gambar1").show();
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			} else {
				$("#gambar1").show();
			}
			var photo2 = snapshot.child("photos/photo2").val();
			$("#fileName2replaced").val("false");
			if (photo2 != "empty") {
				$("#fileName2").val(photo2);
				$("#maxPic").val(2);
				var strRef2 = firebase.storage().ref().child('images/building/'+photo2);
				strRef2.getDownloadURL().then(function(url) {
					$("#prepiew2").attr("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			}
			var photo3 = snapshot.child("photos/photo3").val();
			$("#fileName3replaced").val("false");
			if (photo3 != "empty") {
				$("#fileName3").val(photo3);
				$("#maxPic").val(3);
				var strRef3 = firebase.storage().ref().child('images/building/'+photo3);
				strRef3.getDownloadURL().then(function(url) {
					$("#prepiew3").attr("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			}
			var photo4 = snapshot.child("photos/photo4").val();
			$("#fileName4replaced").val("false");
			if (photo4 != "empty") {
				$("#fileName4").val(photo4);
				$("#maxPic").val(4);
				var strRef4 = firebase.storage().ref().child('images/building/'+photo4);
				strRef4.getDownloadURL().then(function(url) {
					$("#prepiew4").attr("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			}
			var photo5 = snapshot.child("photos/photo5").val();
			$("#fileName5replaced").val("false");
			if (photo5 != "empty") {
				$("#fileName5").val(photo5);
				$("#maxPic").val(5);
				var strRef5 = firebase.storage().ref().child('images/building/'+photo5);
				strRef5.getDownloadURL().then(function(url) {
					$("#prepiew5").attr("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			}
			var photo6 = snapshot.child("photos/photo6").val();
			$("#fileName6replaced").val("false");
			if (photo6 != "empty") {
				$("#fileName6").val(photo6);
				$("#maxPic").val(6);
				var strRef6 = firebase.storage().ref().child('images/building/'+photo6);
				strRef6.getDownloadURL().then(function(url) {
					$("#prepiew6").attr("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			}
			var photo7 = snapshot.child("photos/photo7").val();
			$("#fileName7replaced").val("false");
			if (photo7 != "empty") {
				$("#fileName7").val(photo7);
				$("#maxPic").val(7);
				var strRef7 = firebase.storage().ref().child('images/building/'+photo7);
				strRef7.getDownloadURL().then(function(url) {
					$("#prepiew7").attr("src",url);
				}).catch(function(error) {
					console.log("Error "+error.code+" : "+error.message);
				})
			}
			setTimeout(function() {
				//stop full loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				})
			}, 1000)
		//doesn't exist
		} else {
			window.alert("Building does not exist");
			window.location = "building_list.html";
		}
	})
	//picture listener
	$('#prepiew1').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep1,#gambar2").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	$('#prepiew2').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep2,#gambar3").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	$('#prepiew3').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep3,#gambar4").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	$('#prepiew4').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep4,#gambar5").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	$('#prepiew5').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep5,#gambar6").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	$('#prepiew6').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep6,#gambar7").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	$('#prepiew7').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep7").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	})
	//file input listener
	$("#fileButton").change(function() {
		var counter = document.getElementById("picCount").value;
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#prepiew'+counter).attr('src', e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
			$("#fileName"+counter).val(this.files[0].name);
			$("#fileName"+counter+"replaced").val("true");
		}
	})
	//modal confirmation listener
	$("#confirmYes").on('click', function () {
		uploadDB(buildType,buildNo);
	})

})
//jquery form validation
$().ready(function() {

	$("#inpBuild").validate({
		submitHandler: function() {
			//trigger modal popup
			$("#modalConfirm").modal();
		},
		rules: {
			latitude: {
				required: true,
				min: -90,
				max: 90
			},
			longitude: {
				required: true,
				min: -180,
				max: 180
			}
		}
	});

});