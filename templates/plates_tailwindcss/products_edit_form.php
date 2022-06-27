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
                  <h1 class="text-2xl md:text-4xl text-grey-darkest mb-3">Edit product</h1>
              </div>

              <?php if (isset($view['results'])): ?>
                  <?php foreach($view['results'] as $key => $product): ?>
                  <form class="w-full max-w-md" method="post" action="" enctype="multipart/form-data" id="formedit1">
                      <input type="hidden" name="id" value="<?php echo $product['id'] ?>" />
                      <input type="hidden" name="imageoriginal" value="<?php echo $product['image'] ?>" />
                      <div class="flex flex-wrap -mx-3 mb-6">
                          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                              <label for="name" class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Name</label><br />
                              <input type="text" name="name" id="name" size="30" value="<?php echo $product['name'] ?>" /><br />
                          </div>
                          <div class="w-full md:w-1/2 px-3">
                              <label for="price" class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Price</label><br />
                              <input type="text" name="price" id="price" value="<?php echo $product['price'] ?>" /><br />
                          </div>
                      </div>
                      <div class="flex flex-wrap -mx-3 mb-6">
                          <div class="w-full px-3">
                              <label for="description" class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Description</label><br />
                              <input type="text" name="description" id="description" size="100" value="<?php echo $product['description'] ?>" /><br />
                          </div>
                      </div>
                      <div class="flex flex-wrap -mx-3 mb-2">
                          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                              <label for="image" class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">Image</label><br />
                              <input type="file" name="image" id="image" /><br />
                          </div>
                      </div>
                      <p>NOTE: If no file is selected, the current file will be kept.</p>

                      <button class="flex-no-shrink bg-blue hover:bg-blue-dark border-blue hover:border-blue-dark text-sm border-4 text-white py-1 px-2 rounded" type="submit" form="formedit1">
                          Save
                      </button>
                  </form>
                  <?php endforeach; ?>
              <?php endif ?>

              <?php if ($view['saved'] === 1): ?>
                  <div class="bg-green-lightest border border-green-light text-green-dark px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">Success!</strong>
                      <span class="block sm:inline">The product has been saved.</span>
                  </div>
              <?php endif ?>
              <?php if ($view['error'] === 1): ?>
                  <div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">The product has not been saved!</strong>
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
