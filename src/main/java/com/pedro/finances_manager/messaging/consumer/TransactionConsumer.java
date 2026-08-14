package com.pedro.finances_manager.messaging.consumer;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.pedro.finances_manager.entities.Notification;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.entities.enums.CategoryType;
import com.pedro.finances_manager.messaging.RabbitMQConfig;
import com.pedro.finances_manager.messaging.event.TransactionCreatedEvent;
import com.pedro.finances_manager.repository.NotificationRepository;
import com.pedro.finances_manager.repository.TransactionRepository;
import com.pedro.finances_manager.repository.UserRepository;

@Component
public class TransactionConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransactionConsumer.class);

    // Limite mensal de despesas para gerar alerta (pode virar configurável por usuário no futuro)
    private static final BigDecimal MONTHLY_EXPENSE_LIMIT = new BigDecimal("1000.00");

    private final TransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public TransactionConsumer(TransactionRepository transactionRepository,
                               NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.TRANSACTION_QUEUE)
    public void handleTransactionCreated(TransactionCreatedEvent event) {
        log.info("Received transaction.created: id={} user={} category={} amount={}",
                event.transactionId(), event.userId(), event.categoryName(), event.amount());

        // Só processa alertas para despesas
        if (!"EXPENSE".equals(event.categoryType())) {
            log.info("Transaction is INCOME, skipping expense alert check.");
            return;
        }

        // Calcula total de despesas do mês para o usuário
        BigDecimal totalExpenses = transactionRepository.sumByUserAndCategoryType(
                event.userId(), CategoryType.EXPENSE);

        log.info("User {} total monthly expenses: {}", event.userId(), totalExpenses);

        // Alerta quando atinge 80% do limite
        BigDecimal warningThreshold = MONTHLY_EXPENSE_LIMIT.multiply(new BigDecimal("0.80"));

        User user = userRepository.findById(event.userId()).orElse(null);
        if (user == null) return;

        if (totalExpenses.compareTo(MONTHLY_EXPENSE_LIMIT) >= 0) {
            // Ultrapassou o limite
            createNotification(user,
                    "Limite de despesas ultrapassado",
                    String.format("Suas despesas do mês atingiram R$ %s, ultrapassando o limite de R$ %s.",
                            totalExpenses.setScale(2).toPlainString(),
                            MONTHLY_EXPENSE_LIMIT.setScale(2).toPlainString())
            );
        } else if (totalExpenses.compareTo(warningThreshold) >= 0) {
            // Atingiu 80% do limite
            createNotification(user,
                    "Atenção com suas despesas",
                    String.format("Suas despesas do mês já estão em R$ %s (%.0f%% do limite de R$ %s).",
                            totalExpenses.setScale(2).toPlainString(),
                            totalExpenses.divide(MONTHLY_EXPENSE_LIMIT, 2, java.math.RoundingMode.HALF_UP)
                                    .multiply(new BigDecimal("100")).doubleValue(),
                            MONTHLY_EXPENSE_LIMIT.setScale(2).toPlainString())
            );
        }

        // Alerta para transações de valor alto (acima de R$ 500)
        BigDecimal highValueThreshold = new BigDecimal("500.00");
        if (event.amount().compareTo(highValueThreshold) >= 0) {
            createNotification(user,
                    "Transação de alto valor",
                    String.format("Despesa de R$ %s registrada: \"%s\".",
                            event.amount().setScale(2).toPlainString(),
                            event.description())
            );
        }
    }

    private void createNotification(User user, String title, String message) {
        Notification notification = new Notification(title, message, user);
        notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", user.getId(), title);
    }
}
