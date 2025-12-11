var editObjectId;
var editHighlightBorderOld;
function _contentEdit(messageID) {
    // Get Content From Server
    messageObj = getMessage(messageID);

    // Display Lightbox
	document.getElementById('contentEditTextArea').value=messageObj.content;
    CKEDITOR.replace( 'contentEditTextArea' );
}
function _contentSave()
{
    var editObject = _contentIdParse(editObjectId);

    // Send changes to API
    updateMessageContent(editObject.number,CKEDITOR.instances.contentEditTextArea.getData());

    // Update Content On Page
    document.getElementById(editObjectId).innerHTML = CKEDITOR.instances.contentEditTextArea.getData();

    // Hide Lightbox
    document.getElementById('contentEditWindow').style.display='none';
    document.getElementById('lightBoxBg').style.display='none';
    document.getElementById('lightBox').style.display='none';
}
function _contentOutline(contentBox)
{
    // Store Old Style
    editHighlightBgOld = document.getElementById(contentBox).style.background;
    // Add Outline Border
    document.getElementById(contentBox).style.background = '#aaffaa';
}
function _contentNoOutline(contentBox)
{
    // Restore old border
    document.getElementById(contentBox).style.background = editHighlightBgOld;
}
function _contentIdParse(string)
{
    // Store Current Box
    editObjectId = string;

    // Parse Box ID
    var patt1=/r7_(\w+)\[(\d+)\]/gi;
    string.match(patt1);
    editObject = new Object();
    editObject.id = string;
    editObject.type = RegExp.$1;
    editObject.number = RegExp.$2;
    return editObject;
}
function goToEditPage(target) {
	if (typeof(target) === "undefined") target = "";
	window.location.href = "/_site/content_block/"+target;
	return true;
}

// Old Editor Window Load Functions
function ___editContent(object,origin,id) {
	var textEditor=window.open("/_admin/text_editor?object="+object+"&origin="+origin+"&id="+id,"","width=800,height=600,left=20,top=20,status=0,toolbar=0");
};
function ___highlightContent(contentElem) {
	document.getElementById('contentElem').style.border = '1px solid red';
};
function ___blurContent(contentElem) {
	document.getElementById('contentElem').style.border = '0px';
};
