<?php

namespace Application\Models\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Networks
 *
 * @ORM\Table(name="networks")
 * @ORM\Entity
 */
class Networks
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="chainidentifier", type="string", length=10, nullable=false)
     */
    private $chainidentifier;

    /**
     * @var string
     *
     * @ORM\Column(name="chainname", type="string", length=255, nullable=false)
     */
    private $chainname;

    /**
     * @var int
     *
     * @ORM\Column(name="chainid", type="integer", nullable=false)
     */
    private $chainid;

    /**
     * @var string
     *
     * @ORM\Column(name="rpcurl", type="string", length=100, nullable=false)
     */
    private $rpcurl;

    /**
     * @var string
     *
     * @ORM\Column(name="publicrpcurl", type="string", length=100, nullable=false)
     */
    private $publicrpcurl;

    /**
     * @var string
     *
     * @ORM\Column(name="registrycontract", type="string", length=255, nullable=false)
     */
    private $registrycontract;

    

    /**
     * Get the value of id
     *
     * @return  int
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @param  int  $id
     *
     * @return  self
     */ 
    public function setId(int $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of chainidentifier
     *
     * @return  string
     */ 
    public function getChainIdentifier()
    {
        return $this->chainidentifier;
    }

    /**
     * Set the value of chainidentifier
     *
     * @param  string  $chainidentifier
     *
     * @return  self
     */ 
    public function setChainIdentifier(string $chainidentifier)
    {
        $this->chainidentifier = $chainidentifier;

        return $this;
    }

    /**
     * Get the value of chainname
     *
     * @return  string
     */ 
    public function getChainName()
    {
        return $this->chainname;
    }

    /**
     * Set the value of chainname
     *
     * @param  string  $chainname
     *
     * @return  self
     */ 
    public function setChainName(string $chainname)
    {
        $this->chainname = $chainname;

        return $this;
    }

    /**
     * Get the value of chainid
     *
     * @return  int
     */ 
    public function getChainId()
    {
        return $this->chainid;
    }

    /**
     * Set the value of chainid
     *
     * @param  int  $chainid
     *
     * @return  self
     */ 
    public function setChainId(int $chainid)
    {
        $this->chainid = $chainid;

        return $this;
    }

    /**
     * Get the value of rpcurl
     *
     * @return  string
     */ 
    public function getRpcUrl()
    {
        return $this->rpcurl;
    }

    /**
     * Set the value of rpcurl
     *
     * @param  string  $rpcurl
     *
     * @return  self
     */ 
    public function setRpcUrl(string $rpcurl)
    {
        $this->rpcurl = $rpcurl;

        return $this;
    }

    /**
     * Get the value of publicrpcurl
     *
     * @return  string
     */ 
    public function getPublicRpcUrl()
    {
        return $this->publicrpcurl;
    }

    /**
     * Set the value of publicrpcurl
     *
     * @param  string  $publicrpcurl
     *
     * @return  self
     */ 
    public function setPublicRpcUrl(string $publicrpcurl)
    {
        $this->publicrpcurl = $publicrpcurl;

        return $this;
    }

    /**
     * Get the value of registrycontract
     *
     * @return  string
     */ 
    public function getRegistryContract()
    {
        return $this->registrycontract;
    }

    /**
     * Set the value of registrycontract
     *
     * @param  string  $registrycontract
     *
     * @return  self
     */ 
    public function setRegistryContract(string $registrycontract)
    {
        $this->registrycontract = $registrycontract;

        return $this;
    }
}
