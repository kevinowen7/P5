function getFileName(numb) {
	
	//trigger file browser when picture is clicked
	$("#fileButton").trigger("click");
	document.getElementById("picCount").value = numb;
	document.getElementById("fileButton").value = "";
	maxPhoto(numb);
	return false;
	
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
		}
		document.getElementById("prepiew"+pMax).src = "img/empty-photo.jpg";
		document.getElementById("fileName"+pMax).value = "";
		$("#removep"+pMax).hide();
		document.getElementById("fileButton").value = "";
		document.getElementById("maxPic").value = (document.getElementById("maxPic").value)-1;
		if (pMax!=5) {
			$("#gambar"+(parseInt(pMax)+1)).fadeOut(250, function() {
				$(this).hide();
			})
		}
	//deleted photo is the last photo
	} else {
		document.getElementById("prepiew"+numb).src = "img/empty-photo.jpg";
		document.getElementById("fileName"+numb).value = "";
		$("#removep"+numb).hide();
		document.getElementById("fileButton").value = "";
		document.getElementById("maxPic").value = (document.getElementById("maxPic").value)-1;
		if (numb!=5) {
			$("#gambar"+(parseInt(numb)+1)).fadeOut(250, function() {
				$(this).hide();
			})
		}
	}
	
}

function get_fmoney(money) {
	
	var rev     = parseInt(money, 10).toString().split('').reverse().join('');
	var rev2    = '';
	for(var i = 0; i < rev.length; i++){
		rev2  += rev[i];
		if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
			rev2 += '.';
		}
	}
	return ("Rp. "+rev2.split('').reverse().join('') + ',-')
	
}

function pembulatan(input) {
	
	return (Math.round((parseInt(input)/100)))*100;
	
}

function removeOptions(selectbox) {
	
    //clear select options
    for(i=selectbox.options.length-1; i>=1; i--) {
        selectbox.remove(i);
    }
	
}

function rem_moneydot(money) {
	
	return parseInt(money.split(".").join(""));
	
}

function get_moneydot(money) {
	
	if (isNaN(parseInt(money))) {
		var convertmoney = "";
	} else {
		money = rem_moneydot(money);
		var convertmoney = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
	}
	return convertmoney;
	
}

function getFileExtension(filename) {
	
	//get file extension such as .jpg .png .bmp etc
	return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
	
}

