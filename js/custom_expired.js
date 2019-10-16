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

$(document).ready(function() {
	
	// ALMOST EXPIRED LIST
	// select table to work with jquery datatables
	var table1 = $('#data-table').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
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
				width: "8%",
				className: 'dt-head-center'
			},
			{
				targets: 5,
				width: "8%",
				className: 'dt-head-center'
			},
			{
				targets: 6,
				width: "8%",
				className: 'dt-head-center'
			},
			{
				targets: 7,
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
								tenantPhone = snapshot.child("cont_mobile").val();
								tenantObj = {
									"tenant_id":tenantID,
									"refNum":refNumber,
									"content":[refNumFormat,"<a href='tenant_details.html?id="+tenantID+"' class='pull-left'>"+tenantName+"</a>",reformatDate(endDate),propertyAddress,buildNo,floorNo,roomNo,tenantPhone],
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