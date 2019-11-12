function split_ph(phoneNumb) {
	
	var reformat = phoneNumb.replace(/(\d{4})/g, function(match){
        return match + "-";
	});
	if (reformat.charAt(reformat.length-1) === "-") {
		reformat = reformat.slice(0, reformat.length-1);
	}
	return reformat;
	
}

function date_diff_indays(d1, d2) {
	
	var diff = Date.parse(d2) - Date.parse(d1);
	return Math.floor(diff / 86400000);
	
}

function shortenString(yourString,maxLength){

	//trim the string to the maximum length
	var trimmedString = yourString.substr(0, maxLength);

	return trimmedString+"..."
	
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

//fungsi untuk Non-Active Tenant
function nonactiveModal(){
	var refNumber = $("#tenant_id").html()
	$('#nonactiveM').html("Are you sure to Non-Active "+refNumber+" ?");
	$('#nonactiveM').val(refNumber);
	$("#nonActiveModal").modal();
}

$("#submitNonActive").click(function(){
	$('#nonActiveModal').modal('hide');
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	nonActive();

})

function nonActive(){
	id2 = window.location.href.split('=')[1];
	id = id2.split("#")[0];
	newfirebase=firebase.database().ref().child("tenantendContract/"+id);
	contract=firebase.database().ref().child("contract/"+id+"/"+room_id);
	contract.on("child_added", function(snapshot){
		if (snapshot.key!="historyperiod" && snapshot.key!="status"){
			var bond = snapshot.child("bond").val();
			var ctrt_length = snapshot.child("ctrt_length").val();
			var ctrt_type = snapshot.child("ctrt_type").val();
			var end_date = snapshot.child("end_date").val();
			var payPlan = snapshot.child("payPlan").val();
			var refNumb = snapshot.child("refNumb").val();
			var rent = snapshot.child("rent").val();
			var start_date = snapshot.child("start_date").val();
			newfirebase.child("contract").push({
				"bond":bond,
				"ctrt_length":ctrt_length,
				"ctrt_type":ctrt_type,
				"end_date":end_date,
				"payPlan":payPlan,
				"refNumb":refNumb,
				"rent":rent,
				"start_date":start_date
			})
		}
		else if (snapshot.key=="historyperiod"){
			historyperiod = snapshot.val();	
			newfirebase.child("contract").update({
				"historyperiod":historyperiod
			})
		}
	})
	
	payment = firebase.database().ref().child("payment/"+id);
	payment.on("child_added", function(snapshot){
		if (snapshot.key!="balance"&&snapshot.key!= "bondWaitDue"&&snapshot.key!="recurring"){
			var date = snapshot.child("date").val();
			var desc = snapshot.child("desc").val();
			var invoice = snapshot.child("invoice").val();
			var payment= snapshot.child("payment").val();
			var list = snapshot.child("list").val();
			var refnumber = snapshot.child("refnumber").val();
			newfirebase.child("payment").push({
				"date": date,
				"desc":desc,
				"invoice":invoice,
				"payment":payment,
				"list":list,
				"refnumber":refnumber
			})
		}
		else if(snapshot.key == "balance"){
			var balance = snapshot.val();
			newfirebase.child("payment").update({
				"balance":balance
			})
		}
		else if (snapshot.key == "bondWaitDue"){
			var bondWaitDue = snapshot.val();
			newfirebase.child("payment").update({
				"bondWaitDue":bondWaitDue
			})
		}
		else if (snapshot.key == "recurring"){
			var recurring = snapshot.val();
			newfirebase.child("payment").update({
				"recurring":recurring
			})
		}
	 })
	

	setTimeout(function(){
		firebase.database().ref().child("payment/"+id).remove();
		firebase.database().ref().child("contract/"+id).remove();
		firebase.database().ref().child("tenant/"+id).remove();
		firebase.database().ref().child("tenant-room/"+id).remove();
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	
		//success notification
		$.gritter.add({
			title: 'Tenant has been deactivated',
			text: 'Tenant was successfuly be deactivated',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
		setTimeout(function(){
			window.location='home.html';
		}, 1000);
		
	}, 2000);

}

//Fungsi untuk End-Contract Tenant
function endContractModal(){
	var refNumber = $("#tenant_id").html()
	$('#endM').html("Are you sure to end contract "+refNumber+" ?");
	$('#endM').val(refNumber);
	$("#endModal").modal();
}

$("#submitEnd").click(function(){
	$('#endModal').modal('hide');
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	endContract();

})

function endContract(){
	var refNumber = $("#tenant_id").html()
	refNumb=refNumber.split(" ")
	refNumb2=refNumb[0]+refNumb[1]+refNumb[2]
	var room_id=refNumb2.substring(0,7)
	id2 = window.location.href.split('=')[1];
	id = id2.split("#")[0];
	var historyperiod=0
	newfirebase=firebase.database().ref().child("tenantendContract/"+id);
	
	
	tenant =  firebase.database().ref().child("tenant/"+id);
	tenant.once("value", function(snapshot){
		var full_name=snapshot.child("full_name").val();
		var birth_date=snapshot.child("birth_date").val();
		var cont_home=snapshot.child("cont_home").val();
		var cont_mobile=snapshot.child("cont_mobile").val();
		var email=snapshot.child("email").val();
		var id_number1=snapshot.child("id_number1").val();
		var id_number2=snapshot.child("id_number2").val();
		var id_photo1=snapshot.child("id_photo1").val();
		var id_photo2=snapshot.child("id_photo2").val();
		var id_type1=snapshot.child("id_type1").val();
		var id_type2=snapshot.child("id_type2").val();
		var kk_photo=snapshot.child("kk_photo").val();
		var los_prev=snapshot.child("los_prev").val();
		var occupation=snapshot.child("occupation").val();
		var perm_addr=snapshot.child("perm_addr").val();
		var prev_addr=snapshot.child("prev_addr").val();
		var rfl_prev=snapshot.child("rfl_prev").val();
		var tn_photo = snapshot.child("tn_photo").val();
		var addressR1=snapshot.child("references/reference_1/address").val();
		var contactR1=snapshot.child("references/reference_1/contact").val();
		var full_nameR1=snapshot.child("references/reference_1/full_name").val();
		var relationR1=snapshot.child("references/reference_1/relation").val();
		var addressR2=snapshot.child("references/reference_2/address").val();
		var contactR2=snapshot.child("references/reference_2/contact").val();
		var full_nameR2=snapshot.child("references/reference_2/full_name").val();
		var relationR2=snapshot.child("references/reference_2/relation").val();
		
		newfirebase.child("tenant").update({
			"full_name":full_name,
			"birth_date":birth_date,
			"cont_home":cont_home,
			"cont_mobile":cont_mobile,
			"email":email,
			"id_number1":id_number1,
			"id_number2":id_number2,
			"id_photo1":id_photo1,
			"id_photo2":id_photo2,
			"id_type1":id_type1,
			"id_type2":id_type2,
			"kk_photo":kk_photo,
			"los_prev":los_prev,
			"occupation":occupation,
			"perm_addr":perm_addr,
			"prev_addr":prev_addr,
			"rfl_prev":rfl_prev,
			"tn_photo":tn_photo,
			"references":{
				"reference_1":{
					"address":addressR1,
					"contact":contactR1,
					"full_name":full_nameR1,
					"relation":relationR1
				},
				"reference_2":{
					"address":addressR2,
					"contact":contactR2,
					"full_name":full_nameR2,
					"relation":relationR2
				}
			}
		})
	})
	tenantroom = firebase.database().ref().child("tenant-room/"+id);
	tenantroom.on("child_added", function(snapshot){
		var apply_date = snapshot.child("apply_date").val();
		var adjst_bond = snapshot.child("adjst_bond").val();
		var adjst_pay = snapshot.child("adjst_pay").val();
		var build_no = snapshot.child("build_no").val();
		var ctrt_opt = snapshot.child("ctrt_opt").val();
		var key_rtrn = snapshot.child("key_collection/key_rtrn").val();
		var pick_act = snapshot.child("key_collection/pick_act").val();
		var pick_est = snapshot.child("key_collection/pick_est").val();
		var key_date = snapshot.child("key_date").val();
		var pay_plan = snapshot.child("pay_plan").val();
		var prop_addr = snapshot.child("prop_addr").val();
		var ref_number = snapshot.child("ref_number").val();
		var rent_bond = snapshot.child("rent_bond").val();
		var rent_price = snapshot.child("rent_price").val();
		var start_date = snapshot.child("start_date").val();
		var stat_approve = snapshot.child("stat_approve").val();
		var stat_process = snapshot.child("stat_process").val();
		var stat_chrg_f = snapshot.child("stat_chrg_f").val();
		var stat_chrg_n = snapshot.child("stat_chrg_n").val();
		var stat_occupy = snapshot.child("stat_occupy").val();

		newfirebase.child("tenant-room").update({
			ref_number : ref_number,
			build_no : build_no,
			prop_addr : prop_addr,
			apply_date : apply_date,
			start_date : start_date,
			key_date : key_date,
			ctrt_opt : ctrt_opt,
			pay_plan : pay_plan,
			adjst_pay : adjst_pay,
			adjst_bond : adjst_bond,
			stat_approve : stat_approve,
			stat_process : stat_process,
			key_collection : {
				pick_est : pick_est,
				pick_act : pick_act,
				key_rtrn : key_rtrn
			},
			stat_occupy : stat_occupy,
			stat_chrg_f : stat_chrg_f,
			stat_chrg_n : stat_chrg_n,
			rent_price	: rent_price,
			rent_bond	: rent_bond
		})
	})
	setTimeout(function(){
		$("#contract_details").append(" Contract Ended")
		$("#end").hide()
		startDate = Date.today().toString("MM/dd/yyyy")
		endDate = Date.today().addDays(1).toString("MM/dd/yyyy")
		var refNumber = $("#tenant_id").html();
		tenantid2=$("#tenant_id").html().substring(0,9)
		tenantid3=tenantid2.split(" ")
		tenantid4=tenantid3[0]+tenantid3[1]+tenantid3[2]
		contract=firebase.database().ref().child("contract/"+id+"/"+tenantid4);
		var enddate = $("#period1").text()
		enddate2=enddate.split(" - ")[1]
		var bond=$("#bond1").text()
		var rent=$("#payment1").text()
		bond2=bond.split("to")[0]
		rent2=rent.split("paid")[0]
		payplan=rent.split("paid ")[1]
		payplan2=payplan.split(" Electricity")[0]
		bond =rem_fmoney(bond2).toString()
		rent = rem_fmoney(rent2).toString()
		if(enddate2=="Ongoing"){
			contract.push({
				"ctrt_length": "-",
				"refNumb":refNumber,
				"ctrt_type":"-",
				"bond": bond,
				"end_date":endDate,
				"start_date":startDate,
				"payPlan":payplan2,
				"rent":rent
			})
			contract.update({
				"status":"inactive"
			})
			contract.update({
				"historyperiod":++historyperiod
			})
		}else{
			contract.update({
				"status":"inactive"
			})
			contract.update({
				"historyperiod":++historyperiod
			})
		}
		
		
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	
		
		//success notification
		$.gritter.add({
			title: 'Contract was Ended ',
			text: 'Contract was successfully ended',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	}, 2000);
	
}

$("#endModal").draggable({
	handle: ".modal-header"
});
$("#nonActiveModal").draggable({
	handle: ".modal-header"
});

function extendTenant() {
	var historyperiod=0
	var status = ""
	var contract2 = firebase.database().ref().child("contract/"+id+"");
        contract2.on('child_added', function(snapshot){
            room_id=snapshot.key
						var contract4 = firebase.database().ref().child("contract/"+id+"/"+room_id+"");
						contract4.on('value', function(snapshot){
							historyperiod=snapshot.child("historyperiod").val()
							status=snapshot.child("status").val();
						})
						// contract4.on('child_added', function(snapshot){
						// 	var bond = snapshot.child("bond").val()
						// 	var ctrt_length=snapshot.child("ctrt_length").val()
						// 	var ctrt_type = snapshot.child("ctrt_type").val()
						// 	var payPlan = snapshot.child("payPlan").val()
						// 	var refNumb = snapshot.child("refNumb").val()
						// 	var rent=snapshot.child("rent").val()
						// 	var start_date = snapshot.child("start_date").val()
						// 	var end_date = snapshot.child("end_date").val()
						// })
				})
	//collect data from form
	historyperiod++;
	var refNumber = $("#tenant_id").html();
	var payPlan = $("#extendPayPlan").val();
	var bondPrice = $("#fbond").html();
	var rentPrice = $("#fprice").html();
	var startDate = $("#ExtendstartDate").html();
	var endDate2 = $("#ExtendendDate").html();
	if(endDate2=="Ongoing"){
		ctrt_length="-"
		ctrt_type="-"
	}
	else{
		ctrt_length=$("#ExtendIntendAngka").val();
		ctrt_type=$("#extendIntend").val()
	}
	if ($("#ExtendendDate").html()!="Ongoing"){
		var endDate = reformatDate2($("#ExtendendDate").html());
	}
	else{
		endDate = "Ongoing"
	}
	bondPrice2=bondPrice.split("Rp. ")[1]
	bondPrice3=bondPrice2.split(",-")[0]
	bondPrice4=bondPrice3.split(".")
	bondPrice5=""
	for (let index = 0; index < bondPrice4.length; index++) {
		bondPrice5+=bondPrice4[index]	
	}
	bondPrice6=parseInt(bondPrice5)

	rentPrice2=rentPrice.split("Rp. ")[1]
	rentPrice3=rentPrice2.split(",-")[0]
	rentPrice4=rentPrice3.split(".")
	rentPrice5=""
	for (let index = 0; index < rentPrice4.length; index++) {
		rentPrice5+=rentPrice4[index]	
	}
	
	$("#extendForm").trigger("reset");
	
	if (status=="inactive"){
		firebase.database().ref().child("tenant_endContract/"+id).remove();
	}

	tenantid2=$("#tenant_id").html().substring(0,9)
	tenantid3=tenantid2.split(" ")
	tenantid4=tenantid3[0]+tenantid3[1]+tenantid3[2]
	var contract = firebase.database().ref().child("contract/"+id+"/"+tenantid4+"");
	contract.push({
		"ctrt_length": ctrt_length,
		"refNumb":refNumber,
		"ctrt_type":ctrt_type,
		"bond": bondPrice5,
		"end_date":endDate,
		"start_date":reformatDate2(startDate),
		"payPlan":payPlan,
		"rent":rentPrice5
	})
	contract.update({
		"historyperiod":++historyperiod,
		"status":"active"
	})
	//create due on ledger
	/*
	var bondPriceInt = parseInt($("#cfbond").val());
	var rentPriceInt = parseInt($("#cfprice").val());
	ledgerList.push({
		"date":reformatDate2(startDate),
		"desc":"Bond Money Due",
		"invoice":bondPriceInt,
		"payment":null
	});
	ledgerList.push({
		"date":reformatDate2(startDate),
		"desc":"Rental Due",
		"invoice":rentPriceInt,
		"payment":null
	});
	ledgerList = sortArrayByDate(ledgerList);
	table1.clear();
	for (x in ledgerList) {
		table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
	}
	table1.draw();
	countTotalDue();
	countTotalReceived();
	countBalance();
	countTotalBalance();
	//change start date to end of contract
	$("#startDate").html($("#endDate").html());
	//reset input
	$("#extendPayPlan")
		.val("")
		.trigger("change");
	$("#extendIntend")
		.val("")
		.trigger("change");
	*/
	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
		//success notification
		$.gritter.add({
			title: 'Tenant Extended',
			text: 'Tenant was successfully extended.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	}, 1000);

}

$(document).ready(function() {
	
	// ALMOST EXPIRED LIST
	// select table to work with jquery datatables
	var table1 = $('#expiredTable').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
		"fixedHeader": true,
		"order": [[ 2,"asc" ]],
		"columnDefs": [
			{
				targets: 0,
				width: "11%",
				orderable:false,
				className: 'dt-head-center'
			},
			{
				targets: 1,
				className: 'dt-head-center'
			},
			{
				targets: 2,
				width: "10%",
				className: 'dt-head-center'
			},
			{
				targets: 3,
				width: "20%",
				className: 'dt-head-center'
			},
			{
				targets: 4,
				width: "5%",
				className: 'dt-head-center dt-body-center'
			},
			{
				targets: 5,
				width: "5%",
				className: 'dt-head-center dt-body-center'
			},
			{
				targets: 6,
				width: "5%",
				className: 'dt-head-center dt-body-center'
			},
			{
				targets: 7,
				width: "15%",
				className: 'dt-head-center'
			},
			{
				targets: 8,
				width: "12%",
				orderable:false,
				className: 'dt-head-center'
			}
		]
	});
	
	// get data from database
	var contractRef = firebase.database().ref("contract");
	var tenantRoomRef = firebase.database().ref("tenant-room");
	var tenantRef = firebase.database().ref("tenant");
	var d = new Date();
    //var todayDate = (parseInt(d.getMonth())+1)+"/"+d.getDate()+"/"+d.getFullYear();
    var todayDate = Date.today().addDays(20).toString("MM/dd/yyyy")
	var listTenant = [];
	contractRef.on('child_added', function(snapshot) {
		var tenantID = snapshot.key;
		contractRef.child(tenantID).on('child_added', function(snapshot) {
			// get tenant data
			var roomID = snapshot.key;
			contractRef.child(tenantID+"/"+roomID).on('child_added', function(snapshot) {
				if (snapshot.key != "historyperiod" && snapshot.key != "status") {
					var endDate = snapshot.child("end_date").val();
					
					if ((endDate != "Ongoing") && (date_diff_indays(todayDate,endDate) >= 0)) {
						tenantRoomRef.child(tenantID+"/"+roomID).once('value', function(snapshot) {
							var refNumFormat = snapshot.child("ref_number").val();
							var propertyAddress = shortenString(snapshot.child("prop_addr").val(),20);
							var refN = refNumFormat.split(" ");
							var refNumber = refN[0]+refN[1]+refN[2];
							var buildNo = refNumber.substring(1,3);
							var floorNo = refNumber.substring(3,5);
							var roomNo = refNumber.substring(5,7);
							tenantRef.child(tenantID).once('value', function(snapshot) {
								tenantName = snapshot.child("full_name").val();
								tenantPhone = split_ph(snapshot.child("cont_mobile").val());
								tenantObj = {
									"tenant_id":tenantID,
									"refNum":refNumber,
									"content":[refNumFormat,"<a href='tenant_details.html?id="+tenantID+"' class='pull-left'>"+tenantName+"</a>",reformatDate(endDate),propertyAddress,buildNo,floorNo,roomNo,tenantPhone,`<button id="extender" type="button" class="btn btn-xs btn-primary" title="Send email"><i class="fa fa-envelope"></i></button> `+`<button id="extender" type="button" class="btn btn-xs btn-success" title="Extend"><i class="fa fa-plus"></i></button> `+`<button id="end" type="button" class="btn btn-xs btn-danger" onclick="endContractModal()" title="End contract"><i class="fa fa-times"></i></button> `+`<button id="nonactive" type="button" class="btn btn-xs btn-warning" onclick="nonactiveModal()" title="Non-Active"><i class="fa fa-minus"></i></button>`],
								}
								listTenant.push(tenantObj);
								
								// insert data into table
								table1.clear();
								for (i=0; i<listTenant.length; i++) {
									table1.row.add(listTenant[i].content).node().id = listTenant[i].tenant_id;
								}
								table1.draw();
							});
						});
					}
				}
			});
		});
	});
	
	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}, 1000);
	
});