<?php

namespace Application\Controllers;

use Ascmvc\Mvc\Controller;

class Dapp_WrapController extends Controller
{
    public function indexAction($vars = null)
    {
        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;
        
        $this->view['templatefile'] = 'Dapp_Wrap_index';
        
        return $this->view;
    }
}
