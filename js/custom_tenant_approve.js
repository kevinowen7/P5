function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
//menjumlahkan hari dengan tanggal yang diminta
function sumDate(hari,date){
	var intend = parseInt(hari);
	//set date yang ditentukan
	var someDate = new Date(date);
	//menjumlahkan tanggal
	someDate.setDate(someDate.getDate() + intend); 
	newDate = String(someDate).split(" ")
	var endMonth = newDate[1];
	var endDay = newDate[2];
	var endYear = newDate[3];

	var endDate = endDay+"-"+endMonth+"-"+endYear;

	return endDate;
}

// send email
function sendEmail(tenantID,roomID,total,propAddr1){
	//get tenant mail from firebase
	/*
	var getEmail = firebase.database().ref().child("tenant/"+tenantID);
	getEmail.once('value', function(snapshot) {
		// membaca target , subject , pesan, no kamar
		var to=snapshot.child("email").val();
		var name=snapshot.child("full_name").val();
		var noKamar = String(roomID.charAt(5))+String(roomID.charAt(6));
		var idKamar = String(roomID.charAt(1))+String(roomID.charAt(2));
		var today = new Date();
		var subject = "Summary Payment NSP"
		var message = "Salam "+name+"\n\nPihak NSP sudah menyetujui permohonan kamu untuk masuk kamar "+noKamar+" di gedung "+idKamar+" yang beralamat di "+propAddr1+"\n\nKamu perlu membayar Bond Money dan Rental Money sebesar "+get_fmoney(total)+" ke No. Rek dibawah ini: \n\nNo. Rek : 323232323\n\nAtas Nama : Monica\n\nPaling lambat "+sumDate(7,today)+". Jika sudah transfer , harap menghubungi no WA 08xxxxx"

		//set to firebase
		var sendEmail = firebase.database().ref().child("sendEmail");
		sendEmail.set({
			'subject' : subject,
			'to' : to,
			'message' : message,
		});
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "https://sendemailgokost.herokuapp.com/webhook", true);
		xhr.send();
	 
		xhr.onreadystatechange = processRequest;
		 //kondisi ketika webhook selesai di buka
		function processRequest(e) {
			if (xhr.readyState == 4) {
				$("#approveText").html("APPROVED");
				$("#loadingApprove").hide();
				$("#approveText").show();
				$("#approveButt").fadeIn(250, function() {
					$(this).show();
				});
			}
		}
	});
	*/
	$("#approveText").html("APPROVED");
	$("#loadingApprove").hide();
	$("#approveText").show();
	$("#approveButt").fadeIn(250, function() {
		$(this).show();
	});
	return false;
}

//re-format phone number
function reformatList(listData,x){
	var hasil="";
	var hasil1="";
	
	listData  = listData.split("");
	for (var i=0;i<x;i++){
		hasil = hasil+listData[i];
	}
	for (var i=0;i<x;i++){
		listData.shift();
	}
	for (var i=0;i<x;i++){
		hasil1 = hasil1+listData[i];
	}
	for (var i=0;i<x;i++){
		listData.shift();
	}
	hasil = hasil+"-"+hasil1+"-"+listData.join("");
	return hasil
}

