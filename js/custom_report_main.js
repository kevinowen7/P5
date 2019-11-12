function tableLoadOn() {
	
	$("#tableLoad").show();
	
}

function tableLoadOff() {
	
	$("#tableLoad").hide();
	
}

function countTenantinBuilding(buildNo,tenantList) {
	
	var tenantCount = 0;
	for (i=0;i<tenantList.length;i++) {
		var tenantRoom = String(Object.keys(tenantList[i]));
		var tenantBuild = tenantRoom.substring(1,3);
		if (tenantBuild == buildNo) {
			tenantCount++;
		}
	}
	
	return tenantCount;
	
}

function get_moneydot(money) {
	
	if (isNaN(parseInt(money))) {
		var convertmoney = "";
	} else {
		var convertmoney = money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		if (parseInt(money) < 0) {
			convertmoney = "(" + convertmoney.slice(1) + ")";
		}
	}
	return convertmoney;
	
}

function date_diff_indays(d1, d2) {
	
	var diff = Date.parse(d2) - Date.parse(d1);
	return Math.floor(diff / 86400000);
	
}

function reformatDate(inputDate,dateType) {
	
	var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var months2 = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	var outputDate = "";
	
	if (dateType == "US") {
		var inputDay = inputDate.split("-")[0];
		var inputMonth = inputDate.split("-")[1];
		var inputYear = inputDate.split("-")[2];
		
		var outputDay = inputDay;
		if (parseInt(inputDay) < 10) {
			outputDay = "0"+inputDay;
		}
		
		var outputMonth = "";
		for (var i=0; i<months.length; i++) {
			if (inputMonth == months[i]) {
				outputMonth = months2[i];
				break
			}
		}
		
		var outputYear = "20"+inputYear;
		
		outputDate = outputMonth+"/"+outputDay+"/"+outputYear;
	} else if (dateType == "ID") {
		var inputDay = parseInt(inputDate.split("/")[1]);
		var inputMonth = parseInt(inputDate.split("/")[0]);
		var inputYear = inputDate.split("/")[2];
		
		var outputDay = inputDay;
		var outputMonth = months[inputMonth-1];
		var outputYear = inputYear.split("")[2]+inputYear.split("")[3];
		
		outputDate = outputDay+"-"+outputMonth+"-"+outputYear;
	}
	
	return outputDate;
	
}

