function editBuild(buildNo) {
	
	for(i=1; i<=9; i++) {
		if (buildNo==String(i)) {
			buildNo = "0"+String(i);
		}
	}
	window.location = "building_edit.html?id=1"+buildNo;
	
}

function removeBuild(buildNo) {
	
	//trigger modal popup
	$("#modalConfirm").modal();
	//modal confirmation listener
	$("#confirmYes").on('click', function () {
		//stop modal confirmation listener
		$("#confirmYes").off();
		//success notification
		$.gritter.add({
			title: 'Building Removed',
			text: 'Building was successfully removed from the database.',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
	})
	
}

function expense(x){
	//trigger modal popup
	$("#modalExpense").modal();	
	//modal confirmation listener
	$("#confirmExpense").on('click', function () {
		//stop modal confirmation listener
		$("#confirmExpense").off();
		//success notification
		$.gritter.add({
			title: 'Expense Added',
			text: 'Expense was successfully added',
			image: './img/bell.png',
			sticky: false,
			time: 3500,
			class_name: 'gritter-custom'
		})
		setTimeout(function(){
			window.location='accounting_building.html?id='+x;
		},1500);
	})
	
}

function hideBuild(buildNo) {
	
	// Start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	});
	
	var dbRef = firebase.database().ref().child("property/residential");
	var dbHiddenRef = firebase.database().ref().child("propertyHidden/residential");
	
	if ((buildNo > 0) && (buildNo < 10)) {
		buildNo = "0"+String(buildNo);
	} else {
		buildNo = String(buildNo);
	}
	
	dbRef.once('value', function(snapshot) {
		var buildingKey = "building_no:"+buildNo;
		var building = snapshot.child(buildingKey).val();
		dbHiddenRef.update({
			[buildingKey] : building
		}).then(function onSuccess(res) {
			dbRef.child(buildingKey).remove(
			).then(function onSuccess(res) {
				// Success notification
				$.gritter.add({
					title: 'Building Hidden',
					text: 'Building '+buildNo+' was successfully hidden.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				// Stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			}).catch(function onError(err) {
				// Error notification
				$.gritter.add({
					title: 'Error Hiding Building',
					text: err.code+" : "+err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				// Stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			});
		}).catch(function onError(err) {
			// Error notification
			$.gritter.add({
				title: 'Error Hiding Building',
				text: err.code+" : "+err.message,
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			// Stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		});
	});
	
}

function showBuild(buildNo) {
	
	// Start loading icon
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	});
	
	var dbRef = firebase.database().ref().child("property/residential");
	var dbHiddenRef = firebase.database().ref().child("propertyHidden/residential");
	
	if ((buildNo > 0) && (buildNo < 10)) {
		buildNo = "0"+String(buildNo);
	} else {
		buildNo = String(buildNo);
	}
	
	dbHiddenRef.once('value', function(snapshot) {
		var buildingKey = "building_no:"+buildNo;
		var building = snapshot.child(buildingKey).val();
		dbRef.update({
			[buildingKey] : building
		}).then(function onSuccess(res) {
			dbHiddenRef.child(buildingKey).remove(
			).then(function onSuccess(res) {
				// Success notification
				$.gritter.add({
					title: 'Building Shown',
					text: 'Building '+buildNo+' was successfully shown.',
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				// Stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			}).catch(function onError(err) {
				// Error notification
				$.gritter.add({
					title: 'Error Showing Building',
					text: err.code+" : "+err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
				// Stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			});
		}).catch(function onError(err) {
			// Error notification
			$.gritter.add({
				title: 'Error Showing Building',
				text: err.code+" : "+err.message,
				image: './img/bell.png',
				sticky: false,
				time: 3500,
				class_name: 'gritter-custom'
			});
			// Stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		});
	});
	
}

$(document).ready(function() {
	
	//check other expense
	$("#detailsex").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "other") {
			$("#optex").fadeIn(250, function() {
				$(this).show();
			})
		} else {
			$("#optex").fadeOut(250, function() {
				$(this).hide();
			});
		}
	})
	//select table to work with jquery datatables
	var table = $('#buildingTable').DataTable({
		"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
        "iDisplayLength": -1,
		"sPaginationType": "full_numbers",
		"fixedHeader": true,
		"order": [[ 0, "asc" ]],
		"columnDefs": [
		{
			targets: 0,
			width: "10%",
			
		},
		{ 
			targets: -1,
			width: "19%",
			orderable: false
		}]
	})
	//input data from database to table
	var dbRef = firebase.database().ref().child("property/residential");
	var dbHiddenRef = firebase.database().ref().child("propertyHidden/residential");
	
	dbRef.on('value', function(snapshot) {
		if (!snapshot.hasChildren()) { //no building exist in database
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		} else {
			dbRef.off();
			dbRef.on('child_added', function(snapshot) {
				var builder = snapshot.key.split(":");
				var address1 = snapshot.child("address_street").val();
				var address2 = snapshot.child("address_city").val();
				var address3 = snapshot.child("address_province").val();
				var address4 = snapshot.child("address_zipcode").val();
				table.row.add(["<a href='room_list.html?id="+builder[1]+"'><center>"+builder[1]+"</center></a>","<p style='display:none'>"+snapshot.child("alias").val()+"</p> <a href='room_list.html?id="+builder[1]+"'>"+address1+"</a>",address2,address3,address4,"<button id='summary' class='btn btn-xs btn-success' title='Summary Building' onClick=window.location='room_list.html?id="+builder[1]+"#tenanti'><i class='fa fa-clipboard'></i></button>  <button id='expense' class='btn btn-xs btn-danger' title='Add Expense' onClick='expense("+builder[1]+")'><i class='fa fa-money'></i></button> <button id='addRoom' class='btn btn-xs btn-success' title='Add Room' onClick=window.location='room_add.html?id=1"+builder[1]+"'><i class='fa fa-bed'></i></button> <button id='editbutt' class='btn btn-xs btn-warning' title='Edit Building' onclick='editBuild("+builder[1]+")'><i class='fa fa-pencil'></i></button> <button class='btn btn-xs btn-brown' title='Hide Building' onClick='hideBuild("+builder[1]+")'><i class='fa fa-eye-slash'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Remove Building' onclick='removeBuild("+builder[1]+")'><i class='fa fa-times'></i></button>"]).node().id = 'build'+builder[1];
				table.draw();
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			});
			//replace data when a change is detected
			dbRef.on('child_changed', function(snapshot) {
				var builder = snapshot.key.split(":");
				var row = table.row('#build'+builder[1]);
				row.remove();
				var address1 = snapshot.child("address_street").val();
				var address2 = snapshot.child("address_city").val();
				var address3 = snapshot.child("address_province").val();
				var address4 = snapshot.child("address_zipcode").val();
				table.row.add(["<a href='room_list.html?id="+builder[1]+"'><center>"+builder[1]+"</center></a>","<p style='display:none'>"+snapshot.child("alias").val()+"</p> <a href='room_list.html?id="+builder[1]+"'>"+address1+"</a>",address2,address3,address4,"<button id='summary' class='btn btn-xs btn-success' title='Summary Building' onClick=window.location='room_list.html?id="+builder[1]+"#tenanti'><i class='fa fa-clipboard'></i></button>  <button id='expense' class='btn btn-xs btn-danger' title='Add Expense' onClick='expense("+builder[1]+")'><i class='fa fa-money'></i></button> <button id='addRoom' class='btn btn-xs btn-success' title='Add Room' onClick=window.location='room_add.html?id=1"+builder[1]+"'><i class='fa fa-bed'></i></button> <button id='editbutt' class='btn btn-xs btn-warning' title='Edit Building' onclick='editBuild("+builder[1]+")'><i class='fa fa-pencil'></i></button> <button class='btn btn-xs btn-brown' title='Hide Building' onClick='hideBuild("+builder[1]+")'><i class='fa fa-eye-slash'></i></button> <button id='removebutt' class='btn btn-xs btn-danger' title='Remove Building' onclick='removeBuild("+builder[1]+")'><i class='fa fa-times'></i></button>"]).node().id = 'build'+builder[1];
				table.draw();
			});
			//remove row when deleted
			dbRef.on('child_removed', function(snapshot) {
				var builder = snapshot.key.split(":");
				var row = table.row('#build'+builder[1]);
				row.remove();
				table.draw();
			});
		}
	});
	
	dbHiddenRef.on('value', function(snapshot) {
		if (!snapshot.hasChildren()) { //no building exist in database
			//stop loading icon
			$("#cover-spin").fadeOut(250, function() {
				$(this).hide();
			});
		} else {
			dbHiddenRef.off();
			dbHiddenRef.on('child_added', function(snapshot) {
				var builder = snapshot.key.split(":");
				var address1 = snapshot.child("address_street").val();
				var address2 = snapshot.child("address_city").val();
				var address3 = snapshot.child("address_province").val();
				var address4 = snapshot.child("address_zipcode").val();
				table.row.add(["<center>"+builder[1]+"</center>",address1+" [HIDDEN]",address2,address3,address4,"<button class='btn btn-xs btn-yellow' title='Show Building' onClick='showBuild("+builder[1]+")'><i class='fa fa-eye-slash'></i></button>"]).node().id = 'build'+builder[1];
				table.draw();
				//stop loading icon
				$("#cover-spin").fadeOut(250, function() {
					$(this).hide();
				});
			});
			//replace data when a change is detected
			dbHiddenRef.on('child_changed', function(snapshot) {
				var builder = snapshot.key.split(":");
				var row = table.row('#build'+builder[1]);
				row.remove();
				var address1 = snapshot.child("address_street").val();
				var address2 = snapshot.child("address_city").val();
				var address3 = snapshot.child("address_province").val();
				var address4 = snapshot.child("address_zipcode").val();
				table.row.add(["<center>"+builder[1]+"</center>",address1+" [HIDDEN]",address2,address3,address4,"<button class='btn btn-xs btn-yellow' title='Show Building' onClick='showBuild("+builder[1]+")'><i class='fa fa-eye-slash'></i></button>"]).node().id = 'build'+builder[1];
				table.draw();
			});
			//remove row when deleted
			dbHiddenRef.on('child_removed', function(snapshot) {
				var builder = snapshot.key.split(":");
				var row = table.row('#build'+builder[1]);
				row.remove();
				table.draw();
			});
		}
	});
})