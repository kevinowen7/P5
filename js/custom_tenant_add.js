function convertCanvasToImage(canvas) {
	
	var image = new Image();
	image.src = canvas.toDataURL("image/jpeg", 0.97);
	return image;
	
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

function rem_fmoney(money) {
	
	return parseInt(money.substring(4,money.length-2).split(".").join(""))
	
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

function removeOptions(selectbox) {
	
    //clear select options
    for(i=selectbox.options.length-1; i>=1; i--) {
        selectbox.remove(i);
    }
	
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

function reformatDate3(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	inputBroke=inputDate.split("/");
	inputDay=parseInt(inputBroke[0]);
	inputMonth=parseInt(inputBroke[1]);
	inputYear=inputBroke[2];
	outputDay=inputDay;
	outputMonth=months[inputMonth-1];
	outputYear=inputYear;
	return (outputDay+"-"+outputMonth+"-"+outputYear);
	
}

function reformatBirth(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	inputBroke=inputDate.split("-");
	inputDay=parseInt(inputBroke[2]);
	inputMonth=parseInt(inputBroke[1]);
	inputYear=inputBroke[0];
	outputDay=inputDay;
	outputMonth=months[inputMonth-1];
	outputYear=inputYear;
	return (outputDay+"-"+outputMonth+"-"+outputYear);
	
}

function reformatDate4(inputDate) {
	
	inputBroke=inputDate.split("/");
	inputDay=parseInt(inputBroke[1]);
	inputMonth=parseInt(inputBroke[0]);
	inputYear=inputBroke[2];
	return (inputDay+"/"+inputMonth+"/"+inputYear);
	
}

function date_diff_indays(d1, d2) {
	
	var diff = Date.parse(d2) - Date.parse(d1);
	return Math.floor(diff / 86400000);
	
}

function getFileExtension(filename) {
	
	//get file extension such as .jpg .png .bmp etc
	return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
	
}

function lockForm() {
	
	//lock submit buttons
	$("#bfinish").prop('disabled', true);
	$("#breset").prop('disabled', true);
	//lock inputs
	$("input").prop('disabled', true);
	$("select").prop('disabled', true);
	
}

function unlockForm() {
	
	//unlock submit buttons
	$("#bfinish").prop('disabled', false);
	$("#breset").prop('disabled', false);
	//unlock inputs
	$("input").prop('disabled', false);
	$("select").prop('disabled', false);
	
}

function uploadDB() {
	
	//start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	});
	lockForm();
	var tenantID;
	//listen value to reach threshold
	$("#thresholdCounter").change(function() {
		if ($(this).val() == "6") { //wait until finish uploading
			/*
			//send email
			var ref = $("#roomid").html()+$("#tenantno").html();
			var ref = ref.split(" ")[0]+ref.split(" ")[1]+ref.split(" ")[2];
			var noLantai = String(ref.charAt(3))+String(ref.charAt(4));
			var noKamar = String(ref.charAt(5))+String(ref.charAt(6));
			//send email
			var message = "Dear "+$("#afname").val()+",<br>"+"Terima kasih telah melakukan pemesanan kamar di NSP \n\n\nNoPemesanan : "+ref+"<br>Alamat : "+$("#propaddr_st").html()+", "+$("#propaddr_ct").html()+" "+$("#propaddr_pv").html()+" "+$("#propaddr_zp").html()+"<br>No. Kamar : "+noKamar+"<br>Lantai : "+noLantai+"<br>Starting Date : "+$("#edate").val()+"\n\nPemesanan saudara/i akan segera kami proses paling lambat 3 hari kerja. Saudara/i bisa memeriksa status penesanan anda pada link berikut : <a href='http://example.com'>example.com</a>";
			//set to firebase
			var sendEmail = firebase.database().ref().child("sendEmail");
			sendEmail.set({
				'subject' : "Konfirmasi Pemesanan Kamar",
				'to' : $("#email").val(),
				'message' : message,
			});
			//membangunkan heroku
			var xhr0 = new XMLHttpRequest();
			xhr0.open('GET', "https://sendemailgokost.herokuapp.com/", true);
			xhr0.send();
			xhr0.onreadystatechange = processRequest;
			 //kondisi ketika webhook selesai di buka
			function processRequest(e) {
				if (xhr0.readyState == 4) {
					//mengirim email
					var xhr = new XMLHttpRequest();
					xhr.open('GET', "https://sendemailgokost.herokuapp.com/webhook", true);
					xhr.send();
				 
					xhr.onreadystatechange = processRequest;
					 //kondisi ketika webhook selesai di buka
					function processRequest(e) {
						if (xhr.readyState == 4) {
							//stop loading
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							})
							//stop threshold listener
							$("#thresholdCounter").off();
							//success notification
							$.gritter.add({
								title: 'Tenant Added',
								text: 'Tenant was successfully added to the database.',
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
							//stop loading icon
							$("#loadingUpload").fadeOut(250, function() {
								$(this).hide();
							});
							setTimeout(function() {
								window.location="home.html";
							}, 1200);
						}
					}
				}
			}
			*/
			//stop loading
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			})
			//stop threshold listener
			$("#thresholdCounter").off();
			//success notification
			$.gritter.add({
				title: 'Tenant Added',
				text: 'Tenant was successfully added to the database.',
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			//stop loading icon
			$("#loadingUpload").fadeOut(250, function() {
				$(this).hide();
			});
			setTimeout(function() {
				window.location="home.html";
			}, 1200);
		}
	});
	
	//upload to DB (tenant)
	const dbRefTenant = firebase.database().ref("tenant");
	const dbRefTenantRoom = firebase.database().ref("tenant-room");
	
	dbRefTenant.once('value', function(snapshot) {
		if (snapshot.hasChildren()) { //tenant list filledj
			var currCount = snapshot.child("counter").val();
			var nextCount = parseInt(currCount)+1;
			tenantID = "t_"+nextCount;
			dbRefTenant.update({
				counter : nextCount
			});
		} else {
			tenantID = "t_1"; //tenant list empty
			dbRefTenant.update({
				counter : 1
			});
		}
		paymentRef = firebase.database().ref().child("payment/"+tenantID);
		var contract = firebase.database().ref().child("contract/"+tenantID+"/"+$("#myRoomID").val()+"");
		var sd_date = new Date(reformatDate2($("#edate").val()))
		var ed_date = sd_date.addMonths(parseInt($("#ctoption").val())).toString("M/d/yyyy")
		contract.push({
			"ctrt_length": $("#ctoption").val(),
			"refNumb":$("#roomid").html()+$("#tenantno").html(),
			"ctrt_type":"Months",
			"bond": rem_fmoney($("#fbond").html()),
			"end_date":ed_date,
			"start_date":reformatDate2($("#edate").val()),
			"payPlan":$("#payplan").val(),
			"rent":rem_fmoney($("#fprice").html())
		})
		contract.update({
			"historyperiod":1
		})
		
		
		dbRefTenant.child(tenantID).set({
			full_name : $("#afname").val(),
			birth_date : reformatDate2($("#bdate").val()),
			occupation : $("#occupy").val(),
			id_type1 : $("#idtype1").val(),
			id_number1 : $("#idno1").val(),
			id_photo1 : "empty",
			id_type2 : $("#idtype2").val(),
			id_number2 : $("#idno2").val(),
			id_photo2 : "empty",
			kk_photo : "empty",
			tn_photo : "empty",
			perm_addr : $("#aadstreet").val()+", "+$("#aadcity").val()+", "+$("#aadprov").val()+" "+$("#aadzip").val(),
			prev_addr : $("#paddress").val(),
			los_prev : $("#rlosy").val()+","+$("#rlosm").val(),
			rfl_prev : $("#rreason").val(),
			email : $("#email").val(),
			cont_home : $("#aphome").val(),
			cont_mobile : $("#apmobile").val(),
			references : {
				reference_1 : {
					full_name : $("#r1fname").val(),
					relation : $("#r1rel").val(),
					address : $("#r1adstreet").val()+", "+$("#r1adcity").val()+", "+$("#r1adprov").val()+" "+$("#r1adzip").val(),
					contact : $("#r1p").val()
				},
				reference_2 : {
					full_name : $("#r2fname").val(),
					relation : $("#r2rel").val(),
					address : $("#r2adstreet").val()+", "+$("#r2adcity").val()+", "+$("#r2adprov").val()+" "+$("#r2adzip").val(),
					contact : $("#r2p").val()
				}
			}
		}).then(function onSuccess(res) {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}).catch(function onError(err) {
			//error notification
			$.gritter.add({
				title: 'Error Ref Tenant',
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
		var d = new Date();
		//upload to DB (tenant-room)
		dbRefTenantRoom.child(tenantID+"/"+$("#myRoomID").val()).set({
			ref_number : $("#roomid").html()+$("#tenantno").html(),
			build_no : $("#propnumb").html().substring(10,12),
			prop_addr : $("#propaddr_st").html()+", "+$("#propaddr_ct").html()+" "+$("#propaddr_pv").html()+" "+$("#propaddr_zp").html(),
			apply_date : (parseInt(d.getMonth())+1)+"/"+d.getDate()+"/"+d.getFullYear(),
			start_date : reformatDate2($("#edate").val()),
			key_date : reformatDate2($("#edate").val()),
			ctrt_opt : $("#ctoption").val(),
			pay_plan : $("#payplan").val(),
			adjst_pay : $("#payadjt").val(),
			adjst_bond : $("#bondadjt").val(),
			stat_approve : "waiting",
			stat_process : "continue",
			key_collection : {
				pick_est : "date",
				pick_act : "date",
				key_rtrn : "date"
			},
			stat_occupy : "booking",
			stat_chrg_f : "0",
			stat_chrg_n : "0",
			rent_price	: rem_fmoney($("#fprice").html()),
			rent_bond	: rem_fmoney($("#fbond").html())
		}).then(function onSuccess(res) {
			$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
			$("#thresholdCounter").trigger("change");
		}).catch(function onError(err) {
			//error notification
			$.gritter.add({
				title: 'Error Ref Tenant-Room',
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
		//upload id 1
		if ($("#upBox1")[0].files && $("#upBox1")[0].files[0]) {
			var photo1 = $("#upBox1")[0].files[0];
			var filename1 = "ID_1."+getFileExtension(photo1.name);
			var storageRef1 = firebase.storage().ref("images/tenant/"+tenantID+"/"+filename1);
			var task1 = storageRef1.put(photo1);
			task1.on('state_changed',
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
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
					dbRefTenant.child(tenantID).update({
						id_photo1 : filename1
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Ref Image 1 DB',
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
		//upload id 2
		if ($("#upBox2")[0].files && $("#upBox2")[0].files[0]) {
			var photo2 = $("#upBox2")[0].files[0];
			var filename2 = "ID_2."+getFileExtension(photo2.name);
			var storageRef2 = firebase.storage().ref("images/tenant/"+tenantID+"/"+filename2);
			var task2 = storageRef2.put(photo2);
			task2.on('state_changed',
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
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
					dbRefTenant.child(tenantID).update({
						id_photo2 : filename2
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Ref Image 2 DB',
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
		//upload kk
		if ($("#upBox3")[0].files && $("#upBox3")[0].files[0]) {
			var photo3 = $("#upBox3")[0].files[0];
			var filename3 = "ID_3."+getFileExtension(photo3.name);
			var storageRef3 = firebase.storage().ref("images/tenant/"+tenantID+"/"+filename3);
			var task3 = storageRef3.put(photo3);
			task3.on('state_changed',
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
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
					dbRefTenant.child(tenantID).update({
						kk_photo : filename3
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Ref Image 3 DB',
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
		//upload tenant photo
		if ($("#pready").attr("src") != "") {
			var photo4 = $("#pready").attr("src");
			var filename4 = "ID_4.jpg";
			var storageRef4 = firebase.storage().ref("images/tenant/"+tenantID+"/"+filename4);
			var task4 = storageRef4.putString(photo4,'data_url');
			task4.on('state_changed',
				function progress(snapshot) {
					var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
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
					dbRefTenant.child(tenantID).update({
						tn_photo : filename4
					}).then(function onSuccess(res) {
						$("#thresholdCounter").val(parseInt($("#thresholdCounter").val())+1);
						$("#thresholdCounter").trigger("change");
					}).catch(function onError(err) {
						//error notification
						$.gritter.add({
							title: 'Error Ref Image 4 DB',
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
	});
	
}

$(document).ready(function() {

	
	//auto fill form with data
	var id = window.location.href.split('=');
	if (id[1] == undefined) {
		//room find
		$("#propaddr_s").show();
		$("#propshow").hide();
		$("#refblock").hide();
		$("#payplan").prop("disabled",true);
		//array for search bar autocomplete
		var buildList = [];
		//fill array with data from database
		const dbRefBuild = firebase.database().ref("property/residential");
		dbRefBuild.on('child_added', function(snapshot) {
			var build_numb = snapshot.key.split(":")[1];
			var ad_st = snapshot.child("address_street").val();
			var ad_ct = snapshot.child("address_city").val();
			var ad_pv = snapshot.child("address_province").val();
			var ad_zp = snapshot.child("address_zipcode").val();
			var arraydata = {
				label: ad_st+", "+ad_ct+", "+ad_pv+" "+ad_zp,
				buildid: build_numb,
				address1: ad_st,
				address2: ad_ct,
				address3: ad_pv,
				address4: ad_zp
			};
			buildList.push(arraydata);
			//sort array ascending based on address
			buildList.sort(function(a, b){
				var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase();
				if (nameA < nameB) //sort string ascending
					return -1;
				if (nameA > nameB)
					return 1;
				return 0; //default return value (no sorting)
			});
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			})
		});
		//start property address autocomplete
		$("#propaddr_s").autocomplete({
			source: function(request, response) {
				var results = $.ui.autocomplete.filter(buildList, request.term);
				response(results.slice(0, 8));
			},
			select: function(event, ui) {
				$("#buildnumber").val(ui.item.buildid);
				$("#propnumb").html("(Building "+ui.item.buildid+")");
				$("#propaddr_st").html(ui.item.address1);
				$("#propaddr_ct").html(ui.item.address2+",");
				$("#propaddr_pv").html(ui.item.address3+",");
				$("#propaddr_zp").html(ui.item.address4);
				$("#propaddr_s").fadeOut(250, function() {
					$(this).hide();
					$("#propshow").fadeIn(250, function() {
						$(this).show();
						$("#resetaddr").show();
					})
				})
				$("#boxfloor").replaceWith("<select id='floornumb' name='floornumb' class='form-control' style='display:none;' required><option value=''>Select Room Floor</option></select>");
				$("#boxroom").replaceWith("<select id='roomnumb' name='roomnumb' class='form-control' style='display:none;' required disabled><option value=''>Select Room Number</option></select>");
				var floorList = [];
				const dbRefBuildFlr = firebase.database().ref("property/residential/building_no:"+ui.item.buildid);
				//start loading icon
				$("#cover-spin").fadeIn(250, function() {
					$(this).show();
				})
				dbRefBuildFlr.on('child_added', function(snapshot) {
					if (snapshot.key.split(":")[0] == "floor") {
						floorList.push(snapshot.key.split(":")[1]);
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						})
					}
				})
				for (i=0; i<floorList.length; i++) { 
					var optionElement = document.createElement("option");
					optionElement.value = floorList[i];
					optionElement.innerHTML = floorList[i];
					document.getElementById("floornumb").appendChild(optionElement);
				}
				$("#floornumb,#roomnumb").fadeIn(250, function() {
					$(this).show();
				})
				$("#floornumb").on('change', function () {
					if ($(this).find("option:selected").attr('value') == "") {
						removeOptions(document.getElementById("roomnumb"));
						$("#roomnumb").val("");
						$("#roomnumb").trigger("change");
						$("#roomnumb").prop("disabled",true);
					} else {
						//start loading icon
						$("#cover-spin").fadeIn(250, function() {
							$(this).show();
						})
						removeOptions(document.getElementById("roomnumb"));
						$("#roomnumb").val("");
						$("#roomnumb").trigger("change");
						$("#roomnumb").prop("disabled",false);
						var selectFloor = $("#floornumb").val();
						var roomList = [];
						const dbRefBuildRoom = firebase.database().ref("property/residential/building_no:"+ui.item.buildid+"/floor:"+selectFloor);
						dbRefBuildRoom.on('child_added', function(snapshot) {
							var roomId = snapshot.key.split(":")[1];
							var roomIdBroke = roomId.split("");
							roomList.push(roomIdBroke[5]+roomIdBroke[6]);
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							})
						})
						for (i=0; i<roomList.length; i++) { 
							var optionElement = document.createElement("option");
							optionElement.value = roomList[i];
							optionElement.innerHTML = roomList[i];
							document.getElementById("roomnumb").appendChild(optionElement);
						}
					}
				})
				$("#roomnumb").on('change', function () {
					$("#edatepicker").datepicker("destroy");
					$("#edate").val("");
					if ($(this).find("option:selected").attr('value') == "") {
						$("#payplan").prop("disabled",true);
						$("#payplan").val("");
						$("#rprice,#bmoney,#fprice,#fbond").html("Rp. -");
						$("#cprice,#cbond,#cfprice,#cfbond").val("");
						$("#payadjt,#bondadjt").val("0");
						$("#padj,#badj").fadeOut(200, function() {
							$(this).hide();
						})
						$("#refblock").fadeOut(200, function() {
							$(this).hide();
							$("#roomid").html("");
						});
						$("#roomnumb").val("");
						$("#adate").html("");
						$("#yearp").val("");
						$("#myRoomID").val("");
					} else {
						//start loading icon
						$("#cover-spin").fadeIn(250, function() {
							$(this).show();
						})
						var buildNumb = $("#buildnumber").val();
						var roomFloor = $("#floornumb").val();
						var roomNumb = $("#roomnumb").val();
						var roomID = "1"+buildNumb+roomFloor+roomNumb;
						var roomIDbroke = roomID.split("");
						const dbRefRoom = firebase.database().ref("property/residential/building_no:"+ui.item.buildid+"/floor:"+roomFloor+"/ID:"+roomID);
						dbRefRoom.once('value', function(snapshot) {
							if (snapshot.child("availdate").val() != "empty" && snapshot.child("yearprice").val() != "empty") {
								$("#payplan").prop("disabled",false);
								$("#payplan").val("");
								$("#rprice,#bmoney,#fprice,#fbond").html("Rp. -");
								$("#cprice,#cbond,#cfprice,#cfbond").val("");
								$("#payadjt,#bondadjt").val("0");
								$("#padj,#badj").fadeOut(200, function() {
									$(this).hide();
								})
								$("#roomid").html(roomIDbroke[0]+roomIDbroke[1]+roomIDbroke[2]+" "+roomIDbroke[3]+roomIDbroke[4]+roomIDbroke[5]+" "+roomIDbroke[6]);
								$("#refblock").fadeIn(200, function() {
									$(this).show();
								});
								$("#adate").html(reformatDate(snapshot.child("availdate").val()));
								$("#yearp").val(parseInt(snapshot.child("yearprice").val()));
								$("#myRoomID").val(roomID);
								$('#edatepicker').datepicker({
									format: "d-M-yy",
									autoclose: true,
									startDate: reformatDate4(reformatDate2($("#adate").html()))
								});
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								})
							} else {
								$("#payplan").prop("disabled",true);
								$("#payplan").val("");
								$("#rprice,#bmoney,#fprice,#fbond").html("Rp. -");
								$("#cprice,#cbond,#cfprice,#cfbond").val("");
								$("#payadjt,#bondadjt").val("0");
								$("#padj,#badj").fadeOut(200, function() {
									$(this).hide();
								})
								$("#refblock").fadeOut(200, function() {
									$(this).hide();
									$("#roomid").html("");
								});
								$("#roomnumb").val("");
								$("#adate").html("");
								$("#yearp").val("");
								$("#myRoomID").val("");
								//error notification
								$.gritter.add({
									title: 'Error',
									text: 'Available date or room price is empty.',
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								})
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								})
							}
						})
					}
				})
				return false;
			}
		});
	} else {
		//room defined
		var broke = id[1].split("");
		var buildType0 = broke[0];
		if (buildType0 == "2") {
			var buildType = "commercial";
		} else if (buildType0 == "1") {
			var buildType = "residential";
		}
		var buildNo = broke[1]+broke[2];
		var floorNo = broke[3]+broke[4];
		var roomNo = broke[5]+broke[6];
		var roomIDspaced = broke[0]+broke[1]+broke[2]+" "+broke[3]+broke[4]+broke[5]+" "+broke[6];
		$("#roomid").html(roomIDspaced);
		$("#floornumb").html(floorNo);
		$("#roomnumb").html(roomNo);
		const dbRefBuild = firebase.database().ref("property/"+buildType+"/"+"building_no:"+buildNo);
		dbRefBuild.once('value', function(snapshot) {
			var propaddress_st = snapshot.child("address_street").val();
			if (propaddress_st != null) {
				//address data
				$("#propnumb").html("(Building "+buildNo+")");
				$("#propaddr_st").html(propaddress_st);
				$("#propaddr_ct").html(snapshot.child("address_city").val()+",");
				$("#propaddr_pv").html(snapshot.child("address_province").val()+",");
				$("#propaddr_zp").html(snapshot.child("address_zipcode").val());
				dbRefRoom = firebase.database().ref("property/"+buildType+"/"+"building_no:"+buildNo+"/floor:"+floorNo+"/ID:"+id[1]);
				dbRefRoom.once('value', function(snapshot) {
					if (snapshot.child("yearprice").val() != null) {
						var availDate = snapshot.child("availdate").val();
						if (availDate != "empty") {
							$("#adate").html(reformatDate(snapshot.child("availdate").val()));
							$("#yearp").val(snapshot.child("yearprice").val());
							$("#myRoomID").val(id[1]);
							$('#edatepicker').datepicker({
								format: "d-M-yy",
								autoclose: true,
								startDate: reformatDate4(reformatDate2($("#adate").html()))
							});
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							})
						} else {
							alert("Please provide a valid available date for the room.");
							window.location = "room_list.html?id="+buildNo;
						}
					} else {
						alert("Room does not exist");
						window.location = "room_list.html?id="+buildNo;
					}
				})
			} else {
				alert("Building does not exist.");
				window.location = "room_list.html";
			}
		})
	}
	//elements for taking the snapshot
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var video = document.getElementById('video');
	var localstream;
	//camera listener
	$("#startcam").click(function() {
		//get access to the camera
		if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			document.getElementById("startcam").classList.add("hidden");
			document.getElementById("video").classList.remove("hidden");
			document.getElementById("snap").classList.remove("hidden");
			//start stream video
			navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
				video.srcObject = stream;
				localstream = stream;
				video.play();
			})
		} else {
			alert("something happened");
		}
	})
	//trigger photo take
	$("#snap").click(function() {
		video.pause();
		context.drawImage(video, 0, 0, 1280, 960);
		video.src = "";
		localstream.getTracks()[0].stop();
		document.getElementById("video").classList.add("hidden");
		document.getElementById("canvas").classList.remove("hidden");
		document.getElementById("snap").classList.add("hidden");
		document.getElementById("resetp").classList.remove("hidden");
		document.getElementById("finishp").classList.remove("hidden");
	})
	//reset camera and photo
	$("#resetp").click(function() {
		document.getElementById("video").classList.remove("hidden");
		document.getElementById("canvas").classList.add("hidden");
		document.getElementById("snap").classList.remove("hidden");
		document.getElementById("resetp").classList.add("hidden");
		document.getElementById("finishp").classList.add("hidden");
		//start stream video
		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
			video.srcObject = stream;
			localstream = stream;
			video.play();
		})
	})
	//finish taking photo
	$("#finishp").click(function() {
		var conf = confirm("Are you sure? Photo cannot be changed until complete.");
		if (conf == true) {
			document.getElementById("canvas").classList.add("hidden");
			document.getElementById("resetp").classList.add("hidden");
			document.getElementById("finishp").classList.add("hidden");
			document.getElementById("pready").classList.remove("hidden");
			var c = document.getElementById("canvas");
			var gambar = convertCanvasToImage(c);
			document.getElementById("pready").src = gambar.src;
		}
	})
	//ref number listener
	$("#refchg").on('click', function() {
		var inpStart = $("#refnumb").val();
		if(inpStart == 0) {
			$("#tenantno").html("00");
		} else if (inpStart>=0 && inpStart<=99 && inpStart%1==0) {
			for(j=1; j<=9; j++) {
				if (inpStart==String(j)) {
					inpStart="0"+String(j);
				}
			}
			$("#tenantno").html(inpStart);
		}
	})
	//reset address listener
	$("#resetaddr").on('click', function() {
		location.reload();
	})
	//pay plan listener
	$("#payplan").on('change', function() {
		var yearPr = $("#yearp").val();
		if (yearPr == "") {
			$("#payplan").val("");
			//error notification
			$.gritter.add({
				title: 'Error',
				text: 'Room is not valid.',
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			})
		} else {
			var sixPr = pembulatan((((parseInt(yearPr)/2)*1.1)+25000).toFixed(2));
			var monthPr = pembulatan((((parseInt(yearPr)/12)*1.2)+25000).toFixed(2));
			var yearBo = pembulatan((parseInt(yearPr)/12).toFixed(2));
			var sixBo = pembulatan(sixPr/6);
			var monthBo = monthPr;
			$("#payadjt,#bondadjt").val("0");
			if ($(this).find("option:selected").attr("value") == "") {
				$("#roompricing").fadeOut(250, function() {
					$(this).hide();
				})
				$("#rprice,#bmoney,#fprice,#fbond").html("Rp. -");
				$("#cprice,#cbond,#cfprice,#cfbond").val("");
				$("#padj,#badj").fadeOut(200, function() {
					$(this).hide();
				})
			} else if ($(this).find("option:selected").attr("value") == "annually") {
				$("#roompricing").fadeIn(250, function() {
					$(this).show();
				})
				$("#rprice,#fprice").html(get_fmoney(yearPr));
				$("#bmoney,#fbond").html(get_fmoney(yearBo));
				$("#cprice,#cfprice").val(yearPr);
				$("#cbond,#cfbond").val(yearBo);
				$("#padj,#badj").fadeIn(200, function() {
					$(this).show();
				})
			} else if ($(this).find("option:selected").attr("value") == "semiannually") {
				$("#roompricing").fadeIn(250, function() {
					$(this).show();
				})
				$("#rprice,#fprice").html(get_fmoney(sixPr));
				$("#bmoney,#fbond").html(get_fmoney(sixBo));
				$("#cprice,#cfprice").val(sixPr);
				$("#cbond,#cfbond").val(sixBo);
				$("#padj,#badj").fadeIn(200, function() {
					$(this).show();
				})
			} else if ($(this).find("option:selected").attr("value") == "monthly") {
				$("#roompricing").fadeIn(250, function() {
					$(this).show();
				})
				$("#rprice,#fprice").html(get_fmoney(monthPr));
				$("#bmoney,#fbond").html(get_fmoney(monthBo));
				$("#cprice,#cfprice").val(monthPr);
				$("#cbond,#cfbond").val(monthBo);
				$("#padj,#badj").fadeIn(200, function() {
					$(this).show();
				})
			}
		}
	})
	//occupation listener
	$("#occupy").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "pelajar-mahasiswa") {
			$("#idtype1").val("ktm");
			$("#idtype1").prop('disabled',true);
		} else {
			$("#idtype1").val("");
			$("#idtype1").prop('disabled',false);
		}
	})
	//prev address listener
	$("input[type=radio][name=paddressrad]").on('change', function() {
		if (this.value == 'other') {
			$("#paddress").val("");
			$("#paddress").prop("readOnly",false);
		} else {
			if ($("#aadstreet").val() != "" && $("#aadcity").val() != "" && $("#aadprov").val() != "" && $("#aadzip").val() != "") {
				$("#paddress").val($("#aadstreet").val()+", "+$("#aadcity").val()+", "+$("#aadprov").val()+" "+$("#aadzip").val());
				$("#paddress").prop("readOnly",true);
			} else {
				$("input[type=radio][name=paddressrad]").prop('checked', false);
				$("#paddress").val("");
				$("#paddress").prop("readOnly",true);
				//error notification
				$.gritter.add({
					title: 'Error',
					text: 'Address is not valid.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				})
			}
		}
	})
	//upload1 button listener
	$("#bupload1").on('click', function() {
		$("#upBox1").trigger("click");
		$("#upBox1").on('change', function() {
			if ($(this).val() != "") {
				$("#up1val").html($(this).val().split("\\")[2]);
				$("#up1val").fadeIn(250, function() {
					$(this).removeClass("hide");
				})
			} else {
				$("#up1val").html("");
				$("#up1val").fadeOut(250, function() {
					$(this).hide();
				})
			}
		})
	})
	//upload2 button listener
	$("#bupload2").on('click', function() {
		$("#upBox2").trigger("click");
		$("#upBox2").on('change', function() {
			if ($(this).val() != "") {
				$("#up2val").html($(this).val().split("\\")[2]);
				$("#up2val").fadeIn(250, function() {
					$(this).removeClass("hide");
				})
			} else {
				$("#up2val").html("");
				$("#up2val").fadeOut(250, function() {
					$(this).hide();
				})
			}
		})
	})
	//upload3 button listener
	$("#bupload3").on('click', function() {
		$("#upBox3").trigger("click");
		$("#upBox3").on('change', function() {
			if ($(this).val() != "") {
				$("#up3val").html($(this).val().split("\\")[2]);
				$("#up3val").fadeIn(250, function() {
					$(this).removeClass("hide");
				})
			} else {
				$("#up3val").html("");
				$("#up3val").fadeOut(250, function() {
					$(this).hide();
				})
			}
		})
	})
	//modal confirmation listener
	$("#confirmYes").on('click', function () {
		uploadDB();
	})
	//entry date picker listener
	$("#edate").on('change', function () {
		if ($(this).val() != "") {
			if(date_diff_indays(reformatDate2($(this).val()),reformatDate2($("#adate").html())) > 0) {
				//error notification
				$.gritter.add({
					title: 'Error',
					text: 'Date is not valid.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				$(this).val("");
			}
		}
	})
	//birth date picker listener
	$("#bdate").on('change', function () {
		if ($(this).val() != "") {
			$(this).val(reformatBirth($(this).val()));
		}
	})
	//price adjustment listener
	$("#padj").on('click', function() {
		$("#modalPriceAdjt").modal();
	});
	//bond money adjustment listener
	$("#badj").on('click', function() {
		$("#modalBondAdjt").modal();
	});
	//price adjustment auto dot
	$("#priceAdjustment").on('keyup change', function() {
		$("#priceAdjustment").val(get_moneydot($("#priceAdjustment").val()));
	});
	//bond adjustment auto dot
	$("#bondAdjustment").on('keyup change', function() {
		$("#bondAdjustment").val(get_moneydot($("#bondAdjustment").val()));
	});
	//confirm price adjustment listener
	$("#confirmPriceAdjt").on('click', function() {
		var prompter = rem_moneydot($("#priceAdjustment").val());
		if (prompter != null && prompter != "") {
			var adjprice = parseInt(prompter);
			$("#fprice").html(get_fmoney(pembulatan(adjprice)));
			$("#cfprice").val(pembulatan(adjprice));
			$("#payadjt").val(prompter);
			if ($("#payplan").find("option:selected").attr("value") == "annually") {
				var yearPr = $("#cfprice").val();
				var yearBo = pembulatan((parseInt(yearPr)/12).toFixed(2));
				$("#fbond").html(get_fmoney(yearBo));
				$("#cfbond").val(yearBo);
			} else if ($("#payplan").find("option:selected").attr("value") == "semiannually") {
				var sixPr = $("#cfprice").val();
				var yearPr = pembulatan((((sixPr-25000)/1.1)*2).toFixed(2));
				var monthPr = pembulatan((((parseInt(yearPr)/12)*1.2)+25000).toFixed(2));
				var sixBo = pembulatan(monthPr);
				$("#fbond").html(get_fmoney(sixBo));
				$("#cfbond").val(sixBo);
			} else if ($("#payplan").find("option:selected").attr("value") == "monthly") {
				var monthPr = $("#cfprice").val();
				var yearPr = pembulatan((((monthPr-25000)/1.2)*12).toFixed(2));
				var sixPr = pembulatan((((parseInt(yearPr)/2)*1.1)+25000).toFixed(2));
				var monthBo = pembulatan((sixPr/6).toFixed(2));
				$("#fbond").html(get_fmoney(monthBo));
				$("#cfbond").val(monthBo);
			}
		}
	});
	//confirm bond adjustment listener
	$("#confirmBondAdjt").on('click', function() {
		var prompter = rem_moneydot($("#bondAdjustment").val());
		if (prompter != null && prompter != "") {
			var adjbond = parseInt(prompter);
			$("#fbond").html(get_fmoney(pembulatan(adjbond)));
			$("#bondadjt").val(prompter);
		}
	});
	//special case button listener
	$("#specialcase").on('click', function () {
		/* var id = window.location.href.split('=');
		if (id[1] == undefined) {
			window.location = "tenant_add_special.html";
		} else {
			window.location = "tenant_add_special.html?id="+id[1];
		} */
	})
	$('#bdatepicker').on('click', function(e) {
		e.preventDefault();
		$.dateSelect.show({
			element: 'input[name="bdate"]'
		});
	});
	
})

//jquery form validation
$().ready(function() {

	$("#getTenant").validate({
		submitHandler: function() {
			//trigger modal popup
			$("#modalConfirm").modal();
		}
	})

})