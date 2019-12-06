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

function shortenString(yourString,maxLength){

	//trim the string to the maximum length
	var trimmedString = yourString.substr(0, maxLength);

	return trimmedString+"..."
	
}

function deleteBooking(tenantID) {
	
	$("#confirmYes").off();
	$("#modalConfirm").modal();
	$("#confirmYes").click(function () {
		startPageLoad();
		var tenantRef = firebase.database().ref("tenant");
		var trRef = firebase.database().ref("tenant-room");
		tenantRef.child(tenantID).remove(
		).then(function onSuccess(res) {
			trRef.child(tenantID).remove(
			).then(function onSuccess(res) {
				trRef.once("value", function() {
					var tenantCount = parseInt(snapshot.child("total_tenant").val()) - 1;
					trRef.update({
						total_tenant : tenantCount
					}).then(function onSuccess(res) {
						addNotification("Booking removed","Booking successfully removed.");
						stopPageLoad();
					}).catch(function onError(err) {
						addNotification("Error Remove Booking",err.code+" : "+err.message);
					});
				});
			}).catch(function onError(err) {
				addNotification("Error Remove Booking",err.code+" : "+err.message);
			});
		}).catch(function onError(err) {
			addNotification("Error Remove Booking",err.code+" : "+err.message);
		});
	});
	
}

