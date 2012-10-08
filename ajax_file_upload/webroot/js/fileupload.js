(function($) {

  $.fn.ajaxfileuploader = function(options) {

    var opts = $.extend({}, $.fn.ajaxfileuploader.defaults, options);
    var filelist = new Array();	
    var uploadwidget = new Object();
    var imgwidget = new Object();
    		

    return this.each(function() {
	   
			buildElement($(this).attr("id"))
	      		$(this).change(onChange);
		
		

    });

    function onChange() {
		/* Validate Form Before submit */
		var filename = $(this).val();
		var pos = filename.lastIndexOf('.'); 
		var msg = '';
		if(pos !== -1)
		{
			var extension = filename.substring(pos+1);
			var isvalidextension = false;
			msg = "Invalid file not supported";
			for(i in opts.VALIDFORMAT)
			{
				
				if(extension == opts.VALIDFORMAT[i])
				{isvalidextension= true; break;}
				
			}
			
		
		
		

		}
		
		if(isvalidextension && imgwidget.find("tr").length > opts.MAXUPLOAD)
		{isvalidextension= false; msg = "only "+opts.MAXUPLOAD+" File can be uploaded ";displayUploadForm()}

		if(isvalidextension)	
		uploadwidget.find("form").submit();


		
		if(!isvalidextension||pos == -1)
		alert(msg)
				
      		return false;
    }
	function delRow(){
	
		if(!confirm("Are you sure, you want to delete this image?"))
		return;
		
		var row = $(this).parents("tr");
		var imgname = $(this).attr("title");
		
		var request = $.ajax({
			  url: opts.SCRIPT+"?action=deleteimg",
			  type: "POST",
			  async:false,
			  data: {name : imgname},
			  dataType: "html"
		});
		request.done(function(msg) {

				row.remove();
				displayUploadForm()
		});
		
		request.fail(function(jqXHR, textStatus) {
				alert( "Request failed:User " + textStatus );
		});	
			
		return false;
	}
    function displayUploadForm(){
		
		if(imgwidget.find("tr").length < opts.MAXUPLOAD+1)
		uploadwidget.find('form input').removeAttr("disabled")
		else
		uploadwidget.find('form input').attr("disabled","disabled")
    }			
    function loaddetails(){
	
	var txt = uploadwidget.find("iframe").contents().find('body').html();

	var obj = jQuery.parseJSON(txt);
	
	if(obj)
	{
		for(i in obj['files'])
		{
			var name = obj['files'][i].name;
			var thumbimgurl = obj['files'][i].thumbimgurl;
			var upload_name	= obj['files'][i].upload_name;
			imgwidget.find("table").append("<tr id='"+name+"'><td><img src='"+thumbimgurl+"'></td><td>"+upload_name+"</td><td><a href='javascript:void(0)' class='delrow' title='"+name+"'>Delete</a></td></tr>");
			imgwidget.find("tr[id='"+name+"'] a.delrow").click(delRow)	
		}
	}
	displayUploadForm();
    }	
    function buildElement(id)
    {
		
	var pos = $("#"+id).offset();	
	var divid = "uploadwidget"+id
	var formid = "idOfFormElement"+id;
	var iframeid = "idOfIframeElement"+id;
	
	$('body').append($('<div id="'+divid+'"></div>'));
	$('body').append($('<div id="'+divid+'_imgmgt" class="filemgt"><table></table><div class="paginate"></div></div>'));

	uploadwidget = $('#'+divid);
	imgwidget = $('#'+divid+'_imgmgt');
	imgwidget.find("table").append("<tr><td>"+opts.TABLEHEAD.name+"</td><td>"+opts.TABLEHEAD.imgname+"</td><td>"+opts.TABLEHEAD.operation+"</td></tr>");

	uploadwidget.append('<iframe name="'+iframeid+'" id="'+iframeid+'" style="width:0px;height:0px" src="'+opts.SCRIPT+'?action=getimages"></iframe>');	
	uploadwidget.append($('<form action="'+opts.SCRIPT+'?action=addimg" enctype="multipart/form-data" method="post" target="'+iframeid+'"></form>'));
	uploadwidget.find('form').append('<input id="fileupload1" type="file" name="files1" class="file" >');
	

	uploadwidget.css("position","absolute")
	uploadwidget.css("top",pos.top);
	uploadwidget.css("left",pos.left);
	uploadwidget.find('iframe').hide();

	uploadwidget.find('iframe').bind('load',loaddetails);
	$("#"+id).hide();
	uploadwidget.find('.file').change(onChange);

    }
   			

 }

  $.fn.ajaxfileuploader.defaults = {SCRIPT: 'process.php',ACTION:'',VALIDFORMAT:['jpeg','jpg','png','gif'],MAXUPLOAD:5,TABLEHEAD:{name:'name',imgname:'image name',operation:'Operation'}}

})(jQuery);


