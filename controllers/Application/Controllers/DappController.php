<?php

namespace Application\Controllers;

use Application\Events\ReadNetworksCompleted;
use Application\ReadModels\NetworksReadModel;
use Ascmvc\EventSourcing\AggregateEventListenerInterface;
use Ascmvc\EventSourcing\AggregateImmutableValueObject;
use Ascmvc\EventSourcing\AggregateRootController;
use Ascmvc\EventSourcing\Event\Event;
use Ascmvc\EventSourcing\EventDispatcher;
use Ascmvc\EventSourcing\Event\AggregateEvent;
use Ascmvc\Mvc\AscmvcEvent;

class DappController extends AggregateRootController implements AggregateEventListenerInterface
{
    const READ_REQUESTED = 'networks_read_received';

    // Define the Aggregate's invokable listeners.
    protected $aggregateListenerNames = [
        DappController::READ_REQUESTED => NetworksReadModel::class,
    ];

    // This controller MUST implement the Ascmvc\AscmvcControllerFactoryInterface interface
    // if you wish to enable this factory method.
    /*public static function factory(array &$baseConfig, EventDispatcher &$eventDispatcher, Container &$serviceManager, &$viewObject)
    {
        // It is possible to override the default identifiers for this Aggregate Root
        // (event notified aggregates).
        $eventDispatcher->setIdentifiers(
            [
                NetworksController::class,
                EventLogger::class,
                SomeClass::class,
            ]
        );

        // Manually attach invokable listeners if needed
        $someReadModel = SomeReadModel::getInstance($eventDispatcher);

        $eventDispatcher->attach(
            NetworksController::READ_REQUESTED,
            $someReadModel
        );

        $somePolicy = NetworksPolicy::getInstance($eventDispatcher);

        // If there are many listeners to attach, one may use a
        // Listener Aggregate that implements the \Laminas\EventManager\ListenerAggregateInterface
        // instead of attaching them one by one.
        $eventDispatcher->attach(
            NetworksController::CREATE_REQUESTED,
            $somePolicy
        );

        $eventDispatcher->attach(
            NetworksController::UPDATE_REQUESTED,
            $somePolicy
        );

        $eventDispatcher->attach(
            NetworksController::DELETE_REQUESTED,
            $somePolicy
        );

        // Instantiate an instance of this controller
        $controller = new NetworksController($baseConfig, $eventDispatcher);

        // If needed, it is possible another listener method to the shared event manager's
        // corresponding identifier (see above).
        $sharedEventManager = $eventDispatcher->getSharedManager();

        $sharedEventManager->attach(
            NetworksController::class,
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
        $app = $event->getApplication();

        $baseConfig = $app->getBaseConfig();

        $this->view['path'] = explode('/', $app->getRequest()->getServerParams()['REQUEST_URI']);

        $this->view['dappName'] = $baseConfig['dappName'];
        $this->view['env'] = $baseConfig['env'];
        $this->view['dappActive'] = $baseConfig['dappActive'];

        $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-main.css';

        // if (is_null($this->view['path'][2]) || empty($this->view['path'][2]) || $this->view['path'][2] === 'index' || $this->view['path'][2] === 'wrap') {
        //     $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-wrap.css';
        // } elseif ($this->view['path'][2] === 'delegate'){
        //     $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-delegate.css';
        // } elseif ($this->view['path'][2] === 'claim') {
        //     $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-claim.css';
        // }

        $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-wrap.css';
        $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-delegate.css';
        $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-claim.css';
        $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-stake.css';
        $this->view['css'][] = $baseConfig['URLBASEADDR'] . 'css/dapp-stake-transfer.css';

        $this->view['js'][] = $baseConfig['URLBASEADDR'] . 'js/glob.min.js';
        $this->view['js'][] = $baseConfig['URLBASEADDR'] . 'js/web3.min.js';

        // $this->view['jsdefer'][] = $baseConfig['URLBASEADDR'] . 'js/flare/avalanche.js';
        // $this->view['jsdefer'][] = $baseConfig['URLBASEADDR'] . 'js/flare/index.js';
    }

    /**
     * Updates the Controller's output at the dispatch event if needed (listener method).
     *
     * @param AggregateEvent $event
     */
    public function onAggregateEvent(AggregateEvent $event)
    {
        if (!$event instanceof ReadNetworksCompleted) {
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
            $networkArray['id'] = (string)$vars['get']['id'];
        } else {
            $networkArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($networkArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            DappController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function indexAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->filteredResults = [];
            $networkSymbols = [];

            if ($this->view['env'] === 'production') {
                $networkSymbols = ['FLR', 'SGB'];
            } else {
                $networkSymbols = ['CFLR', 'C2FLR'];
            }

            array_walk($this->results, function($value, $key, $symbol) {
                foreach ($symbol as $networkSymbol) {
                    if ($value['chainidentifier'] === $networkSymbol) {
                        $this->filteredResults[$key] = $value;
                    }
                }
            }, $networkSymbols);

            $this->view['results'] = $this->filteredResults;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['dappwrap'] = 1;

        $this->view['templatefile'] = 'dapp_index';

        return $this->view;
    }

    public function preWrapAction($vars = null)
    {
        if (isset($vars['get']['id'])) {
            $networkArray['id'] = (string)$vars['get']['id'];
        } else {
            $networkArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($networkArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            DappController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function wrapAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->filteredResults = [];
            $networkSymbols = [];

            if ($this->view['env'] === 'production') {
                $networkSymbols = ['FLR', 'SGB'];
            } else {
                $networkSymbols = ['CFLR', 'C2FLR'];
            }

            array_walk($this->results, function($value, $key, $symbol) {
                foreach ($symbol as $networkSymbol) {
                    if ($value['chainidentifier'] === $networkSymbol) {
                        $this->filteredResults[$key] = $value;
                    }
                }
            }, $networkSymbols);

            $this->view['results'] = $this->filteredResults;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['dappwrap'] = 1;

        $this->view['templatefile'] = 'dapp_wrap';

        return $this->view;
    }

    public function preDelegateAction($vars = null)
    {
        if (isset($vars['get']['id'])) {
            $networkArray['id'] = (string)$vars['get']['id'];
        } else {
            $networkArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($networkArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            DappController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function delegateAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->filteredResults = [];
            $networkSymbols = [];

            if ($this->view['env'] === 'production') {
                $networkSymbols = ['FLR', 'SGB'];
            } else {
                $networkSymbols = ['CFLR', 'C2FLR'];
            }

            array_walk($this->results, function($value, $key, $symbol) {
                foreach ($symbol as $networkSymbol) {
                    if ($value['chainidentifier'] === $networkSymbol) {
                        $this->filteredResults[$key] = $value;
                    }
                }
            }, $networkSymbols);

            $this->view['results'] = $this->filteredResults;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['dappdelegate'] = 1;

        $this->view['templatefile'] = 'dapp_delegate';

        return $this->view;
    }

    public function preClaimAction($vars = null)
    {
        if (isset($vars['get']['id'])) {
            $networkArray['id'] = (string)$vars['get']['id'];
        } else {
            $networkArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($networkArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            DappController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function claimAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->filteredResults = [];
            $networkSymbols = [];

            if ($this->view['env'] === 'production') {
                $networkSymbols = ['FLR', 'SGB'];
            } else {
                $networkSymbols = ['CFLR', 'C2FLR'];
            }

            array_walk($this->results, function($value, $key, $symbol) {
                foreach ($symbol as $networkSymbol) {
                    if ($value['chainidentifier'] === $networkSymbol) {
                        $this->filteredResults[$key] = $value;
                    }
                }
            }, $networkSymbols);

            $this->view['results'] = $this->filteredResults;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['headjs'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['dappclaim'] = 1;

        $this->view['templatefile'] = 'dapp_claim';

        return $this->view;
    }

    public function preStakeAction($vars = null)
    {
        if (isset($vars['get']['id'])) {
            $networkArray['id'] = (string)$vars['get']['id'];
        } else {
            $networkArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($networkArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            DappController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function stakeAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->filteredResults = [];
            $networkSymbols = [];

            if ($this->view['env'] === 'production') {
                $networkSymbols = ['FLR', 'SGB'];
            } else {
                $networkSymbols = ['CFLR', 'C2FLR'];
            }

            array_walk($this->results, function($value, $key, $symbol) {
                foreach ($symbol as $networkSymbol) {
                    if ($value['chainidentifier'] === $networkSymbol) {
                        $this->filteredResults[$key] = $value;
                    }
                }
            }, $networkSymbols);

            $this->view['results'] = $this->filteredResults;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['headjs'] = 1;

        // $this->view['headjsdefer'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['dappstake'] = 1;

        $this->view['templatefile'] = 'dapp_stake';

        return $this->view;
    }

    public function preStakeTransferAction($vars = null)
    {
        if (isset($vars['get']['id'])) {
            $networkArray['id'] = (string)$vars['get']['id'];
        } else {
            $networkArray = [];
        }

        $aggregateValueObject = new AggregateImmutableValueObject($networkArray);

        $event = new AggregateEvent(
            $aggregateValueObject,
            $this->aggregateRootName,
            DappController::READ_REQUESTED
        );

        $this->eventDispatcher->dispatch($event);
    }

    public function stakeTransferAction($vars = null)
    {
        if (isset($this->results) && !empty($this->results)) {
            $this->filteredResults = [];
            $networkSymbols = [];

            if ($this->view['env'] === 'production') {
                $networkSymbols = ['FLR', 'SGB'];
            } else {
                $networkSymbols = ['CFLR', 'C2FLR'];
            }

            array_walk($this->results, function($value, $key, $symbol) {
                foreach ($symbol as $networkSymbol) {
                    if ($value['chainidentifier'] === $networkSymbol) {
                        $this->filteredResults[$key] = $value;
                    }
                }
            }, $networkSymbols);

            $this->view['results'] = $this->filteredResults;
        } else {
            $this->view['results']['nodata'] = 'No results';
        }

        $this->view['headjs'] = 1;

        // $this->view['headjsdefer'] = 1;

        $this->view['bodyjs'] = 1;

        $this->view['dappstake'] = 1;

        $this->view['templatefile'] = 'dapp_stake_transfer';

        return $this->view;
    }
}