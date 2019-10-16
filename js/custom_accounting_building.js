//array for search bar autocomplete
var buildList = [
	{
		label: "Jl. Kowalski No. 7 RT 13 RW 2, You, Jelly, Gunung Kidul, Daerah Istimewa Yogyakarta 14444",
		buildnumber: "03"
	},
	{
		label: "Jl. Private No. 2 RT 3 RW 4, Yes, No, Madiun, Jawa Timur 44551",
		buildnumber: "07"
	},
	{
		label: "Jl. Skipper No. 15 RT 12 RW 23, Nigga, What, Jakarta Pusat, DKI Jakarta 12345",
		buildnumber: "01"
	}
];
//sort array ascending based on name
buildList.sort(function(a, b){
	var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase();
	if (nameA < nameB) //sort string ascending
		return -1;
	if (nameA > nameB)
		return 1;
	return 0; //default return value (no sorting)
});



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
	})
	
}


$(document).ready(function() {
	var table = $('#data-table1').DataTable({
		"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
		"iDisplayLength": -1,
		"order": [[ 0, "asc" ]],
		"columnDefs": [
		{
			targets: [0,1],
			width: "2%"
		},
		{
			targets: [2,9,10,11],
			width: "25%"
		},
		{
			targets: [5,6],
			width: "5%"
		},
		{
			targets: [2,3,4,5,6,8,9,10,11],
			orderable: false
		}],
		scrollX:        true,
		scrollCollapse: true,
		paging:         false,
		fixedColumns:   true
	})
	//building number listener
	$('#buildNo').on('change keyup', function () {
		
		//start loading icon
		$("#cover-spin").fadeIn(250, function() {
			$(this).removeClass("hide");
		})
		table
			.clear()
			.draw();
		var Ref = parseInt($("#buildNo").val());
		//define table to work with jquery datatables
		if (Ref == 1){
			// change address and total room
			$("#totalR").html("9")
			$("#address1").html("Jl. Skipper No. 15 RT 12 RW 23, Nigga, What")
			$("#buildNo1").html($("#buildNo").val())
			//input data from database to table
			table.row.add(["01","01","Rp 3.000.000,-","","","","","","","","","",""]);
			table.row.add(["01","02","Rp 3.000.000,-","","","","","","","","","",""]);
			table.row.add(["01","03","Rp 3.000.000,-","<a id='t_5 ' href='tenant_details.html?id=t_5#ledger'>Aleksandra Hyde</a>","1-May-08","31-Oct-08","101 010 500","monthly","0813-94715874","Rp 275.000,-","","Rp (275.000,-)"]);
			table.row.add(["02","01","Rp 3.000.000,-","<a id='t_6 ' href='tenant_details.html?id=t_6#ledger'>Amari O'Reilly</a>","1-Apr-08","30-Sep-08","101 020 100","monthly","022 - 9199 3781","<p>Rp 225.000,-</p><p>Rp 225.000,-</p><p>Rp 225.000,-</p><p>Rp 225.000,-</p>","","<p>Rp (225.000,-)</p><p>Rp (450.000,-)</p><p>Rp (675.000,-)</p><p>Rp (900.000,-)</p>"]);
			table.row.add(["02","02","Rp 3.000.000,-","<a id='t_7 ' href='tenant_details.html?id=t_7#ledger'>Jan Garrison</a>","1-May-08","30-Oct-08","101 020 200","monthly","0856-2032552","Rp 215.000,-","Rp 215.000,-","Rp 0,-"]);
			table.row.add(["02","03","Rp 2.700.000,-","<a id='t_3 ' href='tenant_details.html?id=t_3#ledger'>Briana Holloway</a>","1-May-08","<p>30-Oct-08</p><p>Bond</p>","101 020 300","monthly","0813-20093906","<p>Rp 150.000,-</p><p>Rp 225.000,-</p>","<p>Rp 275.000,-</p>","<p>Rp 125.000,-</p><p>Rp (100.000,-)</p>"]);
			table.row.add(["03","01","Rp 2.700.000,-","<a id='t_4 ' href='tenant_details.html?id=t_4#ledger'>Zakary Neville</a>","27-May-08","<p>26-Oct-08</p><p>Bond</p>","101 030 100","monthly","0857-59936957","<p>Rp 225.000,-</p><p>Rp 225.000,-</p><p>Rp 200.000,-</p>","<p>Rp 275.000,-</p><p>Rp 250.000,-</p></br>","<p>Rp 50.000,-</p><p>Rp 25.000,-</p><p>Rp (125.000,-)</p>"]);
			table.row.add(["03","02","Rp 2.700.000,-","<a id='t_2 ' href='tenant_details.html?id=t_2#ledger'>Kevin Owen</a>","8-May-08","<p>7-Nov-08</p><p>Bond</p>","101 030 200","6 month","0857-22102914","<p>Rp 225.000,-</p><p>Rp 200.000,-</p>","<p>Rp 225.000,-</p></br>","<p>Rp 0,-</p><p>Rp (200.000,-)</p>"]);
			table.row.add(["03","03","Rp 3.000.000,-","<a id='t_8 ' href='tenant_details.html?id=t_8#ledger'>Pamela Daugherty</a>","1-May-08","<p>31-Oct-08</p>","101 030 300","6 month","0819-10225333","<p>Rp 215.000,-</p><p>Rp 200.000,-</p><p>Rp 215.000,-</p><p>Rp 215.000,-</p>","<p>Rp 300.000,-</p></br><p>Rp 225.000,-</p></br>","<p>Rp 85.000,-</p><p>Rp (115.000,-)</p><p>Rp (105.000,-)</p><p>Rp (320.000,-)</p>"]);
			table.row.add(["Total","","Rp 26.100.000,-","","","","","","","Rp 3.685.000,-","Rp 1.765.000,-","Rp (1.920.000,-)"]);
			table.draw(false);
		}
		if (Ref == 3){
			// change address and total room
			$("#totalR").html("14")
			$("#address1").html("GG. H. SIROD NO 16, CIHAMPELAS")
			$("#buildNo1").html($("#buildNo").val())
			//input data from database to table
			table.row.add(["01","01","Rp 3.000.000,-","","","","","","","","","",""]);
			table.row.add(["01","02","Rp 3.000.000,-","","","","","","","","","",""]);
			table.row.add(["01","03","Rp 3.000.000,-","<a id='t_5' href='javaScript:void(0);'>M.Gaha Wendy</a>","1-May-08","31-Oct-08","101 010 300","monthly","0813-94715874","Rp 275.000,-","","Rp (275.000,-)"]);
			table.row.add(["01","04","Rp 3.000.000,-","<a id='t_6' href='javaScript:void(0);'>Christian FT</a>","1-Apr-08","30-Sep-08","101 010 400","monthly","022 - 9199 3781","<p>Rp 225.000,-</p><p>Rp 225.000,-</p><p>Rp 225.000,-</p><p>Rp 225.000,-</p>","","<p>Rp (225.000,-)</p><p>Rp (450.000,-)</p><p>Rp (675.000,-)</p><p>Rp (900.000,-)</p>"]);
			table.row.add(["01","05","Rp 3.000.000,-","","","","","","","","","",""]);
			table.row.add(["01","06","Rp 3.000.000,-","","","","","","","","","",""]);
			table.row.add(["01","07","Rp 3.000.000,-","<a id='t_7' href='javaScript:void(0);'>Inu Wisnu</a>","1-May-08","30-Oct-08","101 010 700","monthly","0856-2032552","Rp 215.000,-","Rp 215.000,-","Rp 0,-"]);
			table.row.add(["02","01","Rp 2.700.000,-","","","","","","","","","",""]);
			table.row.add(["02","02","Rp 2.700.000,-","<a id='t_3' href='javaScript:void(0);'>Lidha Lismanawati</a>","1-May-08","<p>30-Oct-08</p><p>Bond</p>","101 020 200","monthly","0813-20093906","<p>Rp 150.000,-</p><p>Rp 225.000,-</p>","<p>Rp 275.000,-</p>","<p>Rp 125.000,-</p><p>Rp (100.000,-)</p>"]);
			table.row.add(["02","03","Rp 2.700.000,-","<a id='t_4' href='javaScript:void(0);'>Ai Tuti Sulastri</a>","27-May-08","<p>26-Oct-08</p><p>Bond</p>","101 020 300","monthly","0857-59936957","<p>Rp 225.000,-</p><p>Rp 225.000,-</p><p>Rp 200.000,-</p>","<p>Rp 275.000,-</p><p>Rp 250.000,-</p></br>","<p>Rp 50.000,-</p><p>Rp 25.000,-</p><p>Rp (125.000,-)</p>"]);
			table.row.add(["02","04","Rp 2.700.000,-","<a id='t_2' href='javaScript:void(0);'>Rahmawati Shaumah</a>","8-May-08","<p>7-Nov-08</p><p>Bond</p>","101 020 400","6 month","0857-22102914","<p>Rp 225.000,-</p><p>Rp 200.000,-</p>","<p>Rp 225.000,-</p></br>","<p>Rp 0,-</p><p>Rp (200.000,-)</p>"]);
			table.row.add(["02","05","Rp 3.000.000,-","<a id='t_8' href='javaScript:void(0);'>Fanny Astriani</a>","1-May-08","<p>31-Oct-08</p>","101 020 500","6 month","0819-10225333","<p>Rp 215.000,-</p><p>Rp 200.000,-</p><p>Rp 215.000,-</p><p>Rp 215.000,-</p>","<p>Rp 300.000,-</p></br><p>Rp 225.000,-</p></br>","<p>Rp 85.000,-</p><p>Rp (115.000,-)</p><p>Rp (105.000,-)</p><p>Rp (320.000,-)</p>"]);
			table.row.add(["02","06","Rp 2.700.000,-","<a id='t_9' href='javaScript:void(0);'>Nina Tanuatmadja</a>","1-May-08","<p>31-Oct-08</p>","101 020 600","6 month","0857-20517210","<p>Rp 200.000,-</p><p>Rp 200.000,-</p><p>Rp 225.000,-</p><p>Rp 225.000,-</p>","<p>Rp 200.000,-</p><p>Rp 275.000,-</p><p>Rp 250.000,-</p></br>","<p>Rp 0,-</p><p>Rp 75.000,-</p><p>Rp 100.000,-</p><p>Rp (125.000,-)</p>"]);
			table.row.add(["02","07","Rp 3.500.000,-","<a id='t_10' href='javaScript:void(0);'>Yulmedianti K</a>","1-May-08","<p>31-Oct-08</p><p>Bond</p>","101 020 700","6 month","0852-22305695","<p>Rp 350.000,-</p><p>Rp 300.000,-</p><p>Rp 350.000,-</p><p>Rp 350.000,-</p><p>Rp 350.000,-</p></br>","<p>Rp 350.000,-</p><p>Rp 350.000,-</p><p>Rp 450.000,-</p></br></br><p>Rp 450.000,-</p>","<p>Rp 0,-</p><p>Rp 50.000,-</p><p>Rp 150.000,-</p><p>Rp (200.000,-)</p><p>Rp (550.000,-)</p><p>Rp (100.000,-)</p>"]);
			table.row.add(["Total","","Rp 41.000.000,-","","","","","","","Rp 5.185.000,-","Rp 3.190.000,-","Rp (1.995.000,-)"]);
			table.draw(false);
		}
		if (Ref == 7){
			// change address and total room
			$("#totalR").html("0")
			$("#address1").html("Jl. Private No. 2 RT 3 RW 4, Yes, No")
			$("#buildNo1").html($("#buildNo").val())
		}
		// else
		if (Ref != 1 && Ref != 3 && Ref != 7){
			$("#totalR").html("0")
			$("#address1").html("NOT FOUND")
			$("#buildNo1").html($("#buildNo").val())
		}
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
		
	});
	//check other expense
	$("#detailsex").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "other") {
			$("#optex").fadeIn(250, function() {
				$(this).removeClass("hide");
			})
		} else {
			$("#optex").fadeOut(250, function() {
				$(this).addClass("hide")
			});
		}
	})
	//income add button listener
	$("#incomeb").on('click', function() {
		$("#addIncomeModal").modal();
	})
	//expense add button listener
	$("#expenseb").on('click', function() {
		$("#addExpenseModal").modal();
	})
	
	//check other income
	$("#detailsin").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "other") {
			$("#optin").fadeIn(250, function() {
				$(this).removeClass("hide");
			})
		} else {
			$("#optin").fadeOut(250, function() {
				$(this).addClass("hide")
			});
		}
	})
	//check other expense
	$("#detailsex").on('change', function() {
		if ($(this).find("option:selected").attr("value") == "other") {
			$("#optex").fadeIn(250, function() {
				$(this).removeClass("hide");
			})
		} else {
			$("#optex").fadeOut(250, function() {
				$(this).addClass("hide")
			});
		}
	})
	//start search bar autocomplete
	$("#buildno").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(buildList, request.term);
			response(results.slice(0, 10));
		},
		select: function(event, ui) {
			$("#buildno").replaceWith("<div class='checkbox'><span id='buildno' name='buildno'>"+ui.item.buildnumber+"</span></div>");
			return false;
		}
	});
	$("#buildno").autocomplete("instance")._renderItem = function(ul,item) {
		return $("<li>")
			.append("<div>"+item.label+" ("+item.buildnumber+")</div>")
			.appendTo(ul);
	};
	//start search bar autocomplete
	$("#buildno2").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(buildList, request.term);
			response(results.slice(0, 10));
		},
		select: function(event, ui) {
			$("#buildno2").replaceWith("<div class='checkbox'><span id='buildno' name='buildno'>"+ui.item.buildnumber+"</span></div>");
			return false;
		}
	});
	$("#buildno2").autocomplete("instance")._renderItem = function(ul,item) {
		return $("<li>")
			.append("<div>"+item.label+" ("+item.buildnumber+")</div>")
			.appendTo(ul);
	};

	//collect id from link
	var refBuild = window.location.href.split('=');
	if (refBuild[1] == undefined) {
		//no building number defined
		document.getElementById('buildNo').value = "1";
		$("#buildNo").trigger("change");
	} else if (refBuild[1] != "undefined") {
		//building number defined
		document.getElementById('buildNo').value = parseInt(refBuild[1]);
		$("#buildNo").trigger("change");
	}
	
	//stop loading icon
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	})
});