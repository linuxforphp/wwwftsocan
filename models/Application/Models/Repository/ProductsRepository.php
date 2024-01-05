<?php

namespace Application\Models\Repository;

use Application\Models\Entity\Products;
use Doctrine\ORM\EntityRepository;

class ProductsRepository extends EntityRepository
{

    protected $products;

    public function findAll()
    {
        $results = $this->findBy([], ['id' => 'ASC']);

        for ($i = 0; $i < count($results); $i++) {
            $results[$i] = $this->hydrateArray($results[$i]);
        }

        return $results;
    }

    public function save(array $productArray, Products $products = null)
    {
        $this->products = $this->setData($productArray, $products);

        try {
            $this->_em->persist($this->products);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function delete(Products $products)
    {
        $this->products = $products;

        try {
            $this->_em->remove($this->products);
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function hydrateArray(Products $products)
    {
        $array['id'] = $products->getId();
        $array['name'] = $products->getName();
        $array['price'] = $products->getPrice();
        $array['description'] = $products->getDescription();
        $array['image'] = $products->getImage();

        return $array;
    }

    public function setData(array $productArray, Products $products = null)
    {
        if (!$products) {
            $this->products = new Products();
        } else {
            $this->products = $products;
        }

        $this->products->setName($productArray['name']);
        $this->products->setPrice($productArray['price']);
        $this->products->setDescription($productArray['description']);
        $this->products->setImage($productArray['image']);

        return $this->products;
    }
}
