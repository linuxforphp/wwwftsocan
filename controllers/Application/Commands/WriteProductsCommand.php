<?php

namespace Application\Commands;

use Application\Models\Entity\Products;
use Application\Models\Repository\ProductsRepository;
use Ascmvc\AbstractApp;
use Doctrine\ORM\Mapping\ClassMetadata;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class WriteProductsCommand extends ProductsCommand
{
    protected static $defaultName = 'products:write';

    public function __construct(AbstractApp $webapp)
    {
        // you *must* call the parent constructor
        parent::__construct($webapp);
    }

    protected function configure()
    {
        $this
            ->setName('products:write')
            ->setDescription("Write 'Products' entities using Doctrine.");
        $this
            // configure arguments
            ->addArgument('execute', InputArgument::REQUIRED, "[create], [update] or [delete] the 'Products' entities.")
            // configure options
            ->addOption('values', null, InputOption::VALUE_REQUIRED, 'Specify a serialized value object array to use.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $name = $input->getArgument('execute');

        $connName = $this->getWebapp()->getBaseConfig()['database']['read_conn_name'];

        $entityManager = $this->getWebapp()->getServiceManager()[$connName];

        $serializedAggregateValueObjectProperties = $input->getOption('values');

        $args = unserialize($serializedAggregateValueObjectProperties);

        $productsRepository = new ProductsRepository(
            $entityManager,
            new ClassMetadata(Products::class)
        );

        $values = [];

        try {
            if ($name === 'create') {
                $productsRepository->save($args);
            } elseif ($name === 'update') {
                $products = $entityManager->find(Products::class, $args['id']);

                $values['data']['pre'] = [
                    'id' => $products->getId(),
                    'name' => $products->getName(),
                    'price' => $products->getPrice(),
                    'description' => $products->getDescription(),
                    'image' => $products->getImage(),
                ];

                $productsRepository->save($args, $products);
            } elseif ($name === 'delete') {
                if (isset($args['id'])) {
                    $products = $entityManager->find(Products::class, $args['id']);
                    $productsRepository->delete($products);
                }
            }

            $values['data']['post'] = $args;

            $values['params']['saved'] = 1;
        } catch (\Exception $e) {
            $values['params']['error'] = 1;
        }

        $outputValues = serialize($values);

        $output->writeln($outputValues);

        return 0;
    }
}