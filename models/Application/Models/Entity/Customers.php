<?php

namespace Application\Models\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity("Application\Models\Entity\Customers")
 * @ORM\Table("customers")
 */
class Customers
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=32, name="firstname")
     */
    protected $firstName;

    /**
     * @ORM\Column(type="string", length=32, name="lastname")
     */
    protected $lastName;


    /**
     * @return mixed $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed $firstName
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @return mixed $lastName
     */
    public function getLastName()
    {
        return $this->lastName;
    }
}
