package com.example.backend.service.interfaces;

import com.example.backend.event.ClaimSubmittedEvent;

public interface ClaimEventService {

    void processClaimSubmittedEvent(ClaimSubmittedEvent event) ;
}
