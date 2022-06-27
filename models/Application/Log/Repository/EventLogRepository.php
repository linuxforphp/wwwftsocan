<?php

namespace Application\Log\Repository;

use Application\Log\Entity\EventLog;
use Doctrine\ORM\EntityRepository;

class EventLogRepository extends EntityRepository
{
    protected $eventLog;

    public function commitDeferred(array $eventLogArray, EventLog $eventLog = null)
    {
        $this->eventLog = $this->setData($eventLogArray, $eventLog);

        try {
            $this->_em->persist($this->eventLog);
        } catch (\Exception $e) {
            throw new \Exception('Doctrine not available');
        }
    }

    public function commit()
    {
        try {
            $this->_em->flush();
        } catch (\Exception $e) {
            throw new \Exception('Database not available');
        }
    }

    public function setData(array $eventLogArray, EventLog $eventLog = null)
    {
        if (!$eventLog) {
            $this->eventLog = new EventLog();
        } else {
            $this->eventLog = $eventLog;
        }

        $this->eventLog->setName($eventLogArray['name']);
        $this->eventLog->setParameters(serialize($eventLogArray['parameters']));
        $occurred = new \DateTime($eventLogArray['occurred']);
        $this->eventLog->setOccurred($occurred);

        return $this->eventLog;
    }
}