function reformatDate2(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	months2=["01","02","03","04","05","06","07","08","09","10","11","12"];
	inputBroke=inputDate.split("-");
	inputDay=inputBroke[0];
	inputMonth=inputBroke[1];
	inputYear=inputBroke[2];
	if (parseInt(inputDay) < 10) {
		outputDay = "0"+inputDay;
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

function resetForm() {
	
	location.reload();
	
}

function lockForm() {
	
	//reset progress bar
	for(i=1; i<=5; i++) {
		$("#progBar"+i).css("width","0%");
	}
	//lock submit buttons
	$("#bfinish").prop('disabled', true);
	//lock inputs
	$("input").prop('disabled', true);
	$("select").prop('disabled', true);
	//lock photos
	var pMax = $("#maxPic").val();
	for(i=1; i<=pMax; i++) {
		$("#jump"+i).removeAttr("href");
		$("#jump"+i).removeAttr("onclick");
		$("#removep"+i).hide();
		$("#progBared"+i).removeClass("hidden");
	}
	for(i = parseInt(pMax)+1; i<=5; i++) {
		$("#prepiew"+i).hide();
	}
	
}

function unlockForm() {
	
	//unlock submit buttons
	$("#bfinish").prop('disabled', false);
	//unlock inputs
	$("input").prop('disabled', false);
	$("select").prop('disabled', false);
	//unlock photos
	var pMax = $("#maxPic").val();
	for(i=1; i<=pMax; i++) {
		$("#jump"+i).attr("href","javascript:void(0);");
		$("#jump"+i).attr("onclick","getFileName("+i+")");
		$("#removep"+i).show();
		$("#progBared"+i).addClass("hidden");
	}
	for(i = parseInt(pMax)+1; i<=5; i++) {
		$("#prepiew"+i).show();
	}
	
}

function uploadDB() {
	
	//start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	});
	lockForm();
	var buildType = "1";
	var buildNo = $("#buildno").html();
	var floorNo = $("#rflor").val();
	var roomNo = $("#roomno").val();
	for(i=1; i<=9; i++) {
		if (roomNo == String(i)) {
			roomNo = "0"+String(i);
		}
	}
	var roomID = buildType+buildNo+floorNo+roomNo;
	var d = new Date();
	if ($("#roomnovalid").val() == "valid") { //room doesn't exist
		//listen value to reach threshold
		$("#thresholdCounter").change(function() {
			if ($(this).val() == "7") { //wait until finish uploading
				//stop threshold listener
				$("#thresholdCounter").off();
				$("#thresholdCounter").val("0");
				//success notification
				$.gritter.add({
					title: 'Room Uploaded',
					text: 'Room was successfully uploaded to the database.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				setTimeout(function(){
					window.location = "room_list.html?id="+buildNo;
				}, 1200);
			}
		});
		//upload data to database
		const dbRefRoom = firebase.database().ref("property/residential/building_no:"+buildNo+"/floor:"+floorNo+"/ID:"+roomID);
		dbRefRoom.set({
			availdate : reformatDate2($("#adate").val()),
			roomsize : $("#rmsize").val(),
			yearprice : rem_moneydot($("#pyear").val()),
			last_edited : (parseInt(d.getMonth())+1)+"/"+d.getDate()+"/"+d.getFullYear(),
			last_ref : "0",
			photos : {
				photo1 : "empty",
				photo2 : "empty",
				photo3 : "empty",
				photo4 : "empty",
				photo5 : "empty"
			},
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
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
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
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		});
		//update room count
		const dbRefBuild = firebase.database().ref("property/residential/building_no:"+buildNo);
		dbRefBuild.once("value",function(snapshot) {
			var roomCount = snapshot.child("room_count").val().split(",");
			var totalRoom = snapshot.child("total_room").val();
			var floorIndex = parseInt(floorNo)-1;
			roomCount[floorIndex] = parseInt(roomCount[floorIndex])+1;
			dbRefBuild.update({
				room_count : roomCount.toString(),
				total_room : parseInt(totalRoom)+1
			}).then(function onSuccess(res) {
				$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
				$("#thresholdCounter").trigger("change");
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
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			});
		});
		//photo 1
		if ($("#fileName1").val() != "") {
			var photo1 = $("#prepiew1").attr("src");
			var filename1 = roomID+"_1."+getFileExtension($("#fileName1").val());
			var storageRef1 = firebase.storage().ref('images/building/room/'+filename1);
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
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					dbRefRoom.child("photos").update({
						photo1 : filename1
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Image 1 DB',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
						unlockForm();
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					});
				}
			)
		} else {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 2
		if ($("#fileName2").val() != "") {
			var photo2 = $("#prepiew2").attr("src");
			var filename2 = roomID+"_2."+getFileExtension($("#fileName2").val());
			var storageRef2 = firebase.storage().ref('images/building/room/'+filename2);
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
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					dbRefRoom.child("photos").update({
						photo2 : filename2
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Image 2 DB',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
						unlockForm();
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					});
				}
			)
		} else {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 3
		if ($("#fileName3").val() != "") {
			var photo3 = $("#prepiew3").attr("src");
			var filename3 = roomID+"_3."+getFileExtension($("#fileName3").val());
			var storageRef3 = firebase.storage().ref('images/building/room/'+filename3);
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
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					dbRefRoom.child("photos").update({
						photo3 : filename3
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Image 3 DB',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
						unlockForm();
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					});
				}
			)
		} else {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 4
		if ($("#fileName4").val() != "") {
			var photo4 = $("#prepiew4").attr("src");
			var filename4 = roomID+"_4."+getFileExtension($("#fileName4").val());
			var storageRef4 = firebase.storage().ref('images/building/room/'+filename4);
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
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					dbRefRoom.child("photos").update({
						photo4 : filename4
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Image 4 DB',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
						unlockForm();
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					});
				}
			)
		} else {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
		//photo 5
		if ($("#fileName5").val() != "") {
			var photo5 = $("#prepiew5").attr("src");
			var filename5 = roomID+"_5."+getFileExtension($("#fileName5").val());
			var storageRef5 = firebase.storage().ref('images/building/room/'+filename5);
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
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					})
				},
				function complete() {
					dbRefRoom.child("photos").update({
						photo5 : filename5
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Image 5 DB',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
						unlockForm();
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					});
				}
			)
		} else {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}
	} else { //room exist
		unlockForm();
		//error notification
		$.gritter.add({
			title: 'Error',
			text: 'Room already exist.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
		//scroll to input field
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#buildno").offset().top
		}, 1000);
	}
	
}

