<?php

namespace Application\Controllers;

use Application\Events\ReadProductsCompleted;
use Application\Events\WriteProductsCompleted;
use Application\Policies\ProductsPolicy;
use Application\ReadModels\ProductsReadModel;
use Ascmvc\EventSourcing\AggregateEventListenerInterface;
use Ascmvc\EventSourcing\AggregateImmutableValueObject;
use Ascmvc\EventSourcing\AggregateRootController;
use Ascmvc\EventSourcing\Event\Event;
use Ascmvc\EventSourcing\EventDispatcher;
use Ascmvc\EventSourcing\Event\AggregateEvent;
use Ascmvc\Mvc\AscmvcEvent;
use Pimple\Container;
use Laminas\Diactoros\Response;

class ProductsController extends AggregateRootController implements AggregateEventListenerInterface
{
    const READ_REQUESTED =  'products_read_received';

    const CREATE_REQUESTED = 'products_create_received';

    const UPDATE_REQUESTED = 'products_update_received';

    const DELETE_REQUESTED = 'products_delete_received';

    // Define the Aggregate's invokable listeners.
    protected $aggregateListenerNames = [
        ProductsController::READ_REQUESTED => ProductsReadModel::class,
        ProductsController::CREATE_REQUESTED => ProductsPolicy::class,
        ProductsController::UPDATE_REQUESTED => ProductsPolicy::class,
        ProductsController::DELETE_REQUESTED => ProductsPolicy::class,
    ];

    // This controller MUST implement the Ascmvc\AscmvcControllerFactoryInterface interface
    // if you wish to enable this factory method.
    /*public static function factory(array &$baseConfig, EventDispatcher &$eventDispatcher, Container &$serviceManager, &$viewObject)
    {
        // It is possible to override the default identifiers for this Aggregate Root
        // (event notified aggregates).
        $eventDispatcher->setIdentifiers(
            [
                ProductsController::class,
                EventLogger::class,
                SomeClass::class,
            ]
        );

        // Manually attach invokable listeners if needed
        $someReadModel = SomeReadModel::getInstance($eventDispatcher);

        $eventDispatcher->attach(
            ProductsController::READ_REQUESTED,
            $someReadModel
        );

        $somePolicy = ProductsPolicy::getInstance($eventDispatcher);

        // If there are many listeners to attach, one may use a
        // Listener Aggregate that implements the \Laminas\EventManager\ListenerAggregateInterface
        // instead of attaching them one by one.
        $eventDispatcher->attach(
            ProductsController::CREATE_REQUESTED,
            $somePolicy
        );

        $eventDispatcher->attach(
            ProductsController::UPDATE_REQUESTED,
            $somePolicy
        );

        $eventDispatcher->attach(
            ProductsController::DELETE_REQUESTED,
            $somePolicy
        );

        // Instantiate an instance of this controller
        $controller = new ProductsController($baseConfig, $eventDispatcher);

        // If needed, it is possible another listener method to the shared event manager's
        // corresponding identifier (see above).
        $sharedEventManager = $eventDispatcher->getSharedManager();

        $sharedEventManager->attach(
            ProductsController::class,
            '*',
            [$controller, 'someListenerMethod']
        );

        // Return the controller to the Controller Manager.
        return $controller;
    }*/

    /*public function onDispatch(AscmvcEvent $event)
    {
        $array = [
            'firstname' => 'Andrew',
            'lastname' => 'Caya',
            'age' => 42,
        ];

        $response = new Response();
        $response->getBody()->write(json_encode($array));
        $response = $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->withAddedHeader('X-Custom-Header', 'it works');

        return $response;
    }*/

    public function onDispatch(AscmvcEvent $event)
    {
        $this->view['saved'] = 0;

        $this->view['error'] = 0;
    }

    /**
     * Updates the Controller's output at the dispatch event if needed (listener method).
     *
     * @param AggregateEvent $event
     */
    public function onAggregateEvent(AggregateEvent $event)
    {
        if (!$event instanceof WriteProductsCompleted && !$event instanceof ReadProductsCompleted) {
            return;
        }

        $eventName = $event->getName();

        $this->results = $event->getAggregateValueObject()->getProperties();

        $this->params = $event->getParams();
    }

