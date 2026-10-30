package com.example.backend.service.interfaces;

import com.example.backend.event.ClaimSubmittedEvent;

public interface KafkaConsumerService {

    void processClaimSubmittedEvent(ClaimSubmittedEvent event) ;
}
