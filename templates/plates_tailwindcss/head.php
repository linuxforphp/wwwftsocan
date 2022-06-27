 <head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="<?php echo $view['description'] ?>">
    <meta name="author" content="<?php echo $view['author'] ?>">
    <link rel="icon" href="<?php echo $view['favicon'] ?>">

    <link rel="apple-touch-icon" href="<?php echo $view['urlbaseaddr'] ?>apple-touch-icon.png">

    <title><?php echo $view['title'] ?></title>

    <!-- Core CSS -->
    <?php foreach($view['css'] as $key => $value): ?>
    <link href="<?php echo $value ?>" rel="stylesheet">
    <?php endforeach; ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="<?php echo $view['urlbaseaddr'] ?>js/html5shiv.min.js"></script>
      <script src="<?php echo $view['urlbaseaddr'] ?>js/respond.min.js"></script>
    <![endif]-->
    
  </head>