$(document).ready(function() {
	
	// Initialization
	var table = $('#reportTable').DataTable({
		"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
		"iDisplayLength": -1,
		"paging": false,
		"fixedHeader": true,
		"order": [[ 0, "asc" ]],
		"columnDefs": [
			{
				targets: 0,
				className: 'dt-body-center',
				width: "3%"
			},
			{
				targets: 1,
				render: function ( data, type, row ) {
					return data.substr(0,70)+"...";
				}
			},
			{
				targets: [2,3],
				className: 'dt-body-center',
				width: "10%",
				orderable: false
			},
			{
				targets: [4,5,6,7,8],
				className: 'dt-body-right',
				width: "10%",
				orderable: false
			},
		]
	});
	
	$('#filterStartDatePicker').datepicker({
		format: "d-M-yy",
		autoclose: true
	});
	
	$('#filterEndDatePicker').datepicker({
		format: "d-M-yy",
		autoclose: true
	});
	
	$("#showCustomReport").click(function() {
		$("#filterModal").modal();
	});
	
	var tenantRef = firebase.database().ref("tenant-room");
	var buildRef = firebase.database().ref("property/residential");
	var reportRef = firebase.database().ref("reportAccount");
	var tenantList = [];
	
	/* tenantRef.on('value', function(snapshot) {
		alert(snapshot.numChildren());
	}); */
	/* reportRef.on('child_added', function(snapshot) {
		reportRef.child(snapshot.key).on('child_added', function(snapshot2) {
			reportRef.child(snapshot.key+"/"+snapshot2.key).update({
				inputDate : "09/19/2019"
			}).catch(function onError(err) {
				//error notification
				$.gritter.add({
					title: 'Error',
					text: err.code+" : "+err.message,
					image: './img/bell.png',
					sticky: false,
					time: 3500,
					class_name: 'gritter-custom'
				});
			});
		});
	}); */
	
	tenantRef.once('value', function(snapshot) {
		tableLoadOn();
		
		// Find total tenant
		var totalTenant = snapshot.child("total_tenant").val();
		
		tableLoadOff();
		
		// Count tenant from DB
		$("#dbTenantCounter").change(function() {
			if (($(this).val() == totalTenant) && (tenantList.length == totalTenant)) {
				tenantRef.off();
				
				// Find latest report update date
				$("#dbLastUpdated").change(function() {
					$("#reportLastUpdated").html(reformatDate($("#dbLastUpdated").val(),"ID"));
				});
				
				// Find report start date
				$("#dbStartDate").change(function() {
					$("#reportStartDate").html(reformatDate($("#dbStartDate").val(),"ID"));
				});
				
				// Find report end date
				$("#dbEndDate").change(function() {
					$("#reportEndDate").html(reformatDate($("#dbEndDate").val(),"ID"));
				});
				
				// Load All Report Data
				$("#showAllReport").click(function() {
					$("#cover-spin").fadeIn(250, function() {
						$(this).show();
					});
					
					setTimeout(function() {
						// Reset table
						$("#showAllReport").prop("disabled",true);
						$("#showLastReport,#showNowReport").prop("disabled",false);
						$("#reportLastUpdated,#reportStartDate,#reportEndDate").html("...");
						$("#dbLastUpdated,#dbStartDate,#dbEndDate").val("");
						table
							.clear()
							.draw();
						$("#totalAllRoom,#totalAllVacant,#totalAllDue,#totalAllOverdue,#totalAllReceived,#totalAllExpense,#totalBalance").html("0");
						$("#totalDueInt,#totalOverdueInt,#totalReceivedInt,#totalExpenseInt,#totalBalanceInt").val("0");
							
						// Pull all building data
						buildRef.on('child_added', function(snapshot) {
							tableLoadOn();
							
							var buildObject = new Object();
							buildObject.no = snapshot.key.split(":")[1];
							buildObject.address = snapshot.child("address_street").val();
							buildObject.roomCount = snapshot.child("total_room").val();
							buildObject.tenantCount = countTenantinBuilding(buildObject.no,tenantList);
							var buildVacantCount = buildObject.roomCount - buildObject.tenantCount;
							
							buildObject.due = 0;
							buildObject.receive = 0;
							buildObject.expense = 0;
							table.row.add([buildObject.no,"<a href='room_list.html?id="+buildObject.no+"#tenanti'>"+buildObject.address+"</a>",buildObject.roomCount,buildVacantCount,get_moneydot(buildObject.due),get_moneydot(buildObject.receive - buildObject.due),get_moneydot(buildObject.receive),get_moneydot(buildObject.expense),get_moneydot(buildObject.receive - buildObject.expense)]).node().id = 'build'+buildObject.no;
							
							// Pull report data
							reportRef.child(buildObject.no).on('child_added', function(snapshot) {
								tableLoadOn();
								
								var inputDate = snapshot.child("inputDate").val();
								var reportDate = snapshot.child("date").val();
								if ($("#dbLastUpdated").val() == "") {
									$("#dbLastUpdated")
										.val(inputDate)
										.change();
								} else {
									if (date_diff_indays($("#dbLastUpdated").val(),inputDate) > 0) {
										$("#dbLastUpdated")
											.val(inputDate)
											.change();
									}
								}
								if (($("#dbStartDate").val() == "") || ($("#dbEndDate").val() == "")) {
									$("#dbStartDate")
										.val(reportDate)
										.change();
									$("#dbEndDate")
										.val(reportDate)
										.change();
								} else {
									if (date_diff_indays($("#dbStartDate").val(),reportDate) < 0) {
										$("#dbStartDate")
											.val(reportDate)
											.change();
									}
									if (date_diff_indays($("#dbEndDate").val(),reportDate) > 0) {
										$("#dbEndDate")
											.val(reportDate)
											.change();
									}
								}
								
								var reportDue = parseInt(snapshot.child("due").val())
								var reportReceive = parseInt(snapshot.child("receive").val())
								
								buildObject.due += reportDue;
								buildObject.receive += reportReceive;
								
								$("#totalDueInt").val(parseInt($("#totalDueInt").val()) + reportDue);
								$("#totalAllDue").html(get_moneydot($("#totalDueInt").val()));
								$("#totalOverdueInt").val(parseInt($("#totalOverdueInt").val()) + (reportReceive - reportDue));
								$("#totalAllOverdue").html(get_moneydot($("#totalOverdueInt").val()));
								$("#totalReceivedInt").val(parseInt($("#totalReceivedInt").val()) + reportReceive);
								$("#totalAllReceived").html(get_moneydot($("#totalReceivedInt").val()));
								$("#totalExpenseInt").val(parseInt($("#totalExpenseInt").val()) + buildObject.expense);
								$("#totalAllExpense").html(get_moneydot($("#totalExpenseInt").val()));
								$("#totalBalanceInt").val(parseInt($("#totalBalanceInt").val()) + (reportReceive - buildObject.expense));
								$("#totalBalance").html(get_moneydot($("#totalBalanceInt").val()));
								$("#summary-due").html($("#totalAllDue").html());
								$("#summary-overdue").html($("#totalAllOverdue").html());
								$("#summary-expense").html($("#totalAllExpense").html());
								$("#summary-balance").html($("#totalBalance").html());
								
								table.cell('#build'+buildObject.no,4).data(get_moneydot(buildObject.due));
								table.cell('#build'+buildObject.no,5).data(get_moneydot(buildObject.receive - buildObject.due));
								table.cell('#build'+buildObject.no,6).data(get_moneydot(buildObject.receive));
								table.cell('#build'+buildObject.no,7).data(get_moneydot(buildObject.expense));
								table.cell('#build'+buildObject.no,8).data(get_moneydot(buildObject.receive - buildObject.expense));
								
								tableLoadOff();
							});
							
							table.draw();
							
							$("#totalAllRoom").html(parseInt($("#totalAllRoom").html()) + parseInt(buildObject.roomCount));
							$("#totalAllVacant").html(parseInt($("#totalAllVacant").html()) + buildVacantCount);
							$("#summary-vacant").html(((parseInt($("#totalAllVacant").html()) / parseInt($("#totalAllRoom").html()))*100).toFixed(2)+"%");
							$("#summary-empty").html($("#totalAllVacant").html());
							
							tableLoadOff();
						});
						
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					}, 250);
					
				});
				
				// Load Last Month Report Data
				$("#showLastReport").click(function() {
					$("#cover-spin").fadeIn(250, function() {
						$(this).show();
					});
					
					setTimeout(function() {
						// Reset table
						$("#showLastReport").prop("disabled",true);
						$("#showAllReport,#showNowReport").prop("disabled",false);
						$("#reportLastUpdated,#reportStartDate,#reportEndDate").html("...");
						$("#dbLastUpdated,#dbStartDate,#dbEndDate").val("");
						table
							.clear()
							.draw();
						$("#totalAllRoom,#totalAllVacant,#totalAllDue,#totalAllOverdue,#totalAllReceived,#totalAllExpense,#totalBalance").html("0");
						$("#totalDueInt,#totalOverdueInt,#totalReceivedInt,#totalExpenseInt,#totalBalanceInt").val("0");
						
						// Pull all building data
						buildRef.on('child_added', function(snapshot) {
							tableLoadOn();
							
							var buildObject = new Object();
							buildObject.no = snapshot.key.split(":")[1];
							buildObject.address = snapshot.child("address_street").val();
							buildObject.roomCount = snapshot.child("total_room").val();
							buildObject.tenantCount = countTenantinBuilding(buildObject.no,tenantList);
							var buildVacantCount = buildObject.roomCount - buildObject.tenantCount;
							
							buildObject.due = 0;
							buildObject.receive = 0;
							buildObject.expense = 0;
							table.row.add([buildObject.no,"<a href='room_list.html?id="+buildObject.no+"#tenanti'>"+buildObject.address+"</a>",buildObject.roomCount,buildVacantCount,get_moneydot(buildObject.due),get_moneydot(buildObject.receive - buildObject.due),get_moneydot(buildObject.receive),get_moneydot(buildObject.expense),get_moneydot(buildObject.receive - buildObject.expense)]).node().id = 'build'+buildObject.no;
							
							// Pull report data
							reportRef.child(buildObject.no).on('child_added', function(snapshot) {
								tableLoadOn();
								
								var d = new Date();

								var thisMonth = d.getMonth() + 1;
								var lastMonth = thisMonth - 1; 
								if (thisMonth == 1) {
									lastMonth = 12;
								}

								var thisYear = d.getFullYear();
								if (thisMonth == 1) {
									thisYear -= 1;
								}
								
								var reportDate = snapshot.child("date").val();
								var reportMonth = parseInt(reportDate.split("/")[0]);
								var reportYear = parseInt(reportDate.split("/")[2]);
								
								if ((reportMonth == lastMonth) && (reportYear == thisYear)) {
									var inputDate = snapshot.child("inputDate").val();
									if ($("#dbLastUpdated").val() == "") {
										$("#dbLastUpdated")
											.val(inputDate)
											.change();
									} else {
										if (date_diff_indays($("#dbLastUpdated").val(),inputDate) > 0) {
											$("#dbLastUpdated")
												.val(inputDate)
												.change();
										}
									}
									if (($("#dbStartDate").val() == "") || ($("#dbEndDate").val() == "")) {
										$("#dbStartDate")
											.val(reportDate)
											.change();
										$("#dbEndDate")
											.val(reportDate)
											.change();
									} else {
										if (date_diff_indays($("#dbStartDate").val(),reportDate) < 0) {
											$("#dbStartDate")
												.val(reportDate)
												.change();
										}
										if (date_diff_indays($("#dbEndDate").val(),reportDate) > 0) {
											$("#dbEndDate")
												.val(reportDate)
												.change();
										}
									}
									
									var reportDue = parseInt(snapshot.child("due").val());
									var reportReceive = parseInt(snapshot.child("receive").val());
									
									buildObject.due += reportDue;
									buildObject.receive += reportReceive;
									
									$("#totalDueInt").val(parseInt($("#totalDueInt").val()) + reportDue);
									$("#totalAllDue").html(get_moneydot($("#totalDueInt").val()));
									$("#totalOverdueInt").val(parseInt($("#totalOverdueInt").val()) + (reportReceive - reportDue));
									$("#totalAllOverdue").html(get_moneydot($("#totalOverdueInt").val()));
									$("#totalReceivedInt").val(parseInt($("#totalReceivedInt").val()) + reportReceive);
									$("#totalAllReceived").html(get_moneydot($("#totalReceivedInt").val()));
									$("#totalExpenseInt").val(parseInt($("#totalExpenseInt").val()) + buildObject.expense);
									$("#totalAllExpense").html(get_moneydot($("#totalExpenseInt").val()));
									$("#totalBalanceInt").val(parseInt($("#totalBalanceInt").val()) + (reportReceive - buildObject.expense));
									$("#totalBalance").html(get_moneydot($("#totalBalanceInt").val()));
									$("#summary-due").html($("#totalAllDue").html());
									$("#summary-overdue").html($("#totalAllOverdue").html());
									$("#summary-expense").html($("#totalAllExpense").html());
									$("#summary-balance").html($("#totalBalance").html());
								}
								
								table.cell('#build'+buildObject.no,4).data(get_moneydot(buildObject.due));
								table.cell('#build'+buildObject.no,5).data(get_moneydot(buildObject.receive - buildObject.due));
								table.cell('#build'+buildObject.no,6).data(get_moneydot(buildObject.receive));
								table.cell('#build'+buildObject.no,7).data(get_moneydot(buildObject.expense));
								table.cell('#build'+buildObject.no,8).data(get_moneydot(buildObject.receive - buildObject.expense));
								
								tableLoadOff();
							});
							
							table.draw();
							
							$("#totalAllRoom").html(parseInt($("#totalAllRoom").html()) + parseInt(buildObject.roomCount));
							$("#totalAllVacant").html(parseInt($("#totalAllVacant").html()) + buildVacantCount);
							$("#summary-vacant").html(((parseInt($("#totalAllVacant").html()) / parseInt($("#totalAllRoom").html()))*100).toFixed(2)+"%");
							$("#summary-empty").html($("#totalAllVacant").html());
							
							tableLoadOff();
						});
						
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					}, 250);
					
				});
				
				// Load This Month Report Data
				$("#showNowReport").click(function() {
					$("#cover-spin").fadeIn(250, function() {
						$(this).show();
					});
					
					setTimeout(function() {
						// Reset table
						$("#showNowReport").prop("disabled",true);
						$("#showLastReport,#showAllReport").prop("disabled",false);
						$("#reportLastUpdated,#reportStartDate,#reportEndDate").html("...");
						$("#dbLastUpdated,#dbStartDate,#dbEndDate").val("");
						table
							.clear()
							.draw();
						$("#totalAllRoom,#totalAllVacant,#totalAllDue,#totalAllOverdue,#totalAllReceived,#totalAllExpense,#totalBalance").html("0");
						$("#totalDueInt,#totalOverdueInt,#totalReceivedInt,#totalExpenseInt,#totalBalanceInt").val("0");
						
						// Pull all building data
						buildRef.on('child_added', function(snapshot) {
							tableLoadOn();
							
							var buildObject = new Object();
							buildObject.no = snapshot.key.split(":")[1];
							buildObject.address = snapshot.child("address_street").val();
							buildObject.roomCount = snapshot.child("total_room").val();
							buildObject.tenantCount = countTenantinBuilding(buildObject.no,tenantList);
							var buildVacantCount = buildObject.roomCount - buildObject.tenantCount;
							
							buildObject.due = 0;
							buildObject.receive = 0;
							buildObject.expense = 0;
							table.row.add([buildObject.no,"<a href='room_list.html?id="+buildObject.no+"#tenanti'>"+buildObject.address+"</a>",buildObject.roomCount,buildVacantCount,get_moneydot(buildObject.due),get_moneydot(buildObject.receive - buildObject.due),get_moneydot(buildObject.receive),get_moneydot(buildObject.expense),get_moneydot(buildObject.receive - buildObject.expense)]).node().id = 'build'+buildObject.no;
							
							// Pull report data
							reportRef.child(buildObject.no).on('child_added', function(snapshot) {
								tableLoadOn();
								
								var d = new Date();

								var thisMonth = d.getMonth() + 1;
								var thisYear = d.getFullYear();
								
								var reportDate = snapshot.child("date").val();
								var reportMonth = parseInt(reportDate.split("/")[0]);
								var reportYear = parseInt(reportDate.split("/")[2]);
								
								if ((reportMonth == thisMonth) && (reportYear == thisYear)) {
									var inputDate = snapshot.child("inputDate").val();
									if ($("#dbLastUpdated").val() == "") {
										$("#dbLastUpdated")
											.val(inputDate)
											.change();
									} else {
										if (date_diff_indays($("#dbLastUpdated").val(),inputDate) > 0) {
											$("#dbLastUpdated")
												.val(inputDate)
												.change();
										}
									}
									if (($("#dbStartDate").val() == "") || ($("#dbEndDate").val() == "")) {
										$("#dbStartDate")
											.val(reportDate)
											.change();
										$("#dbEndDate")
											.val(reportDate)
											.change();
									} else {
										if (date_diff_indays($("#dbStartDate").val(),reportDate) < 0) {
											$("#dbStartDate")
												.val(reportDate)
												.change();
										}
										if (date_diff_indays($("#dbEndDate").val(),reportDate) > 0) {
											$("#dbEndDate")
												.val(reportDate)
												.change();
										}
									}
									
									var reportDue = parseInt(snapshot.child("due").val());
									var reportReceive = parseInt(snapshot.child("receive").val());
									
									buildObject.due += reportDue;
									buildObject.receive += reportReceive;
									
									$("#totalDueInt").val(parseInt($("#totalDueInt").val()) + reportDue);
									$("#totalAllDue").html(get_moneydot($("#totalDueInt").val()));
									$("#totalOverdueInt").val(parseInt($("#totalOverdueInt").val()) + (reportReceive - reportDue));
									$("#totalAllOverdue").html(get_moneydot($("#totalOverdueInt").val()));
									$("#totalReceivedInt").val(parseInt($("#totalReceivedInt").val()) + reportReceive);
									$("#totalAllReceived").html(get_moneydot($("#totalReceivedInt").val()));
									$("#totalExpenseInt").val(parseInt($("#totalExpenseInt").val()) + buildObject.expense);
									$("#totalAllExpense").html(get_moneydot($("#totalExpenseInt").val()));
									$("#totalBalanceInt").val(parseInt($("#totalBalanceInt").val()) + (reportReceive - buildObject.expense));
									$("#totalBalance").html(get_moneydot($("#totalBalanceInt").val()));
									$("#summary-due").html($("#totalAllDue").html());
									$("#summary-overdue").html($("#totalAllOverdue").html());
									$("#summary-expense").html($("#totalAllExpense").html());
									$("#summary-balance").html($("#totalBalance").html());
								}
								
								table.cell('#build'+buildObject.no,4).data(get_moneydot(buildObject.due));
								table.cell('#build'+buildObject.no,5).data(get_moneydot(buildObject.receive - buildObject.due));
								table.cell('#build'+buildObject.no,6).data(get_moneydot(buildObject.receive));
								table.cell('#build'+buildObject.no,7).data(get_moneydot(buildObject.expense));
								table.cell('#build'+buildObject.no,8).data(get_moneydot(buildObject.receive - buildObject.expense));
								
								tableLoadOff();
							});
							
							table.draw();
							
							$("#totalAllRoom").html(parseInt($("#totalAllRoom").html()) + parseInt(buildObject.roomCount));
							$("#totalAllVacant").html(parseInt($("#totalAllVacant").html()) + buildVacantCount);
							$("#summary-vacant").html(((parseInt($("#totalAllVacant").html()) / parseInt($("#totalAllRoom").html()))*100).toFixed(2)+"%");
							$("#summary-empty").html($("#totalAllVacant").html());
							
							tableLoadOff();
						});
						
						$("#cover-spin").fadeOut(250, function() {
							$(this).hide();
						});
					}, 250);
					
				});
				
				jQuery.validator.addMethod("isAfterStartDate", function(value, element) {
					var startDate = reformatDate($('#filterStartDate').val(),"US");
					var endDate = reformatDate(value,"US");

					if (date_diff_indays(startDate,endDate) >= 0) {
						return true;
					} else  {
						return false;
					}
				}, "End date should be after start date");
				
				// Load Custom Filter Report Data
				$("#filterForm").validate({
					submitHandler: function() {
						$('#filterModal').modal('toggle');
						
						$("#cover-spin").fadeIn(250, function() {
							$(this).show();
						});
						
						setTimeout(function() {
							// Reset table
							$("#showAllReport,#showLastReport,#showNowReport").prop("disabled",false);
							$("#reportLastUpdated,#reportStartDate,#reportEndDate").html("...");
							$("#dbLastUpdated,#dbStartDate,#dbEndDate").val("");
							table
								.clear()
								.draw();
							$("#totalAllRoom,#totalAllVacant,#totalAllDue,#totalAllOverdue,#totalAllReceived,#totalAllExpense,#totalBalance").html("0");
							$("#totalDueInt,#totalOverdueInt,#totalReceivedInt,#totalExpenseInt,#totalBalanceInt").val("0");
							
							// Pull all building data
							buildRef.on('child_added', function(snapshot) {
								tableLoadOn();
								
								var buildObject = new Object();
								buildObject.no = snapshot.key.split(":")[1];
								buildObject.address = snapshot.child("address_street").val();
								buildObject.roomCount = snapshot.child("total_room").val();
								buildObject.tenantCount = countTenantinBuilding(buildObject.no,tenantList);
								var buildVacantCount = buildObject.roomCount - buildObject.tenantCount;
								
								buildObject.due = 0;
								buildObject.receive = 0;
								buildObject.expense = 0;
								table.row.add([buildObject.no,"<a href='room_list.html?id="+buildObject.no+"#tenanti'>"+buildObject.address+"</a>",buildObject.roomCount,buildVacantCount,get_moneydot(buildObject.due),get_moneydot(buildObject.receive - buildObject.due),get_moneydot(buildObject.receive),get_moneydot(buildObject.expense),get_moneydot(buildObject.receive - buildObject.expense)]).node().id = 'build'+buildObject.no;
								
								// Pull report data
								reportRef.child(buildObject.no).on('child_added', function(snapshot) {
									tableLoadOn();
									
									var filterStartDate = reformatDate($("#filterStartDate").val(),"US");
									var filterEndDate = reformatDate($("#filterEndDate").val(),"US");
									var reportDate = snapshot.child("date").val();
									
									if ((date_diff_indays(filterStartDate,reportDate) >= 0) && (date_diff_indays(filterEndDate,reportDate) <= 0)) {
										var inputDate = snapshot.child("inputDate").val();
										if ($("#dbLastUpdated").val() == "") {
											$("#dbLastUpdated")
												.val(inputDate)
												.change();
										} else {
											if (date_diff_indays($("#dbLastUpdated").val(),inputDate) > 0) {
												$("#dbLastUpdated")
													.val(inputDate)
													.change();
											}
										}
										if (($("#dbStartDate").val() == "") || ($("#dbEndDate").val() == "")) {
											$("#dbStartDate")
												.val(reportDate)
												.change();
											$("#dbEndDate")
												.val(reportDate)
												.change();
										} else {
											if (date_diff_indays($("#dbStartDate").val(),reportDate) < 0) {
												$("#dbStartDate")
													.val(reportDate)
													.change();
											}
											if (date_diff_indays($("#dbEndDate").val(),reportDate) > 0) {
												$("#dbEndDate")
													.val(reportDate)
													.change();
											}
										}
										
										var reportDue = parseInt(snapshot.child("due").val());
										var reportReceive = parseInt(snapshot.child("receive").val());
										
										buildObject.due += reportDue;
										buildObject.receive += reportReceive;
										
										$("#totalDueInt").val(parseInt($("#totalDueInt").val()) + reportDue);
										$("#totalAllDue").html(get_moneydot($("#totalDueInt").val()));
										$("#totalOverdueInt").val(parseInt($("#totalOverdueInt").val()) + (reportReceive - reportDue));
										$("#totalAllOverdue").html(get_moneydot($("#totalOverdueInt").val()));
										$("#totalReceivedInt").val(parseInt($("#totalReceivedInt").val()) + reportReceive);
										$("#totalAllReceived").html(get_moneydot($("#totalReceivedInt").val()));
										$("#totalExpenseInt").val(parseInt($("#totalExpenseInt").val()) + buildObject.expense);
										$("#totalAllExpense").html(get_moneydot($("#totalExpenseInt").val()));
										$("#totalBalanceInt").val(parseInt($("#totalBalanceInt").val()) + (reportReceive - buildObject.expense));
										$("#totalBalance").html(get_moneydot($("#totalBalanceInt").val()));
										$("#summary-due").html($("#totalAllDue").html());
										$("#summary-overdue").html($("#totalAllOverdue").html());
										$("#summary-expense").html($("#totalAllExpense").html());
										$("#summary-balance").html($("#totalBalance").html());
									}
									
									table.cell('#build'+buildObject.no,4).data(get_moneydot(buildObject.due));
									table.cell('#build'+buildObject.no,5).data(get_moneydot(buildObject.receive - buildObject.due));
									table.cell('#build'+buildObject.no,6).data(get_moneydot(buildObject.receive));
									table.cell('#build'+buildObject.no,7).data(get_moneydot(buildObject.expense));
									table.cell('#build'+buildObject.no,8).data(get_moneydot(buildObject.receive - buildObject.expense));
									
									tableLoadOff();
								});
								
								table.draw();
								
								$("#totalAllRoom").html(parseInt($("#totalAllRoom").html()) + parseInt(buildObject.roomCount));
								$("#totalAllVacant").html(parseInt($("#totalAllVacant").html()) + buildVacantCount);
								$("#summary-vacant").html(((parseInt($("#totalAllVacant").html()) / parseInt($("#totalAllRoom").html()))*100).toFixed(2)+"%");
								$("#summary-empty").html($("#totalAllVacant").html());
								
								tableLoadOff();
							});
							
							$("#cover-spin").fadeOut(250, function() {
								$(this).hide();
							});
						}, 250);
					},
					rules: {
						filterEndDate: {
							required: true,
							isAfterStartDate: true
						}


					}
				});
				
				// Default table filter
				$("#showNowReport").click();
			}
		});
		
		// Pull all tenant-room data
		tenantRef.on('child_added', function(snapshot) {
			tableLoadOn();
			
			if (snapshot.key != "total_tenant") {
				var tenantObject = snapshot.val();
				
				tenantList.push(tenantObject);
				$("#dbTenantCounter")
					.val(parseInt($("#dbTenantCounter").val()) + 1)
					.change();
			}
			
			tableLoadOff();
		});
		
	});

});