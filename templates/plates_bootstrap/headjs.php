<head>
    <!-- meta character set -->
    <meta charset="utf-8">
    <!-- Always force latest IE rendering engine or request Chrome Frame -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!-- Mobile Specific Meta -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Meta Description -->
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="<?=$view['description'] ?>">
    <meta name="author" content="<?=$view['author'] ?>">
    <meta name="keywords" content="flare, flare networks, servers, node, unleashing value, linux, docker, asclinux, linux for php, lfphp">
    <link rel="icon" href="<?=$view['favicon'] ?>">

    <link rel="apple-touch-icon" href="<?=$view['urlbaseaddr'] ?>apple-touch-icon.png">

    <title><?=$view['title'] ?></title>

    <!-- CSS
    ================================================== -->

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" type='text/css'> 

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css'>

    <!-- Fontawesome Icon font -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/font-awesome.min.css">
    <!-- bootstrap.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/jquery.fancybox.css">
    <!-- bootstrap.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/bootstrap.min.css">
    <!-- owl.carousel.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/owl.carousel.min.css">
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/owl.theme.default.min.css">
    <!-- slit-slider.css -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/slit-slider.css">
    <!-- animate.css -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/animate.css">
    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/main.css">

    <?php foreach($view['css'] as $key => $value): ?>
        <link href="<?php echo $value ?>" rel="stylesheet">
    <?php endforeach; ?>

    <?php foreach($view['jshead'] as $key => $value): ?>
        <script src="<?php echo $value ?>"></script>
    <?php endforeach; ?>

    <?php foreach($view['jsscriptshead'] as $key => $value): ?>
        <?php echo $value ?>
    <?php endforeach; ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="<?=$view['urlbaseaddr'] ?>js/html5shiv.min.js"></script>
      <script src="<?=$view['urlbaseaddr'] ?>js/respond.min.js"></script>
    <![endif]-->
</head>
