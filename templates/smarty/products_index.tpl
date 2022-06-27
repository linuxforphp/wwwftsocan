<!DOCTYPE html>
<html lang="en">

{if isset($view.headjs)}
    {include file='headjs.tpl'}
{else}
    {include file='head.tpl'}
{/if}

<body>
{include file='navbar.tpl'}

<main role="main">

    <div class="container">
        <div id="pageBodyProducts"class="row">
            <h1 class="h1 pt-2 pb-4">Products page</h1>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Actions</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {if isset($view.results.nodata)}
                        <tr>
                            <td>{$view.results.nodata}</td>
                        </tr>
                    {else}
                        {foreach from=$view.results item=product}
                            <tr>
                                <td>{$product.id}</td>
                                <td>{$product.name}</td>
                                <td>{$product.price}</td>
                                <td>{$product.description}</td>
                                <td>{$product.image}</td>
                                <td>
                                    <a href="{$view.urlbaseaddr}products/edit/{$product.id}">Modify</a>
                                </td>
                                <td>
                                    <a href="{$view.urlbaseaddr}products/delete/{$product.id}">Delete</a>
                                </td>
                            </tr>
                        {/foreach}
                    {/if}
                    </tbody>
                </table>
            </div>
            <p class="pb-5"><a href="{$view.urlbaseaddr}products/add" class="btn btn-light mt-6 inline-block bg-white text-black no-underline px-4 py-3 shadow-lg">Add new product</a></p>
        </div> <!-- END pageBodyProducts -->
    </div>

    <!-- feature -->
    <div class="bg-yellow text-black">
        <div class="container">
            <div class="row">
                <div class="col-lg-12"><p><br /></p></div>
            </div>
        </div>
    </div>
    <!-- /feature -->

    <!-- content -->
    <div class="bg-white">
        <div class="container">
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-4"></div>
                <div class="col-md-1"></div>
                <div class="col-md-5"></div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </div>

</main> <!-- /content -->

<div class="container-footer">
    {include file='footer.tpl'}
</div>

{if $view.bodyjs == 1}
    {include file='bodyjs.tpl'}
{/if}

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="{$view.urlbaseaddr}js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>