<?php

namespace Application\Controllers;

use Ascmvc\Mvc\Controller;

class FlrexplorerController extends Controller
{
    public function indexAction($vars = null)
    {
        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;
        
        $this->view['templatefile'] = 'flrexplorer_index';
        
        return $this->view;
    }
}
