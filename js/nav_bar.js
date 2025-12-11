var menuStatus = new Array();
function parseMenu(elemRq)
{
        elemRq.id.match(/^(\w+)\[(\w+)\]$/);
        var elemRs              = new Object();
        elemRs.type             = RegExp.$1;
        elemRs.ID               = RegExp.$2;
        elemRs.child    = document.getElementById('child_container['+elemRs.ID+']');
        elemRs.parent   = document.getElementById('button['+elemRs.ID+']');
        return elemRs;
}
function expandMenu(elemID)
{
		var elem = document.getElementById(elemID);
        elemRs=parseMenu(elem);
        var parentCorner = findCorner(elemRs.parent);
        elemRs.child.style.left = (parseInt(parentCorner[0]) - 210) + 'px';
        //elemRs.child.style.top = elemRs.parent.offsetHeight + parentCorner[1] - 89;
        elemRs.child.style.display = 'block';
        menuStatus[elem.id] = true;
        return true;
}
function collapseMenu(elemID)
{
		var elem = document.getElementById(elemID);
        elemRs = parseMenu(elem);
        menuStatus[elem.id] = false;
		var date = new Date();
		var curDate = null;
		do { curDate = new Date(); }
		while(curDate-date < 100);
		if ((! menuStatus[elemRs.child.id]) && (! menuStatus[elemRs.parent.id]))
		{
				elemRs.child.style.display = 'none';
		}
        return true;
}
function findCorner(obj)
{
        var curleft = curtop = 0;
        var message = '';
        if (obj.offsetParent)
        {
                do {
                        if (obj.id == 'main') { break };
                        curleft += obj.offsetLeft;
                        curtop += obj.offsetTop;
                        if (message) message += '+';
                        message += obj.offsetLeft + '['+obj.id+']';
                } while (obj = obj.offsetParent);
        }
        //alert(message);
        return [curleft,curtop];
}