    public function onEvent(Event $event)
    {
        return;
    }

    public function preIndexAction($vars = null)
    {
        if (isset($vars['get']['id'])) {
            $productArray['id'] = (string) $vars['get']['id'];
        } else {
            $productArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($productArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            ProductsController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function indexAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->view['results'] = $this->results;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['bodyjs'] = 1;

        $this->view['templatefile'] = 'products_index';

        return $this->view;
    }

    public function preAddAction($vars)
    {
        if (!empty($vars['post'])) {
            // Would have to sanitize and filter the $_POST array.
            $productArray['name'] = (string) $vars['post']['name'];
            $productArray['price'] = (string) $vars['post']['price'];
            $productArray['description'] = (string) $vars['post']['description'];
            $productArray['image'] = (string) $vars['files']['image']->getClientFilename();

            $aggregateValueObject = new AggregateImmutableValueObject($productArray);

            $event = new AggregateEvent(
                $aggregateValueObject,
                ProductsController::class,
                ProductsController::CREATE_REQUESTED
            );

            $this->eventDispatcher->dispatch($event);
        }
    }

    public function addAction($vars)
    {
        if (isset($this->params['saved'])) {
            $this->view['saved'] = $this->params['saved'];
        }

        if (isset($this->params['error'])) {
            $this->view['error'] = $this->params['error'];
        }

        $this->view['bodyjs'] = 1;

        $this->view['templatefile'] = 'products_add_form';

        return $this->view;
    }

    public function preEditAction($vars)
    {
        if (!empty($vars['post'])) {
            // Would have to sanitize and filter the $_POST array.
            $productArray['id'] = (string) $vars['post']['id'];
            $productArray['name'] = (string) $vars['post']['name'];
            $productArray['price'] = (string) $vars['post']['price'];
            $productArray['description'] = (string) $vars['post']['description'];

            if (!empty($vars['files']['image']->getClientFilename())) {
                $productArray['image'] = (string) $vars['files']['image']->getClientFilename();
            } else {
                $productArray['image'] = (string) $vars['post']['imageoriginal'];
            }

            $aggregateValueObject = new AggregateImmutableValueObject($productArray);

            $event = new AggregateEvent(
                $aggregateValueObject,
                $this->aggregateRootName,
                ProductsController::UPDATE_REQUESTED
            );

            $this->eventDispatcher->dispatch($event);
        } else {
            if (isset($vars['get']['id'])) {
                $productArray['id'] = (string) $vars['get']['id'];

                $aggregateValueObject = new AggregateImmutableValueObject($productArray);

                $event = new AggregateEvent(
                    $aggregateValueObject,
                    $this->aggregateRootName,
                    ProductsController::READ_REQUESTED
                );

                $this->eventDispatcher->dispatch($event);
            }
        }
    }

    public function editAction($vars)
    {
        if (isset($this->params['saved'])) {
            $this->view['saved'] = $this->params['saved'];
        } else {
            if (isset($this->results) && !empty($this->results)) {
                $this->view['results'] = $this->results;
            } else {
                $response = new Response();
                $response->getBody()->write('404 Not Found');
                $response = $response
                    ->withStatus(404);

                return $response;
            }
        }

        $this->view['bodyjs'] = 1;
        
        $this->view['templatefile'] = 'products_edit_form';
        
        return $this->view;
    }

    public function preDeleteAction($vars)
    {
        // Sanitize and filter the $_GET array.
        $productArray['id'] = (int) $vars['get']['id'];

        $aggregateValueObject = new AggregateImmutableValueObject($productArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            ProductsController::class,
            ProductsController::DELETE_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function deleteAction($vars)
    {
        if (isset($this->params['saved'])) {
            $this->view['saved'] = $this->params['saved'];
        }

        if (isset($this->params['error'])) {
            $this->view['error'] = $this->params['error'];
        }
		
		$this->view['templatefile'] = 'products_delete';
        
        return $this->view;
    }
}
