jQuery.fn.dataTableExt.oSort['us_date-asc']  = function(a,b) {
 var x = new Date(a),
     y = new Date(b);
 return ((x < y) ? -1 : ((x > y) ?  1 : 0));
};

jQuery.fn.dataTableExt.oSort['us_date-desc'] = function(a,b) {
 var x = new Date(a),
     y = new Date(b);
 return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
};