$(document).ready(function() {
	
	//collect id from link
	var id = window.location.href.split('=').pop();
	var broke = id.split("");
	//split id into different categories
	var buildType0 = broke[0];
	if (buildType0=="1"){
		var buildType = "residential";
	} 
	var buildNo = broke[1]+broke[2];
	//set building number in form
	$("#buildno").html(buildNo);
	const dbRef = firebase.database().ref("property/"+buildType+"/"+"building_no:"+buildNo);
	//check if building exist
	dbRef.once('value', function(snapshot) {
		//building exist
		if (snapshot.hasChildren()) {
			//set facilities input fields in form
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
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			})
		//building does not exist
		} else {
			window.alert("Building does not exist");
			window.location = "room_list.html";
		}
		//check floors
		var floorList = [];
		dbRef.on('child_added', function(snapshot) {
			removeOptions(document.getElementById("rflor"));
			if (snapshot.key.split(":")[0] == "floor") {
				floorList.push(snapshot.key.split(":")[1]);
			}
			for (i=0; i<floorList.length; i++) { 
				var optionElement = document.createElement("option");
				optionElement.value = floorList[i];
				optionElement.innerHTML = floorList[i];
				document.getElementById("rflor").appendChild(optionElement);
			}
		})
	});
	//room number listener
	$('#roomno').on('change keyup click', function () {
		var floorNo = $("#rflor").val();
		var nowRoom = $("#roomno").val();
		for(j=1; j<=9; j++) {
			if (nowRoom == String(j)) {
				nowRoom = "0"+String(j);
			}
		}
		var roomID = buildType0+buildNo+floorNo+nowRoom;
		$("#roomnovalid").val("invalid");
		const dbCheck = firebase.database().ref("property/residential/building_no:"+buildNo+"/floor:"+floorNo+"/ID:"+roomID);
		dbCheck.once('value', function(snapshot) {
			if ($("#roomno").val() == "") { //empty input
				$("#roomnovalid").val("invalid");
				$("#roomtrue").fadeOut(100, function() {
					$(this).hide();
				});
				$("#roomfalse").fadeOut(100, function() {
					$(this).hide();
				});
			} else if (parseInt(nowRoom) < 1 || parseInt(nowRoom) > 99) { //invalid number
				$("#roomnovalid").val("invalid");
				$("#roomtrue").fadeOut(100, function() {
					$(this).hide();
					$("#roomfalse").fadeIn(100, function() {
						$(this).show();
					});
				});
			} else if (!snapshot.hasChildren()) { //room does not exist
				$("#roomnovalid").val("valid");
				$("#roomfalse").fadeOut(100, function() {
					$(this).hide();
					$("#roomtrue").fadeIn(100, function() {
						$(this).show();
					});
				});
			} else { //room exist
				$("#roomnovalid").val("invalid");
				$("#roomtrue").fadeOut(100, function() {
					$(this).hide();
					$("#roomfalse").fadeIn(100, function() {
						$(this).show();
					});
				});
			}
		});
	});
	//floor listener
	$('#rflor').on('change', function () {
		//start loading icon
		$("#cover-spin").fadeIn(250, function() {
			$(this).show();
		});
		var floorNo = $(this).val();
		if (floorNo == "") {
			$("#roomno")
				.val("")
				.trigger("change")
				.prop("readonly",true);
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		} else {
			const dbRefFloor = firebase.database().ref("property/residential/building_no:"+buildNo+"/floor:"+floorNo).limitToLast(2);
			dbRefFloor.on('child_added', function(snapshot) {
				if (snapshot.key != "floorplan") {
					var lastRoomID = snapshot.key.split(":")[1];
					var lastRoomNumber = parseInt(lastRoomID.substring(5,7));
					var suggestRoomNumber  = lastRoomNumber+1;
					$("#roomno")
						.val(suggestRoomNumber)
						.trigger("change")
						.prop('readonly',false);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
				}
			});
		}
	});
	//picture listener
	$('#prepiew1').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep1,#gambar2").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	});
	$('#prepiew2').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep2,#gambar3").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	});
	$('#prepiew3').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep3,#gambar4").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	});
	$('#prepiew4').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep4,#gambar5").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	});
	$('#prepiew5').on('load', function () {
		if ($(this).attr('src') != "img/empty-photo.jpg") {
			$("#removep5").fadeIn(250, function() {
				$(this).removeClass("hide");
				$("#fileButton").val("");
			})
		}
	});
	//file input listener
	$("#fileButton").change(function() {
		var counter = document.getElementById("picCount").value;
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#prepiew'+counter).attr('src', e.target.result);
			}
			reader.readAsDataURL(this.files[0]);
			document.getElementById("fileName"+counter).value = this.files[0].name;
		}
	});
	//price listener
	$("#pyear").on('keyup change', function() {
		$("#pyear").val(get_moneydot($("#pyear").val()));
		var yearPr = pembulatan(rem_moneydot($("#pyear").val()));
		if (isNaN(yearPr)) {
			$("#byear").html("-");
			$("#psix").html("-");
			$("#bsix").html("-");
			$("#pmonth").html("-");
			$("#bmonth").html("-");
		} else {
			var sixPr = pembulatan((((parseInt(yearPr)/2)*1.1)+25000).toFixed(2));
			var monthPr = pembulatan((((parseInt(yearPr)/12)*1.2)+25000).toFixed(2));
			var yearBo = pembulatan((parseInt(yearPr)/12).toFixed(2));
			var sixBo = pembulatan(monthPr);
			var monthBo = pembulatan((sixPr/6).toFixed(2));
			$("#byear").html(get_fmoney(yearBo));
			$("#psix").html(get_fmoney(sixPr));
			$("#bsix").html(get_fmoney(sixBo));
			$("#pmonth").html(get_fmoney(monthPr));
			$("#bmonth").html(get_fmoney(monthBo));
		}
	});
	//modal confirmation listener
	$("#confirmYes").on('click', function () {
		$("#rflor").off();
		$("#roomno").off();
		uploadDB();
	});
	
});

