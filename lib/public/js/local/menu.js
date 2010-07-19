/*
* JQUERY SIMPLE MENU 
* BY HTTP://WWW.LASTWEBDESIGNER.COM
*/
$(document).ready(function(){
var Duration = 150; //time in milliseconds

	      $('#navigation ul li a').hover(function() {
	        $(this).animate({ paddingLeft: '20px' }, Duration);
	      }, function() {
	        $(this).animate({ paddingLeft: '0px' }, Duration);           
	      });

		
});