<?php

namespace Application\Policies;

use Application\Controllers\ProductsController;
use Application\Events\WriteProductsCompleted;
use Ascmvc\EventSourcing\AggregateImmutableValueObject;
use Ascmvc\EventSourcing\AggregatePolicy;
use Ascmvc\EventSourcing\CommandRunner;
use Ascmvc\EventSourcing\Event\AggregateEvent;
use Ascmvc\EventSourcing\Event\Event;
use Ascmvc\EventSourcing\EventDispatcher;

class ProductsPolicy extends AggregatePolicy
{
    const CREATE_COMPLETED = 'products_create_completed';

    const UPDATE_COMPLETED = 'products_update_completed';

    const DELETE_COMPLETED = 'products_delete_completed';

    protected $commandRunner;

    public static function getInstance(EventDispatcher $eventDispatcher)
    {
        return new self($eventDispatcher);
    }

    public function __invoke(AggregateEvent $event)
    {
        if (is_null($this->commandRunner)) {
            $this->onAggregateEvent($event);

            $app = $event->getApplication();

            $name = $event->getName();

            $execute = '';

            if ($name === ProductsController::CREATE_REQUESTED) {
                $execute = 'create';
            } elseif ($name === ProductsController::UPDATE_REQUESTED) {
                $execute = 'update';
            } elseif ($name === ProductsController::DELETE_REQUESTED) {
                $execute = 'delete';
            }

            $valuesArray = $event->getAggregateValueObject()->getProperties();

            $arguments = [];

            if (!empty($valuesArray)) {
                $values = $event->getAggregateValueObject()->serialize();

                $arguments = [
                    'execute' => $execute,
                    '--values' => $values,
                ];
            }

            $swoole = $app->isSwoole();

            $this->commandRunner = new CommandRunner($app, 'products:write', $arguments, $swoole);
        }

        while ($this->commandRunner->start()) {
            yield true;
        }

        $processStdout = $this->commandRunner->getOutput();
        //$processStderr = $this->commandProcess->getError();

        if (!empty($processStdout)) {
            $processStdoutArray = unserialize($processStdout);

            if (isset($processStdoutArray['data'])) {
                $valueObjectProperties = $processStdoutArray['data'];
            }
        } else {
            $valueObjectProperties = [];
        }

        $name = $event->getName();

        $aggregateValueObject = new AggregateImmutableValueObject($valueObjectProperties);

        if ($name === ProductsController::CREATE_REQUESTED) {
            $event = new WriteProductsCompleted(
                $aggregateValueObject,
                $event->getAggregateRootName(),
                ProductsPolicy::CREATE_COMPLETED
            );
        } elseif ($name === ProductsController::UPDATE_REQUESTED) {
            $event = new WriteProductsCompleted(
                $aggregateValueObject,
                $event->getAggregateRootName(),
                ProductsPolicy::UPDATE_COMPLETED
            );
        } elseif ($name === ProductsController::DELETE_REQUESTED) {
            $event = new WriteProductsCompleted(
                $aggregateValueObject,
                $event->getAggregateRootName(),
                ProductsPolicy::DELETE_COMPLETED
            );
        }

        $eventParams = $processStdoutArray['params'];

        $event->setParams($eventParams);

        $this->eventDispatcher->dispatch($event);

        return;
    }

    public function onAggregateEvent(AggregateEvent $event)
    {
        parent::onAggregateEvent($event);
    }

    public function onEvent(Event $event)
    {
    }
}
