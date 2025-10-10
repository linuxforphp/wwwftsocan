<?php

namespace Application\Models\Repository;

use Application\Models\Entity\Networks;
use Doctrine\ORM\EntityRepository;

class NetworksRepository extends EntityRepository
{

    protected $networks;

    public function findAll()
    {
        $results = $this->findBy([], ['id' => 'ASC']);

        for ($i = 0; $i < count($results); $i++) {
            $results[$i] = $this->hydrateArray($results[$i]);
        }

        return $results;
    }

    public function save(array $networkArray, Networks $networks = null)
    {
        $this->networks = $this->setData($networkArray, $networks);

        try {
            $this->_em->persist($this->networks);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function delete(Networks $networks)
    {
        $this->networks = $networks;

        try {
            $this->_em->remove($this->networks);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function hydrateArray(Networks $networks)
    {
        $array['id'] = $networks->getId();
        $array['chainidentifier'] = $networks->getChainIdentifier();
        $array['chainname'] = $networks->getChainName();
        $array['chainid'] = $networks->getChainId();
        $array['rpcurl'] = $networks->getRpcUrl();
        $array['publicrpcurl'] = $networks->getPublicRpcUrl();
        $array['registrycontract'] = $networks->getRegistryContract();

        return $array;
    }

    public function setData(array $networkArray, Networks $networks = null)
    {
        if (!$networks) {
            $this->networks = new Networks();
        } else {
            $this->networks = $networks;
        }

        $this->networks->setChainIdentifier($networkArray['chainidentifier']);
        $this->networks->setChainName($networkArray['chainname']);
        $this->networks->setChainId($networkArray['chainid']);
        $this->networks->setRpcUrl($networkArray['rpcurl']);
        $this->networks->setPublicRpcUrl($networkArray['publicrpcurl']);
        $this->networks->setRegistryContract($networkArray['registrycontract']);

        return $this->networks;
    }
}
