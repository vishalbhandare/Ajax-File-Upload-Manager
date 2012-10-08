<?php
/*
	Author: vishal bhandare
	Email: bhandare.vishal@gmail.com

	Main class to manage ajax upload from backend
	
*/
class AjaxImgupload{

	/* configuration options */
	var $options = array();

	/* constructor */
	function __construct($options = array())
	{
		/* default configuration */
		$this->options = array(
				'upload_dir'=>$_SERVER['DOCUMENT_ROOT'].'/feature/ajax_file_upload/file/images/main/',
				'upload_url'=>'/feature/ajax_file_upload/file/images/main/',
				'max_size'=>array(
						'jpeg'=>'20111110','jpg'=>'2011110',
						'txt'=>'500'
						),
				'file_support'=>array('jpeg','gif','jpg'),
				'thumbnail_dir'=>$_SERVER['DOCUMENT_ROOT'].'/feature/ajax_file_upload/file/images/thumb/',
				'thumbnail_url'=>'/feature/ajax_file_upload/file/images/thumb/',
				'thumbnail_dimension'=>array("max_width"=>150,"max_height"=>75)				
				);

		/* replace with customi condiguration */
		$this->options = array_replace_recursive($this->options, $options);
	
	}
	/* add file to repository */
	function addFile()
	{
		/* validate uploaded file */
		$this->validate();		
	}
	/*
		validate file
		 -  file size
		 -  supported file type
		 -  any kind of error in file upload
	*/
	function validateFiles()
	{
	
		$errorslist = array();
		$details = array();
		foreach($_FILES as $key=>$value)
		{
			//print $key;
			$name = $value['name'];
			$type = $value['type'];
			$size = $value['size'];
			
			$extension = substr(strstr($name,"."),1);
			/* Size of file check*/
			if(1024 * $this->options['max_size'][$extension] < $size)
			{
				$errorslist[$key][$name][] = "File is too large".$size;
				continue;
			} 
			
			/* extension check */
			if(!in_array($extension,$this->options['file_support']))
			{
				$errorslist[$key][$name][] = "File is not of correct type";continue;
			}

			/* mime type check */
			if(!in_array($extension,$this->options['file_support']))
			{
				$errorslist[$key][$name][] = "File is not of correct type";continue;
			}
			/* check for any kind of error in file upload */
			if($value['error']!=0)
			{
				$errorslist[$key][$name][] = "There was some error while uploading file. Please try again.";continue;	
			}

			/* generate unique name for file */
			$filename = rand(10,10000)."_".date("Ymdh").".".$extension;
			/* move file from temporary location to some location */			
			move_uploaded_file($value['tmp_name'], $this->options['upload_dir']."$filename");
			if(isset($this->options['thumbnail_dir']))
			{
				$this->createThumbnail($filename);	
			}
			
			$details['files'][] = array("name"=>$filename,"upload_name"=>$name,'thumbimgurl'=>$this->options['thumbnail_url'].$filename,'action'=>'added');
			

		}
			
		if(isset($this->options['callback']))
		{
			call_user_func($this->options['callback'],$details['files']);
		}
		return $details;
		
	}

	/*
	this function generate thumbnail for uploaded images
	*/
	function createThumbnail($file_name)
	{
		$dimension = $this->options['thumbnail_dimension'];
		$file_path = $this->options['upload_dir'].$file_name;
		$new_file_path = $this->options['thumbnail_dir'].$file_name;
		list($img_width, $img_height) = @getimagesize($file_path);
		
		if (!$img_width || !$img_height) {
		    return false;
		}
		$scale = min(
		    $dimension['max_width'] / $img_width,
		    $dimension['max_height'] / $img_height
		);
		
		if ($scale >= 1) {
		    if ($file_path !== $new_file_path) {
		        return copy($file_path, $new_file_path);
		    }
		    return true;
		}
		
		$new_width = $img_width * $scale;
		$new_height = $img_height * $scale;
		$new_img = @imagecreatetruecolor($new_width, $new_height);
		
		switch (strtolower(substr(strrchr($file_name, '.'), 1))) {
		    case 'jpg':
		    case 'jpeg':
					
		        $src_img = @imagecreatefromjpeg($file_path);
		        $write_image = 'imagejpeg';
		        $image_quality = 75;
		        break;
		    case 'gif':
		        @imagecolortransparent($new_img, @imagecolorallocate($new_img, 0, 0, 0));
		        $src_img = @imagecreatefromgif($file_path);
		        $write_image = 'imagegif';
		        $image_quality = null;
		        break;
		    case 'png':
		        @imagecolortransparent($new_img, @imagecolorallocate($new_img, 0, 0, 0));
		        @imagealphablending($new_img, false);
		        @imagesavealpha($new_img, true);
		        $src_img = @imagecreatefrompng($file_path);
		        $write_image = 'imagepng';
		        $image_quality = 9;
		        break;
		    default:
		        $src_img = null;
		}
		$success = $src_img && @imagecopyresampled(
		    $new_img,
		    $src_img,
		    0, 0, 0, 0,
		    $new_width,
		    $new_height,
		    $img_width,
		    $img_height
		) && $write_image($new_img, $new_file_path, $image_quality);
	
		// Free up memory (imagedestroy does not delete files):
		@imagedestroy($src_img);
		@imagedestroy($new_img);
		return $success;
	}
	
	/* Remove file from disk and call user function to clean related to file from database */
	function removeFile($names=array())
	{
		$details = array();
		foreach($names as $name){
			$status = array("name"=>$name,'action'=>'deleted');
			
			$status['status'] = $this->unlinkImages($name);
			
			$details['files'][] = $status;	
			
		}
		if(isset($this->options['callback']))
		{
				call_user_func($this->options['callback'],$details['files']);
		}
		return true; 	
	}

	/* File delete */
	function unlinkImages($name)
	{
		if(file_exists($this->options['upload_dir'].$name))
		{
			@unlink($this->options['upload_dir'].$name);
			@unlink($this->options['thumbnail_dir'].$name);
			return true;	
		}
		else
			return false;
	}

	/* Return all file */	
	function getFilesDetails()
	{	
		
		$files = array();
		if(isset($this->options['loadcallback']))
		$files = call_user_func($this->options['loadcallback'],$this);
		return $files;
	}

	/* get thumbnail url */
	function getFile($id,$thumb=true)
	{
		return $this->options['thumbnail_url'].$id;
	}	

	/* 
		interaction related to common functionality
		- addimg  upload image to repository
		- getfilethumb get file thumbnail as when required
		- deleteimg delete image from server
		- retrive all image details located on server

	*/
	function responder($action='')
	{	
		
		switch($action)
		{
			case "addimg":
				$details = $this->validateFiles();
				print "<html><body>";
				print(json_encode($details));
				print "</body></html>";
				break;
			case "getfilethumb":
				print $this->getFile($_REQUEST['action'],$name);
				break;
			case "deleteimg":
				$filenames = explode(",",$_REQUEST['name']);
				print $this->removeFile($filenames);
				break;
			case "getimages":
				$details = $this->getFilesDetails();
				print "<html><body>";
				print(json_encode($details));
				print "</body></html>";

				break;
		}

	}

}
?>
