package com.example.backend.service.interfaces;

import com.example.backend.event.ClaimSubmittedEvent;

public interface KafkaProducerService {

    void publishClaimSubmittedEvent(ClaimSubmittedEvent event) ;
}
