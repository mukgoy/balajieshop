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
mainApp.directive('selectpicker', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$timeout(function () {
				$(elem).selectpicker('refresh');
			});
        }
    };	
});
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

