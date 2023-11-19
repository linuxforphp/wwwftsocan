<?php

namespace Application\Commands;

use Application\Models\Entity\SmartContracts;
use Application\Models\Repository\SmartContractsRepository;
use Ascmvc\AbstractApp;
use Doctrine\ORM\Mapping\ClassMetadata;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ReadSmartContractsCommand extends DappCommand
{
    protected static $defaultName = 'smartcontracts:read';

    public function __construct(AbstractApp $webapp)
    {
        // you *must* call the parent constructor
        parent::__construct($webapp);
    }

    protected function configure()
    {
        $this
            ->setName('smartcontracts:read')
            ->setDescription("Query Doctrine for 'SmartContracts' entities.");
        $this
            // configure options
            ->addOption('values', null, InputOption::VALUE_REQUIRED, 'Specify a serialized value object array to use.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $connName = $this->getWebapp()->getBaseConfig()['database']['read_conn_name'];

        $entityManager = $this->getWebapp()->getServiceManager()[$connName];

        $serializedAggregateValueObjectProperties = $input->getOption('values');

        if (!empty($serializedAggregateValueObjectProperties)) {
            $args = unserialize($serializedAggregateValueObjectProperties);
        } else {
            $args = [];
        }

        $SmartContractsRepository = new SmartContractsRepository(
            $entityManager,
            new ClassMetadata(SmartContracts::class)
        );

        try {
            if (isset($args['id'])) {
                $result = $SmartContractsRepository->find($args['id']);

                if (!is_null($result)) {
                    $results[] = $SmartContractsRepository->hydrateArray($result);
                } else {
                    $results = [];
                }
            } else {
                $results = $SmartContractsRepository->findAll();
            }
        } catch (\Exception $e) {
            return 1;
        }

        if (!empty($results)) {
            $outputValues = serialize($results);
        } else {
            $outputValues = '';
        }

        $output->writeln($outputValues);

        return 0;
    }
}