//jquery form validation
$().ready(function() {

	$("#inpRoom").validate({
		submitHandler: function() {
			if ($("#pyearval").val() != "" && $("#pyearval").val() != "NaN") {
				//trigger modal popup
				$("#modalConfirm").modal();
			} else {
				//scroll back to top
				$('html, body').animate({
					scrollTop: 0
				}, 500);
				//error notification
				$.gritter.add({
					title: 'Error',
					text: 'Annual price cannot be empty.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				})
			}
		},
		rules: {
			rflor: {
				required: true,
				digits: true,
				min: 1,
				max: 99
			},
			roomno: {
				required: true,
				digits: true,
				min: 1,
				max: 99
			},
			pyear: "required",
			rmsize: "required",
			adate: "required"
		},
		messages: {
			rflor: {
				required: "Please enter room floor.",
				digits: "Please enter a valid number.",
				min: "Room floor must be greater than or equal to 1.",
				max: "Room floor must be less than or equal to 99."
			},
			roomno: {
				required: "Please enter room number.",
				digits: "Please enter a valid number.",
				min: "Room number must be greater than or equal to 1.",
				max: "Room number must be less than or equal to 99."
			},
			pyear: "Please enter yearly price",
			rmsize: "Please enter room size",
			adate: "Please enter available date"
		}
	});

});