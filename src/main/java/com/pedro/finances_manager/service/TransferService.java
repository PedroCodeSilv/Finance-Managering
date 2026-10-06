package com.pedro.finances_manager.service;
import com.pedro.finances_manager.dto.transfers.TransferRequestDTO;
import com.pedro.finances_manager.entities.Account;
import com.pedro.finances_manager.entities.Transaction;
import com.pedro.finances_manager.entities.User;
import com.pedro.finances_manager.repository.AccountRepository;
import com.pedro.finances_manager.repository.TransactionRepository;
import com.pedro.finances_manager.repository.UserRepository;
import com.pedro.finances_manager.security.JWTUserData;

import jakarta.transaction.Transactional;
import org.apache.el.stream.Optional;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.math.BigDecimal;

@Service
public class TransferService {



    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final AccountService accountService;
    private final TransactionService transactionService;

    public TransferService(AccountRepository accountRepository, TransactionRepository transactionRepository, UserService userService, AccountService accountService, TransactionService transactionService) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userService = userService;
        this.accountService = accountService;
        this.transactionService = transactionService;
    }


    @Transactional
    public void transfer(
            TransferRequestDTO request,
            JWTUserData jwtUser
    ) {

        User user = userService.findUser(jwtUser.userId());

        Account sourceAccount = accountService.findAccount(
                request.sourceAccountId(),
                jwtUser.userId()
        );

        Account destinationAccount = accountService.findAccount(
                request.destinationAccountId(),
                jwtUser.userId()
        );

        validateTransfer(
                request,
                sourceAccount,
                destinationAccount
        );

        transactionService.createDebit(
                user,
                sourceAccount,
                request.amount(),
                String.format(
                        "Transferência enviada para a conta %s",
                        destinationAccount.getId()
                )
        );

        transactionService.createCredit(
                user,
                destinationAccount,
                request.amount(),
                String.format(
                        "Transferência recebida da conta %s",
                        sourceAccount.getId()
                )
        );
    }

    private void validateTransfer(
            TransferRequestDTO request,
            Account source,
            Account destination
    ) {

        if (request.amount() == null ||
                request.amount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "O valor da transferência deve ser maior que zero"
            );
        }

        if (source.getId().equals(destination.getId())) {
            throw new IllegalArgumentException(
                    "A conta de origem e destino não podem ser iguais"
            );
        }


    }
}

