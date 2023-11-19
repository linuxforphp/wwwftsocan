<?php

namespace Application\Models\Repository;

use Application\Models\Entity\SmartContracts;
use Doctrine\ORM\EntityRepository;

class SmartContractsRepository extends EntityRepository
{

    protected $smartContracts;

    public function findAll()
    {
        $results = $this->findBy([], ['id' => 'ASC']);

        for ($i = 0; $i < count($results); $i++) {
            $results[$i] = $this->hydrateArray($results[$i]);
        }

        return $results;
    }

    public function save(array $smartContractsArray, SmartContracts $smartContracts = null)
    {
        $this->smartContracts = $this->setData($smartContractsArray, $smartContracts);

        try {
            $this->_em->persist($this->smartContracts);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function delete(SmartContracts $smartContracts)
    {
        $this->smartContracts = $smartContracts;

        try {
            $this->_em->remove($this->smartContracts);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function hydrateArray(SmartContracts $smartContracts)
    {
        $array['id'] = $smartContracts->getId();
        $array['contractname'] = $smartContracts->getContractName();

        return $array;
    }

    public function setData(array $smartContractsArray, SmartContracts $smartContracts = null)
    {
        if (!$smartContracts) {
            $this->smartContracts = new SmartContracts();
        } else {
            $this->smartContracts = $smartContracts;
        }

        $this->smartContracts->setContractName($smartContractsArray['contractname']);

        return $this->smartContracts;
    }
}
