/* geography.js
	JavaScript representation of Porkchop
	Web Portal Storage Objects.
	Copyright Boston Metrics, Inc. 2017
*/
var apiError = '';

var World = {
	error: '',
	getCountries: function() {
		var resultXML = apiRequest('/_geography/api?method=findCountries');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}

		// Parse Response
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success) {
			var countryArray = [];
			var countries = XMLParse.xml2ObjArray(resultXML,'country');
			for (var i = 0; i < countries.length; i ++) {
				var country = Object.create(Country);
				country.id = countries[i].id;
				country.name = countries[i].name;
				country.abbreviation = countries[i].abbreviation;
				country.code = countries[i].code;
				countryArray.push(country);
			}
			return countryArray;
		}
		else {
			this.error = "Error from api: ".resultObj.error;
			return;
		}
	}
};

var Country = {
	error: '',
	id: '',
	abbreviation: '',
	name: '',
    get: function(name) {
		// Get Info from API
        var resultXML = apiRequest('/_geography/api?method=getCountry&name='+name,'');
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
        var resultObj = XMLParse.xmlElem2Obj(resultXML);
        if (resultObj.success) {
			var country = resultObj.country;
			if (!country) {
				this.error = "Country not found";
				return null;
			}
			this.id = country.id;
            this.name = country.name;
			this.abbreviation = country.abbreviation;
			return true;
        }
        else {
            this.error = "Error from api: ".resultObj.error;
    	    return false;
        }
	},
	getProvinces() {
		var resultXML = apiRequest('/_geography/api?method=findProvinces&country_id='+this.id);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}

		// Parse Response
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success) {
			var provinceArray = [];
			var provinces = XMLParse.xml2ObjArray(resultXML,'province');
			for (var i = 0; i < provinces.length; i ++) {
				var province = Object.create(Province);
				province.id = provinces[i].id;
				province.name = provinces[i].name;
				province.abbreviation = provinces[i].abbreviation;
				province.code = provinces[i].code;
				province.country_id = provinces[i].country_id;
				provinceArray.push(province);
			}
			return provinceArray;
		}
		else {
			this.error = "Error from api: ".resultObj.error;
			return;
		}
	},
	load() {
		var resultXML = apiRequest('/_geography/api','method=getCountry&id='+this.id);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}

		// Uncomment to see XML
		console.log(resultXML);

		// Parse Response
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1)	{
			this.id = resultObj.country.id;
			this.name = resultObj.country.name;
			this.abbreviation = resultObj.country.abbreviation;
			return true;
		}
		else {
			return false;
		}
	}
}

var CountryList = {
	error: '',
	count: 0,
	find: function(parameters) {
		var uri = '/_geography/api?method=findCountries';
		if (typeof(parameters) === 'array') {
			if (typeof(parameters['name']) != 'undefined')
				uri += '&name='+parameters['name'];
			if (typeof(parameters['abbreviation']) != 'undefined')
				uri += '&abbreviation='+parameters['abbreviation'];
		}

		var resultXML = apiRequest(uri,'');
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success) {
			var countries = new Array();
			var results = XMLParse.xml2ObjArray(resultXML,'country');
			for (var i = 0; i < results.length; i ++) {
				var country = Object.create(Country);
				country.id = results[i].id;
				country.name = results[i].name;
				country.abbreviation = results[i].abbreviation;
				countries.push(country);
			}
			return countries;
		}
		else {
			this.error = "Error from api: ".resultObj.error;
			return false;
		}
	}
}


var Province = {
	error: '',
	id: '',
	code: '',
	country_id: '',
	abbreviation: '',
	name: '',
    get: function(name) {
		// Get Info from API
        var resultXML = apiRequest('/_geography/api?method=getProvince&country_id='+this.country_id+'&name='+name,'');
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
        var resultObj = XMLParse.xmlElem2Obj(resultXML);
        if (resultObj.success) {
			var province = resultObj.province;
			if (!province) {
				this.error = "Country not found";
				return null;
			}
			this.id = province.id;
			this.country_id = province.country_id;
			this.code = province.code;
            this.name = province.name;
			this.abbreviation = province.abbreviation;
			return true;
        }
        else {
            this.error = "Error from api: ".resultObj.error;
    	    return false;
        }
	}
}

var ProvinceList = {
	error: '',
	count: 0,
	find: function(parameters) {
		var uri = '/_geography/api?method=findProvinces';
		if (typeof(parameters) === 'array') {
			if (typeof(parameters['country_id']) != 'undefined')
				uri += '&country_id='+parameters['country_id'];
			if (typeof(parameters['name']) != 'undefined')
				uri += '&name='+parameters['name'];
			if (typeof(parameters['abbreviation']) != 'undefined')
				uri += '&abbreviation='+parameters['abbreviation'];
		}
		else if (typeof(parameters) === 'object') {
			if (typeof(parameters.country_id) != 'undefined')
				uri += '&country_id='+parameters.country_id;
			if (typeof(parameters.name) != 'undefined')
				uri += '&name='+parameters.name;
			if (typeof(parameters.abbreviation) != 'undefined')
				uri += '&abbreviation='+parameters.abbreviation;
		}

		var resultXML = apiRequest(uri,'');
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success) {
			var provinces = new Array();
			var results = XMLParse.xml2ObjArray(resultXML,'province');
			for (var i = 0; i < results.length; i ++) {
				var province = Object.create(Province);
				province.id = results[i].id;
				province.code = results[i].code;
				province.country_id = results[i].country_id;
				province.name = results[i].name;
				province.abbreviation = results[i].abbreviation;
				provinces.push(province);
			}
			return provinces;
		}
		else {
			this.error = "Error from api: ".resultObj.error;
			return false;
		}
	}
}