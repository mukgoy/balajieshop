mainApp.filter("tomytimezone", function() {
    return function(millis) {
        var date = new Date(millis);
        var date = new Date(date.toLocaleString());
        return date;
    };
});
mainApp.filter("baseurl", function() {
    return function(url) {
        var reg = new RegExp('^(?:[a-z]+:)?//', 'i');
        if (reg.test(url)) {
            return url;
        }
        return baseUrl + url;
    }
}); 
mainApp.filter('camelcase', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
mainApp.filter("cdnurl", function() {
    return function(url) {
        var reg = new RegExp('^(?:[a-z]+:)?//', 'i');
        if (reg.test(url)) {
            return url;
        }
        return cdnUrl + url;
    }
});
mainApp.filter('isEmpty', function() {
    var bar;
    return function(obj) {
        for (bar in obj) {
            if (obj.hasOwnProperty(bar)) {
                return false;
            }
        }
        return true;
    };
});
mainApp.filter('trustAsResourceUrl', ['$sce', function($sce) { //used in iframe url
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
mainApp.filter("json_decode", function() {
    return function(str) {
        return JSON.parse(str);
    }
});

mainApp.filter('filesize', function () {
	return function (size) {
		// console.log(size);
		if (isNaN(size))
			size = 0;

		if (size < 1024)
			return size + ' Bytes';

		size /= 1024;

		if (size < 1024)
			return size.toFixed(2) + ' Kb';

		size /= 1024;

		if (size < 1024)
			return size.toFixed(2) + ' Mb';

		size /= 1024;

		if (size < 1024)
			return size.toFixed(2) + ' Gb';

		size /= 1024;

		return size.toFixed(2) + ' Tb';
	};
});
mainApp.filter('secondtotime', function () {
	return function (time) {
		time = Math.round(time);
		var hours = Math.floor(time / 3600);
		time = time - hours * 3600;
		var minutes = Math.floor(time / 60),
		seconds = time - minutes * 60;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		if(hours > 0){
			return hours + ":" + minutes + ":" + seconds;
		}
		return minutes + ":" + seconds;
	};
});

mainApp.factory('form',function($rootScope, $http) {
	return {
		submit : function(actionUrl, formScope, isResetForm){
			if(isResetForm === undefined){
				isResetForm = 0;
			}
			return $http({
                method: 'POST',
                url: actionUrl,
                transformRequest: function(data) {
                    var formData = new FormData();
                    angular.forEach(data, function(value, key){
                        if (key == 'file') {
                            $.each(value, function(fileKey, fileValue) {
                                for (var i = 0; i < value[fileKey].length; i++) {
                                    formData.append(fileKey, value[fileKey][i]);
                                }
                            });
                        }
                        if (key == 'mfile') {
                            $.each(value, function(fileKey, fileValue) {
                                for (var i = 0; i < value[fileKey].length; i++) {
                                    formData.append(fileKey + '[]', value[fileKey][i]);
                                }
                            });
                        }
                    });
                    angular.forEach(createNextedParam(angular.copy(data)), function(item){
                        formData.append(item.key, item.val);
                    });
                    return formData;
                },
                data: formScope,
                headers: { 'Content-Type': undefined }
            });
		}
	}
});
	