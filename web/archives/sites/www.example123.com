<html data-adblockkey="MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLl0RJYcDS0N2xIgi01rOAcEtvCUTUq+IuNz5PA8eXYsfPLRkgnNehO+NbOZAlLoQnSpB5rXuRxRCTF+T1iU9sCAwEAAQ==_I8LZh8/0OlkpKQO5qP/8CTvyaiRfze7x/fMpfBtnrorPtwE1cjhTrhpKW4D/T3q98sFZEB3s3HlvbgRAcUD7lQ==" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
	<title>example123.com</title>
	<meta name="keywords" value=""/>
	<meta name="description" content="">
	    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	    <script type="text/javascript">
		$(document).ready(function () {
		    $('#main').attr('src', "/cf.php");
		    $('#main').css('visibility', 'visible');
		});

		/* if (parent.frames.length > 0)
		    top.location.replace(document.location); */
	    </script>
    </head>
    <frameset rows="100%,*" frameborder="no" border="0" framespacing="0" id="frameset">
	<frame id="main" src="/cf.php"></frame>
	<frame id="sub1" src="bh.php?dm=example123.com&kw=example123&tt=7ee1a54efe3f3be31736970a50963f14&ty=false" style="visibility: hidden;"></frame>
    </frameset>
</html>