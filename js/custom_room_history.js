$(document).ready(function() {

	//collect id from link
	var refBuild = window.location.href.split('=');
	if (refBuild[1] == undefined) {
		alert("Room not found!");
		window.location = "room_list.html";
	} else if (refBuild[1] != "undefined") {
		var breakId = refBuild[1].split("");
		var roomNumb = breakId[5]+breakId[6];
		$("#roomNumb").html(roomNumb);
	}
	//stop loading icon
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	});

})