$(document).ready(function() {
	
	//BOOKING LIST
	//select table to work with jquery datatables
	var table1 = $('#data-table').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
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
				width: "5%",
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
				width: "28%",
				className: 'dt-head-center'
			},
			{
				targets: 7,
				className: 'dt-head-center'
			}
			
		]
	})
	
	//get data from database
	var trRef = firebase.database().ref("tenant-room");
	var paymentRef = firebase.database().ref("payment");
	var listApproveT=[];
	trRef.on('value', function(snapshot) {
		var tenantCount = snapshot.child("total_tenant").val();
		$("#amountData").off();
		// table data listener
		$("#amountData").change(function() {
			if ($(this).val() == tenantCount) {
				table1.clear();
				//add hasil sort ke datatables
				for (i=0;i<listApproveT.length;i++) {
					table1.row.add(listApproveT[i].content).node().id = 'booking'+listApproveT[i].refNum;
				}
				table1.draw();
				$("#amountData").off();
				stopPageLoad();
			} else {
				startPageLoad();
			}
		});
	});
	trRef.on('child_added', function(snapshot) {
		var tenantID = snapshot.key;
		trRef.child(tenantID).on('child_added', function(snapshot) {
			//get starting date , building address , status occupy , ref id
			var statingDate=snapshot.child("start_date").val();
			var propAddr=snapshot.child("prop_addr").val();
			propAddr = shortenString(propAddr,20);
			var statOccupy=snapshot.child("stat_occupy").val();
			var refNumFormat = snapshot.child("ref_number").val();
			var refN=refNumFormat.split(" ");
			var refNumber=refN[0]+refN[1]+refN[2];
			var buildNo = refNumber.substring(1,3);
			var floorNo = refNumber.substring(3,5);
			var roomNo = refNumber.substring(5,7);
			var tenantRef = firebase.database().ref().child("tenant/"+tenantID);
			var tenantName; var tenantContact;
			tenantRef.once('value', function(snapshot) {
				// get name from database
				tenantName=snapshot.child("full_name").val();
				tenantContact = snapshot.child("cont_mobile").val();
				paymentRef.child(tenantID).once('value', function(snapshot) {
					if (snapshot.val() != null) {  // Have payments
						// jika status = approved
						if (statOccupy=="approved"){
							// untuk sort , datanya dimasukan ke list
							newObj = {
								"statOccupy":"approved",
								"refNum":refNumber,
								"content":[refNumFormat,statingDate,propAddr,buildNo,floorNo,roomNo,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",tenantContact,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' style='background-color:#c8bca6' disabled ><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' style='background-color:#c8bca6' disabled><i class='fa fa-times'></i></button>"],
								"tenant_id":tenantID
							}
							listApproveT.push(newObj);
						}
						//jika status = booking
						if(statOccupy=="booking") {
							// untuk sort , datanya dimasukan ke list
							newObj = {
								"statOccupy":"booking",
								"refNum":refNumber,
								"content":[refNumFormat,statingDate,propAddr,buildNo,floorNo,roomNo,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",tenantContact,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' style='background-color:#c8bca6' disabled><i class='fa fa-times'></i></button>"],
								"tenant_id":tenantID
							}
							listApproveT.push(newObj);
						}
					} else {  // No payments
						// jika status = approved
						if (statOccupy=="approved"){
							// untuk sort , datanya dimasukan ke list
							newObj = {
								"statOccupy":"approved",
								"refNum":refNumber,
								"content":[refNumFormat,statingDate,propAddr,buildNo,floorNo,roomNo,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",tenantContact,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' style='background-color:#c8bca6' disabled ><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('"+tenantID+"')><i class='fa fa-times'></i></button>"],
								"tenant_id":tenantID
							}
							listApproveT.push(newObj);
						}
						//jika status = booking
						if(statOccupy=="booking") {
							// untuk sort , datanya dimasukan ke list
							newObj = {
								"statOccupy":"booking",
								"refNum":refNumber,
								"content":[refNumFormat,statingDate,propAddr,buildNo,floorNo,roomNo,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",tenantContact,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('"+tenantID+"')><i class='fa fa-times'></i></button>"],
								"tenant_id":tenantID
							}
							listApproveT.push(newObj);
						}
					}
					listApproveT = sortByStatOccupy(listApproveT);
					$("#amountData").val((parseInt($("#amountData").val()) + 1).toString());
					$("#amountData").change();
				});
			});
		});
		trRef.child(tenantID).on('child_changed', function(snapshot) {
			//get starting date , building address , status occupy, ref id
			var statingDate=snapshot.child("start_date").val();
			var propAddr=snapshot.child("prop_addr").val();
			propAddr = shortenString(propAddr,20);
			var statOccupy=snapshot.child("stat_occupy").val();
			var refNumFormat = snapshot.child("ref_number").val();
			var refN=refNumFormat.split(" ");
			var refNumber=refN[0]+refN[1]+refN[2];
			var buildNo = refNumber.substring(1,3);
			var floorNo = refNumber.substring(3,5);
			var roomNo = refNumber.substring(5,7);
			var tenantRef = firebase.database().ref().child("tenant/"+tenantID);
			var tenantName; var tenantContact;
			tenantRef.once('value', function(snapshot) {
				table1.clear();
				// get name from database
				tenantName=snapshot.child("full_name").val();
				tenantContact = snapshot.child("cont_mobile").val();
				// remove row changed
				var row = table1.row('#booking'+refNumber);
				row.remove();
				// update occupy pada list
				
				// jika status = approved
				if (statOccupy=="approved"){
					for (i=0;i<listApproveT.length;i++){
						if(listApproveT[i].refNum==refNumber){
							newObj = {
								"statOccupy":statOccupy,
								"refNum":refNumber,
								"content":[listApproveT[i].content[0],statingDate,propAddr,buildNo,floorNo,roomNo,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",tenantContact,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"') style='background-color:#c8bca6' disabled ><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('"+tenantID+"')><i class='fa fa-times'></i></button>"],
								"tenant_id":tenantID
							}
							listApproveT[i]=newObj;
							break
						}
					}
				}
				//jika status = booking
				if(statOccupy=="booking") {
					for (i=0;i<listApproveT.length;i++){
						if(listApproveT[i].refNum==refNumber){
							newObj = {
								"statOccupy":statOccupy,
								"refNum":refNumber,
								"content":[listApproveT[i].content[0],statingDate,propAddr,buildNo,floorNo,roomNo,"<a href='tenant_approve.html?id="+refNumber+"' class='pull-left'>"+tenantName+"</a>",tenantContact,"<button id='approve_booking"+refNumber+"' class='btn btn-xs btn-success' title='Approve' onclick=approveBooking('booking"+refNumber+"')><i class='fa fa-check'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Delete' onclick=deleteBooking('"+tenantID+"')><i class='fa fa-times'></i></button>"],
								"tenant_id":tenantID
							}
							listApproveT[i]=newObj;
							break
						}
					}
				}
				//sorting
				listApproveT = sortByStatOccupy(listApproveT);
				//add hasil sort ke datatables
				for (i=0;i<listApproveT.length;i++) {
					table1.row.add(listApproveT[i].content).node().id = 'booking'+listApproveT[i].refNum;
				}
				table1.draw();
				
			});
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
	
	//add tenant button listener
	$("#baddt").on('click', function() {
		window.location = "tenant_add.html";
	})
	
});