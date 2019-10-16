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

function pembulatan(input) {
	
	return (Math.round((parseInt(input)/100)))*100;
	
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

function lockForm() {
	
	//reset progress bar
	for(i=1; i<=5; i++) {
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
	for(i = parseInt(pMax)+1; i<=5; i++) {
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
	for(i = parseInt(pMax)+1; i<=5; i++) {
		$("#prepiew"+i).show();
	}
	
}

function uploadDB() {
	
	//start loading icon
	$("#loadingUpload").fadeIn(250, function() {
		$(this).removeClass("hide");
	})
	lockForm();
	var pMax = $("#maxPic").val();
	for(i=1; i<=pMax; i++) {
		$("#progBar"+i).css("width","100%");
	}
	var roomID = $("#roomid").html();
	var IDBroke = roomID.split("");
	var buildType;
	if (IDBroke[0] == "1") {
		buildType = "residential";
	} else {
		buildType = "commercial";
	}
	var buildNo = IDBroke[1]+IDBroke[2];
	var floorNo = IDBroke[3]+IDBroke[4];
	var d = new Date();
	const dbRefRoom = firebase.database().ref("property/"+buildType+"/building_no:"+buildNo+"/floor:"+floorNo+"/ID:"+roomID);
	dbRefRoom.update({
		availdate : reformatDate2($("#adate").val()),
		last_edited : (parseInt(d.getMonth())+1)+"/"+d.getDate()+"/"+d.getFullYear(),
		roomsize : $("#rmsize").val(),
		yearprice : rem_moneydot($("#pyear").val()),
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
		//success notification
		$.gritter.add({
			title: 'Room Updated',
			text: 'Room was successfully updated to the database.',
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
		$("#loadingUpload").fadeOut(250, function() {
			$(this).hide();
		})
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
	var floorNo = broke[3]+broke[4];
	//set room id in form
	$("#roomid").html(id)
	const check = firebase.database().ref().child("property/"+buildType+"/"+"building_no:"+buildNo+"/floor:"+floorNo+"/ID:"+id);
	//check if room exist
	check.once('value', function(snapshot) {
		//room exist
		if (snapshot.child("roomsize").val() != null) {
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
			//set other input fields in form
			$("#pyear").val(get_moneydot(snapshot.child("yearprice").val().toString()))
			$("#pyear").trigger("change");
			$("#rmsize").val(snapshot.child("roomsize").val());
			$("#adate").val(reformatDate(snapshot.child("availdate").val()));
			//check value of photos
			var photo1 = snapshot.child("photos/photo1").val();
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
			setTimeout(function() {
				//stop full loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				})
			}, 3000)
		//room doesn't exist
		} else {
			window.alert("Room does not exist");
			window.location = "room_list.html?id="+buildNo;
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
			$("#removep5").fadeIn(250, function() {
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
			document.getElementById("fileName"+counter).value = this.files[0].name;
		}
	})
	//price listener
	$('#pyear').on('keyup change', function () {
		$(this).val(get_moneydot($(this).val()));
		var yearPr = rem_moneydot($(this).val());
		if (yearPr == ""){
			$("#byear").html("");
			$("#psix").html("");
			$("#bsix").html("");
			$("#pmonth").html("");
			$("#bmonth").html("");
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
		uploadDB();
	})
	
})

//jquery form validation
$().ready(function() {

	$("#inpRoom").validate({
		submitHandler: function() {
			//trigger modal popup
			$("#modalConfirm").modal();
		},
		rules: {
			rmsize: "required",
			adate: "required"
		}
	});

});