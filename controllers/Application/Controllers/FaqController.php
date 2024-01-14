<?php

namespace Application\Controllers;

use Ascmvc\Mvc\Controller;

class FaqController extends Controller
{
    public function indexAction($vars = null)
    {
        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['templatefile'] = 'faq_index';

        return $this->view;
    }
}
