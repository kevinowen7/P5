//array for search bar autocomplete
var tenantNames = [
	{
		label: "Bea Curran",
		tenantid: "t_1",
		refnumber: "101010100"
	},
	{
		label: "Kevin Owen",
		tenantid: "t_2",
		refnumber: "101010300"
	},
	{
		label: "Briana Holloway",
		tenantid: "t_3",
		refnumber: "101010200"
	},
	{
		label: "Zakary Neville",
		tenantid: "t_4",
		refnumber: "101010400"
	},
	{
		label: "Aleksandra Hyde",
		tenantid: "t_5",
		refnumber: "101010500"
	},
	{
		label: "Amari O'Reilly",
		tenantid: "t_6",
		refnumber: "101020100"
	},
	{
		label: "Jan Garrison",
		tenantid: "t_7",
		refnumber: "101020300"
	},
	{
		label: "Kevin Owen",
		tenantid: "t_8",
		refnumber: "102010200"
	},
	{
		label: "Pamela Daugherty",
		tenantid: "t_9",
		refnumber: "102010100"
	},
	{
		label: "Vernon Kirkland",
		tenantid: "t_10",
		refnumber: "101010101"
	},
	{
		label: "Jacob Connolly",
		tenantid: "t_11",
		refnumber: "102020100"
	}
];
//sort array ascending based on name
tenantNames.sort(function(a, b){
	var nameA=a.label.toLowerCase(), nameB=b.label.toLowerCase();
	if (nameA < nameB) //sort string ascending
		return -1;
	if (nameA > nameB)
		return 1;
	return 0; //default return value (no sorting)
});

// hide/show payment tab
function showPayment(){
	$("#invoicep").val("1");
	$("#tabvoice").fadeOut(250, function() {
		$(this).addClass('hide');
	})
	if ($("#paymentp").val()=="1"){
		$("#paymentp").val("0");
		$("#tabpayment").fadeIn(250, function() {
			$(this).removeClass('hide');
		})
	}
	else {
		$("#paymentp").val("1");
		$("#tabpayment").fadeOut(250, function() {
			$(this).addClass('hide');
		})
	}
}

// hide/show in voice tab
function showInvoice(){
	$("#paymentp").val("1");
	$("#tabpayment").fadeOut(250, function() {
		$(this).addClass('hide');
	})
	if ($("#invoicep").val()=="1"){
		$("#invoicep").val("0");
		$("#tabvoice").fadeIn(250, function() {
			$(this).removeClass('hide');
		})
	}
	else {
		$("#invoicep").val("1");
		$("#tabvoice").fadeOut(250, function() {
			$(this).addClass('hide');
		})
	}
}

function removeOptions(selectbox) {
	
    //clear select options
    for(i=selectbox.options.length-1; i>=1; i--) {
        selectbox.remove(i);
    }
	
}

function payment(){
	tenantid = $("#tenantnamepay").attr('name');
	window.location = "tenant_details.html?id="+tenantid+"#ledger";

}
function invoice(){
	tenantid = $("#tenantnamein").attr('name');
	window.location = "tenant_details.html?id="+tenantid+"#ledger";

}
$(document).ready(function() {
	// check href
	var link_ = window.location.href.split('#')[1];
	if (link_=="payment"){
		showPayment();
	} else if (link_=="invoice") {
		showInvoice();
	}
	
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
	//invoice bond checkbox listener
	$("input[type=checkbox][name=invoiceBond]").on('change', function() {
		if (this.checked) {
			$("#invoiceDetailsOtherBlock,#invoiceRecurrentBlock").fadeOut(250, function() {
				$(this).hide();
			})
			removeOptions(document.getElementById("invoiceDetails"));
			var optionElement1 = document.createElement("option");
			var optionElement2 = document.createElement("option");
			optionElement1.value = "transfer";
			optionElement1.innerHTML = "Bond Money Transfer";
			optionElement2.value = "refund";
			optionElement2.innerHTML = "Bond Money Refund";
			document.getElementById("invoiceDetails").appendChild(optionElement1);
			document.getElementById("invoiceDetails").appendChild(optionElement2);
		} else {
			$("#invoiceDetailsOtherBlock").fadeOut(250, function() {
				$(this).hide();
			})
			$("#invoiceRecurrentBlock").fadeIn(250, function() {
				$(this).show();
			})
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
		}
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
	//start search bar autocomplete
	$("#tenantname").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(tenantNames, request.term);
			response(results.slice(0, 10));
		},
		select: function(event, ui) {
			$("#tenantname").replaceWith("<div class='checkbox'><span id='tenantnamepay' name='"+ui.item.tenantid+"'>"+ui.item.label+"</span></div>");
			return false;
		}
	});
	$("#tenantname").autocomplete("instance")._renderItem = function(ul,item) {
		return $("<li>")
			.append("<div>"+item.label+" ("+item.refnumber+")</div>")
			.appendTo(ul);
	};
	//start search bar autocomplete
	$("#tenantname2").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(tenantNames, request.term);
			response(results.slice(0, 10));
		},
		select: function(event, ui) {
			$("#tenantname2").replaceWith("<div class='checkbox'><span id='tenantnamein' name='"+ui.item.tenantid+"'>"+ui.item.label+"</span></div>");
			return false;
		}
	});
	$("#tenantname2").autocomplete("instance")._renderItem = function(ul,item) {
		return $("<li>")
			.append("<div>"+item.label+" ("+item.refnumber+")</div>")
			.appendTo(ul);
	};
});