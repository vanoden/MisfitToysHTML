/*	Set contents and call moveTip to position. */
var tipElem;
function showTip(elem,evt,message)
{
	tipElem=document.getElementById("toolTip");
	tipElem.innerHTML=message;
	moveTip(elem,evt);
	tipElem.style.display = "block";
	tipElem.style.position = "absolute";
	//tipElem.innerHTML += parseInt(evt.pageY + 15) + 'px x ' + parseInt(evt.pageX + 15) + 'px';
}
/*	Position the Tip Element */
function moveTip(elem,evt)
{
	if(document.all) // for IE5+ only
	{
		tipElem.style.pixelTop=(document.body.scrollTop + event.clientY) + 15;
		tipElem.style.pixelLeft=(document.body.scrollLeft + event.clientX) + 15;
	}
	else
	{
		tipElem.style.top = parseInt(evt.pageY + 15) + 'px';
		tipElem.style.left = parseInt(evt.pageX + 15) + 'px';
	}
}
/*	Hide the tooltip */
function hideTip()
{
	tipElem.style.display="none";
}

/* Backwards Compatibility */
function movetip(elem,evt)
{
	moveTip(elem,evt);
}
function showtip(elem,evt,num,message)
{
	showTip(elem,evt,num,message);
}
function hidetip()
{
	hideTip();
}