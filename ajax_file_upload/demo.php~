<html>
<head>
<style type='text/css'>
.filemgt{
border:1px solid red;width:400px;top:0px;right:0px;position:absolute;min-height:400px;
}
.filemgt table td{
border:1px solid red
}

</style>
<script type="text/javascript" src="webroot/js/jquery-1.8.1.min.js"></script>
<script type="text/javascript" src="webroot/js/fileupload.js"></script>
<script type="text/javascript">

$(document).ready(function() {
 $('#vishal').ajaxfileuploader({SCRIPT: 'process.php',VALIDFORMAT:['jpeg','jpg','png','gif'],MAXUPLOAD:9,TABLEHEAD:{name:'name',imgname:'image name',operation:'Operation'}})

});
</script>
</head>
<body>
<div style='width:200px;height:200px;border:1px solid red' id='queuearea'>
</div>
<form name='form1' action='#' >
	<feildset>
	<div>
	<label>Name</label>:<input type='text' value=''>
	</div>
	<div>
	<label>Upload</label>:<input type='file' value='' id='vishal' >
	</div>
	</feildset>
</form>

<div class="imgupload" style='position:absolute;top:0px;display:none'>
<form target="fileuploadiframe" id='uploadmanager' enctype="multipart/form-data" method='post' action="index.php?c=vishal&a=uploadpersonalimg&app=findyourpartner">
<input id="fileupload" type="file" name="files"  >
</form>
</div>




</body>
</html>
