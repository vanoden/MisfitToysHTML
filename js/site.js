// Show Name in Login Tab if Logged In
function setAdmin() {
	var elem = document.getElementById('myaccount');
	var customer = Object.create(Customer);
	customer.me();
	
	if (customer.identified) {
		var myAcctImg = document.createElement('img');
		myAcctImg.src = '/img/_global/icon_myaccount.svg';
		myAcctImg.title = 'My Account';
		elem.appendChild(myAcctImg);
		
		var myAcctLink = document.createElement('a');
		myAcctLink.href = '/_spectros/welcome';
		myAcctLink.alt = 'My Account';
		myAcctLink.classList.add('username');
		myAcctLink.innerHTML = customer.first_name + ' ' + customer.last_name;
		elem.appendChild(myAcctLink);
		
		var myAcctLO = document.createElement('a');
		myAcctLO.href = '/_register/logout';
		myAcctLO.innerHTML = 'log out';
		elem.appendChild(myAcctLO);
	} else {
		var myAcctLI = document.createElement('a');
		myAcctLI.href = '/_register/login';
		myAcctLI.innerHTML = 'log in';
		elem.appendChild(myAcctLI);

		var myAcctLink = document.createElement('a');
		myAcctLink.href = '/_contact/form';
		myAcctLink.innerHTML = 'register';
		elem.appendChild(myAcctLink);
	}
}

function setNav() {
	return true;
    setAdmin();
    return true;
}

var Site = {
	pendingMessages: function() {
		var resultXML = apiRequest('/_site/api','method=mySiteMessageCount');
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}

		var resultObj = XMLParse.xmlElem2Obj(resultXML);
		if (resultObj.success == 1) {
			return parseInt(resultObj.count);
		}
		else {
			return false;
		}
	},
	getMenuItems: function(name) {
		var resultXML = apiRequest('/_site/api','method=findNavigationItems&menu_code='+name);
		if (apiError.length) {
			this.error = "API Error: "+apiError;
			return;
		}

		var resultArray = XMLParse.xml2ObjArray(resultXML,'item');
		var items = [];
		for (var i = 0; i < resultArray.length; i ++) {
			var item = Object.create(NavigationMenuItem);
			item.title = resultArray[i].title;
			item.id = resultArray[i].id;
			item.menu_id = resultArray[i].menu_id;
			item.target = resultArray[i].target;
			item.view_order = resultArray[i].view_order;
			item.alt = resultArray[i].alt;
			item.description = resultArray[i].description;
			item.parent_id = resultArray[i].parent_id;
			item.required_role_id = resultArray[i].required_role_id;
			if (resultArray[i].external == 1) item.external = true;
			if (resultArray[i].ssl == 1) item.ssl = true;
			console.log("Title: "+item.title);
			items.push(item);
		}
		return items;
	}
}

var NavigationMenuItem = {
	title: '',
	id: '',
	menu_id: '',
	target: '',
	view_order: '',
	alt: '',
	description: '',
	parent_id: '',
	required_role_id: '',
	external: false,
	ssl: false
}

function findAncestor (el, sel) {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
    return el;
}

