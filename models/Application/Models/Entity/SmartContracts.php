<?php

namespace Application\Models\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity("Application\Models\Entity\SmartContracts")
 * @ORM\Entity(repositoryClass="Application\Models\Repository\SmartContractsRepository")
 * @ORM\Table("smartcontracts")
 */
class SmartContracts
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=32, name="name")
     */
    protected $contractname;

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
    public function getContractName()
    {
        return $this->contractname;
    }

    /**
     * @param mixed $name
     */
    public function setContractName($contractname)
    {
        $this->contractname = (string) $contractname;
    }
}
