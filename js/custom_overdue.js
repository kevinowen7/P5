function split_ph(phoneNumb) {
	
	var reformat = phoneNumb.replace(/(\d{4})/g, function(match){
        return match + "-";
	});
	if (reformat.charAt(reformat.length-1) === "-") {
		reformat = reformat.slice(0, reformat.length-1);
	}
	return reformat;
	
}

//sort list by status approve or booking
function sortByStatOccupy(listApproveT){
	newArray=[]
	
	//jika statusnya booking
	for (i=0;i<listApproveT.length;i++) {
		if (listApproveT[i].statOccupy=="booking"){
			newObj = {
				"statOccupy":listApproveT[i].statOccupy,
				"refNum":listApproveT[i].refNum,
				"content":listApproveT[i].content,
				"tenant_id":listApproveT[i].tenant_id
			}
			newArray.push(newObj);
		}
	}
		
	//jika statusnya approved
	for (i=0;i<listApproveT.length;i++) {
		if (listApproveT[i].statOccupy=="approved"){
			newObj = {
				"statOccupy":listApproveT[i].statOccupy,
				"refNum":listApproveT[i].refNum,
				"content":listApproveT[i].content,
				"tenant_id":listApproveT[i].tenant_id
			}
			newArray.push(newObj);
		}
	}
	return newArray
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

function shortenString(yourString,maxLength){

	//trim the string to the maximum length
	var trimmedString = yourString.substr(0, maxLength);

	return trimmedString+"..."
	
}



$(document).ready(function() {
	
	//BOOKING LIST
	//select table to work with jquery datatables
	var table1 = $('#overdueTable').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
		"fixedHeader": true,
		"order": [],
		"columnDefs": [
			{
				targets: -1,
				orderable:false,
				className: 'dt-head-center'
			},
			{
				targets: 0,
				width: "11%",
				orderable:false,
				className: 'dt-head-center'
			},
			{
				targets: 1,
				width: "11%",
				className: 'dt-head-center'
			},
			{
				targets: 2,
				width: "18%",
				className: 'dt-head-center'
			},
			{
				targets: 3,
				width: "28%",
				className: 'dt-head-center'
			},
			{
				targets: 4,
				width: "5%",
				className: 'dt-head-center'
			},
			{
				targets: 5,
				width: "5%",
				className: 'dt-head-center'
			},
			{
				targets: 6,
				width: "5%",
				className: 'dt-head-center'
			},
			{
				targets: 7,
				width: "15%",
				className: 'dt-head-center'
			}
			
		]
	})
	tenant={}
	tenantdata={}
	overdue={}
	var trRef = firebase.database().ref("tenant-room");
	var tenantRef = firebase.database().ref().child("tenant");
	var overdueRef = firebase.database().ref().child("overdue");
	var a=1;
	var listApproveT=[];
	tenantRef.on('child_added',function(snapshot){
		var id = snapshot.key
		tenantRef.child(id).once("value", function(snapshot){
			tenantdata[id]=snapshot.val()
		})
	})
	trRef.on('child_added', function(snapshot) {
		var tenantID = snapshot.key;
		
		trRef.child(tenantID).on('child_added', function(snapshot) {
			//get starting date , building address , status occupy , ref id
			tenant[tenantID]=snapshot.val()
			// var statingDate=snapshot.child("start_date").val();
			// var propAddr=snapshot.child("prop_addr").val();
			// var statOccupy=snapshot.child("stat_occupy").val();
			// var refNumFormat = snapshot.child("ref_number").val();
			// var refN=refNumFormat.split(" ");
			// var refNumber=refN[0]+refN[1]+refN[2];
			// propAddr = shortenString(propAddr,10);
			// var tenantRef = firebase.database().ref().child("tenant/"+tenantID);
			// var tenantName;
			// tenantRef.once('value', function(snapshot) {
			// 	table1.clear();
			// 	// get name from database
			// 	tenantName=snapshot.child("full_name").val();
			// 	tenantName = shortenString(tenantName,8);
			// 	// jika status = approved
			// 	if (statOccupy=="approved"){
			// 		// untuk sort , datanya dimasukan ke list
			// 		newObj = {
			// 			"statOccupy":"approved",
			// 			"refNum":refNumber,
			// 			"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"') style='background-color:#c8bca6' disabled ><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('booking"+refNumber+"')><i class='fa fa-times'></i></button>"],
			// 			"tenant_id":tenantID
			// 		}
			// 		listApproveT.push(newObj);
			// 	}
			// 	//jika status = booking
			// 	if(statOccupy=="booking") {
			// 		// untuk sort , datanya dimasukan ke list
			// 		newObj = {
			// 			"statOccupy":"booking",
			// 			"refNum":refNumber,
			// 			"content":[refNumFormat,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('booking"+refNumber+"')><i class='fa fa-times'></i></button>"],
			// 			"tenant_id":tenantID
			// 		}
			// 		listApproveT.push(newObj);
			// 	}
			// 	listApproveT = sortByStatOccupy(listApproveT);
			// 	//add hasil sort ke datatables
			// 	for (i=0;i<listApproveT.length;i++) {
			// 		table1.row.add(listApproveT[i].content).node().id = 'booking'+listApproveT[i].refNum;
			// 	}
			// 	table1.draw();
			// 	a++
			// });
		});
		trRef.child(tenantID).on('child_changed', function(snapshot) {
			tenant[tenantID]=snapshot.val()
			//get starting date , building address , status occupy, ref id
			// var statingDate=snapshot.child("start_date").val();
			// var propAddr=snapshot.child("prop_addr").val();
			// propAddr = shortenString(propAddr,10);
			// var statOccupy=snapshot.child("stat_occupy").val();
			// var refNumFormat = snapshot.child("ref_number").val();
			// var refN=refNumFormat.split(" ");
			// var refNumber=refN[0]+refN[1]+refN[2];
			// var tenantRef = firebase.database().ref().child("tenant/"+tenantID);
			// var tenantName;
			// tenantRef.once('value', function(snapshot) {
			// 	table1.clear();
			// 	// get name from database
			// 	tenantName=snapshot.child("full_name").val();
			// 	tenantName = shortenString(tenantName,8);
			// 	// remove row changed
			// 	var row = table1.row('#booking'+refNumber);
			// 	row.remove();
			// 	// update occupy pada list
				
			// 	// jika status = approved
			// 	if (statOccupy=="approved"){
			// 		for (i=0;i<listApproveT.length;i++){
			// 			if(listApproveT[i].refNum==refNumber){
			// 				newObj = {
			// 					"statOccupy":statOccupy,
			// 					"refNum":refNumber,
			// 					"content":[listApproveT[i].content[0],tenantName,statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"') style='background-color:#c8bca6' disabled ><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('booking"+refNumber+"')><i class='fa fa-times'></i></button>"],
			// 					"tenant_id":tenantID
			// 				}
			// 				listApproveT[i]=newObj;
			// 				break
			// 			}
			// 		}
			// 	}
			// 	//jika status = booking
			// 	if(statOccupy=="booking") {
			// 		for (i=0;i<listApproveT.length;i++){
			// 			if(listApproveT[i].refNum==refNumber){
			// 				newObj = {
			// 					"statOccupy":statOccupy,
			// 					"refNum":refNumber,
			// 					"content":[listApproveT[i].content[0],tenantName,statingDate,propAddr,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('booking"+refNumber+"')><i class='fa fa-times'></i></button>"],
			// 					"tenant_id":tenantID
			// 				}
			// 				listApproveT[i]=newObj;
			// 				break
			// 			}
			// 		}
			// 	}
			// 	//sorting
			// 	listApproveT = sortByStatOccupy(listApproveT);
			// 	//add hasil sort ke datatables
			// 	for (i=0;i<listApproveT.length;i++) {
			// 		table1.row.add(listApproveT[i].content).node().id = 'booking'+listApproveT[i].refNum;
			// 	}
			// 	table1.draw();
				
			// });
		});
		trRef.child(tenantID).on('child_removed', function(snapshot) {
			//get ref ID
			var refN=snapshot.child("ref_number").val().split(" ");
			var refNumber=refN[0]+refN[1]+refN[2];
			// remove row changed
			var row = table1.row('#booking'+refNumber);
			row.remove();
		});
	});
	overdueRef.on('child_added', function(snapshot){
		var tenantID = snapshot.key;	
		overdue[tenantID]=snapshot.val()
		
	})


		setTimeout(() => {
			table1.clear()
			if (tenant!={} && tenantdata!={} && overdue!={}){
				for (i in overdue){
					console.log(i);
					var balance = overdue[i].balance;
					//validasi jika balance balance !=0
					if (balance<0){
						var refN = tenant[i].ref_number
						var refN1= refN.split(" ");
						var refNumber = refN1[0]+refN1[1]+refN1[2];
						var buildNo = refNumber.substring(1,3);
						var floorNo = refNumber.substring(3,5);
						var roomNo = refNumber.substring(5,7);
						var statOccupy = tenant[i].stat_occupy
						var overdueDate = overdue[i].date_due
						if ((statOccupy=="approved") ||(statOccupy=="active")){
							
							
							// overdueRef2=firebase.database().ref().child("tenant/"+tenantID);
							var name = shortenString(tenantdata[i].full_name,10) 
							table1.row.add([refN,"<a href='tenant_details.html?id="+i+"'>"+name+"</a>",reformatDate(overdueDate),shortenString(tenant[i].prop_addr,20),buildNo,floorNo,roomNo,split_ph(tenantdata[i].cont_mobile)]).node().id = 'over'+i;
							
						}
					}
				}
				table1.draw();
			}else{
				setTimeout(() => {
					if (tenant!={} && tenantdata!={} && overdue!={}){
						for (i in overdue){
							var balance = overdue[i].balance;
							//validasi jika balance balance !=0
							if (balance<0){
								var refN = tenant[i].ref_number
								var refN1= refN.split(" ");
								var refNumber = refN1[0]+refN1[1]+refN1[2];
								var buildNo = refNumber.substring(1,3);
								var floorNo = refNumber.substring(3,5);
								var roomNo = refNumber.substring(5,7);
								var statOccupy = tenant[i].stat_occupy
								var overdueDate = overdue[i].date_due
								if ((statOccupy=="approved") ||(statOccupy=="active")){
									
									
									// overdueRef2=firebase.database().ref().child("tenant/"+tenantID);
									var name = shortenString(tenantdata[i].full_name,10) 
									table1.row.add([refN,"<a href='tenant_details.html?id="+i+"'>"+name+"</a>",reformatDate(overdueDate),shortenString(tenant[i].prop_addr,20),buildNo,floorNo,roomNo,split_ph(tenantdata[i].cont_mobile)]).node().id = 'over'+i;
									
								}
							}
						}
						table1.draw();
					}
				}, 2000);
			}
		},10000);
	
		setTimeout(function(){
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			})
		}, 10000);
	
})