<?php

namespace Application\Controllers;

use Ascmvc\Mvc\Controller;

class StakeController extends Controller
{
    public function indexAction($vars = null)
    {
        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;
        
        $this->view['templatefile'] = 'stake_index';
        
        return $this->view;
    }
}
