package com.pedro.finances_manager.messaging.producer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import com.pedro.finances_manager.messaging.RabbitMQConfig;
import com.pedro.finances_manager.messaging.event.TransactionCreatedEvent;

@Component
public class TransactionProducer {

    private static final Logger log = LoggerFactory.getLogger(TransactionProducer.class);

    private final RabbitTemplate rabbitTemplate;

    public TransactionProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendTransactionCreated(TransactionCreatedEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.TRANSACTION_ROUTING_KEY,
                event
        );
        log.info("Event published: transaction.created id={} amount={}", event.transactionId(), event.amount());
    }
}
