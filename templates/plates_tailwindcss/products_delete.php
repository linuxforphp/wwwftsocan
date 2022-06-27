<!DOCTYPE html>
<html lang="en">

<?php if (isset($view['headjs'])): ?>
    <?=$this->section('headjs', $this->fetch('headjs', ['view' => $view]))?>
<?php else: ?>
    <?=$this->section('head', $this->fetch('head', ['view' => $view]))?>
<?php endif ?>

  <body>
  <?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

  <div id="pageBodyProducts">
      <div class="w-full py-24 px-6 bg-grey-lighter relative z-10">
          <div class="container max-w-xl mx-auto text-left flex items-center flex-wrap w-1/2">

              <div class="w-full md:w-2/3">
                  <h1 class="text-2xl md:text-4xl text-grey-darkest mb-3">Delete product</h1>
              </div>

              <?php if ($view['saved'] === 1): ?>
                  <div class="bg-green-lightest border border-green-light text-green-dark px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">Success!</strong>
                      <span class="block sm:inline">The product has been deleted.</span>
                  </div>
              <?php endif ?>
              <?php if ($view['error'] === 1): ?>
                  <div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">The product has not been deleted!</strong>
                      <span class="block sm:inline">Please try again.</span>
                  </div>
              <?php endif ?>
          </div>
          <p><br /><br /><a href="<?php echo $view['urlbaseaddr'] ?>products/index" class="inline-block bg-black text-white text-sm px-4 py-3 no-underline">List products</a></p>
      </div>
  </div> <!-- END pageBody -->

  <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>

  <?php if ($view['bodyjs'] === 1): ?>
      <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
  <?php endif ?>

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="<?php echo $view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>
    
  </body>
</html>
