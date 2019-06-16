define(["app"], function(app) {
/* *********Slug Maker Start************* */
var charmap = {
        ' ': " ",
        '¡': "!",
        '¢': "c",
        '£': "lb",
        '¥': "yen",
        '¦': "|",
        '§': "SS",
        '¨': "\"",
        '©': "(c)",
        'ª': "a",
        '«': "<<",
        '¬': "not",
        '­': "-",
        '®': "(R)",
        '°': "^0",
        '±': "+/-",
        '²': "^2",
        '³': "^3",
        '´': "'",
        'µ': "u",
        '¶': "P",
        '·': ".",
        '¸': ",",
        '¹': "^1",
        'º': "o",
        '»': ">>",
        '¼': " 1/4 ",
        '½': " 1/2 ",
        '¾': " 3/4 ",
        '¿': "?",
        'À': "`A",
        'Á': "'A",
        'Â': "^A",
        'Ã': "~A",
        'Ä': '"A',
        'Å': "A",
        'Æ': "AE",
        'Ç': "C",
        'È': "`E",
        'É': "'E",
        'Ê': "^E",
        'Ë': '"E',
        'Ì': "`I",
        'Í': "'I",
        'Î': "^I",
        'Ï': '"I',
        'Ð': "D",
        'Ñ': "~N",
        'Ò': "`O",
        'Ó': "'O",
        'Ô': "^O",
        'Õ': "~O",
        'Ö': '"O',
        '×': "x",
        'Ø': "O",
        'Ù': "`U",
        'Ú': "'U",
        'Û': "^U",
        'Ü': '"U',
        'Ý': "'Y",
        'Þ': "Th",
        'ß': "ss",
        'à': "`a",
        'á': "'a",
        'â': "^a",
        'ã': "~a",
        'ä': '"a',
        'å': "a",
        'æ': "ae",
        'ç': "c",
        'è': "`e",
        'é': "'e",
        'ê': "^e",
        'ë': '"e',
        'ì': "`i",
        'í': "'i",
        'î': "^i",
        'ï': '"i',
        'ð': "d",
        'ñ': "~n",
        'ò': "`o",
        'ó': "'o",
        'ô': "^o",
        'õ': "~o",
        'ö': '"o',
        '÷': ":",
        'ø': "o",
        'ù': "`u",
        'ú': "'u",
        'û': "^u",
        'ü': '"u',
        'ý': "'y",
        'þ': "th",
        'ÿ': '"y',
        'Ā': "A",
        'ā': "a",
        'Ă': "A",
        'ă': "a",
        'Ą': "A",
        'ą': "a",
        'Ć': "'C",
        'ć': "'c",
        'Ĉ': "^C",
        'ĉ': "^c",
        'Ċ': "C",
        'ċ': "c",
        'Č': "C",
        'č': "c",
        'Ď': "D",
        'ď': "d",
        'Đ': "D",
        'đ': "d",
        'Ē': "E",
        'ē': "e",
        'Ĕ': "E",
        'ĕ': "e",
        'Ė': "E",
        'ė': "e",
        'Ę': "E",
        'ę': "e",
        'Ě': "E",
        'ě': "e",
        'Ĝ': "^G",
        'ĝ': "^g",
        'Ğ': "G",
        'ğ': "g",
        'Ġ': "G",
        'ġ': "g",
        'Ģ': "G",
        'ģ': "g",
        'Ĥ': "^H",
        'ĥ': "^h",
        'Ħ': "H",
        'ħ': "h",
        'Ĩ': "~I",
        'ĩ': "~i",
        'Ī': "I",
        'ī': "i",
        'Ĭ': "I",
        'ĭ': "i",
        'Į': "I",
        'į': "i",
        'İ': "I",
        'ı': "i",
        'Ĳ': "IJ",
        'ĳ': "ij",
        'Ĵ': "^J",
        'ĵ': "^j",
        'Ķ': "K",
        'ķ': "k",
        'Ĺ': "L",
        'ĺ': "l",
        'Ļ': "L",
        'ļ': "l",
        'Ľ': "L",
        'ľ': "l",
        'Ŀ': "L",
        'ŀ': "l",
        'Ł': "L",
        'ł': "l",
        'Ń': "'N",
        'ń': "'n",
        'Ņ': "N",
        'ņ': "n",
        'Ň': "N",
        'ň': "n",
        'ŉ': "'n",
        'Ō': "O",
        'ō': "o",
        'Ŏ': "O",
        'ŏ': "o",
        'Ő': '"O',
        'ő': '"o',
        'Œ': "OE",
        'œ': "oe",
        'Ŕ': "'R",
        'ŕ': "'r",
        'Ŗ': "R",
        'ŗ': "r",
        'Ř': "R",
        'ř': "r",
        'Ś': "'S",
        'ś': "'s",
        'Ŝ': "^S",
        'ŝ': "^s",
        'Ş': "S",
        'ş': "s",
        'Š': "S",
        'š': "s",
        'Ţ': "T",
        'ţ': "t",
        'Ť': "T",
        'ť': "t",
        'Ŧ': "T",
        'ŧ': "t",
        'Ũ': "~U",
        'ũ': "~u",
        'Ū': "U",
        'ū': "u",
        'Ŭ': "U",
        'ŭ': "u",
        'Ů': "U",
        'ů': "u",
        'Ű': '"U',
        'ű': '"u',
        'Ų': "U",
        'ų': "u",
        'Ŵ': "^W",
        'ŵ': "^w",
        'Ŷ': "^Y",
        'ŷ': "^y",
        'Ÿ': '"Y',
        'Ź': "'Z",
        'ź': "'z",
        'Ż': "Z",
        'ż': "z",
        'Ž': "Z",
        'ž': "z",
        'ſ': "s"
    };
function _slugify(s) {
	if (!s) return "";
	var ascii = [];
	var ch, cp;
	for (var i = 0; i < s.length; i++) {
		if ((cp = s.charCodeAt(i)) < 0x180) {
			ch = String.fromCharCode(cp);
			ascii.push(charmap[ch] || ch);
		}
	}
	s = ascii.join("");
	s = s.replace(/[^\w\s-]/g, "").trim().toLowerCase();
	return s.replace(/[-\s]+/g, "-");
}
app.factory("Slug", function() {
	return {
		slugify: _slugify
	};
});
app.directive("slugModel", ["Slug", function(Slug) {
	return {
		restrict: "A",
		scope: {
                slugTo: "=",
            },
		transclude: true,
		replace: true,
		link: function(scope, elem, attrs) {
			if (!attrs.slugFrom) {
				alert("must set attribute 'from'");
			}
			scope.$parent.$watch(attrs.slugFrom, function(val) {
				scope.slugTo = Slug.slugify(val);
			});
			scope.$parent.$watch(attrs.slugTo, function(val) {
				scope.slugTo = Slug.slugify(val);
			});
		}
	};
}]);
app.filter("slugify", function(Slug) {
	return function(input) {
		return Slug.slugify(input);
	};
});
/* *********Slug Maker End************* */

/* filters */
app.filter("tomytimezone", function() {
	return function(millis) {
		var date = new Date(millis);
		var date = new Date(date.toLocaleString());
		return date;
	};
});
app.filter("baseurl", function () {
	return function (url) {
		var reg = new RegExp('^(?:[a-z]+:)?//', 'i');
		if(reg.test(url)){
			return url;
		} 
		return baseUrl + url;
	}
});
app.filter("cdnurl", function () {
	return function (url) {
		var reg = new RegExp('^(?:[a-z]+:)?//', 'i');
		if(reg.test(url)){
			return url;
		} 
		return cdnUrl + url;
	}
});
app.filter('isEmpty', function () {
	var bar;
	return function (obj) {
		for (bar in obj) {
			if (obj.hasOwnProperty(bar)) {
				return false;
			}
		}
		return true;
	};
});
app.filter('trustAsResourceUrl', ['$sce', function($sce) {//used in iframe url
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
app.filter('startsWithLetter', function () {
	return function (items, letter) {
		var filtered = [];
		var letterMatch = new RegExp(letter, 'i');
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (letterMatch.test(item.name.substring(0, 1))) {
				filtered.push(item);
			}
		}
		return filtered;
	};
});

app.factory('form', function ($http) {
	var form = {};
	form.submit = function (actionUrl, formScope){
			return	$http({
				method  : 'POST',
				url     : actionUrl,
				transformRequest: function (data) {
					formDataObj = angular.copy(data);
					var formData = new FormData();
					angular.forEach(data, function (value, key) {
						console.log(value);
						if(key == 'file'){
							$.each(value, function(fileKey) {
								for (var i = 0; i < value[fileKey].length; i++) {
									formData.append(fileKey, value[fileKey][i]);
								}
							});
						}
						if(key == 'mfile'){
							$.each(value, function(fileKey) {
								for (var i = 0; i < value[fileKey].length; i++) {
									formData.append(fileKey+'[]', value[fileKey][i]);
								}
							});
						}
					});
					angular.forEach(createNextedParam(formDataObj), function (item){
						formData.append(item.key, item.val);
					});
					return formData;
				},
				data: formScope,
				headers : { 'Content-Type': undefined}
			});
	}
	return form;
});

});