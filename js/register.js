/* register.js
	JavaScript representation of Porkchop
	Web Portal Register Objects.
	Copyright Boston Metrics, Inc. 2017
*/
var apiError = '';

var Customer = {
	error: '',
	id: '',
	code: '',
	first_name: '',
	last_name: '',
	organization: '',
	identified: false,
	timezone: '',
	admin: false,
	unreadMessages: 0,
	csrfToken: '',
    authenticate: function(login,password) {
    
		// Get Info from API
        var resultXML = apiRequest('/_register/api','method=authenticateSession&login='+login+'&password='+password);
        
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
        var resultObj = XMLParse.xmlElem2Obj(resultXML);
        if (resultObj.success == 1) {
			return true;
		} else {
			// Store the error and reason for TOTP handling
			this.error = resultObj.error;
			this.reason = resultObj.reason;
			this.requires_otp = resultObj.requires_otp;
			
			// Store in global object for myaccount.js to access
			window.customerAuth = {
				error: resultObj.error,
				reason: resultObj.reason,
				requires_otp: resultObj.requires_otp
			};
			return false;
        }
	},
    checkPasswordStrength: function(password) {
    
		// Get Info from API
        var resultXML = apiRequest('/_register/api','method=checkPasswordStrength&password='+password);
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
        var resultObj = XMLParse.xmlElem2Obj(resultXML);
        if (resultObj.success == 1) {
			return true;
		} else {
			return false;
        }
	},
	me: function() {
	
		// Get Info from API
		var resultXML = apiRequest('/_register/api','method=me');
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1)	{
			if (typeof(resultObj.customer.code) === 'undefined' || resultObj.customer.code.length == 0) {
				this.identified = false;
				console.log("Customer code empty");
				return false;
			}
			this.identified = true;
			this.code = resultObj.customer.code;
			this.first_name = resultObj.customer.first_name;
			this.last_name = resultObj.customer.last_name;
			this.organization = Object.create(Organization);
			this.organization.name = resultObj.customer.organization.name;
			this.timezone = resultObj.customer.timezone;
			this.unreadMessages = resultObj.customer.unreadMessages;
			if (resultObj.customer.admin == 1) this.admin = true;
			if (this.admin) console.log("Customer '"+this.code+"' authenticated as admin");
			else console.log("Customer '"+this.code+"' authenticated");
			return true;
		} else {
			console.log("API Failure");
			return false;
		}
	},
	get: function(code) {
	
		// Get Info from API
		var resultXML = apiRequest('/_register/api','method=getCustomer&code='+code);
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Uncomment to see XML
		console.log(resultXML);

		// Parse Response
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1)	{
			if (typeof(resultObj.customer.code) === 'undefined' || resultObj.customer.code.length == 0) {
				this.identified = false;
				console.log("Customer code empty");
				return false;
			}
			this.identified = true;
			console.log("Customer '"+resultObj.customer.code+"' returned for get()");
			this.id = resultObj.customer.id;
			this.code = resultObj.customer.code;
			this.first_name = resultObj.customer.first_name;
			this.last_name = resultObj.customer.last_name;
			
			// @TODO - Load Organization - is this required?
			//this.organization = Object.create(Organization);
			//this.organization.name = resultObj.customer.organization.name;
			return true;
		} else {
			return false;
		}
	},
	locations: function() {
		var resultXML = apiRequest('/_register/api','method=findCustomerLocations&code='+this.code);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			var locationArray = [];
			var locations = XMLParse.xml2ObjArray(resultXML,'location');
			for (var i = 0; i < locations.length; i ++) {
				console.log(locations[i]);
				var location = Object.create(Location);
				location.id = locations[i].id;
				location.name = locations[i].name;
				location.city = locations[i].city;
				location.zip_code = locations[i].zip_code;
				location.province_id = locations[i].province_id;
				location.province = Object.create(Province);
				location.province.load(locations[i].province_id);
				locationArray.push(location);
			}
			return locationArray;
		}
	},
	getToken() {
		var resultXML = apiRequest('/_monitor/api','method=csrfToken');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success) {
			var token = resultObj.token;
			console.log("Token: "+token);
			this.csrfToken = token;
		}
	},
};