function showAPIHelpMessage(elem) {
	var formElem = findAncestor(elem,"form");
	var formName = formElem.getAttribute("name");

	if (elem.tagName == "SPAN") {
		var labelElem = elem;
		console.log("Label element found: "+labelElem.innerHTML);
		var paramName = labelElem.innerHTML;
		labelElem.style.cursor = "help";
	}
	else if (elem.tagName == "INPUT" || elem.tagName == "SELECT" || elem.tagName == "TEXTAREA") {
		var labelElem = formElem.querySelector('span[for="'+elem.getAttribute("name")+'"]');
		if (labelElem) {
			console.log("Label element found: "+labelElem.innerHTML);
		}
		else {
			console.log("No label element found for "+elem.tagName+" "+elem.getAttribute("name"));
		}
		var paramName = elem.getAttribute("name");
	}
	else {
		return;
	}

	var helpMessageDiv = document.getElementById("apiHelpMessage");
	if (!formElem) {
		return;
	}
	console.log("Showing help for "+formElem.getAttribute("name")+" "+paramName);
	if (!helpMessageDiv) {
		console.log("Creating help message div");
		helpMessageDiv = document.createElement('div');
		helpMessageDiv.id = "apiHelpMessage";
		helpMessageDiv.style.zIndex = "1000";
		helpMessageDiv.style.backgroundColor = "#ffffff";
		helpMessageDiv.style.border = "1px solid #000";
		helpMessageDiv.style.padding = "5px";
		helpMessageDiv.style.overflow = "auto";
	}
	helpMessageDiv.innerHTML = "";
	helpMessageDiv.style.position = "absolute";
	helpMessageDiv.style.display = "block";

	// Position help message next to input element
	console.log("Positioning help message next to label element");
	if (!labelElem) {
		console.log("No label element found for "+paramName);
		return;
	}
	if (labelElem.tagName != "SPAN") {
		console.log("Label element is not a span, using parent span");
		labelElem = labelElem.parentElement.querySelector('span');
	}
	if (!labelElem) {
		console.log("No label element found for "+paramName);
		return;
	}
	console.log("Label element found: "+labelElem.innerHTML);
	var methodRect = labelElem.getBoundingClientRect();
	helpMessageDiv.style.left = (methodRect.left) + "px";
	helpMessageDiv.style.top = (methodRect.top + methodRect.height+document.documentElement.scrollTop + 5) + "px";
	console.log("Positioning help message at "+helpMessageDiv.style.top+" + "+ document.documentElement.scrollTop);

	// Populate field object and property
	var objectElem = formElem.querySelector('input[name="'+paramName+'-help_message_object"]');
	var propertyElem = formElem.querySelector('input[name="'+paramName+'-help_message_property"]');
	var objectPropertyElem = document.createElement('span');
	objectPropertyElem.style.display = "block";
	if (propertyElem) {
		if (objectElem) {
			objectPropertyElem.innerHTML = objectElem.value+"."+propertyElem.value;
		}
		else {
			objectPropertyElem.innerHTML = propertyElem.value;
		}
	}
	else {
		objectPropertyElem.innerHTML = labelElem.innerHTML;
	}
	helpMessageDiv.appendChild(objectPropertyElem);

	// Populate field type
	var typeElem = formElem.querySelector('input[name="'+paramName+'-help_message_type"]');
	if (typeElem) {
		console.log("Displaying type: "+typeElem.value);
		var type = typeElem.value;
		var typeDiv = document.createElement('div');
		var typeLabel = document.createElement('span');
		typeLabel.style.display = "inline-block";
		typeLabel.style.width = "100px";
		typeLabel.innerHTML = "Type";
		var typeValue = document.createElement('span');
		typeValue.innerHTML = type;
		typeDiv.appendChild(typeLabel);
		typeDiv.appendChild(typeValue);
		helpMessageDiv.appendChild(typeDiv);
	}

	// Populate field deprecated
	var depElem = formElem.querySelector('input[name="'+paramName+'-help_message_deprecated"]');
	if (depElem) {
		console.log("Displaying deprecation");
		var dep = depElem.value;
		var depDiv = document.createElement('div');
		var depLabel = document.createElement('span');
		depLabel.style.display = "inline-block";
		depLabel.style.width = "100px";
		depLabel.innerHTML = "Type";
		var depValue = document.createElement('span');
		depValue.innerHTML = dep;
		depDiv.appendChild(depLabel);
		depDiv.appendChild(depValue);
		helpMessageDiv.appendChild(depDiv);
	}

	// Populate field description
	var descriptionElem = formElem.querySelector('input[name="'+paramName+'-help_message_description"]');
	if (descriptionElem) {
		var description = descriptionElem.value;
		var descriptionDiv = document.createElement('div');
		var descriptionLabel = document.createElement('span');
		descriptionLabel.style.display = "block";
		descriptionLabel.style.display = "inline-block";
		descriptionLabel.style.width = "100px";
		descriptionLabel.innerHTML = "Description";
		var descriptionValue = document.createElement('span');
		descriptionValue.innerHTML = description;
		descriptionDiv.appendChild(descriptionLabel);
		descriptionDiv.appendChild(descriptionValue);
		helpMessageDiv.appendChild(descriptionDiv);
	}

	// Populate field required
	var requiredElem = formElem.querySelector('form[name="'+formName+'"] input[name="'+paramName+'-help_message_required"]');
	if (requiredElem) {
		var required = requiredElem.value;
		var requiredDiv = document.createElement('div');
		var requiredLabel = document.createElement('span');
		requiredLabel.style.display = "inline-block";
		requiredLabel.style.width = "100px";
		requiredLabel.innerHTML = "Required";
		var requiredValue = document.createElement('span');
		if (required == "1") {
			required = "Yes";
		}
		else {
			required = "No";
		}
		requiredValue.innerHTML = required;
		requiredDiv.appendChild(requiredLabel);
		requiredDiv.appendChild(requiredValue);
		helpMessageDiv.appendChild(requiredDiv);
	}

	// Populate field wildcards allowed
	var wildElem = formElem.querySelector('input[name="'+paramName+'-help_message_allow_wildcards"]');
	if (wildElem) {
		console.log("Displaying deprecation");
		var wild = wildElem.value;
		var wildDiv = document.createElement('div');
		var wildLabel = document.createElement('span');
		wildLabel.style.display = "inline-block";
		wildLabel.style.width = "100px";
		wildLabel.innerHTML = "Wildcards Allowed";
		var wildValue = document.createElement('span');
		wildValue.innerHTML = wild;
		wildDiv.appendChild(wildLabel);
		wildDiv.appendChild(wildValue);
		helpMessageDiv.appendChild(wildDiv);
	}

	// Populate field regex validation
	var valMethodElem = formElem.querySelector('input[name="'+paramName+'-help_message_validation_method"]');
	if (valMethodElem) {
		console.log("Displaying deprecation");
		var valMethod = valMethodElem.value;
		var valMethodDiv = document.createElement('div');
		var valMethodLabel = document.createElement('span');
		valMethodLabel.style.display = "inline-block";
		valMethodLabel.style.width = "100px";
		valMethodLabel.innerHTML = "valMethod";
		var valMethodValue = document.createElement('span');
		valMethodValue.innerHTML = valMethod;
		valMethodDiv.appendChild(valMethodLabel);
		valMethodDiv.appendChild(valMethodValue);
		helpMessageDiv.appendChild(valMethodDiv);
	}

	// Populate field regex validation
	var regexElem = formElem.querySelector('input[name="'+paramName+'-help_message_regex"]');
	if (regexElem) {
		console.log("Displaying deprecation");
		var regex = regexElem.value;
		var regexDiv = document.createElement('div');
		var regexLabel = document.createElement('span');
		regexLabel.style.display = "inline-block";
		regexLabel.style.width = "100px";
		regexLabel.innerHTML = "REGEX";
		var regexValue = document.createElement('span');
		regexValue.innerHTML = regex;
		regexDiv.appendChild(regexLabel);
		regexDiv.appendChild(regexValue);
		helpMessageDiv.appendChild(regexDiv);
	}

	// Populate field regex
	var ctElem = formElem.querySelector('input[name="'+paramName+'-help_message_content_type"]');
	if (ctElem) {
		console.log("Displaying deprecation");
		var ct = ctElem.value;
		var ctDiv = document.createElement('div');
		var ctLabel = document.createElement('span');
		ctLabel.style.display = "inline-block";
		ctLabel.style.width = "100px";
		ctLabel.innerHTML = "Content Type";
		var ctValue = document.createElement('span');
		ctValue.innerHTML = ct;
		ctDiv.appendChild(ctLabel);
		ctDiv.appendChild(ctValue);
		helpMessageDiv.appendChild(ctDiv);
	}
	document.body.appendChild(helpMessageDiv);
}
function hideAPIHelpMessage() {
	var helpMessageDiv = document.getElementById("apiHelpMessage");
	if (helpMessageDiv) {
		console.log("Hiding help message");
		helpMessageDiv.style.display = "none";
	}
}
function frameAPIFormBorder(elem) {
	elem.style.border = "2px solid #007bff";
	elem.style.boxShadow = "0 4px 8px rgba(0,123,255,0.2)";
}
function unframeAPIFormBorder(elem) {
	elem.style.border = "1px solid #ddd";
	elem.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
}