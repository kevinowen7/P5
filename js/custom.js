/* Sidebar navigation */
/* ------------------ */

/* Show navigation when the width is greather than or equal to 991px */

$(document).ready(function(){

  $(window).resize(function()
  {
    if($(window).width() >= 767){
      $(".side-nav").slideDown(150);
    }     
	else{
	  $(".side-nav").slideUp(150);
	}	
  });

});

/* ****************************************** */
/* Sidebar dropdown */
/* ****************************************** */

$(document).ready(function(){
  $(".sidebar-dropdown a").on('click',function(e){
      e.preventDefault();

      if(!$(this).hasClass("open")) {
        // hide any open menus and remove all other classes
        $(".sidebar .side-nav").slideUp(150);
        $(".sidebar-dropdown a").removeClass("open");
        
        // open our new menu and add the open class
        $(".sidebar .side-nav").slideDown(150);
        $(this).addClass("open");
      }
      
      else if($(this).hasClass("open")) {
        $(this).removeClass("open");
        $(".sidebar .side-nav").slideUp(150);
      }
  });

});

/* ****************************************** */
/* Sidebar dropdown menu */
/* ****************************************** */

$(document).ready(function(){

  $(".has_submenu > a").click(function(e){
    e.preventDefault();
    var menu_li = $(this).parent("li");
    var menu_ul = $(this).next("ul");

    if(menu_li.hasClass("open")){
      menu_ul.slideUp(150);
      menu_li.removeClass("open");
	  $(this).find("span").removeClass("fa-caret-up").addClass("fa-caret-down");
    }
    else{
      $(".side-nav > li > ul").slideUp(150);
      $(".side-nav > li").removeClass("open");
      menu_ul.slideDown(150);
      menu_li.addClass("open");
	  $(this).find("span").removeClass("fa-caret-down").addClass("fa-caret-up");
    }
  });
  
});

/* ****************************************** */
/* Slim Scroll */
/* ****************************************** */

$(function(){
    $('.scroll').slimScroll({
        height: '315px',
		size: '5px',
		color:'rgba(50,50,50,0.3)'
    });
});	

/* ****************************************** */
/* Knob */
/* ****************************************** */

$(function() {
    $(".knob").knob();
});

/* ****************************************** */
/* JS for UI Tooltip */
/* ****************************************** */

$('.ui-tooltip').tooltip();

/* ****************** */
/* Date Time Picker JS */
/* ****************** */

$(function() {
	$('#datetimepicker1').datetimepicker({
		pickTime: false
	});
});
$(function() {
	$('#datetimepicker2').datetimepicker({
		pickDate: false
	});
});

/* ****************************** */
/* Slider */
/* ******************************* */

    $(function() {
        // Horizontal slider
        $( "#master1, #master2" ).slider({
            value: 60,
            orientation: "horizontal",
            range: "min",
            animate: true
        });

        $( "#master4, #master3" ).slider({
            value: 80,
            orientation: "horizontal",
            range: "min",
            animate: true
        });        

        $("#master5, #master6").slider({
            range: true,
            min: 0,
            max: 400,
            values: [ 75, 200 ],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            }
        });


        // Vertical slider 
        $( "#eq > span" ).each(function() {
            // read initial values from markup and remove that
            var value = parseInt( $( this ).text(), 10 );
            $( this ).empty().slider({
                value: value,
                range: "min",
                animate: true,
                orientation: "vertical"
            });
        });
    });
 
/* ****************** */
/* Calendar */
/* ****************************************** */

  $(document).ready(function() {
  
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    $('#calendar').fullCalendar({
      header: {
        left: 'prev',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,next'
      },
      editable: true,
      events: [
        {
          title: 'All Day Event',
          start: new Date(y, m, 1)
        },
        {
          title: 'Long Event',
          start: new Date(y, m, d-5),
          end: new Date(y, m, d-2)
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d-3, 16, 0),
          allDay: false
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: new Date(y, m, d+4, 16, 0),
          allDay: false
        },
        {
          title: 'Meeting',
          start: new Date(y, m, d, 10, 30),
          allDay: false
        },
        {
          title: 'Lunch',
          start: new Date(y, m, d, 12, 0),
          end: new Date(y, m, d, 14, 0),
          allDay: false
        },
        {
          title: 'Birthday Party',
          start: new Date(y, m, d+1, 19, 0),
          end: new Date(y, m, d+1, 22, 30),
          allDay: false
        },
        {
          title: 'Click for Google',
          start: new Date(y, m, 28),
          end: new Date(y, m, 29),
          url: 'http://google.com/'
        }
      ]
    });
    
  });
  
/* ****************************************** */
/* Form Validate // Form Validation */
/* ****************************************** */



/* ****************************************** */
/* Form Wizard */
/* ****************************************** */

$(document).ready(function() {

	$("#wizard").steps({
		headerTag: "h2",
		transitionEffect: "slide",
		autoFocus: true
	});
});

/* ****************************************** */
/* Compose Mail Form word processor JS */
/* ****************************************** */

$('.textarea').wysihtml5();
$(prettyPrint);

/* ****************************************** */
/* Task widget */
/* ****************************************** */

$(document).ready(function(){   
   $('.tasks-widget input:checkbox').removeAttr('checked').on('click', function(){
      if(this.checked){
         $(this).next("span").css('text-decoration','line-through');
      }
      else{
         $(this).next("span").css('text-decoration','none');
      }
	});
});

/* ****************************************** */
/* Functions */
/* ****************************************** */

function startPageLoad() {
	
	$("#cover-spin").fadeIn(250, function() {
		$(this).show();
	});
	
}

function stopPageLoad() {
	
	$("#cover-spin").fadeOut(250, function() {
		$(this).hide();
	});
	
}

function addNotification(customTitle,customText) {
	
	$.gritter.add({
		title: customTitle,
		text: customText,
		image: "./img/bell.png",
		sticky: false,
		time: 3500,
		class_name: "gritter-custom"
	});
	
}

function logout(){
	
	firebase.auth().signOut();
	
}