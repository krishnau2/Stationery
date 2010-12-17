var timeout         = 500;
var closetimer		= 0;
var ddmenuitem      = 0;

function pulldown_menu_open()
{	pulldown_menu_canceltimer();
	pulldown_menu_close();
	ddmenuitem = $(this).find('ul').eq(0).css('visibility', 'visible');}

function pulldown_menu_close()
{	if(ddmenuitem) ddmenuitem.css('visibility', 'hidden');}

function pulldown_menu_timer()
{	closetimer = window.setTimeout(pulldown_menu_close, timeout);}

function pulldown_menu_canceltimer()
{	if(closetimer)
	{	window.clearTimeout(closetimer);
		closetimer = null;}}

$(document).ready(function()
{	$('#pulldown_menu > li').bind('mouseover', pulldown_menu_open);
	$('#pulldown_menu > li').bind('mouseout',  pulldown_menu_timer);});

document.onclick = pulldown_menu_close;

