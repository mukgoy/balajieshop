/* helper functions */
function getPagination(data) {
    var liLimit = 5;
    var itemsPerPage = parseInt(data.itemsPerPage);
    var recordsFiltered = parseInt(data.recordsFiltered);
    var currentPage = parseInt(data.currentPage);
    var totalPages = Math.ceil(recordsFiltered / itemsPerPage);
    var begin = parseInt(currentPage - 2 > 0 ? currentPage - 2 : 1);
    var end = totalPages - begin - liLimit + 1 > 0 ? begin + liLimit - 1 : totalPages;
    var pageList = [];
    for (var i = begin; i <= end; i++) {
        pageList.push(i);
    }
    return pageList;
}

function getDateTimePickerObj(attrs) {
    var obj = {};
    obj.timepicker = 0;
    if (attrs.hasOwnProperty("format")) { obj.format = attrs.format; }
    if (attrs.hasOwnProperty("timepicker")) { obj.timepicker = 1 }
    if (attrs.hasOwnProperty("lang")) { obj.lang = attrs.lang; }
    if (attrs.hasOwnProperty("mindate")) {
        obj.minDate = attrs.mindate.split("-").reverse().join("/");
    }
    if (attrs.hasOwnProperty("maxdate")) {
        obj.maxDate = attrs.maxdate.split("-").reverse().join("/");
    }
    return obj;
}

function processResponse($scope = null, formScope, data) {

    console.log(data);
    formScope.error = '';
    if (data.status == 'error') {
        if (typeof data.message === 'string') {
            $.notify(data.message, "error");
        } else {
            formScope.error = data.message;
        }
    }
    if (data.status == 'success') {
        $.notify(data.message, "success");
    }
    if (data.callback) {
        eval(data.callback);
    }
    if (data.redirect_url) {
        $scope.redirect(data.redirect_url);
    }
}

function resetForm(formDataObj) {
    angular.forEach(formDataObj, function(value, key) {
        formDataObj[key] = null;
    });
}

function deleteConfirm(callback, msg) {
    if (msg === undefined) { msg = 'Are you sure to delete?'; }
    $("#smart-confirmation-box .delete-confirm-msg").html(msg);
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

function createNextedParam(data, postPrepend = '') {
    var result = [];
    angular.forEach(data, function(value, key) {
        if (key == 'file' || key == 'mfile') { return; }
        var newPrepend = postPrepend == '' ? key : postPrepend + '[' + key + ']';
        if (typeof value == 'string') {
            result.push({ 'key': newPrepend, 'val': value });
        } else {
            var result2 = createNextedParam(value, newPrepend);
            Array.prototype.push.apply(result, result2);
        }
    });
    // console.log(result);
    return result;
}

function removeHashKey(obj) {
    var result = {};
    angular.forEach(obj, function(value, key) {
        if (key == '$$hashKey') { return; }
        if (typeof value == 'string') {
            result[key] = value;
        } else {
            result[key] = removeHashKey(value)
        }
    });
    return result;
}

function checkCurrentUrlContainSubdomain() {
    var result = baseUrl.includes('www.');
    return result;
}