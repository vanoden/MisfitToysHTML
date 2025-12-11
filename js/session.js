var Session = {
	code: '',
	me: function() {
		var resultXML = apiRequest('/_monitor/api?method=findCollectionSensors&collection_code='+this.code);
		if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
        var resultObj = XMLParse.xmlElem2Obj(resultXML);
        if (resultObj.success) {
			return XMLParse.xml2ObjArray(resultXML,'sensor');
        }
        else {
            this.error = "Error from api: ".resultObj.error;
    	    return;
        }
	}
}