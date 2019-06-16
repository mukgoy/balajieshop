
(function($) {
    jQuery.fn.drop_uploader = function(options) {
        options = $.extend({
          
        }, options);

        this.each(function(i, val) {
            var v = val;
            // Get input file params
            var file_accept = $(v).attr("accept");
            var file_multiple = $(v).prop("multiple");
            var max_file_size = 0; 

            var uploader_id = 'drop_uploader_' + i;

            var cur_form = $(v).parent("form");
            var input_max_file_size = $(cur_form).find("input[name=MAX_FILE_SIZE]").val();
            if(input_max_file_size !== undefined) {
                max_file_size = parseInt(input_max_file_size);
            }
            var data_max_file_size = $(v).data("maxfilesize");
            if(data_max_file_size !== undefined) {
                max_file_size = parseInt(data_max_file_size);
            }

            var thumbnails_layout = options.layout;

            if($(v).data("layout") == "thumbnails") {
                thumbnails_layout = true;
            }

            if($(v).data("layout") == "list") {
                thumbnails_layout = false;
            }

            // Wrap file input field
            $(v).attr('id', get_random_id());
            $(v).wrap('<div id="' + uploader_id + '" class="drop_uploader drop_zone"></div>');
            $(v).before('<div class="text_wrapper">' + options.uploader_icon + ' <span class="text">' + options.uploader_text + '<span> <a href="#" class="' + options.browse_css_selector + '">' + options.browse_text + '</a></span> Your files.</span></div>');
            $(v).before('<span class="errors"></span>');
            if(thumbnails_layout) {
                $(v).before('<ul class="files thumb"></ul>');
            } else {
                $(v).before('<ul class="files"></ul>');
            }

            var drop_zone = $('#' + uploader_id);

            drop_zone[0].ondragover = function(event) {
                drop_zone.addClass('hover');
                maximizeInput(v);
                return false;
            };

            drop_zone[0].ondragleave = function(event) {
                drop_zone.removeClass('hover');
                //minimizeInput(v);
                return false;
            };

            drop_zone[0].ondrop = function(event) {
                minimizeInput(v);
                clear_error();
                var files = event.dataTransfer.files;
                // Check Files
                var check_result = check_files(files);
                if(check_result == false) {
                    $('#' + uploader_id + ' .files').html('');
                    // Delete input and create new
                    var new_id = get_random_id();
                    var cur_input_html = $(v)[0].outerHTML;
                    var new_v = $.parseHTML(cur_input_html);
                    $(new_v).attr('id', new_id);
                    $(v).before(new_v);
                    $(v).remove();
                    v = $('#'+new_id)[0];
                    $(v).change(function() {
                        files_changed();
                    });
                    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                }
            };

            $(drop_zone).find("." + options.browse_css_selector).click(function(event) {
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                $(v).click();
            });

            // Show added files
            $(v).change(function() {
                files_changed();
            });

            function files_changed() {
                var files = $(v)[0].files;
                $('#' + uploader_id + ' .files').html('');
                for (var i = 0; i < files.length; i++) {
                    if(thumbnails_layout) {
                        // Add file to list
                        $('#' + uploader_id + ' .files.thumb').append('<li id="selected_file_' + i + '"><div class="thumbnail"></div><span class="title" title="' + files[i].name + '"> ' + files[i].name + ' </span></li>');
                        // Thumbnail
                        preview_file(files[i],i);
                    } else {
                        // Add file to list
                        $('#' + uploader_id + ' .files').append('<li id="selected_file_' + i + '">' + options.file_icon + ' ' + files[i].name + ' </li>');
                    }
                }
            }

            function preview_file(file, i) {
                var reader  = new FileReader();

                // Check file type
                if(file.type.match('image/*')) {
                    reader.readAsDataURL(file);
                } else if(file.type.match('video/*')) {
                    $('#' + uploader_id + ' #selected_file_' + i + ' div.thumbnail').html('<i class="pe-7s-video"></i>');
                } else if(file.type.match('audio/*')) {
                    $('#' + uploader_id + ' #selected_file_' + i + ' div.thumbnail').html('<i class="pe-7s-volume"></i>');
                } else {
                    $('#' + uploader_id + ' #selected_file_' + i + ' div.thumbnail').html('<i class="pe-7s-file"></i>');
                }

                reader.onloadend = function () {
                    $('#' + uploader_id + ' #selected_file_' + i + ' div.thumbnail').attr('style', 'background-image: url("' + reader.result + '")');
                }
            }

            function set_error(text) {
                $('#' + uploader_id + ' .errors').html('<p>' + text + '</p>');
                if (options.time_show_errors > 0) {
                    setTimeout(clear_error, options.time_show_errors * 1000);
                }
            }

            function clear_error() {
                $('#' + uploader_id + ' .errors p').fadeOut("slow", function() {
                    $('#' + uploader_id + ' .errors p').remove();
                });
            }

            function get_file_size_readable(bytes) {
                if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
                else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
                else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
                else if (bytes>1)           {bytes=bytes+' bytes';}
                else if (bytes==1)          {bytes=bytes+' byte';}
                else                        {bytes='0 byte';}
                return bytes;
            };

            function check_files(files) {
                var allow_file_add = true;
                // Check multiple file support
                if (file_multiple) {
                    allow_file_add = true;
                } else {
                    if (files.length > 1) {
                        set_error('Only one file allowed');
                        allow_file_add = false;
                    } else {
                        allow_file_add = true;
                    }
                }
                // Check file type support
                if(file_accept === undefined) {
                    allow_file_add = true;
                } else {
                    var accept_array = file_accept.split(',');
                    for (var i = 0; i < files.length; i++) {
                        var match_count = 0;
                        for (var a = 0; a < accept_array.length; a++) {
                            var match_string = accept_array[a].replace('/','.').trim();
                            if(files[i].type.match(match_string) != null) {
                                match_count++;
                            }
                        }
                        if(match_count == 0) {
                            set_error('File type is not allowed');
                            allow_file_add = false;
                            break;
                        }
                    }
                }
                // Check file size
                for (var i = 0; i < files.length; i++) {
                    if(files[i].size > max_file_size && max_file_size > 0) {
                        allow_file_add = false;
                        set_error('File is bigger than ' + get_file_size_readable(max_file_size));
                    }
                }
                return allow_file_add;
            }

            function maximizeInput(v) {
                var drop_zone = $(v).parent(".drop_zone");
                var position = drop_zone.position();
                var top = position.top + parseInt(drop_zone.css('marginTop'), 10);
                var left = position.left + parseInt(drop_zone.css('marginLeft'), 10);
                $(v).css({top: top, left: left, position:'absolute', width: drop_zone.width(), height: drop_zone.height(), display:'block'});
            }

            function minimizeInput(v) {
                $(v).css({display:'none'});
            }

            function get_random_id() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for( var i=0; i < 15; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            }
        });
    };
})(jQuery);

