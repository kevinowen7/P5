//define table to work with jquery datatables
var table = $('#bledger').DataTable({
	"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
	"iDisplayLength": -1,
	"paging": false,
	"ordering": false,
	"columnDefs": [
	{
		targets: [0,1],
		width: "17%",
	},
	{
		targets: [2,3,4],
		width: "22%",
		render: $.fn.dataTable.render.number( '.', ',', 0, 'Rp. ',',-' )
	}]
});
var table1 = $('#sledger').DataTable({
	"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
	"iDisplayLength": -1,
	"paging": false,
	"ordering": false,
	"columnDefs": [
	{
		targets: [0,1],
		width: "17%",
	},
	{
		targets: [2,3,4],
		width: "22%",
		render: $.fn.dataTable.render.number( '.', ',', 0, 'Rp. ',',-' )
	}]
});

var bondList = [];
var ledgerList = [];
var bondWaitDue = 0;


function removeOptions(selectbox) {
	
    //clear select options
    for(i=selectbox.options.length-1; i>=1; i--) {
        selectbox.remove(i);
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
	outputYear = inputYear;
	return (outputMonth+"/"+outputDay+"/"+outputYear);
	
}

function reformatDate4(inputDate) {
	
	months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	inputBroke=inputDate.split("/");
	inputDay=parseInt(inputBroke[1]);
	inputMonth=parseInt(inputBroke[0]);
	inputYear=inputBroke[2];
	outputDay=inputDay;
	outputMonth=months[inputMonth-1];
	return (outputDay+"-"+outputMonth+"-"+inputYear);
	
}



function date_diff_indays(d1, d2) {
	
	var diff = Date.parse(d2) - Date.parse(d1);
	return Math.floor(diff / 86400000);
	
}

function sortArrayByDate(oldArray) {
	
	var newArray = [];
	for (i=0;i<oldArray.length;i++) {
		if (newArray.length==0) {
			newObj = {
				"date":oldArray[i].date,
				"desc":oldArray[i].desc,
				"invoice":oldArray[i].invoice,
				"payment":oldArray[i].payment
			}
			newArray[0] = newObj;
		}
		else {
			for (j=newArray.length-1;j>=0;j--) {
				if (date_diff_indays(newArray[j].date,oldArray[i].date)>=0) {
					for (k=newArray.length-1;k>=j;k--) {
						newObj = {
						"date":newArray[k].date,
						"desc":newArray[k].desc,
						"invoice":newArray[k].invoice,
						"payment":newArray[k].payment
						}
						newArray[k+1] = newObj;
					}
					newObj2 = {
					  "date":oldArray[i].date,
					  "desc":oldArray[i].desc,
					  "invoice":oldArray[i].invoice,
					  "payment":oldArray[i].payment
					}
					newArray[j+1] = newObj2;
					break
				}
				else {
					if (j==0) {
						for (k=newArray.length-1;k>=j;k--) {
							newObj = {
							  "date":newArray[k].date,
							  "desc":newArray[k].desc,
							  "invoice":newArray[k].invoice,
							  "payment":newArray[k].payment
							}
							newArray[k+1] = newObj;
						}
						newObj2 = {
							"date":oldArray[i].date,
							"desc":oldArray[i].desc,
							"invoice":oldArray[i].invoice,
							"payment":oldArray[i].payment
						}
						newArray[j] = newObj2;
						break
					}
				}
			}
		}
	}
	return newArray;
	
}

function pembulatan(input) {
	
	return (Math.round((parseInt(input)/100)))*100;
	
}

function countTotalBondDue() {
	
	var totalBondDue = 0;
	for (i=0;i<table.rows().count();i++) {
		var bondDue = table.row(i).data()[2];
		if (bondDue != null) {
			totalBondDue = totalBondDue+bondDue;
		}
	}
	$("#bDueTot").html(get_fmoney(totalBondDue));
	
}

function countTotalBondReceived() {
	
	var totalBondReceived = 0;
	for (i=0;i<table.rows().count();i++) {
		var bondReceived = table.row(i).data()[3];
		if (bondReceived != null) {
			totalBondReceived = totalBondReceived+bondReceived;
		}
	}
	$("#bReceivedTot").html(get_fmoney(totalBondReceived));
	
}

function recurringPage(){
	var rent=$("#payment1").text()
	rent2=rent.split("paid")[0]
	payplan=rent.split("paid ")[1]
	payplan2=payplan.split(" Electricity")[0]
	rent = rem_fmoney(rent2).toString()
	window.location='tenant_recurring.html?id='+id+'/='+rent+'/='+payplan2;
}

function countBondBalance() {
	
	var balance = 0;
	for (i=0;i<table.rows().count();i++) {
		var bondDue = table.row(i).data()[2];
		if (bondDue != null) {
			balance = balance - bondDue;
		} else {
			var bondReceived = table.row(i).data()[3];
			balance = balance + bondReceived;
		}
		if (balance < 0) {
			table.cell(i,4).data("("+get_fmoney(Math.abs(balance))+")");
		} else {
			table.cell(i,4).data(get_fmoney(balance));
		}
	}
	
}

function countTotalBondBalance() {
	
	var totalBondDue = rem_fmoney($("#bDueTot").html());
	var totalBondReceived = rem_fmoney($("#bReceivedTot").html());
	var totalBondBalance = totalBondReceived - totalBondDue;
	if (totalBondBalance < 0) {
		$("#bBalanceTot").html("("+get_fmoney(Math.abs(totalBondBalance))+")");
	} else {
		$("#bBalanceTot").html(get_fmoney(totalBondBalance));
	}
	
}

function countTotalDue() {
	
	var totalDue = 0;
	for (i=0;i<table1.rows().count();i++) {
		var ledgerDue = table1.row(i).data()[2];
		if (ledgerDue != null) {
			totalDue = totalDue+ledgerDue;
		}
	}
	$("#lDueTot").html(get_fmoney(totalDue));
	
}

function countTotalReceived() {
	
	var totalReceived = 0;
	for (i=0;i<table1.rows().count();i++) {
		var ledgerReceived = table1.row(i).data()[3];
		if (ledgerReceived != null) {
			totalReceived = totalReceived+ledgerReceived;
		}
	}
	$("#lReceivedTot").html(get_fmoney(totalReceived));
	
}

function countBalance() {
	
	var balance = 0;
	for (i=0;i<table1.rows().count();i++) {
		var ledgerDue = table1.row(i).data()[2];
		if (ledgerDue != null) {
			balance = balance - ledgerDue;
		} else {
			var ledgerReceived = table1.row(i).data()[3];
			balance = balance + ledgerReceived;
		}
		if (balance < 0) {
			table1.cell(i,4).data("("+get_fmoney(Math.abs(balance))+")");
		} else {
			table1.cell(i,4).data(get_fmoney(balance));
		}
	}
	
}

function countTotalBalance() {
	
	var totalDue = rem_fmoney($("#lDueTot").html());
	var totalReceived = rem_fmoney($("#lReceivedTot").html());
	var totalBalance = totalReceived - totalDue;
	if (totalBalance < 0) {
		$("#lBalanceTot").html("("+get_fmoney(Math.abs(totalBalance))+")");
	} else {
		$("#lBalanceTot").html(get_fmoney(totalBalance));
	}
	
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
		
		firebase.database().ref("tenant-room").once('value', function(snapshot) {
			var totalTenant = parseInt(snapshot.child("total_tenant").val()) - 1;
			firebase.database().ref("tenant-room").update({
				total_tenant : totalTenant
			}).then(function onSuccess(res) {
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
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			});
		});
		
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

function addInvoice() {
	// ref number
	refNumberHtml = $("#tenant_id").html();
	refNumberHtml=refNumberHtml.split(" ");
	refNumberHtml=refNumberHtml[0]+refNumberHtml[1]+refNumberHtml[2]
	var building_id = refNumberHtml.substring(1,3);
	//collect data from invoice form
	var invoiceDate = reformatDate2($("#invoiceDate").val());
	var dueDate = $("#invoiceDate").val();
	var invoiceAmount = rem_moneydot($("#invoiceAmount").val());
	var invoiceDetails = $("#invoiceDetails").val();
	var invoiceDetailsOther = $("#invoiceDetailsOther").val();
	reportRef = firebase.database().ref().child("reportAccount");
	paymentRef = firebase.database().ref().child("payment/"+id);
	if (invoiceDetails == "rentdue") {
		var invoiceDetailsFull = "Rental Due";
	} else if (invoiceDetails == "finedue") {
		var invoiceDetailsFull = "Fine Due";
	} else if (invoiceDetails == "transfer") {
		var invoiceDetailsFull = "Bond Money Transfer";
	} else if (invoiceDetails == "refund") {
		var invoiceDetailsFull = "Bond Money Refund";
	} else {
		var invoiceDetailsFull = "Other Due - "+invoiceDetailsOther;
	}
	var invoiceRecurrent = $("#invoiceRecurrent").val(); 

	overdueRef.once('value', function(snapshot){
		prevDue = snapshot.child("balance").val()
		if (prevDue== null){
			var trRef1 = firebase.database().ref().child("tenant-room/"+id);
			trRef1.once('child_added', function(snapshot) {
				var bondPrice=parseInt(snapshot.child("rent_bond").val());
				var rent = parseInt(snapshot.child("rent_price").val());
				overdueRef.set({
					"balance": -bondPrice-rent-parseInt(invoiceAmount),
					"date_due": invoiceDate
				})
		})
		}else{
			if (prevDue>-1){
				overdueRef.update({
					"balance": parseInt(prevDue) - parseInt(invoiceAmount),
					"date_due": invoiceDate
				})
			}else{
				overdueRef.update({
					"balance": parseInt(prevDue) - parseInt(invoiceAmount)
				})
			}			
		}
	})

	paymentRef.once('value', function(snapshot){
		var prevBalance = parseInt(snapshot.child("balance").val())
		var prevInvoice = snapshot.child("due").val()
			if (prevInvoice==null){
				paymentRef.set({
					"balance": (prevBalance - invoiceAmount).toString(),
					"due":parseInt(invoiceAmount)
				})
			}
			else{
				paymentRef.update({
					"balance": (prevBalance - invoiceAmount).toString(),
					"due":parseInt(invoiceAmount)+prevInvoice
				})
			}
		
	
	})

	//standard invoice
	paymentRef.push({
		"date":invoiceDate,
		"desc":invoiceDetailsFull,
		"invoice":invoiceAmount,
		"payment":null,
		"refnumber":refNumberHtml,
		"list":"ledgerList"
	});
	
	var d = new Date();
	var thisDay = d.getDate();
	if (parseInt(thisDay) < 10) {
		thisDay = "0"+thisDay;
	}
	var thisMonth = d.getMonth() + 1;
	if (parseInt(thisMonth) < 10) {
		thisMonth = "0"+thisMonth;
	}
	var thisYear = d.getFullYear();
	var thisDate = thisMonth+"/"+thisDay+"/"+thisYear;
	
	reportRef.child(building_id).push({
		"due":invoiceAmount,
		"receive": 0,
		"date":invoiceDate,
		"inputDate": thisDate
	})

	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
		//reset invoice form
		$('#addInvoiceForm').trigger("reset");
		$("#invoiceDetailsOtherBlock").hide();
		$("#invoiceRecurrentBlock").show();
		removeOptions(document.getElementById("invoiceDetails"));
		var optionElement1 = document.createElement("option");
		var optionElement2 = document.createElement("option");
		var optionElement3 = document.createElement("option");
		optionElement1.value = "rentdue";
		optionElement1.innerHTML = "Rental Due";
		optionElement2.value = "finedue";
		optionElement2.innerHTML = "Fine Due";
		optionElement3.value = "otherdue";
		optionElement3.innerHTML = "Other Due";
		document.getElementById("invoiceDetails").appendChild(optionElement1);
		document.getElementById("invoiceDetails").appendChild(optionElement2);
		document.getElementById("invoiceDetails").appendChild(optionElement3);
		//success notification
		$.gritter.add({
			title: 'Invoice Added',
			text: 'Invoice was successfully added to the database.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	}, 1000);
	
}

function addPayment() {
	
	function resetPaymentForm() {
		//reset payment form
		$('#addPaymentForm').trigger("reset");
		$("#paymentDetailsOtherBlock").hide();
		removeOptions(document.getElementById("paymentDetails"));
		var optionElement1 = document.createElement("option");
		var optionElement2 = document.createElement("option");
		var optionElement3 = document.createElement("option");
		var optionElement4 = document.createElement("option");
		optionElement1.value = "rentpay";
		optionElement1.innerHTML = "Rental Payment";
		optionElement2.value = "finepay";
		optionElement2.innerHTML = "Fine Payment";
		optionElement3.value = "bondpay";
		optionElement3.innerHTML = "Bond Money Payment";
		optionElement4.value = "otherpay";
		optionElement4.innerHTML = "Other Payment";
		document.getElementById("paymentDetails").appendChild(optionElement1);
		document.getElementById("paymentDetails").appendChild(optionElement2);
		document.getElementById("paymentDetails").appendChild(optionElement3);
		document.getElementById("paymentDetails").appendChild(optionElement4);
	}
	
	// ref number
	var refNumberHtml = $("#tenant_id").html();
	var refNumberHtml=refNumberHtml.split(" ");
	var refNumberHtml=refNumberHtml[0]+refNumberHtml[1]+refNumberHtml[2];
	var building_id = refNumberHtml.substring(1,3);
	
	//init firebase
	var paymentRef = firebase.database().ref().child("payment/"+id);
	var overdueRef = firebase.database().ref().child("overdue/"+id);
	var reportRef = firebase.database().ref().child("reportAccount");
	
	//collect data from payment form
	var paymentDate = reformatDate2($("#paymentDate").val());
	var payDate = $("#paymentDate").val();
	var paymentAmount = parseInt(rem_moneydot($("#paymentAmount").val()));
	var paymentDetails = $("#paymentDetails").val();
	var paymentDetailsOther = $("#paymentDetailsOther").val();
	if (paymentDetails == "rentpay") {
		var paymentDetailsFull = "Rental Payment";
	} else if (paymentDetails == "finepay") {
		var paymentDetailsFull = "Fine Payment";
	} else if (paymentDetails == "bondpay") {
		var paymentDetailsFull = "Bond Money Payment";
	} else if (paymentDetails == "transfer") {
		var paymentDetailsFull = "Bond Money Transfer";
	} else if (paymentDetails == "refund") {
		var paymentDetailsFull = "Bond Money Refund";
	} else {
		var paymentDetailsFull = "Other Payment - "+paymentDetailsOther;
	}
	stage1();
	
	function stage1() {
		overdueRef.once('value', function(snapshot){
			var prevDue = snapshot.child("balance").val();
			if (prevDue==null) {
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
					var bondPrice=snapshot.child("rent_bond").val();
					var rent = snapshot.child("rent_price").val();
					var startDate = snapshot.child("start_date").val();
					overdueRef.update({
						"balance":(paymentAmount-bondPrice-rent),
						"date_due": startDate
					}).then(function onSuccess(res) {
						stage2();
					}).catch(function onError(err) {
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
						//error notification
						$.gritter.add({
							title: 'Error Stage 1a',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
					});
				});
			} else {
				overdueRef.update({
					"balance": parseInt(prevDue) + paymentAmount,
				}).then(function onSuccess(res) {
					stage2();
				}).catch(function onError(err) {
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
					//error notification
					$.gritter.add({
						title: 'Error Stage 1b',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					});
				});
			}
		});
	}
	
	function stage2() {
		paymentRef.once('value', function(snapshot){
			if (snapshot.child("balance").val()==null){
				var trRef1 = firebase.database().ref().child("tenant-room/"+id);
				trRef1.once('child_added', function(snapshot) {
					var bondPrice=snapshot.child("rent_bond").val();
					var rent = snapshot.child("rent_price").val()
					
					paymentRef.update({
						"balance": (paymentAmount-bondPrice-rent).toString(),
						"receive": paymentAmount
					}).then(function onSuccess(res) {
						stage3();
					}).catch(function onError(err) {
						//stop loading icon
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
						//error notification
						$.gritter.add({
							title: 'Error Stage 2a',
							text: err.code+" : "+err.message,
							image: './img/bell.png',
							sticky: false,
							time: 3500,
							class_name: 'gritter-custom'
						});
					});
				});
			} else {
				var prevBalance = parseInt(snapshot.child("balance").val());
				var prevRec =parseInt(snapshot.child("receive").val());
				paymentRef.update({
					"balance": (prevBalance + paymentAmount).toString(),
					"receive": paymentAmount+prevRec
				}).then(function onSuccess(res) {
					stage3();
				}).catch(function onError(err) {
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
					//error notification
					$.gritter.add({
						title: 'Error Stage 2b',
						text: err.code+" : "+err.message,
						image: './img/bell.png',
						sticky: false,
						time: 3500,
						class_name: 'gritter-custom'
					});
				});
			}
		});
	}
	
	function stage3() {
		var d = new Date();
		var thisDay = d.getDate();
		if (parseInt(thisDay) < 10) {
			thisDay = "0"+thisDay;
		}
		var thisMonth = d.getMonth() + 1;
		if (parseInt(thisMonth) < 10) {
			thisMonth = "0"+thisMonth;
		}
		var thisYear = d.getFullYear();
		var thisDate = thisMonth+"/"+thisDay+"/"+thisYear;
		
		reportRef.child(building_id).push({
			"receive":paymentAmount,
			"due": 0,
			"date": paymentDate,
			"inputDate": thisDate
		}).then(function onSuccess(res) {
			stage4();
		}).catch(function onError(err) {
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
			//error notification
			$.gritter.add({
				title: 'Error Stage 3',
				text: err.code+" : "+err.message,
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
		});
	}
	
	function stage4() {
		//start set payment
		var trRef1 = firebase.database().ref().child("tenant-room/"+id);
		trRef1.once('child_added', function(snapshot) {
			//mengambil bond price
			var bondPrice=snapshot.child("rent_bond").val();
			
			paymentRef.once('value', function(snapshot) {
				//mengambil bondWaitDue
				var bondWaitDue=snapshot.child("bondWaitDue").val();
				//jika belum selesai pembayaran bondwaitdue
				if (bondWaitDue==null){
					bondWaitDue = bondPrice;
				} else {
					bondWaitDue = bondWaitDue;
				}
				if (paymentDetails == "bondpay") { //bond money payment
					if (bondWaitDue-paymentAmount < 0) {
						if (bondWaitDue != 0) {
							var bondLeft = paymentAmount-bondWaitDue;
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Deposit",
								"invoice":null,
								"payment":bondWaitDue,
								"refnumber":refNumberHtml,
								"list":"bondList"
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":paymentDetailsFull,
									"invoice":null,
									"payment":bondWaitDue,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									if (bondLeft != 0) {
										paymentRef.push({
											"date":paymentDate,
											"desc":"Rental Payment",
											"invoice":null,
											"payment":bondLeft,
											"refnumber":refNumberHtml,
											"list":"ledgerList"
										}).then(function onSuccess(res) {
											bondWaitDue = 0;
											//set bond wait due
											paymentRef.update({
												"bondWaitDue" : bondWaitDue
											}).then(function onSuccess(res) {
												stage5();
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-111d',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-111c',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									} else {									
										bondWaitDue = 0;
										//set bond wait due
										paymentRef.update({
											"bondWaitDue" : bondWaitDue
										}).then(function onSuccess(res) {
											stage5();
										}).catch(function onError(err) {
											//stop loading icon
											$("#cover-spin").fadeOut(250, function() {
												$(this).hide();
											});
											//error notification
											$.gritter.add({
												title: 'Error Stage 4-111d',
												text: err.code+" : "+err.message,
												image: './img/bell.png',
												sticky: false,
												time: 3500,
												class_name: 'gritter-custom'
											});
										});
									}
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-111b',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-111a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						} else {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Rental Payment",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							}).then(function onSuccess(res) {
								stage5();
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-112',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}
					} else {
						bondWaitDue -= paymentAmount;
						//set bond wait due
						paymentRef.update({
							"bondWaitDue" : bondWaitDue
						}).then(function onSuccess(res) {
							paymentRef.push({
								"date":paymentDate,
								"desc":"Bond Money Deposit",
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"bondList"
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":paymentDetailsFull,
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-12c',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-12b',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-12a',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
						});
					}
				} else if (paymentDetails == "transfer") { //bond money transfer
					if (bondWaitDue > 0) {
						if (bondWaitDue-paymentAmount < 0) {
							if (bondWaitDue != 0) {
								var bondLeft = paymentAmount-bondWaitDue;
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":bondWaitDue,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										if (bondLeft != 0) {
											paymentRef.push({
												"date":paymentDate,
												"desc":"Rental Payment",
												"invoice":null,
												"payment":bondLeft,
												"refnumber":refNumberHtml,
												"list":"ledgerList"
											}).then(function onSuccess(res) {
												bondWaitDue = 0;
												//set bond wait due
												paymentRef.update({
													"bondWaitDue" : bondWaitDue
												}).then(function onSuccess(res) {
													stage5();
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-2111d',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-2111c',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										} else {
											bondWaitDue = 0;
											//set bond wait due
											paymentRef.update({
												"bondWaitDue" : bondWaitDue
											}).then(function onSuccess(res) {
												stage5();
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-2111d',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										}
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-2111b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-2111a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							} else {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-2112',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}
						} else {
							bondWaitDue -= paymentAmount;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":paymentAmount,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										stage5();
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-212c',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-212b',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-212a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}
					} else {
						paymentRef.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":paymentAmount,
							"payment":null,
							"refnumber":refNumberHtml,
							"list":"bondList"
						}).then(function onSuccess(res) {
							paymentRef.push({
								"date":paymentDate,
								"desc":paymentDetailsFull,
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							}).then(function onSuccess(res) {
								stage5();
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-22b',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-22a',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
						});
					}
				} else if (paymentDetails == "refund") { //bond money refund
					if (bondWaitDue > 0) {
						if (bondWaitDue-paymentAmount < 0) {
							if (bondWaitDue != 0) {
								var bondLeft = paymentAmount-bondWaitDue;
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":bondWaitDue,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										if (bondLeft != 0) {
											paymentRef.push({
												"date":paymentDate,
												"desc":"Rental Payment",
												"invoice":null,
												"payment":bondLeft,
												"refnumber":refNumberHtml,
												"list":"ledgerList"
											}).then(function onSuccess(res) {
												bondWaitDue = 0;
												//set bond wait due
												paymentRef.update({
													"bondWaitDue" : bondWaitDue
												}).then(function onSuccess(res) {
													stage5();
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-3111d',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-3111c',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										} else {
											bondWaitDue = 0;
											//set bond wait due
											paymentRef.update({
												"bondWaitDue" : bondWaitDue
											}).then(function onSuccess(res) {
												stage5();
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-3111d',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										}
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-3111b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-3111a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							} else {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-3112',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}
						} else {
							bondWaitDue -= paymentAmount;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":paymentAmount,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										stage5();
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-312c',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-312b',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-312a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}
					} else {
						paymentRef.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":paymentAmount,
							"payment":null,
							"refnumber":refNumberHtml,
							"list":"bondList"
						}).then(function onSuccess(res) {
							paymentRef.push({
								"date":paymentDate,
								"desc":paymentDetailsFull,
								"invoice":null,
								"payment":paymentAmount,
								"refnumber":refNumberHtml,
								"list":"ledgerList"
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Withdraw",
									"invoice":paymentAmount,
									"payment":null,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-32c',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-32b',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-32a',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
						});
					}
				} else { //other payment
					if (bondWaitDue > 0) {
						if (bondWaitDue-paymentAmount < 0) {
							if (bondWaitDue != 0) {
								var bondLeft = paymentAmount-bondWaitDue;
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":bondWaitDue,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":bondWaitDue,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										if (bondLeft != 0) {
											paymentRef.push({
												"date":paymentDate,
												"desc":"Rental Payment",
												"invoice":null,
												"payment":bondLeft,
												"refnumber":refNumberHtml,
												"list":"ledgerList"
											}).then(function onSuccess(res) {
												bondWaitDue = 0;
												//set bond wait due
												paymentRef.update({
													"bondWaitDue" : bondWaitDue
												}).then(function onSuccess(res) {
													stage5();
												}).catch(function onError(err) {
													//stop loading icon
													$("#cover-spin").fadeOut(250, function() {
														$(this).hide();
													});
													//error notification
													$.gritter.add({
														title: 'Error Stage 4-4111d',
														text: err.code+" : "+err.message,
														image: './img/bell.png',
														sticky: false,
														time: 3500,
														class_name: 'gritter-custom'
													});
												});
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-4111c',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										} else {
											bondWaitDue = 0;
											//set bond wait due
											paymentRef.update({
												"bondWaitDue" : bondWaitDue
											}).then(function onSuccess(res) {
												stage5();
											}).catch(function onError(err) {
												//stop loading icon
												$("#cover-spin").fadeOut(250, function() {
													$(this).hide();
												});
												//error notification
												$.gritter.add({
													title: 'Error Stage 4-4111d',
													text: err.code+" : "+err.message,
													image: './img/bell.png',
													sticky: false,
													time: 3500,
													class_name: 'gritter-custom'
												});
											});
										}
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-4111b',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-4111a',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							} else {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Rental Payment",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"ledgerList"
								}).then(function onSuccess(res) {
									stage5();
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-4112',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}
						} else {
							bondWaitDue -= paymentAmount;
							//set bond wait due
							paymentRef.update({
								"bondWaitDue" : bondWaitDue
							}).then(function onSuccess(res) {
								paymentRef.push({
									"date":paymentDate,
									"desc":"Bond Money Deposit",
									"invoice":null,
									"payment":paymentAmount,
									"refnumber":refNumberHtml,
									"list":"bondList"
								}).then(function onSuccess(res) {
									paymentRef.push({
										"date":paymentDate,
										"desc":"Bond Money Payment",
										"invoice":null,
										"payment":paymentAmount,
										"refnumber":refNumberHtml,
										"list":"ledgerList"
									}).then(function onSuccess(res) {
										stage5();
									}).catch(function onError(err) {
										//stop loading icon
										$("#cover-spin").fadeOut(250, function() {
											$(this).hide();
										});
										//error notification
										$.gritter.add({
											title: 'Error Stage 4-412c',
											text: err.code+" : "+err.message,
											image: './img/bell.png',
											sticky: false,
											time: 3500,
											class_name: 'gritter-custom'
										});
									});
								}).catch(function onError(err) {
									//stop loading icon
									$("#cover-spin").fadeOut(250, function() {
										$(this).hide();
									});
									//error notification
									$.gritter.add({
										title: 'Error Stage 4-412b',
										text: err.code+" : "+err.message,
										image: './img/bell.png',
										sticky: false,
										time: 3500,
										class_name: 'gritter-custom'
									});
								});
							}).catch(function onError(err) {
								//stop loading icon
								$("#cover-spin").fadeOut(250, function() {
									$(this).hide();
								});
								//error notification
								$.gritter.add({
									title: 'Error Stage 4-412a',
									text: err.code+" : "+err.message,
									image: './img/bell.png',
									sticky: false,
									time: 3500,
									class_name: 'gritter-custom'
								});
							});
						}
					} else {
						paymentRef.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":paymentAmount,
							"refnumber":refNumberHtml,
							"list":"ledgerList"
						}).then(function onSuccess(res) {
							stage5();
						}).catch(function onError(err) {
							//stop loading icon
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
							//error notification
							$.gritter.add({
								title: 'Error Stage 4-42',
								text: err.code+" : "+err.message,
								image: './img/bell.png',
								sticky: false,
								time: 3500,
								class_name: 'gritter-custom'
							});
						});
					}
				}

				/* //bond money payment
				if ($("#paymentBond").prop("checked")) {
					//bond money ledger
					if (paymentDetails == "bondpay") { //payment
						bondList.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount
						});
					} else { //transfer & refund
						bondList.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":paymentAmount,
							"payment":null
						});
					}
					bondList = sortArrayByDate(bondList);
					table.clear();
					for (x in bondList) {
						table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
					}
					table.draw();
					countTotalBondDue();
					countTotalBondReceived();
					countBondBalance();
					countTotalBondBalance();
					//standard ledger
					if (paymentDetails == "refund") { //refund
						ledgerList.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":paymentAmount
						});
						ledgerList.push({
							"date":paymentDate,
							"desc":"Bond Money Withdraw",
							"invoice":paymentAmount,
							"payment":null
						});
					} else { //transfer & payment
						ledgerList.push({
							"date":paymentDate,
							"desc":paymentDetailsFull,
							"invoice":null,
							"payment":paymentAmount
						});
					}
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
				//standard payment
				} else {
					if (paymentDetails == "bondpay") { //payment
						bondList.push({
							"date":paymentDate,
							"desc":"Bond Money Deposit",
							"invoice":null,
							"payment":paymentAmount
						});
						bondList = sortArrayByDate(bondList);
						table.clear();
						for (x in bondList) {
							table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
						}
						table.draw();
						countTotalBondDue();
						countTotalBondReceived();
						countBondBalance();
						countTotalBondBalance();
					}
					ledgerList.push({
						"date":paymentDate,
						"desc":paymentDetailsFull,
						"invoice":null,
						"payment":paymentAmount
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
				} */
			});
		});
	}
	
	function stage5() {
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
		resetPaymentForm();
		//success notification
		$.gritter.add({
			title: 'Payment Added',
			text: 'Payment was successfully added to the database.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
	}
}

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


function startEdit(){
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	$("#historyTenant").hide();
	$("#historyTenantEdt").show();
	//fill name and refnumber from database
	var tenantRef = firebase.database().ref().child("tenant/"+id);
	tenantRef.once('value', function(snapshot) {
		// get name,dll from database
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
		// get data ref 1
		reftenantRef1=tenantRef.child("references/reference_1");
		reftenantRef1.once('value', function(snapshot) {
			var addressR1=snapshot.child("address").val();
			var contactR1=snapshot.child("contact").val();
			var full_nameR1=snapshot.child("full_name").val();
			var relationR1=snapshot.child("relation").val();
			
			// get data ref 2
			reftenantRef2=tenantRef.child("references/reference_2");
			reftenantRef2.once('value', function(snapshot) {
				var addressR2=snapshot.child("address").val();
				var contactR2=snapshot.child("contact").val();
				var full_nameR2=snapshot.child("full_name").val();
				var relationR2=snapshot.child("relation").val();
				
				
				$("#afname_edt").val(full_name);
				$("#email_edt").val(email);
				//jika data bukan dummy maka ini data dari firebase
				if (full_name!=null){
					$("#aphome_edt").val(cont_home);
					$("#apmobile_edt").val(cont_mobile);
					$("#aadstreet_edt").val(perm_addr.split(", ")[0]);
					$("#aadcity_edt").val(perm_addr.split(", ")[1]);
					$("#aadprov_edt").val(perm_addr.split(", ")[2].split(" ")[0]);
					$("#aadzip_edt").val(perm_addr.split(", ")[2].split(" ")[1]);
					$("#bdate_edt").val(reformatDate4(birth_date));
					$("#occupy_edt").val(occupation);
					//reference 1
					$("#r1fname_edt").val(full_nameR1);
					$("#r1rel_edt").val(relationR1);
					$("#r1adstreet_edt").val(addressR1);
					$("#r1p_edt").val(contactR1);
					//reference 2
					$("#r2fname_edt").val(full_nameR2);
					$("#r2rel_edt").val(relationR2);
					$("#r2adstreet_edt").val(addressR2);
					$("#r2p_edt").val(contactR2);
					//stop loading icon
					$("#cover-spin").fadeOut(250, function() {
						$(this).hide();
					});
				}
			});
		});
	});
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function doneEdit(){
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	})
	$("#historyTenant").show();
	$("#historyTenantEdt").hide();
	
	//validasi email
	if (isEmail($("#email_edt").val())){
		var tenantRef = firebase.database().ref().child("tenant/"+id);
		tenantRef.update({
			full_name : $("#afname_edt").val(),
			birth_date : reformatDate3($("#bdate_edt").val()),
			occupation : $("#occupy_edt").val(),
			perm_addr : $("#aadstreet_edt").val()+", "+$("#aadcity_edt").val()+", "+$("#aadprov_edt").val()+" "+$("#aadzip_edt").val(),
			email : $("#email_edt").val(),
			cont_home : $("#aphome_edt").val(),
			cont_mobile : $("#apmobile_edt").val(),
			references : {
				reference_1 : {
					full_name : $("#r1fname_edt").val(),
					relation : $("#r1rel_edt").val(),
					address : $("#r1adstreet_edt").val(),
					contact : $("#r1p_edt").val()
				},
				reference_2 : {
					full_name : $("#r2fname_edt").val(),
					relation : $("#r2rel_edt").val(),
					address : $("#r2adstreet_edt").val(),
					contact : $("#r2p_edt").val()
				}
			}
		}).then(function onSuccess(res) {
			//error notification
			$.gritter.add({
				title: 'Success Update Data Tenant',
				text: "Berhasil Update Tenant "+id,
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			fillTenantData();
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		}).catch(function onError(err) {
			//error notification
			$.gritter.add({
				title: 'Error Update Data Tenant',
				text: err.code+" : "+err.message,
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		});
	} else {
		//error notification
		$.gritter.add({
			title: 'Masukan Email yang Valid',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
	}
	
}

var tenantNames = [];
function fillTenantData(){
	//fill name and refnumber from database
	var tenantRef = firebase.database().ref().child("tenant/"+id);
	tenantRef.once('value', function(snapshot) {
		// get name,dll from database
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
		// get data ref 1
		reftenantRef1=tenantRef.child("references/reference_1");
		reftenantRef1.once('value', function(snapshot) {
			var addressR1=snapshot.child("address").val();
			var contactR1=snapshot.child("contact").val();
			var full_nameR1=snapshot.child("full_name").val();
			var relationR1=snapshot.child("relation").val();
			// get data ref 2
			reftenantRef2=tenantRef.child("references/reference_2");
			reftenantRef2.once('value', function(snapshot) {
				var addressR2=snapshot.child("address").val();
				var contactR2=snapshot.child("contact").val();
				var full_nameR2=snapshot.child("full_name").val();
				var relationR2=snapshot.child("relation").val();
				
				// check data pada list tenantname
				for (i=0;i<(tenantNames.length);++i){
					if (tenantNames[i].tenantid == id){
						label = tenantNames[i].label;
						var refnumber = tenantNames[i].refnumber;
					}
					//redirect from accounting building
					if ((tenantNames[i].tenantid)+"#ledger" == id2) {
						$("#ledger").addClass("in active")
						$("#tenant").removeClass("in active")
						$("#tabtenant").removeClass("active")
						$("#tabledger").addClass("active")
						label = tenantNames[i].label;
						var refnumber = tenantNames[i].refnumber;
					}
				}
				//check tenant exist
				if (label== null) {	
					window.alert("Tenant doesn't exist");
					window.location="tenant_main.html";
				}
				
				
				// fill data from firebase to html
				refnumber = refnumber.split("")
				$("#tenant_name").html(label);
				$("#tenant_id").html(refnumber[0]+refnumber[1]+refnumber[2]+" "+refnumber[3]+refnumber[4]+refnumber[5]+" "+refnumber[6]+refnumber[7]+refnumber[8]);
				$("#afname").html(label);
				$("#email").html(email);
				$("#extendBuildNo").html(refnumber[1]+refnumber[2]);
				$("#extendFloorNo").html(refnumber[3]+refnumber[4]);
				$("#extendRoomNo").html(refnumber[5]+refnumber[6]);
				//jika data bukan dummy maka ini data dari firebase
				if (full_name!=null){
					$("#aphome").html(cont_home);
					$("#apmobile").html(cont_mobile);
					$("#aadstreet").html(perm_addr.split(", ")[0]);
					$("#aadcity").html(perm_addr.split(", ")[1]);
					$("#aadprov").html(perm_addr.split(", ")[2].split(" ")[0]);
					$("#aadzip").html(perm_addr.split(", ")[2].split(" ")[1]);
					$("#bdate").html(reformatDate(birth_date));
					$("#idtype1").html(id_type1+" #"+id_number1);
					$("#idtype2").html(id_type2+" #"+id_number2);
					$("#occupy").html(occupation);
					//reference 1
					$("#r1fname").html(full_nameR1);
					$("#r1rel").html(relationR1);
					$("#r1adstreet").html(addressR1);
					$("#r1p").html(contactR1);
					//reference 2
					$("#r2fname").html(full_nameR2);
					$("#r2rel").html(relationR2);
					$("#r2adstreet").html(addressR2);
					$("#r2p").html(contactR2);
				}
			});
		});
	});
}

$(window).scroll(function(){
	if ($(this).scrollTop() > 350) {
		$('#btnpayin').addClass('fixed');
	} else {
		$('#btnpayin').removeClass('fixed');
	}
});
$(document).ready(function() {
	// invoice and payment scroll
	/* window.onscroll = function() {
		myFunction()
	};
	var elemelon = $("#btnpayin");
	var position = elemelon.position();
	var sticky = position.top;
	alert(sticky);
	function myFunction() {
		if (window.pageYOffset > 280) {
			elemelon.addClass("sticky");
		} else {
			elemelon.removeClass("sticky");
		}
	} */
	//start
	id2 = window.location.href.split('=')[1];
	id = id2.split("#")[0];
	refNumberHtml = $("#tenant_id").html();
	var building_id = refNumberHtml.substring(1,3);
	bondp=0
	rentp=0
	var historyperiod = 0
	var status = ""
	var contract = firebase.database().ref().child("contract/"+id+"");
	paymentRef = firebase.database().ref().child("payment/"+id);
	overdueRef = firebase.database().ref().child("overdue/"+id);
	reportRef = firebase.database().ref().child("reportAccount");
	setTimeout(() => {
		var due = $("#lDueTot").text()
		var receive = $("#lReceivedTot").text()
		var balance = $("#lBalanceTot").text()
		due = due.split("Rp. ")
		due = due[1].split(".").join("")
		due = due.split(",-")
		due = parseInt(due[0])
		receive = receive.split("Rp. ")
		receive = receive[1].split(".").join("")
		receive = receive.split(",-")
		receive = parseInt(receive[0])
		balance = balance.split("Rp. ")
		balance = balance[1].split(".").join("")
		balance = balance.split(",-")
		if (balance[1]==")"){
			balance = "-"+balance[0]
		}else{
			balance = balance[0]
		}
		
		paymentRef.once('value', function(snapshot){
			paymentRef.update({
				"balance": balance,
				"receive": receive,
				"due": due
			})	
		})
	}, 3000);
	contract.on("child_added", function(snapshot){
		room_id=snapshot.key
		var contract2 = firebase.database().ref().child("contract/"+id+"/"+room_id+"");
		contract2.on('value',function(snapshot){
			historyperiod=snapshot.child("historyperiod").val()
			status=snapshot.child("status").val()
		})
	})
	tenantcontract={}
	contract.on('child_added', function(snapshot){
		room_id=snapshot.key
		var contract2 = firebase.database().ref().child("contract/"+id+"/"+room_id+"");
		contract2.on('child_added', function(snapshot){
			if (snapshot.key!="status" && snapshot.key !="historyperiod"){
				tenantcontract[id]=snapshot.val()
			console.log(snapshot.val())
			}
			
		})
	contract2.on('child_added', function(snapshot){
		var payPlan = snapshot.child("payPlan").val();
		var bondPrice = get_fmoney(snapshot.child("bond").val())
		var rentPrice = get_fmoney(snapshot.child("rent").val())
		var startDate = reformatDate(snapshot.child("start_date").val())
			
		if (snapshot.child("end_date").val()!="Ongoing"){
			var endDate = reformatDate(snapshot.child("end_date").val());
			endDate5=reformatDate2(endDate)
			endDate2=new Date(endDate5)
			endDate3=endDate2.addDays(1).toString("M/d/yyyy")	
			endDate4=reformatDate(endDate3)
															
		}
		else{
			endDate = snapshot.child("end_date").val()
																	
		}	
		// $("#yearp").val(rentPrice);
		// $("#payment").html(rentPrice+" paid "+payPlan+"  <strong>Electricity</strong> included /month");
		// $("#bond").html(bondPrice+" paid "+payPlan+"  <strong>Electricity</strong> included /month");
		// $("#period").html(startDate+"  -  "+endDate);
		data=`<div id="tenanthistoryperiod`+historyperiod+`" class="nav-tabs">
		<div class="form-group" style="margin:0px -15px;">
			<label for="period" class="control-label col-lg-3">Period</label>
			<div class="col-lg-9">
				<div class="checkbox">
					<span id="period`+historyperiod+`" name="period">`+startDate+` - `+endDate+`</span>
				</div>
			</div>
		</div>
		<div class="form-group" style="margin:0px -15px;">
			<label for="bond" class="control-label col-lg-3">Bond</label>
			<div class="col-lg-9">
				<div class="checkbox">
					<span id="bond`+historyperiod+`" name="bond" >`+bondPrice+`to be paid at the beginning of contract</span>
				</div>
			</div>
		</div>
		<div class="form-group" style="margin:0px -15px;">
			<label for="payment" class="control-label col-lg-3">Payment</label>
			<div class="col-lg-9">
				<div class="checkbox">
					<span id="payment`+historyperiod+`" name="payment">`+rentPrice+`paid `+payPlan+`  <strong>Electricity</strong> included /month</span>
				</div>
			</div>
		</div>
	</div>
</div>
`

$("#tenanthistory").append(data)
--historyperiod
	})
	
})

setTimeout(() => {
	
	// console.log(status)
	if (status=="inactive"){
		$("#contract_details").append(" Contract Ended")
		$("#end").hide()
	}
	startdate=$("#period1").text().split("- ")[1]
	// console.log(startdate)
	if (startdate!="Ongoing"){
		startdate=reformatDate2(startdate)
		startdate2=new Date(startdate)
		startdate3=reformatDate(startdate2.addDays(1).toString("MM/dd/yyyy"))
		// console.log(startdate3)
		$("#ExtendstartDate").html(startdate3);		
	}
	else{
		startdate3=reformatDate(Date.today().toString("MM/dd/yyyy"))
		$("#ExtendstartDate").html(startdate3);	
	}


}, 6000);



	
	// mengambil data yang approved atau occupy dari firebase ke dalam list
	var trRef1 = firebase.database().ref().child("tenant-room/"+id);
	trRef1.on('child_added', function(snapshot) {
		//get starting date , building address , status occupy , ref id
		var statingDate=snapshot.child("start_date").val();
		var payPlan=snapshot.child("pay_plan").val();
		var propAddr=snapshot.child("prop_addr").val();
		var statOccupy=snapshot.child("stat_occupy").val();
		var refN=snapshot.child("ref_number").val().split(" ");
		var refNumber=refN[0]+refN[1]+refN[2];
		
		//changes
		//mengambil rent price
		var rentPrice=snapshot.child("rent_price").val();
		var bondPrice=snapshot.child("rent_bond").val();
		if (payPlan=="annually"){
			rentp=rentPrice
			bondp=bondPrice
			
		}
		else if(payPlan=="semiannually"){
			rentp=pembulatan((((rentPrice-25000)/1.1)*2).toFixed(2));
			bondp=pembulatan((rentp/12).toFixed(2));
			// console.log(rentp, bondp)
		}

		else if(payPlan=="monthly"){
			rentp=pembulatan((((rentPrice-25000)/1.2)*12).toFixed(2));
			bondp=pembulatan((rentp/12).toFixed(2));
			
		}
		//changes
		
		// var startDate = sDate.split("/");
		// var startMonth = startDate[0];
		// var startDay = startDate[1];
		// var startYear = startDate[2];
		// var endMonth = parseInt(startMonth)+intend;
		// var endDay = parseInt(startDay);
		// var endYear = parseInt(startYear);
		// if (endMonth>12) {
		// 	var addYear = Math.trunc(endMonth/12);
		// 	endYear += addYear;
		// 	endMonth = endMonth%12;
		// }
		// mengambil data tenant yang status nya approved atau active
		if ((statOccupy=="approved") ||(statOccupy=="active")){
			
			//untuk mengisi default payment
			//default bond
			bondList.push({
				"date":statingDate,
				"desc":"Bond Money Due",
				"invoice":bondPrice,
				"payment":null
			});
		
			ledgerList.push({
				"date":statingDate,
				"desc":"Bond Money Due",
				"invoice":bondPrice,
				"payment":null
			});
			ledgerList.push({
				"date":statingDate,
				"desc":"Rental Due",
				"invoice":rentPrice,
				"payment":null
			});
			
			
			//sort bond
			bondList = sortArrayByDate(bondList);
			for (x in bondList) {
				table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
			}
			//sort ledger
			ledgerList = sortArrayByDate(ledgerList);
			for (x in ledgerList) {
				table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
			}
			table.draw();
			table1.draw();
			//menghitung total Bond
			countTotalBondDue();
			countTotalBondReceived();
			countBondBalance();
			countTotalBondBalance();
			//menghitung total Ledger
			countTotalDue();
			countTotalReceived();
			countBalance();
			countTotalBalance();
			//end default bond
			//end untuk mengisi default payment
			
			var tenantRef = firebase.database().ref().child("tenant/"+id);
			tenantRef.once('value', function(snapshot) {
				var full_name=snapshot.child("full_name").val();
				newObj = {
					"label":full_name,
					"tenantid":id,
					"refnumber":refNumber
				}
				tenantNames.push(newObj);
			});
		}
	});
	
	// nama tenant untuk validasi
	var label= null;
	
	//fill name and refnumber from database
	fillTenantData();

	
	
	//start jquery prettyphoto
	$(".prettyphoto").prettyPhoto({
		overlay_gallery: false, 
		social_tools: false
	})
	//tenant id1 button listener
	$("#id1").on('click', function() {
		$("#id1img").trigger( "click" );
	})
	//tenant id2 button listener
	$("#id2").on('click', function() {
		$("#id2img").trigger( "click" );
	})
	//tenant id3 button listener
	$("#id3").on('click', function() {
		$("#id3img").trigger( "click" );
	})
	//invoice add button listener
	$("#invoiceb").on('click', function() {
		$("#addInvoiceModal").modal();
	})
	//invoice amount listener
	$("#invoiceAmount").on('keyup change', function() {
		$("#invoiceAmount").val(get_moneydot($("#invoiceAmount").val()));
	})
	//invoice modal details listener
	$("#invoiceDetails").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "otherdue") {
			$("#invoiceDetailsOtherBlock").fadeIn(250, function() {
				$(this).show();
			})
		} else {
			$("#invoiceDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
		}
	})
	//invoice modal add listener
	$("#addInvoiceButton").click(function() {
		$("#addInvoiceForm").submit();
	})
	//invoice add form validation
	$("#addInvoiceForm").validate({
		submitHandler: function() {
			$('#addInvoiceModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			})
			addInvoice();
		}
	})
	//payment add button listener
	$("#paymentb").on('click', function() {
		$("#addPaymentModal").modal();
	})
	//payment bond checkbox listener
	$("input[type=checkbox][name=paymentBond]").on('change', function() {
		if (this.checked) {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
			removeOptions(document.getElementById("paymentDetails"));
			var optionElement1 = document.createElement("option");
			var optionElement2 = document.createElement("option");
			var optionElement3 = document.createElement("option");
			optionElement1.value = "transfer";
			optionElement1.innerHTML = "Bond Money Transfer";
			optionElement2.value = "refund";
			optionElement2.innerHTML = "Bond Money Refund";
			optionElement3.value = "bondpay";
			optionElement3.innerHTML = "Bond Money Payment";
			document.getElementById("paymentDetails").appendChild(optionElement1);
			document.getElementById("paymentDetails").appendChild(optionElement2);
			document.getElementById("paymentDetails").appendChild(optionElement3);
		} else {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
			removeOptions(document.getElementById("paymentDetails"));
			var optionElement1 = document.createElement("option");
			var optionElement2 = document.createElement("option");
			var optionElement3 = document.createElement("option");
			var optionElement4 = document.createElement("option");
			optionElement1.value = "rentpay";
			optionElement1.innerHTML = "Rental Payment";
			optionElement2.value = "finepay";
			optionElement2.innerHTML = "Fine Payment";
			optionElement3.value = "bondpay";
			optionElement3.innerHTML = "Bond Money Payment";
			optionElement4.value = "otherpay";
			optionElement4.innerHTML = "Other Payment";
			document.getElementById("paymentDetails").appendChild(optionElement1);
			document.getElementById("paymentDetails").appendChild(optionElement2);
			document.getElementById("paymentDetails").appendChild(optionElement3);
			document.getElementById("paymentDetails").appendChild(optionElement4);
		}
	})
	//payment amount listener
	$("#paymentAmount").on('keyup change', function() {
		$("#paymentAmount").val(get_moneydot($("#paymentAmount").val()));
	})
	//payment modal details listener
	$("#paymentDetails").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "otherpay") {
			$("#paymentDetailsOtherBlock").fadeIn(250, function() {
				$(this).show();
			})
		} else {
			$("#paymentDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
		}
	})
	//payment modal add listener
	$("#addPaymentButton").click(function() {
		$("#addPaymentForm").submit();
	})
	//payment add form validation
	$("#addPaymentForm").validate({
		submitHandler: function() {
			$('#addPaymentModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			})
			addPayment();
		}
	})
	//extend button listener
	$("#extender").on('click', function() {
		$("#extendModal").modal();
	})

	//changes
	//extend modal payment plan listener
	$("#extendPayPlan").on('change', function() {
		sixPr = pembulatan((((rentp/2)*1.1)+25000).toFixed(2));
				monthPr = pembulatan((((rentp/12)*1.2)+25000).toFixed(2));
				sixBo = pembulatan(sixPr/6);
				monthBo = monthPr;
				yearPr = rentp
				yearBo =0
		
	
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

		//changes
	

	});
	//extend modal price adjustment listener
	$("#padj").on('click', function() {
		//prompt to insert value
		var prompter = prompt("Adjustment");
		//when prompt is ok
		if (prompter != null && prompter != "") {
			var adjprice = parseInt(prompter);
			$("#fprice").html(get_fmoney(pembulatan(adjprice)));
			$("#cfprice").val(pembulatan(adjprice));
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

	
	//extend modal bond money adjustment listener
	$("#badj").on('click', function() {
		//prompt to insert value
		var prompter = prompt("Adjustment");
		//when prompt is ok
		if (prompter != null && prompter != "") {
			var adjbond = parseInt(prompter);
			$("#fbond").html(get_fmoney(pembulatan(adjbond)));
		}
	});
	//extend modal intend listener
	$("#extendIntend").on('change', function() {
		if ($("#extendIntend").val() == "" || $("#ExtendIntendAngka").val()=="") {
			$("#ExtendendDate").html("-");
		} else {
			var intend = parseInt($("#ExtendIntendAngka").val());
			var startDate = reformatDate2($("#ExtendstartDate").html());
			if ($("#extendIntend").val() == "Days"){
				var myDate = new Date(startDate);
				var endDate = myDate.addDays(intend).toString("M/d/yyyy");
				$("#ExtendendDate").html(reformatDate(endDate));
			}
			else if($("#extendIntend").val() == "Months"){
				var myDate = new Date(startDate);
				var endDate = myDate.addMonths(intend).toString("M/d/yyyy");
				$("#ExtendendDate").html(reformatDate(endDate));
			}
			else if($("#extendIntend").val() == "Years"){
				var myDate = new Date(startDate);
				var endDate = myDate.addYears(intend).toString("M/d/yyyy");
				$("#ExtendendDate").html(reformatDate(endDate));
			}
		}
	});

	//extend modal intend listener
	$("#ExtendIntendAngka").on('change', function() {
		if ($("#extendIntend").val() == "" || $("#ExtendIntendAngka").val()=="") {
			$("#ExtendendDate").html("-");
		} else {
			var intend = parseInt($("#ExtendIntendAngka").val());
			var startDate = reformatDate2($("#ExtendstartDate").html());
			if ($("#extendIntend").val() == "Days"){
				var myDate = new Date(startDate);
				var endDate = myDate.addDays(intend).toString("M/d/yyyy");
				$("#ExtendendDate").html(reformatDate(endDate));
			}
			else if($("#extendIntend").val() == "Months"){
				var myDate = new Date(startDate);
				var endDate = myDate.addMonths(intend).toString("M/d/yyyy");
				$("#ExtendendDate").html(reformatDate(endDate));
			}
			else if($("#extendIntend").val() == "Years"){
				var myDate = new Date(startDate);
				var endDate = myDate.addYears(intend).toString("M/d/yyyy");
				$("#ExtendendDate").html(reformatDate(endDate));
			}
		}
	});
	// if($("#ongoing").checked==true){
	// 	$("input[name='inputAngka']").prop("disabled",true);
	// }
	$("#ongoing").on('change', function() {
		if($('input#ongoing').is(':checked')){
			$("input[name='inputAngka']").prop("disabled",true);
			$("select[name='extendIntend']").prop("disabled",true);
			$("#ExtendendDate").html("Ongoing")
		}
	else{
		$("input[name='inputAngka']").prop("disabled",false);
		$("select[name='extendIntend']").prop("disabled",false);
		$("#ExtendendDate").html("-")
	}})
		
	
	//isi data di extend modal
	var trRef1 = firebase.database().ref().child("tenant-room/"+id);
	trRef1.once('child_added', function(snapshot) {
		var address= snapshot.child("prop_addr").val();
		$("#extendPropAddr").text(address);

	})
		
	//extend modal extend listener
	$("#extendButton").click(function() {
		$("#extendForm").submit();
	})
	//extend modal draggable
	$("#extendModal").draggable({
		handle: ".modal-header"
	});
	//extend form validation
	$("#extendForm").validate({
		submitHandler: function() {
			$('#extendModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			});
			extendTenant();
		}
	})
	
	
	
	// filter onchange
	$("#filter").change(function () {
        var end = this.value;
		if(end=="All"){
			table.clear();
			table1.clear();
			//sort bond
			bondList = sortArrayByDate(bondList);
			for (x in bondList) {
				table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
			}
			//sort ledger
			ledgerList = sortArrayByDate(ledgerList);
			for (x in ledgerList) {
				table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
			}
			table.draw();
			table1.draw();
			//menghitung total Bond
			countTotalBondDue();
			countTotalBondReceived();
			countBondBalance();
			countTotalBondBalance();
			//menghitung total Ledger
			countTotalDue();
			countTotalReceived();
			countBalance();
			countTotalBalance();
		} else if (end=="Debit"){
			table.clear();
			table1.clear();
			//sort bond
			bondList = sortArrayByDate(bondList);
			for (x in bondList) {
				if(bondList[x].invoice==null){
					table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
				}
			}
			//sort ledger
			ledgerList = sortArrayByDate(ledgerList);
			for (x in ledgerList) {
				if(ledgerList[x].invoice==null){
					table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
				}
			}
			table.draw();
			table1.draw();
			//menghitung total Bond
			countTotalBondDue();
			countTotalBondReceived();
			countBondBalance();
			countTotalBondBalance();
			//menghitung total Ledger
			countTotalDue();
			countTotalReceived();
			countBalance();
			countTotalBalance();
		} else if (end=="Credit"){
			table.clear();
			table1.clear();
			//sort bond
			bondList = sortArrayByDate(bondList);
			for (x in bondList) {
				if(bondList[x].payment==null){
					table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
				}
			}
			//sort ledger
			ledgerList = sortArrayByDate(ledgerList);
			for (x in ledgerList) {
				if(ledgerList[x].payment==null){
					table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
				}
			}
			table.draw();
			table1.draw();
			//menghitung total Bond
			countTotalBondDue();
			countTotalBondReceived();
			countBondBalance();
			countTotalBondBalance();
			//menghitung total Ledger
			countTotalDue();
			countTotalReceived();
			countBalance();
			countTotalBalance();
		}
    });
	
	
	//get data from payment database
	paymentRef = firebase.database().ref().child("payment/"+id);
	paymentRef.on('child_added', function(snapshot) {
		date = snapshot.child("date").val();
		desc = snapshot.child("desc").val();
		invoice = snapshot.child("invoice").val();
		payment = snapshot.child("payment").val();
		list = snapshot.child("list").val();
		refnumber = snapshot.child("refnumber").val();
		//jika list == ledgerList
		if(list=="ledgerList"){
			ledgerList.push({
				"date":date,
				"desc":desc,
				"invoice":invoice,
				"payment":payment
			});
		} else if (list=="bondList"){
			bondList.push({
				"date":date,
				"desc":desc,
				"invoice":invoice,
				"payment":payment
			});
		}
		table.clear();
		table1.clear();
		//sort bond
		bondList = sortArrayByDate(bondList);
		for (x in bondList) {
			table.row.add([reformatDate(bondList[x].date),bondList[x].desc,bondList[x].invoice,bondList[x].payment,null]);	
		}
		//sort ledger
		ledgerList = sortArrayByDate(ledgerList);
		for (x in ledgerList) {
			table1.row.add([reformatDate(ledgerList[x].date),ledgerList[x].desc,ledgerList[x].invoice,ledgerList[x].payment,null]);	
		}
		table.draw();
		table1.draw();
		//menghitung total Bond
		countTotalBondDue();
		countTotalBondReceived();
		countBondBalance();
		countTotalBondBalance();
		//menghitung total Ledger
		countTotalDue();
		countTotalReceived();
		countBalance();
		countTotalBalance();
	});
	


	//stop loading icon
	setTimeout(function(){
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}, 3000);
});