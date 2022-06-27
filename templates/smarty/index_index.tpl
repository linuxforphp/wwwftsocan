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
        <div class="row text-left flex flex-wrap">
            <div class="col-md-8">
                <h1 class="p-2 text-center">Welcome to<br />{$view.appname}!</h1>
                <p class="p-2 text-center text-md md:text-lg text-grey-dark leading-normal">
                    You can view a list of all products!
                </p>
                <p class="mb-5 text-center"><a href="{$view.urlbaseaddr}products/index" class="btn btn-light mt-6 inline-block bg-white text-black no-underline px-4 py-3 shadow-lg">View products</a></p>
            </div>
            <div class="col-md-4 items-center">
                <p><img src="{$view.urlbaseaddr}img/lightmvc_logo.png" class="center-block shadow-lg" /><br /></p>
            </div>
        </div>
    </div>

    <!-- feature -->
    <div class="bg-yellow text-black">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="p-5 text-center text-grey-darkest">
                        <div class="mb-5 h3 font-weight-bold">
                            Easily create PHP applications by using any PHP library within this very modular, event-driven and Swoole-enabled framework!
                        </div>
                        <p class="lg:text-xl"><a href="https://lightmvcframework.net/" target="_blank">https://lightmvcframework.net/</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /feature -->

    <!-- content -->
    <div class="bg-white">
        <div class="container">
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-4">
                    <div class="row justify-content-center">
                        <a href="https://getlaminas.org/" target="_blank"><img class="center-block mt-5 p-2" src="{$view.urlbaseaddr}img/laminas-logo.svg" /></a>
                    </div>
                    <div class="row justify-content-center">
                        <a href="https://symfony.com/" target="_blank"><img class="center-block mt-5 p-2" src="{$view.urlbaseaddr}img/symfony.png" /></a>
                    </div>
                    <div class="row justify-content-center">
                        <a href="https://www.swoole.co.uk/" target="_blank"><img class="center-block mt-5 p-2" src="{$view.urlbaseaddr}img/swoole.png" /></a>
                    </div>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-5">
                    <h3 class="mt-5 mb-8">
                        Build applications using PSR-15 compliant middleware and PSR-7 compliant HTTP messages.
                    </h3>
                    <p class="mb-8">Built upon proven technologies like Laminas Diactoros, Laminas Stratigility, and Laminas EventManager!</p>
                    <p class="mb-8">Many great technologies, like Pimple, FastRoute, Plates, and Whoops come together to become the LightMVC Framework!</p>
                    <p class="mb-8">And, let's not forget these great-looking templates created with Bootstrap and Tailwind CSS!</p>
                    <p class="text-center"><a href="{$view.urlbaseaddr}products/index" class="btn btn-dark inline-block bg-black text-white mb-5 px-4 py-3 no-underline shadow-lg">Browse our products</a></p>
                </div>
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
