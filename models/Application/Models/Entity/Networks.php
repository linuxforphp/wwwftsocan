<?php

namespace Application\Models\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity("Application\Models\Entity\Networks")
 * @ORM\Entity(repositoryClass="Application\Models\Repository\NetworksRepository")
 * @ORM\Table("networks")
 */
class Networks
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=4, name="chainidentifier")
     */
    protected $chainidentifier;

    /**
     * @ORM\Column(type="string", length=100, name="rpcurl")
     */
    protected $rpcurl;

    /**
     * @ORM\Column(type="integer", length=11, name="chainid")
     */
    protected $chainid;

    /**
     * @ORM\Column(type="string", length=255, name="registrycontract")
     */
    protected $registrycontract;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = (int) $id;
    }

    /**
     * @return mixed
     */
    public function getIdentifier()
    {
        return $this->chainidentifier;
    }

    /**
     * @param mixed $chainidentifier
     */
    public function setIdentifier($chainidentifier)
    {
        $this->chainidentifier = (string) $chainidentifier;
    }

    /**
     * @return mixed
     */
    public function getRpcUrl()
    {
        return $this->rpcurl;
    }

    /**
     * @param mixed $rpcurl
     */
    public function setRpcUrl($rpcurl)
    {
        $this->rpcurl = (string) $rpcurl;
    }

    /**
     * @return mixed
     */
    public function getChainId()
    {
        return $this->chainid;
    }

    /**
     * @param mixed $chainid
     */
    public function setChainId($chainid)
    {
        $this->chainid = (int) $chainid;
    }

    /**
     * @return mixed
     */
    public function getRegistryContract()
    {
        return $this->registrycontract;
    }

    /**
     * @param mixed $registrycontract
     */
    public function setRegistryContract($registrycontract)
    {
        $this->registrycontract = (string) $registrycontract;
    }
}
