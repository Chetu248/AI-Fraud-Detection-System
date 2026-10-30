package com.example.backend.service.impl;

import com.example.backend.event.ClaimSubmittedEvent;
import com.example.backend.service.interfaces.ClaimEventService;
import com.example.backend.service.interfaces.KafkaConsumerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerServiceImpl implements KafkaConsumerService {

    private final ClaimEventService claimEventService;

    @Override
    @KafkaListener(
            topics = "claim-submitted",
            groupId = "insurance-claim-consumer"
    )
    public void processClaimSubmittedEvent(ClaimSubmittedEvent event) {

        log.info(
                "Received ClaimSubmittedEvent. claimId={}",
                event.getClaimId()
        );

        claimEventService.processClaimSubmittedEvent(event);
    }
}