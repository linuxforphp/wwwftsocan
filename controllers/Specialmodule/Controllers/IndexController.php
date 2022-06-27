<?php

namespace Specialmodule\Controllers;

use Ascmvc\Mvc\AscmvcEvent;
use Ascmvc\Mvc\Controller;
use Laminas\Diactoros\Response\JsonResponse;

class IndexController extends Controller
{
    protected $sessionManager;

    public function onDispatch(AscmvcEvent $event)
    {
        $app = $event->getApplication();

        $sessionManager =  $app->getSessionManager();

        $sessionManager->getSession()->set('middleware', $_SERVER['middleware']);

        $this->sessionManager = $sessionManager;
    }

    public function indexAction($vars = null)
    {
        $session = $this->sessionManager->getSession();

        $array = [
            'module' => 'Specialmodule',
            'controller' => 'IndexController',
            'sessionmiddleware' => $session->get('middleware')['session'],
            'examplemiddleware' => $session->get('middleware')['example'],
            'middlewareconstant' => BAZCONSTANT
        ];
        $response = new JsonResponse($array);

        return $response;
    }
}
