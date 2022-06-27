<!-- Core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<?php foreach($view['js'] as $key => $value): ?>
    <script src="<?php echo $value ?>"></script>
<?php endforeach; ?>

<script>
    var jq = $.noConflict();
    jq(document).ajaxComplete(function() {
        var obj = { Title: 'PHP Code Viewer', Url: '{$view.links.Home}' };
        history.pushState(obj, obj.Title, obj.Url);
        jq('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        jq('#mainFileBrowser').DataTable();
    });
</script>

<?php foreach($view['jsscripts'] as $key => $value): ?>
    <?php echo $value ?>
<?php endforeach; ?>