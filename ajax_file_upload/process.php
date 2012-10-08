<?php

/* global setting */
/* database setting */
$dbhostname = "localhost";
$dbname  = "test";
$dbusername = "root";
$dbpassword = "root";

/* image table */
$imgtable = "users_images";


include("class.AjaxImgupload.php");
/*
	server upload_dir - location where image will be uploaded
	upload_url	  - http address to access image
	max_size 	  - Maximum size for image or file type
	file_support	  - Supported file type
	thumbnail_dir     - Location of thumbnail on server
	thumbnail_dimension - dimension of thumbnail to displayed
	callback 	  - when image is created/uploaded on server , this function is called to store information in database or anything eg.  add_userEntry
	loadcallback	  - this function is called to retrive details of all images stored so far on server eg. getalldetails	
*/

/* configuration options */
$options = array();
$options = array(
		'upload_dir'=>$_SERVER['DOCUMENT_ROOT'].'/ajax_file_upload/file/images/main/',
		'upload_url'=>'/ajax_file_upload/file/images/main/',
		'max_size'=>array(
				'jpeg'=>'20111110','jpg'=>'2011110',
				'txt'=>'500'
				),
		'file_support'=>array('jpeg','gif','jpg'),
		'thumbnail_dir'=>$_SERVER['DOCUMENT_ROOT'].'/ajax_file_upload/file/images/thumb/',
		'thumbnail_url'=>'/ajax_file_upload/file/images/thumb/',
		'thumbnail_dimension'=>array("max_width"=>150,"max_height"=>75)				
		);

$options['callback'] = 'add_userEntry';
$options['loadcallback'] = 'getalldetails';
$userid = 5;
$action = $_REQUEST['action'];


$Filehandler = new AjaxImgupload($options);
$Filehandler->responder($action);


/* User entry */
function add_userEntry($filedetails){

	global $userid,$dbhostname,$dbusername,$dbpassword,$dbname,$imgtable;

	$connect = mysql_connect($dbhostname,$dbusername,$dbpassword);
	mysql_select_db($dbname);
	foreach($filedetails as $details)
	{
		$filename = $details['name'];
		switch($details['action'])
		{
			case "added":
			$upload_filename = $details['upload_name'];
			mysql_query("insert into $imgtable(user_id,file_id,file_name) values('$userid','$filename','$upload_filename')");
			break;
			case "deleted":
			mysql_query("delete from $imgtable where user_id='$userid' and file_id='$filename'");
			break;	
		}		
	}
}
/* get user details */
function getalldetails($obj){

	global $userid,$dbhostname,$dbusername,$dbpassword,$dbname,$imgtable;

	$connect = mysql_connect($dbhostname,$dbusername,$dbpassword);
	mysql_select_db($dbname);
	$resultset = mysql_query("select * from $imgtable where user_id='$userid'");	
	$details = array();
	$details['files'] = array();
	while($row = mysql_fetch_array($resultset))
	{
		$details['files'][] = array("name"=>$row['file_id'],"upload_name"=>$row['file_name'],'thumbimgurl'=>$obj->options['thumbnail_url'].$row['file_id'],'action'=>'loaded');
			
	}
	return $details;
}	


?>