var CustomerList = {
	error: '',
	find: function() {
		var resultXML = apiRequest('/_register/api','method=findCustomers');
		if (apiError.length) {
			console.log("No way");
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		console.log(resultObj);
		if (resultObj.success == 1) {
			var userList = [];
			var users = XMLParse.xml2ObjArray(resultXML,'customer');
			for (var i = 0; i < users.length; i ++) {
				console.log(users[i]);
				var user = Object.create(Customer);
				user.id = users[i].id;
				user.code = users[i].code;
				user.first_name = users[i].first_name;
				user.last_name = users[i].last_name;
				user.organization_id = users[i].organization_id;
				user.timezone = users[i].timezone;
				user.unreadMessages = users[i].unreadMessages;
				userList.push(user);
				console.log(user);
			}
			return userList;
		}
		else {
			console.log("Nope!");
			this.error = "API Error: "+resultObj.error;
			return;
		}
	}
};

var Organization = {
	error: '',
	code: '',
	name: '',
	get(code) {
		var resultXML = apiRequest('/_register/api','method=getOrganization&code='+code);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			this.id = resultObj.organization.id;
			this.code = resultObj.organization.code;
			this.name = resultObj.organization.name;
			return true;
		}
		else return false;
	},
	members() {
		var resultXML = apiRequest('/_register/api','method=findOrganizationMembers');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			var memberArray = [];
			var members = XMLParse.xml2ObjArray(resultXML,'member');
			for (var i = 0; i < members.length; i ++) {
				console.log(members[i]);
				var customer = Object.create(Customer);
				customer.id = members[i].name;
				customer.first_name = members[i].first_name;
				customer.last_name = members[i].last_name;
				customer.organization_id = members[i].organization_id;
				membersArray.push(customer);
			}
			return membersArray;
		}
	},
	humans() {
		var resultXML = apiRequest('/_register/api','method=findOrganizationMembers&type=human');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			var memberArray = [];
			var members = XMLParse.xml2ObjArray(resultXML,'member');
			for (var i = 0; i < members.length; i ++) {
				console.log(members[i]);
				var customer = Object.create(Customer);
				customer.id = members[i].name;
				customer.first_name = members[i].first_name;
				customer.last_name = members[i].last_name;
				customer.organization_id = members[i].organization_id;
				memberArray.push(customer);
			}
			return memberArray;
		}
	},
	devices() {
		var resultXML = apiRequest('/_register/api','method=findOrganizationMembers&type=automation');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			var memberArray = [];
			var members = XMLParse.xml2ObjArray(resultXML,'member');
			for (var i = 0; i < members.length; i ++) {
				console.log(members[i]);
				var customer = Object.create(Customer);
				customer.id = members[i].name;
				customer.first_name = members[i].first_name;
				customer.last_name = members[i].last_name;
				customer.organization_id = members[i].organization_id;
				membersArray.push(customer);
			}
			return membersArray;
		}
	}
};

var OrganizationList = {
	error: '',
	find: function(queryParams) {
		var POSTParams = 'method=findOrganizations';

		if (typeof(queryParams) !== 'undefined') {
			if (typeof(queryParams.name) !== 'undefined') {
				POSTParams += '&name='+queryParams.name;
			}
			if (typeof(queryParams.code) !== 'undefined') {
				POSTParams += '&code='+queryParams.code;
			}
			if (typeof(queryParams.id) !== 'undefined') {
				POSTParams += '&id='+queryParams.id;
			}
		}
		console.log(POSTParams);
		var resultXML = apiRequest('/_register/api',POSTParams);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			var orgList = [];
			var orgs = XMLParse.xml2ObjArray(resultXML,'organization');
			for (var i = 0; i < orgs.length; i ++) {
				console.log(orgs[i]);
				var org = Object.create(Organization);
				org.id = orgs[i].id;
				org.code = orgs[i].code;
				org.name = orgs[i].name;
				orgList.push(org);
				console.log(org);
			}
			return orgList;
		}
		else {
			console.log("Nope!");
			this.error = "API Error: "+resultObj.error;
			return;
		}
	}
};

var Role = {
	error: '',
	id: '',
	name: '',
	description: '',
	get: function(id) {
		var resultXML = apiRequest('/_register/api','method=getRole&id='+id);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			this.id = resultObj.role.id;
			this.name = resultObj.role.name;
			this.description = resultObj.role.description;
			return true;
		}
		else return false;
	}
};

var RoleList = {
	error: '',
	find: function() {
		var resultXML = apiRequest('/_register/api','method=findRoles');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}
		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			var roleList = [];
			var roles = XMLParse.xml2ObjArray(resultXML,'role');
			for (var i = 0; i < roles.length; i ++) {
				console.log(roles[i]);
				var role = Object.create(Role);
				role.id = roles[i].id;
				role.name = roles[i].name;
				role.description = roles[i].description;
				roleList.push(role);
				console.log(role);
			}
			return roleList;
		}
		else {
			console.log("Nope!");
			this.error = "API Error: "+resultObj.error;
			return;
		}
	}
};

var Location = {
	id: '',
	name: '',
	address_1: '',
	address_2: '',
	city: '',
	zip_code: '',
	province_id: '',
	province() {
		var province = Object.create(Province);
		province.load(this.id);
		return province;
	}
};

var AntiCSRFToken = {
	error: '',
	get: function() {
		var resultXML = apiRequest('/_register/api','method=csrfToken');
        if (apiError.length) {
            this.error = "API Error: "+apiError;
            return;
        }

		// Parse Response
        var resultObj = XMLParse.xmlElem2Obj(resultXML);
        if (resultObj.success) {
			return resultObj.token;
            return true;
        }
        else {
            this.error = "Error from api: ".resultObj.error;
    	    return false;
        }
	}
}
