<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="{$view.description}">
    <meta name="author" content="{$view.author}">
    <link rel="icon" href="{$view.favicon}">

    <link rel="apple-touch-icon" href="{$view.urlbaseaddr}apple-touch-icon.png">

    <title>{$view.title}</title>

    <!-- Core CSS -->
    {foreach from=$view.css item=script}
        <link href="{$script}" rel="stylesheet">
    {/foreach}

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="{$view.urlbaseaddr}js/html5shiv.min.js"></script>
      <script src="{$view.urlbaseaddr}js/respond.min.js"></script>
    <![endif]-->

</head>