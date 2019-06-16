/* helper functions */
function processResponse(data, $scope, formScope) {
	if($scope === undefined){
		 $scope = null;
	}
   console.log(data);
    if (formScope) {
        formScope.error = '';
    }

    if (data.status == 'error') {
        if (typeof data.message === 'string') {
            alert(data.message + " error");
        } else {
            if (formScope == undefined) {
                console.log(data);
                alert("Some thing is wronge error");
            } else {			
                formScope.error = data.message;
            }
        }
    }
    if (data.status == 'success') {
        alert(data.message+" success");
    }
    if (data.callback) {
        eval(data.callback);
    }
    if (data.redirect_url) {
        $scope.redirect(data.redirect_url);
    }
}

function deleteConfirm(callback, msg, title) {
	if (msg === undefined) { msg = 'Are you sure to delete?'; }
    if (title === undefined) { title = 'Confirm Delete?'; }
    $("#smart-confirmation-box .delete-confirm-msg").html(msg);
    $("#smart-confirmation-box .delete-confirm-title").html(title);
    $('#smart-confirmation-box .yes-btn').off('click');
    $('#smart-confirmation-box').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#smart-confirmation-box .yes-btn').on('click', function(e) {
		$("#smart-confirmation-box").modal("hide");
        callback();
    });
}

function createNextedParam(data, postPrepend) {
	if(postPrepend ===   undefined){
			 postPrepend = '';
		}
    var result = [];
    angular.forEach(data, function(value, key) {
        if (key == 'file' || key == 'mfile') { return; }
        var newPrepend = postPrepend == '' ? key : postPrepend + '[' + key + ']';
        if (typeof value == 'object') {
             var result2 = createNextedParam(value, newPrepend);
			 Array.prototype.push.apply(result, result2);
        } else {
			result.push({ 'key': newPrepend, 'val': value });
        }
    });
    // console.log(result);
    return result;
}

function dateRangeStrtoTime(string) {
    string = string.split(' - ');
    var date_from = string[0].trim();
    date_from = new Date(date_from);
    date_from.setHours(0, 0, 0, 0);
    date_from = date_from.getTime() / 1000;
    var date_to = string[1].trim();
    date_to = new Date(date_to);
    date_to.setHours(23, 59, 59, 0);
    date_to = date_to.getTime() / 1000;
    return { 'date_start': date_from, 'date_end': date_to };
}

function miliSecondCount(item) {
    var arr = {
        'minute': 1000 * 60,
        'hour': 1000 * 60 * 60,
        'day': 1000 * 60 * 60 * 24,
        'week': 1000 * 60 * 60 * 24 * 7,
        'month': 1000 * 60 * 60 * 24 * 30,
        'year': 1000 * 60 * 60 * 24 * 365,
    };
    return arr[item];
}

function JSONToCSVConvertor(JSONData, fileName, labels, onlychecked) {
	if(onlychecked ===   undefined){
			 onlychecked = 0;
		}
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    var row = labels.toString();
    CSV += row + '\r\n';
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (labels.indexOf(index) >= 0) {
                if (onlychecked) {
                    if (arrData[i].checked) {
                        row += '"' + arrData[i][index] + '",';
                    }
                } else {
                    row += '"' + arrData[i][index] + '",';
                }
            }
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        if (row != '')
            CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }


    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName = fileName.replace(/ /g, "_");
    if (fileName == '') {
        //Generate a file name
        fileName = "report";
    }

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function current_date() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + "/" +
        (month < 10 ? '0' : '') + month + '/' +
        d.getFullYear();
    return output;
}

function current_date_time() {
    var d = new Date();
    var output = d.getTime()/1000;   
    return Math.round(output);  
}

function strtosec(str){
	var t = str.split(':');
	if(t.length==3){
		return parseInt(t[0]*60*60) + parseInt(t[1]*60) + parseInt(t[2]);
	}
	else if(t.length==2){
		return parseInt(t[0]*60)+parseInt(t[1]);
	}
	else{
		return parseInt(t);
	}
}

function setCookie(cname, cvalue, exSecs) {
	if(exSecs === undefined){
		exSecs = 1*24*60*60*1000;
	}
    var d = new Date();
    d.setTime(d.getTime() + exSecs);
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

function getUrlVars(){
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}
