/* directives */
var testcount = 0;
var full_domain = window.location.host
var full_domain_array = full_domain.split('.')
var sub_domain = full_domain_array[0];
var current_app = 'smart';
if(sub_domain == 'bms'){
	current_app = 'bms';
}

mainApp.directive("getTemplate", function() {
    return {
        restrict: "E",
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
      path : '@',
	  activeModule : '=activeModule'
    },
    template: '<ng-include src="path"></ng-include>',
	controller: function($scope){
		$scope.cdnUrl = cdnUrl;
	}
  };
});
mainApp.directive('canvasBox', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
				$(".canvas-box").hide();
				$(".main-box").show();
		}
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

mainApp.directive('filesInputBox', function(){//file selector 
    return {
        restrict: 'C',
		scope:{
			ngDrop : '&'
		},
        link: function($scope, elem, attrs) {
			$(this).find('[type="file"]').fadeTo(1, 0);
			$(elem).find('[type="file"]').css({"width": "0px", "height": "0px"});
			$(elem).find('.click-uploader-div').on('click', function(e) {
				if(!$(e.target).is($(this).find('[type="file"]'))){
					$(this).find('[type="file"]').click();
				}
			});
			$(elem).find('.drop-uploader-div').last().hide();
            elem.on('dragover', function(e) {
				$(elem).find('.drop-uploader-div').first().hide();
				$(elem).find('.drop-uploader-div').last().show();
				e.preventDefault();
				e.stopPropagation();
			});
			elem.on('dragleave', function(e) {
				$(elem).find('.drop-uploader-div').first().show();
				$(elem).find('.drop-uploader-div').last().hide();
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
				$(elem).find('.drop-uploader-div').first().show();
				$(elem).find('.drop-uploader-div').last().hide();
				if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length > 0){
					if (attrs.ngDrop) {
						$scope.ngDrop({files : e.originalEvent.dataTransfer.files});
					}else{
						$scope.$parent.drop_upload(e.originalEvent.dataTransfer.files);
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
mainApp.directive('caleranEx1', function ($timeout) {
    return {
        restrict : "C",
		scope: {
		  ngModel: '=ngModel'
		},
		link: function (scope, elem, attr) {
				var position = "right";
				if($(elem).attr("position")){
					position = $(elem).attr("position");
				}
				$(elem).caleran({
					oninit: function(caleran){
						$timeout(function () {
							//scope.ngModel = $(elem).val();
						});
					},	
					onafterselect: function(caleran, startDate, endDate){
						$timeout(function () {
							scope.ngModel = $(elem).val();
						});
					},
					format:"DD MMM YYYY",
					arrowOn: position,
					ranges: [{
								title: "Today",
								startDate: moment(),
								endDate: moment()
							}, {
								title: "Yesterday",
								startDate: moment().subtract(1, "days"),
								endDate: moment().subtract(1, "days")
							}, {
								title: "Last 7 days",
								startDate: moment().subtract(7, "days"),
								endDate: moment()
							}, {
								title: "Last 30 days",
								startDate: moment().subtract(30, "days"),
								endDate: moment()
							}, {
								title: "Last 90 days",
								startDate: moment().subtract(90, "days"),
								endDate: moment()
							}, {
								title: "This month",
								startDate: moment().startOf("month"),
								endDate: moment().endOf("month")
							}]
				});
		}
    };	
});
mainApp.directive('caleranSingle', function ($timeout) {
    return {
        restrict : "C",
		scope: {
		  ngModel: '=ngModel'
		},
		link: function (scope, elem, attr) {
				var position = "right";
				if($(elem).attr("position")){
					position = $(elem).attr("position");
				}
				$(elem).caleran({
					oninit: function(caleran){
						$timeout(function () {
							scope.ngModel = $(elem).closest('div').find('.caleran-single-target').val();
						});
					},	
					onafterselect: function(caleran, startDate, endDate){
						$timeout(function () {
							// alert($(elem).closest('div').find('.caleran-single-target').val());
							scope.ngModel =  $(elem).closest('div').find('.caleran-single-target').val();
						});
					},
					format:"DD MMM YYYY",
					arrowOn: position,
					singleDate: true,
					calendarCount: 1,
					showHeader: false,
					showFooter: false,
					autoCloseOnSelect: true,
					target: $(elem).closest('div').find('.caleran-single-target'),
				});
		}
    };	
});

mainApp.directive('caleranExBlog', function ($timeout) {
    return {
        restrict : "C",
		scope: {
		  ngModel: '= ngModel'
		},
		link: function (scope, elem, attr) {
				$(elem).caleran({
					oninit: function(caleran){
						$timeout(function () {
							//alert(moment());
							//scope.ngModel = moment();
						});
					},	
					onafterselect: function(caleran, startDate, endDate){
						$timeout(function () {
						
							scope.ngModel = $(elem).val();
						});
					},
					format:"DD MMM YYYY",
					arrowOn: "right",
					ranges: [{
								title: "Today",
								startDate: moment(),
								endDate: moment()
							}, {
								title: "Yesterday",
								startDate: moment().subtract(1, "days"),
								endDate: moment().subtract(1, "days")
							}, {
								title: "Last 7 days",
								startDate: moment().subtract(7, "days"),
								endDate: moment()
							}, {
								title: "Last 30 days",
								startDate: moment().subtract(30, "days"),
								endDate: moment()
							}, {
								title: "Last 90 days",
								startDate: moment().subtract(90, "days"),
								endDate: moment()
							}, {
								title: "This month",
								startDate: moment().startOf("month"),
								endDate: moment().endOf("month")
							}]
				});
		}
    };	
});
mainApp.directive('caleranPicker', function ($timeout) {
    return {
        restrict : "C",
		scope: {
		  ngModel: '=ngModel'
		},
		link: function (scope, elem, attr) {
				$(elem).caleran({
					oninit: function(caleran){
						$timeout(function () {
							scope.ngModel = $(elem).val();
						});
					},	
					onafterselect: function(caleran, startDate, endDate){
						$timeout(function () {
							scope.ngModel = $(elem).val();
						});
					},
					format:"DD/MM/YYYY",
					arrowOn: "right",
					singleDate: true,
					calendarCount: 1,
					showHeader: false,
					showFooter: false,
					target: $("#dob-primary-target"),
					autoCloseOnSelect: true,

							
				});
		}
    };	
});

mainApp.directive('caleran', function ($timeout) {
    return {
        restrict : "C",
		scope: {
		  ngModel: '=ngModel'
		},
		link: function (scope, elem, attr) {
				$(elem).caleran({
					oninit: function(caleran){
						$timeout(function () {
							//scope.ngModel = $(elem).val();
						});
					},	
					onafterselect: function(caleran, startDate, endDate){
						$timeout(function () {
							scope.ngModel = $(elem).val();
						});
					},
					arrowOn: "right",
					singleDate: true,
					calendarCount: 1,
					showHeader: false,
					showFooter: false,
					target: $("#dob-primary-target"),
					autoCloseOnSelect: true,
					minDate:moment().subtract('days', -1),
							
				});
		}
    };	
});

mainApp.directive('calerandob', function ($timeout) {
	
    return {
        restrict : "C",
		scope: {
		  ngModel: '=ngModel'
		},
		link: function (scope, elem, attr) {
				$(elem).caleran({
					oninit: function(caleran){
						$timeout(function () {
							//scope.ngModel = $(elem).val();
						});
					},	
					onafterselect: function(caleran, startDate, endDate){
						$timeout(function () {
							scope.ngModel = $(elem).val();
						});
					},
					arrowOn: "right",
					singleDate: true,
					calendarCount: 1,
					showHeader: false,
					showFooter: false,
					target: $("#dob-primary-target"),
					autoCloseOnSelect: true,
					maxDate:new Date(2001, 0, 1, 0, 0, 0),
							
				});
		}
    };	
});

mainApp.directive('thoriScroll', function ($timeout) {
    return {
        restrict : "C",
		link: function (scope, elem, attr) {
			$(elem).mCustomScrollbar({
				axis:"x",
				scrollButtons:{enable:true},
				theme:"3d-thick"
			});	
		}
    };	
});


			
/*
Created By : Mukesh Goyal
Last Modified : 02-June-2018
Purpose : used in listing filters
*/
mainApp.directive('toggleFilters', function ($timeout) {
	return {
		restrict : "C",
		link: function (scope, elem, attr){
			$(elem).click(function(){
				
				$(".t-wauto").toggleClass("tw-100");
				$(".filter-div-select").toggleClass("d-block");
				$(".col-xs-1-5").toggleClass("col-lg-1-5 col-lg-4");
				//$(".entries-hide").toggle();
				//$(".hide-text-md").toggleClass("d-none");
				$("i.icon-filter").toggleClass("p-blue-clr");
				scope.openFiler = !scope.openFiler;
			});
		}
	};	
});

mainApp.directive('sortIcon', function ($timeout) {
	return {
		scope: {
		  params: '=params',
		},
		template : function(elem, attr){
			var isclass = "ng-class=\"params.order_by=='"+attr.orderBy+"' ? 'fa-sort-'+params.order_type : ''\"";
			return '<i class="fa fa-sort" '+isclass+'></i>';
		},
		link: function (scope, elem, attr){
			$(elem).click(function(){
				console.log(attr);
				console.log(scope);
				if(scope.params.order_by == attr.orderBy){
					scope.params.order_type = scope.params.order_type == 'asc' ? 'desc' : 'asc';
				}else{
					scope.params.order_by = attr.orderBy;
				}
			});
		}
		
	};	
});

mainApp.directive('jsontocsv', function () {
	return {
		restrict : "C",
		scope: {
		  data: '=data',
		},
		link: function (scope, elem, attr){
			$(elem).click(function(){
				if(attr.onlychecked == undefined){attr.onlychecked=0;}
				var labels = attr.labels.split(',');
				JSONToCSVConvertor(scope.data,'test',labels, attr.onlychecked);
			});
		}
		
	};	
});

mainApp.directive("smartLibrary", function($http,$timeout,Upload) {
	return {
        restrict: "E",
		templateUrl: cdnUrl + 'apps/'+current_app+'/html/library/smart-library-popup.html',
		link: function(scope, element, attrs) {
			$('#librarymodalVideo').modal('show');
			// scope.tmp_loader = $('[ng-show="loader"]');
			scope.show_tmp_loader = function(flag){
				scope.loader_show(flag);
				// if(flag){
					// scope.tmp_loader.removeClass('ng-hide');
				// }else{
					// scope.tmp_loader.addClass('ng-hide');	
				// }
			}
			scope.type = attrs.type;
			scope.library_multiple = attrs.multiple;
			if(scope.library_multiple == 'true'){scope.library_multiple = 1;}else{scope.library_multiple=0;}
			scope.selcted_objects = [];
			scope.toggle_library_object = function(val){
				var find_flag = false;
				for(var i =0;i<scope.selcted_objects.length;i++){
					if(scope.selcted_objects[i].object_id == val.object_id){
						scope.selcted_objects.splice(i,1);
						find_flag = true;
					}
				}
				if(!find_flag){
					// if(scope.type == 'video'){
						// $http.get(baseUrl+'api/video/videos/is_video_processed?video_id='+val.video_id)
						// .then(function(response) {
							// if(response.data.status == 'success'){
								// scope.temp_callback(send_object);
								// scope.selcted_objects.push(val);	
							// }else{
								// flashSuccess(response.data.message);
							// }
						// });
					// }else{
						scope.selcted_objects.push(val);	
					// }
				}
			}
			scope.chk_select_object = function(id){
				var flag = false;
				for(var i =0;i<scope.selcted_objects.length;i++){
					if(scope.selcted_objects[i].object_id ==id){
						 flag = true;
					}
				}
				//console.log(flag);
				return flag;
			}			
			scope.counter ={ 
						all : 0,
						recent_update :0,
						recent_upload :0   
					}
			scope.data = {
				records : [],
				search : '',
				order_by :"desc",
				order_type : 'modified_date',
				folder_id : '',
				folder_title : '',
				recent:''
			}
			scope.general = {
				all_folders : []
			};
			scope.load_folders = function(){
				$http({
					url: baseUrl+'api/'+current_app+'/Library/get_all_folders',
					method: "POST",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(function(response) {
					if(response.data.status == 'success'){
						scope.general.all_folders = response.data.message.records;
						$timeout(function () {$('.selectpicker').selectpicker('refresh');});
					}
				});
			}
			scope.load_folders();
			//load & update records
			scope.update_data = function(data){
				scope.data.records = data.message.records;
				
				if(data.message.counts){
					var counts = data.message.counts;
					scope.counter.all  = counts.total;
					scope.counter.recent_update = counts.recently_updated;
					scope.counter.recent_upload = counts.recently_created;
				}
				$timeout(function () {
					$('.selectpicker').selectpicker("refresh"); 
				});
			}
			scope.get_condition = function(){
				var data = '';
				data += 'search='+scope.data.search;
				data += '&recent='+scope.data.recent;
				data += '&items_per_page=*';
				data += '&order_type='+scope.data.order_type;
				data += '&order_by='+scope.data.order_by;
				data += '&type='+scope.type;
				data += '&folder_id='+scope.data.folder_id;
				data += '&popup=1';
				return data;
			}
			scope.get_data = function(){
				scope.show_tmp_loader(true);
				var data = scope.get_condition();
				$http({
					url: baseUrl+'api/'+current_app+'/Library/',
					method: "POST",
					data: data,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(function(response) {
						var data  = response.data;
						scope.update_data(data);
						scope.show_tmp_loader(false);
				}, 
				function(response) { // optional
						// failed
						scope.show_tmp_loader(false);
				});
			}
			scope.get_data();
			//
			scope.library_upload_by_popup = function(files){
				scope.show_tmp_loader(true);
				scope.drop_upload(files,scope.type,scope.data.folder_id,true,scope.upload_handler);
			}
			scope.upload_handler = function(responce){
				if(responce.status=='success'){
					flashSuccess(responce.message);
					scope.get_data();
				}else{
					flashError(responce.message);
				}
				scope.show_tmp_loader(false);
			}
			scope.close_library = function(object){
				if(scope.type == 'video'){
					$http.get(baseUrl+'api/video/videos/is_video_processed?video_id='+object.video_id)
					.then(function(response) {
						if(response.data.status != 'success'){
							flashError(response.data.message);
						}else{
							if(scope.library_multiple){scope.toggle_library_object(object); return;}
							var send_object = {url:object.url,file:object.file,thumbnail:object.thumbnail1,video_id:object.video_id};
							scope.temp_callback(send_object);
							$('#librarymodalVideo').modal('hide');
							$('smart-library').remove();
						}
					});
					
				}else{
					if(scope.library_multiple){scope.toggle_library_object(object); return;}
					var send_object = {url:object.url,file:object.file,thumbnail:object.thumbnail};
					scope.temp_callback(send_object);
					$('#librarymodalVideo').modal('hide');
					$('smart-library').remove();
				}
				
				
				
			}
			scope.select_object_group = function(){
				var object_group = [];
				for(var i =0;i<scope.selcted_objects.length;i++){
					var send_object = {url:scope.selcted_objects[i].url,file:scope.selcted_objects[i].file,thumbnail:scope.selcted_objects[i].thumbnail};
					if(scope.type == 'video'){
						send_object = {url:scope.selcted_objects[i].url,file:scope.selcted_objects[i].file,thumbnail:scope.selcted_objects[i].thumbnail1,video_id:scope.selcted_objects[i].video_id};
					}
					object_group.push(send_object);
				}
				scope.temp_callback(object_group);
				$('#librarymodalVideo').modal('hide');
				$('smart-library').remove();
			}
			
			scope.$watchGroup(['data.folder_id','data.recent'], function(newValues, oldValues, scope) {
				if(newValues != oldValues){
					scope.get_data();
				}
			});

		}
    }
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

mainApp.directive('focusMe', function($parse, $timeout) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value != '') {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            element.bind('blur', function () {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
});

mainApp.directive("httpLink", function($parse) {
    return {
        restrict: "A",
        transclude: true,
        replace: true,
        link: function(scope, elem, attrs) {
			var model = $parse(attrs.ngModel);
            scope.$watch(model, function (value) {
				var re = new RegExp("^(http|https)://", "i");
				var re = new RegExp("^(http|https)", "i");
				if(!re.test(value)){
					last = '';
					$(elem).val('http://'+last);
				}else{
					$(elem).val(value);
				}
            });
        }
    };
});

mainApp.directive('smartAppsIcon',function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attr){
			$(elem).click(function (e) {
				$('#sidebar').addClass('active');
				$('.overlay').fadeIn();
				$('.collapse.in').toggleClass('in');
				$('a[aria-expanded=true]').attr('aria-expanded', 'false');
				
				 $("#sidebar").mCustomScrollbar({
					theme: "minimal"
				});
				$("#sidebar-menu").mCustomScrollbar({
					theme: "minimal"
				});
			});
		}
	}
});


mainApp.directive('menuDismiss',function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attr){
			$(elem).click(function (e) {
				$('#sidebar').removeClass('active');
				scope.sidebarMenu = '';
				$('.overlay').fadeOut();
				scope.$apply();
			});
		}
	}
});