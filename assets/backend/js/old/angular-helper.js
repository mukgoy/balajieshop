/* helper functions */
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
