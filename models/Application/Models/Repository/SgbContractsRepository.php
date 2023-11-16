<?php

namespace Application\Models\Repository;

use Application\Models\Entity\SgbContracts;
use Doctrine\ORM\EntityRepository;

class SgbContractsRepository extends EntityRepository
{

    protected $sgbContracts;

    public function findAll()
    {
        $results = $this->findBy([], ['id' => 'ASC']);

        for ($i = 0; $i < count($results); $i++) {
            $results[$i] = $this->hydrateArray($results[$i]);
        }

        return $results;
    }

    public function save(array $sgbContractArray, SgbContracts $sgbContracts = null)
    {
        $this->sgbContracts = $this->setData($sgbContractArray, $sgbContracts);

        try {
            $this->_em->persist($this->sgbContracts);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function delete(SgbContracts $sgbContracts)
    {
        $this->sgbContracts = $sgbContracts;

        try {
            $this->_em->remove($this->sgbContracts);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function hydrateArray(SgbContracts $sgbContracts)
    {
        $array['id'] = $sgbContracts->getId();
        $array['contractname'] = $sgbContracts->getContractName();
        $array['contractabi'] = $sgbContracts->getContractAbi();

        return $array;
    }

    public function setData(array $sgbContractArray, SgbContracts $sgbContracts = null)
    {
        if (!$sgbContracts) {
            $this->sgbContracts = new SgbContracts();
        } else {
            $this->sgbContracts = $sgbContracts;
        }

        $this->sgbContracts->setContractName($sgbContractArray['contractname']);
        $this->sgbContracts->setContractAbi($productArray['contractabi']);

        return $this->sgbContracts;
    }
}
