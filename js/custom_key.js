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

function editKeyCollectDateModal(keyDate,tenantID,tenantRef,notes) {

	$("#editKeyDateModal").modal();
	$("#keyDate").val(keyDate);
	$("#notes").val(notes);
	$("#keyTenantID").val(tenantID);
	$("#keyTenantRef").val(tenantRef);

}

function editKeyCollectDate() {

	var keyDate = $("#keyDate").val();
	var notes = $("#notes").val();
	if(notes==""){
		notes=null;
	}
	var keyTenantID = $("#keyTenantID").val();
	var keyTenantRef = $("#keyTenantRef").val().substring(0,7);
	var keyDateRef = firebase.database().ref("tenant-room/"+keyTenantID+"/"+keyTenantRef);
	keyDateRef.update({
		"key_date":keyDate,
		"notes":notes
	}).then(function onSuccess(res) {
		//success notification
		$.gritter.add({
			title: 'Key Collection Date Edited',
			text: "Key collection date successfully edited",
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		});
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		});
	}).catch(function onError(err) {
		//error notification
		$.gritter.add({
			title: 'Error Edit Key Collection Date',
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

}

$(document).ready(function() {
	
	//BOOKING LIST
	//select table to work with jquery datatables
	var table1 = $('#keyCollectTable').DataTable({
		"aLengthMenu": [[5, 10, -1], [5, 10, "All"]],
		"iDisplayLength": 5,
		"paging":false,
		"fixedHeader": true,
		"order": [[2,"desc"]],
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
				width: "25%",
				className: 'dt-head-center'
			},
			{
				targets: 2,
				width: "11%",
				className: 'dt-head-center'
			},
			{
				targets: 3,
				width: "15%",
				className: 'dt-head-center'
			},
			{
				targets: 4,
				width: "17%",
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
                width: "5%",
				className: 'dt-head-center'
			}
			
		]
	})
	
	// mengambil data yang approved atau occupy dari firebase ke dalam list
	var trRef = firebase.database().ref().child("payment");
	trRef.on('child_added', function(snapshot) {
		var tenantID = snapshot.key;
		trRef1 = firebase.database().ref().child("tenant-room/"+tenantID);
		trRef1.on('child_added', function(snapshot) {
			//get starting date , status occupy , ref id , alamat
            var propAddr = snapshot.child("prop_addr").val();
            propAddr = shortenString(propAddr,20);
			var statingDate = snapshot.child("start_date").val();
			var keyDate = snapshot.child("key_date").val();
			var statOccupy = snapshot.child("stat_occupy").val();
            var refNumFormat = snapshot.child("ref_number").val();
            var refN=refNumFormat.split(" ");
            var refNumber=refN[0]+refN[1]+refN[2];
			var buildNo = refNumber.substring(1,3);
			var floorNo = refNumber.substring(3,5);
			var roomNo = refNumber.substring(5,7);
			var note = snapshot.child("notes").val();
			var noteIcon=""
			var note1=""
			if(note==null){
				note1=""
				noteIcon=""
			} else {
				note=note.replace("\n", " ");
				note1=note
				noteIcon = "<button class='btn btn-xs btn-danger tip' data-position='top-center' data-tip='"+note+"'>"+"<i class='fa fa-comments-o'></i>"+"</button>"
			}
			
			if ((statOccupy=="approved") ||(statOccupy=="active")){
				trRef2=firebase.database().ref().child("tenant/"+tenantID);
				trRef2.once('value', function(snapshot) {
					var name = snapshot.child("full_name").val();
					table1.row.add([refN,"<a href='javaScript:void(0)' class='pull-left'>"+name+"</a>",statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+tenantID+"\",\""+refNumber+"\",\""+note1+"\")'>"+keyDate+" "+noteIcon+"</a>",propAddr,buildNo,floorNo,roomNo,"<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+tenantID+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+tenantID+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+tenantID;
					table1.draw();
					$(".tip").tip();
				});
			}
		});
		trRef1.on('child_changed', function(snapshot) {
			var row = table1.row('#key'+tenantID);
			row.remove();
			var propAddr = snapshot.child("prop_addr").val();
            propAddr = shortenString(propAddr,20);
			var statingDate = snapshot.child("start_date").val();
			var keyDate = snapshot.child("key_date").val();
			var statOccupy = snapshot.child("stat_occupy").val();
			var refN = snapshot.child("ref_number").val();
			var note = snapshot.child("notes").val();
			var noteIcon=""
			var note1=""
			if(note==null){
				note1=""
				noteIcon=""
			} if(note!=null) {
				note=note.replace("\n", " ");
				note1=note
				noteIcon = "<button class='btn btn-xs btn-danger tip' data-position='top-center' data-tip='"+note+"'>"+"<i class='fa fa-comments-o'></i>"+"</button>"
			}
			var refN1= refN.split(" ");
			var refNumber = refN1[0]+refN1[1]+refN1[2];
			var buildNo = refNumber.substring(1,3);
			var floorNo = refNumber.substring(3,5);
			var roomNo = refNumber.substring(5,7);
			if ((statOccupy=="approved") ||(statOccupy=="active")){
				
				trRef2=firebase.database().ref().child("tenant/"+tenantID);
				trRef2.once('value', function(snapshot) {
					var name = snapshot.child("full_name").val();
					table1.row.add([refN,"<a href='javaScript:void(0)' class='pull-left'>"+name+"</a>",statingDate,"<a href='#' ondblclick='editKeyCollectDateModal(\""+keyDate+"\",\""+tenantID+"\",\""+refNumber+"\",\""+note1+"\")'>"+keyDate+" "+noteIcon+"</a>",propAddr,buildNo,floorNo,roomNo,"<button class='btn btn-xs btn-success' title='Mail Tenant' onclick=mailTenantKey('"+tenantID+"','"+refNumber+"')><i class='fa fa-envelope'></i></button> <button class='btn btn-xs btn-primary' title='Collected' onclick=collectedKey('"+tenantID+"','"+refNumber+"')><i class='fa fa-check'></i></button>"]).node().id = "key"+tenantID;
					table1.draw();
					$(".tip").tip();
				});
			}
		});
		
    });
    $("#editKeyDateModal").draggable({
		handle: ".modal-header"
    });
    //start key datepicker
	$('#keyDatePicker').datepicker({
		autoclose: true
	})
	//key date modal edit listener
	$("#editKeyDateButton").click(function() {
		$("#editKeyDateForm").submit();
	})
	//key date edit form validation
	$("#editKeyDateForm").validate({
		submitHandler: function() {
			$('#editKeyDateModal').modal('hide');
			$("#cover-spin").fadeIn(250, function() {
				$(this).show();
			});
			editKeyCollectDate();
		}
	})
    setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}, 5000);
})