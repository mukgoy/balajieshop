/* directives */
var testcount = 0;
mainApp.directive("getTemplate", function() {
    return {
        restrict: "E",
        scope: !0,
        templateUrl: function(elem, attrs){
			// console.log(cdnUrl + attrs.item);
			return cdnUrl + attrs.item;
		}
    }
});
mainApp.directive("getScopeTemplate", function() {
   return {
    restrict: 'E',
    scope: {
      path : '@'
    },
    template: '<ng-include src="path"></ng-include>'
  };
});
mainApp.directive("warningDelete", function() {
    return {
        restrict: "E",
        templateUrl: cdnUrl+"warning-delete.html"
    }
});
mainApp.directive('selectpickerr', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				$(elem).selectpicker('refresh');
			});
        }
    };	
});
mainApp.directive("selectpicker",["$timeout", function($timeout) {
	return {
		restrict: "A",
		require: ["?ngModel", "?collectionName"],
		compile: function(tElement, tAttrs, transclude) {
			return function(scope, element, attrs, ngModel) {
				$timeout(function () {
					$(element).selectpicker('refresh');
				});
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

				// ngModel.$render = function() {
					// $(element).selectpicker("val", ngModel.$viewValue || "");
				// };

				// ngModel.$viewValue = $(element).val();
			};
		}
	}
}]);
mainApp.directive('overlay', function(){
  return {
    restrict: 'E',
    template: '<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>'
  } 
});
mainApp.directive('clickOnce', function($timeout) {
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
mainApp.directive('commonModalContent', ["$timeout", function($timeout){
  return {
	scope:false,
    restrict: 'E',
    templateUrl: function(elem, attrs){
      return attrs.item;
    },
	link: function($scope, elem) {
		$('overlay').remove();
	}
  }
}]);
mainApp.directive("datetimepicker", function ($timeout) {
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
mainApp.directive("filesInput", function() {//vlidate image file
	return {
		require: "ngModel",
		link: function (scope,elem,attrs,ngModel) {
			elem.on("change", function(e) {
				e.stopPropagation();
				var files = e.target.files;
				$fileinput = $(this).closest('.fileinput');
				
				if (files.length === 0) {
				  this.clear()
				  return
				}
				var fileName = [];
				for(var i = 0; i < files.length; i++){
					var file = files[i];
					fileName.push(file.name);
					if (typeof file.type !== "undefined" ? file.type.match(/^image\/(gif|png|jpeg)$/) : file.name.match(/\.(gif|png|jpe?g)$/i)) {
					}else{
						alert("File Type Not Allow");
						return
					}
				}
				$fileinput.find('.fileinput-filename').text(fileName.join(', '));
				$fileinput.find('span.fileinput-new').text('');
				ngModel.$setViewValue(files);
				if (files[0]){
					var reader = new FileReader();
					reader.onload = function(e) {						
						$(attrs.preview).attr('src', e.target.result);
					}
					reader.readAsDataURL(files[0]);
				}
			})
		}
	}
});
mainApp.directive('filesInputBox', function(){//file selector 
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

mainApp.directive('onErrorSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.onErrorSrc) {
            attrs.$set('src', attrs.onErrorSrc);
          }
        });
      }
    }
});

mainApp.directive('scriptLoad', function(){
  return {
    restrict: 'E',
    template: function(elem, attrs){return '<script src="'+attrs.src+'"></script>'}
  } 

});

mainApp.directive('mCustomScrollbar', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				$(elem).mCustomScrollbar();
			});
        }
    };	
});
mainApp.directive('dragdrop', function ($timeout) {
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
mainApp.directive('tagsinput', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				//$(elem).tagsInput();
			});
        }
    };	
});

mainApp.directive('uibModalBtn', ["$timeout", function($timeout){
  return {
	restrict: 'C',
	scope:{
		templateUrl	: '@',
		ngSize 		: '@',
		controller 	: '@',
		ngData 		: '=',
		ngKey	 	: '@'
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
						resolve : {ngData: $scope.ngData,ngKey: $scope.ngKey}
					}
				});
				modalInstance.result.then(function(newdata){
					//$scope.ngClose({newdata:newdata});
					console.log('Modal submited at: ' + new Date());
				},function () {
					console.log('Modal dismissed at: ' + new Date());
				});
		}
	}
	 
  }
}]);


mainApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);