$(window).scroll(function(){
	if ($(this).scrollTop() > 200) {
		$('#approveButt').addClass('fixed');
	} else {
		$('#approveButt').removeClass('fixed');
	}
});
$(document).ready(function() {
	
	//check ref id
	var id = window.location.href.split('=');
	if (id[1] == undefined) { //ref id invalid
		alert("Reference ID invalid");
		window.location = "home.html";
	} else { //ref id valid
		var idb = id[1].split("");
		var refId = idb[0]+idb[1]+idb[2]+" "+idb[3]+idb[4]+idb[5]+" "+idb[6]+idb[7]+idb[8];
		var listTenant = [];
		var buildNo = idb[1]+idb[2];
		var floorNo = idb[3]+idb[4];
		var roomNo = idb[5]+idb[6];
		const dbRefTenant = firebase.database().ref("tenant-room");
		const dbRefTenant2 = firebase.database().ref("tenant");
		const dbRefBuild = firebase.database().ref("property/residential/building_no:"+buildNo);
		const dbRefRoom = dbRefBuild.child("floor:"+floorNo+"/ID:1"+buildNo+floorNo+roomNo);
		dbRefTenant.on('child_added', function(snapshot) {
			var tenantID = snapshot.key;
			dbRefTenant.child(tenantID).on('child_added', function(snapshot) {
				var refNumber = snapshot.child("ref_number").val();
				tenant = {
					refId: refNumber,
					tenId: tenantID,
					roomId: refNumber.split(" ").join("").substring(0,refNumber.split(" ").join("").length-2)
				};
				listTenant.push(tenant);
			});
			dbRefTenant.child(tenantID).on('child_changed', function(snapshot) {
				if(snapshot.child("stat_occupy").val() == "approved") {
					$("#approveButt").fadeOut(250, function() {
						$(this)
							.prop("disabled",true)
							.hide()
							.removeClass("btn-success")
							.addClass("btn-black");
						$("#approveText").html("APPROVED");
						$("#loadingApprove").hide();
						$("#approveText").show();
						$("#approveButt").fadeIn(250, function() {
							$(this).show();
						});
					});
				} else if(snapshot.child("stat_occupy").val() == "booking") {
					$("#approveButt").fadeOut(250, function() {
						$(this)
							.prop("disabled",false)
							.hide()
							.removeClass("btn-black")
							.addClass("btn-success");
						$("#approveText").html("APPROVE");
						$("#loadingApprove").hide();
						$("#approveText").show();
						$("#approveButt").fadeIn(250, function() {
							$(this).show();
						});
					});
				}
			});
		});
		dbRefTenant.once('value', function(snapshot) {
			for(i=0;i<listTenant.length;i++) {
				if(listTenant[i].refId == refId) { //ref id exist
					$("#refnumb").html(listTenant[i].refId);
					$("#propnumb").html(buildNo);
					$("#floornumb").html(floorNo);
					$("#roomnumb").html(roomNo);
					$("#refId").val(listTenant[i].refId);
					$("#tenId").val(listTenant[i].tenId);
					dbRefBuild.once('value', function(snapshot) {
						$("#propaddr_st").html(snapshot.child("address_street").val());
						$("#propaddr_ct").html(snapshot.child("address_city").val());
						$("#propaddr_pv").html(snapshot.child("address_province").val());
						$("#propaddr_zp").html(snapshot.child("address_zipcode").val());
					});
					dbRefRoom.once('value', function(snapshot) {
						$("#adate").html(reformatDate(snapshot.child("availdate").val()));
					});
					dbRefTenant2.child(listTenant[i].tenId).once('value', function(snapshot) {
						$("#afname").html(snapshot.child("full_name").val());
						$("#bdate").html(reformatDate(snapshot.child("birth_date").val()));
						$("#occupy").html(snapshot.child("occupation").val());
						
						var id_type1 = snapshot.child("id_type1").val();
						var id_number1 = snapshot.child("id_number1").val();
						
						if (id_type1=="sim" && id_number1.length>9) {
							$("#idno1").html(reformatList(id_number1,4));
						} else if(id_type1=="ktp" && id_number1.length>13){
							$("#idno1").html(reformatList(id_number1,6));
						} else {
							$("#idno1").html(id_number1);
						}
						
						var id_type2 = snapshot.child("id_type2").val();
						var id_number2 = snapshot.child("id_number2").val();
						
						if (id_type2=="sim" && id_number2.length>9) {
							$("#idno2").html(reformatList(id_number2,4));
						} else if(id_type2=="ktp" && id_number2.length>13){
							$("#idno2").html(reformatList(id_number2,6));
						} else {
							$("#idno2").html(id_number2);
						}
					
						
						
						$("#apermadd").html(snapshot.child("perm_addr").val());
						$("#email").html(snapshot.child("email").val());
						$("#aphome").html(snapshot.child("cont_home").val());
						$("#apmobile").html(reformatList(snapshot.child("cont_mobile").val(),4));
						$("#r1fname").html(snapshot.child("references/reference_1/full_name").val());
						$("#r1rel").html(snapshot.child("references/reference_1/relation").val());
						$("#r1permadd").html(snapshot.child("references/reference_1/address").val());
						$("#r1p").html(snapshot.child("references/reference_1/contact").val());
						$("#r2fname").html(snapshot.child("references/reference_2/full_name").val());
						$("#r2rel").html(snapshot.child("references/reference_2/relation").val());
						$("#r2permadd").html(snapshot.child("references/reference_2/address").val());
						$("#r2p").html(snapshot.child("references/reference_2/contact").val());
						$("#paddress").html(snapshot.child("prev_addr").val());
						var rlos = snapshot.child("los_prev").val().split(",");
						$("#rlosy").html(rlos[0]);
						$("#rlosm").html(rlos[1]);
						$("#rreason").html(snapshot.child("rfl_prev").val());
					});
					dbRefTenant.child(listTenant[i].tenId+"/"+listTenant[i].roomId).once('value', function(snapshot) {
						$("#payplan").html(snapshot.child("pay_plan").val());
						$("#ctoption").html(snapshot.child("ctrt_opt").val());
						$("#edate").html(reformatDate(snapshot.child("start_date").val()));
						$("#rprice").html(get_fmoney(snapshot.child("rent_price").val()));
						$("#bmoney").html(get_fmoney(snapshot.child("rent_bond").val()));
						if(snapshot.child("stat_occupy").val() == "approved") { //tenant approved
							$("#approveButt").fadeOut(250, function() {
								$(this)
									.hide()
									.removeClass("btn-success")
									.addClass("btn-black")
									.prop("disabled",true);
								$("#approveText").html("APPROVED");
								$("#loadingApprove").hide();
								$("#approveText").show();
								$("#approveButt").fadeIn(250, function() {
									$(this).show();
								});
							});
						}
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					});					
					break;
				} else if(listTenant[i].refId != refId && i == listTenant.length-1) { //ref id doesn't exist
					alert("Reference ID invalid");
					window.location = "home.html";
				}
			}
		});
	}
	//approve button listener
	$("#approveButt").on('click', function () {
		$(this).prop("disabled",true);
		$("#approveText").fadeOut(250, function() {
			$(this).hide();
			$("#loadingApprove").fadeIn(250, function() {
				$(this).show();
				const dbRefTenant = firebase.database().ref("tenant-room");
				var roomId = $("#refnumb").html().split(" ").join("").substring(0,$("#refnumb").html().split(" ").join("").length-2);
				dbRefTenant.child($("#tenId").val()+"/"+roomId).update({
					stat_occupy : "approved"
				}).then(function onSuccess(res) {
					$("#approveButt").fadeOut(250, function() {
						$(this)
							.hide()
							.removeClass("btn-success")
							.addClass("btn-black");
						//mengambil apply date, rent price , prop_addr
						dbRefTenant.child($("#tenId").val()+"/"+roomId).once('value', function(snapshot) {
							var applyDate1=snapshot.child("apply_date").val();
							var rent_price1=snapshot.child("rent_price").val();
							var rent_bond1=snapshot.child("rent_bond").val();
							var total = parseInt(rent_price1)+parseInt(rent_bond1);
							var propAddr1=snapshot.child("prop_addr").val();
							// send email
							sendEmail($("#tenId").val(),roomId,total,propAddr1);
						})
						
					});
				}).catch(function onError(err) {
					//error notification
					$.gritter.add({
						title: 'Error Approving',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					});
					$("#loadingApprove").fadeOut(250, function() {
						$(this).hide();
						$("#approveText").fadeIn(250, function() {
							$(this).show();
							$(this).prop("disabled",false);
						});
					});
				});
				
			});
		});
	});
	
})