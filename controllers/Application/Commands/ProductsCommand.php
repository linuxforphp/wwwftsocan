<?php

namespace Application\Commands;

use Ascmvc\AbstractApp;
use Ascmvc\EventSourcing\AsyncCommand;
use Symfony\Component\Console\Exception\LogicException;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ProductsCommand extends AsyncCommand
{
    protected static $defaultName;

    public function __construct(AbstractApp $webapp)
    {
        // you *must* call the parent constructor
        parent::__construct($webapp);
    }

    protected function configure()
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        throw new LogicException('You must override the execute() method in the concrete command class.');
    }
}
