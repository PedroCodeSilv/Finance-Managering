package com.pedro.finances_manager.messaging;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    public static final String EXCHANGE = "finance.exchange";
    public static final String TRANSACTION_QUEUE = "finance.transaction.created";
    public static final String TRANSACTION_ROUTING_KEY = "transaction.created";
    public static final String TRANSACTION_QUEUES_CONSUME = "transaction.queue";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue transactionQueueConsume(){return new Queue(TRANSACTION_QUEUES_CONSUME, true);}

    @Bean
    public Queue transactionQueue() {
        return new Queue(TRANSACTION_QUEUE, true);
    }

    @Bean
    public Binding transactionBinding(

            @Qualifier("transactionQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(TRANSACTION_ROUTING_KEY);
    }
    @Bean
    public Binding transactionBindingConsume(
            @Qualifier("transactionQueueConsume") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(TRANSACTION_ROUTING_KEY);
    }


    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
