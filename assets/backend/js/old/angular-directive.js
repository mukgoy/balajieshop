/* directives */
var testcount = 0;
define(["app"], function(app) {
app.directive("getTemplate", function() {
    return {
        restrict: "E",
        scope: !0,
        templateUrl: function(elem, attrs){
			// console.log(cdnUrl + attrs.item);
			return cdnUrl + attrs.item;
		}
    }
});
app.directive("getScopeTemplate", function() {
   return {
    restrict: 'E',
    scope: {
      path : '@'
    },
    template: '<ng-include src="path"></ng-include>'
  };
});
app.directive("warningDelete", function() {
    return {
        restrict: "E",
        templateUrl: cdnUrl+"warning-delete.html"
    }
});
app.directive('selectpickerr', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				$(elem).selectpicker('refresh');
			});
			$(elem).on('change', function(e) {
				$timeout(function () {
					$(".selectpicker").selectpicker('refresh');
				});
			});
        }
    };	
});
app.directive("selectpicker",["$timeout", function($timeout) {
	return {
		restrict: "A",
		require: ["?ngModel", "?collectionName"],
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, element, attrs, ngModel) {
				scope.$watch(attrs.ngModel, function(newVal, oldVal) {
					if (newVal !== oldVal) {
						$timeout(function() {
							console.log("value selected");
							$(element).selectpicker("refresh");
						});
					}
				});

				scope.$watch(attrs.collectionName, function(newVal, oldVal) {
					$timeout(function() {
						console.log("select collection updated");
						$(element).selectpicker("refresh");
					});
				});

				ngModel.$render = function() {
					$(element).selectpicker("val", ngModel.$viewValue || "");
				};

				ngModel.$viewValue = $(element).val();
			};
		}
	}
}]);
app.directive('overlay', function(){
  return {
    restrict: 'E',
    template: '<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'
  } 
});
app.directive('clickOnce', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var replacementText = 'Loading...';
            elem.bind('click', function(){
				clickOnce = elem;
                $timeout(function() {
                    if (replacementText) {
                        elem.html(replacementText);
                    }
                    elem.attr('disabled', true);
                }, 0);
            });
        }
    };
});
app.directive('uibModalBtn', ["$timeout", function($timeout){
  return {
	restrict: 'C',
	scope:{
		ngClose 	: '&',
		templateUrl	: '@',
		ngSize 		: '@',
		controller 	: '@',
		ngData 		: '='
	},
	link: function(scope, elem) {
		elem.on('click', function(e) {
			scope.open();
		});
	},
	controller: function($scope, $uibModal){
		$scope.open = function(){
			var modalInstance = $uibModal.open({
					templateUrl: $scope.templateUrl,
					size: $scope.ngSize,
					scope:$scope.$parent,
					controller: $scope.controller,
					resolve: {
						ngData: function () {
							return $scope.ngData;
						}
					}
				});
				modalInstance.result.then(function(newdata){
					$scope.ngClose({newdata:newdata});
				},function () {
					console.log('Modal dismissed at: ' + new Date());
				});
		}
	}
	 
  }
}]);
app.directive("datetimepicker", function ($timeout) {
    return {
        restrict: "C",
        link: function (scope, elem, attrs) {
			var obj = getDateTimePickerObj(attrs);
			$(elem).datetimepicker(obj);
			elem.bind('change', function(){
				var elemAttrs = {};
				Array.prototype.slice.call($(attrs.updateelem)[0].attributes).forEach(function(item) {
					elemAttrs[item.name] = item.value;
				});
				var elemobj = getDateTimePickerObj(elemAttrs);
					$(attrs.updateelem).datetimepicker(elemobj);
            });
        }
    };
});
app.directive("filesInput", function() {//vlidate image file
	return {
		require: "ngModel",
		link: function (scope,elem,attrs,ngModel) {
			elem.on("change", function(e) {
				e.stopPropagation();
				var files = e.target.files;
				ngModel.$setViewValue(files);
				
			})
		}
	}
});
app.directive('filesInputBox', function(){//file selector 
    return {
        restrict: 'C',
        link: function($scope, elem, attrs) {
			$(this).find('[type="file"]').fadeTo(1, 0);
			$(elem).find('[type="file"]').css({"width": "0px", "height": "0px"});
			elem.on('click', function(e) {
				if(!$(e.target).is($(this).find('[type="file"]'))){
					$(this).find('[type="file"]').click();
				}
			});
            elem.on('dragover', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			elem.on('dragenter', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			elem.on('drop', function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (e.originalEvent.dataTransfer){
					if (e.originalEvent.dataTransfer.files.length > 0) {
						$scope.upload(e.originalEvent.dataTransfer.files);
					}
				}
				return false;
			});
        }
    };
});

app.directive('scriptLoad', function(){
  return {
    restrict: 'E',
    template: function(elem, attrs){return '<script src="'+attrs.src+'"></script>'}
  } 

});

app.directive('mCustomScrollbar', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				$(elem).mCustomScrollbar();
			});
        }
    };	
});
app.directive('dragdrop', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				$(elem).drop_uploader({
						uploader_text: 'Drag and drop or',
						browse_text: 'browses',
						browse_css_class: 'button button-primary',
						browse_css_selector: 'file_browse',
						uploader_icon: '<i class="icon icon-others l-gblue-clr"></i>',
						file_icon: '<i class="pe-7s-file"></i>',
						time_show_errors: 5,
						layout: 'thumbnails'
					});
			});
        }
    };	
});
app.directive('tagsinput', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				//$(elem).tagsInput();
			});
        }
    };	
});


});