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
                  <h1 class="text-2xl md:text-4xl text-grey-darkest mb-3">Products page</h1>
              </div>

              <table class="w-full table-responsive">
                  <thead>
                      <tr>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">ID</th>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Name</th>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Price</th>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Image</th>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Options</th>
                          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest"></th>
                      </tr>
                  </thead>
                  <tbody class="align-baseline">
                  <?php if (isset($view['results']['nodata'])): ?>
                      <tr>
                          <td><?php echo $view['results']['nodata'] ?></td>
                      </tr>
                  <?php else: ?>
                      <?php foreach($view['results'] as $key => $product): ?>
                          <tr>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap"><?php echo $product['id'] ?></td>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap"><?php echo $product['name'] ?></td>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap"><?php echo $product['price'] ?></td>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap"><?php echo $product['description'] ?></td>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap"><?php echo $product['image'] ?></td>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap">
                                  <a href="<?php echo $view['urlbaseaddr'] ?>products/edit/<?php echo $product['id'] ?>">Modify</a>
                              </td>
                              <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark whitespace-no-wrap">
                                  <a href="<?php echo $view['urlbaseaddr'] ?>products/delete/<?php echo $product['id'] ?>">Delete</a>
                              </td>
                          </tr>
                      <?php endforeach; ?>
                  <?php endif ?>
                  </tbody>
              </table>
              <p><a href="<?php echo $view['urlbaseaddr'] ?>products/add" class="mt-6 inline-block bg-white text-black no-underline px-4 py-3 shadow-lg">Add new product</a></p>

          </div>

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
