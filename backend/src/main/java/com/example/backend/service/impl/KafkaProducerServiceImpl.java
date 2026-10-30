package com.example.backend.service.impl;

import com.example.backend.event.ClaimSubmittedEvent;
import com.example.backend.service.interfaces.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerServiceImpl implements KafkaProducerService {

    private static final String CLAIM_SUBMITTED_TOPIC = "claim-submitted";

    private final KafkaTemplate<String , ClaimSubmittedEvent> kafkaTemplate ;

    @Override
    public void publishClaimSubmittedEvent(ClaimSubmittedEvent event) {

        kafkaTemplate.send(
                CLAIM_SUBMITTED_TOPIC ,
                String.valueOf(event.getClaimId()) ,
                event
        ) ;

    }
}
