<?php

namespace Application\Controllers;

use Ascmvc\Mvc\Controller;

class SgbexplorerController extends Controller
{
    public function indexAction($vars = null)
    {
        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;
        
        $this->view['templatefile'] = 'sgbexplorer_index';
        
        return $this->view;
    }
}
