<!-- Core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
{foreach from=$view.js item=script}
    <script src="{$script}"></script>
{/foreach}

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

{foreach from=$view.jsscripts item=script}
    {$script}
{/foreach}