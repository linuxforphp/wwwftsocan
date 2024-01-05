<?php

namespace Application\Controllers;

use Ascmvc\Mvc\Controller;

class C404Controller extends Controller
{
    public function indexAction($vars = null)
    {
        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;
        
        $this->view['templatefile'] = 'c404_index';

        $this->view['statuscode'] = 404;
        
        return $this->view;
    }
}
