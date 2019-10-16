$(document).ready(function() {
	
	//select table to work with jquery datatables
	var table = $('#data-table1').DataTable({
		"aLengthMenu": [[10, 20, -1], [10, 20, "All"]],
        "iDisplayLength": 10,
		"sPaginationType": "full_numbers",
		"order": [[ 0, "asc" ]],
		"columnDefs": [
		{
			targets: 0,
			width: "7%"
		},
		{
			targets: 2,
			width: "17%"
		},
		{
			targets: 3,
			width: "25%"
		},
		{ 
			targets: -1,
			width: "15%",
			orderable: false,
			defaultContent:"<button id='removebutt' class='btn btn-xs btn-danger' title='Stop'><i class='fa fa-stop'></i></button>"
		}
		]
	})

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

	id2 = window.location.href.split('=')[1];
	id = id2.split("#")[0];
	rentprice=window.location.href.split('/=')[1];
	payplan=window.location.href.split('/=')[2];

	table.row.add(["<a href='javaScript:void(0)'>01</a>","Rental Due",get_fmoney(rentprice),"Rental Due",payplan,null]).node().id = 'booking1';
	table.draw();

	tenant=firebase.database().ref().child("tenant/"+id);
	tenantroom=firebase.database().ref().child("tenant-room/"+id);
	
	
	tenantroom.on("child_added", function(snapshot){
		refNumb=snapshot.child("ref_number").val()
		$("#tenant_id").html(refNumb)
	})

	tenant.on("value", function(snapshot){
		full_name=snapshot.child("full_name").val()
		$("#tenant_name").html(full_name)
	})

	

	setTimeout(function(){
		//stop loading icon
		$("#cover-spin").fadeOut(250, function() {
			$(this).hide();
		})
	}, 1000);
	//add tenant button listener
	$("#baddt").on('click', function() {
		window.location = "tenant_add.html";
	})
	
});