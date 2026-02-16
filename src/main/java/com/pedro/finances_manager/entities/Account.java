package com.pedro.finances_manager.entities;

import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "account")
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nome")
	private String name;

	@Enumerated(EnumType.STRING)
	// It's identify a enum CHECKING, CASH or CREDIT
	private AccountType type;

	@Enumerated(EnumType.STRING)
	// It's identify a enum cambial money
	private Currency currency;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@Column(name = "create_at")
	private LocalDateTime createAt;

	protected Account() {
		/* JPA persistence, constructor protected */}

	public Account(String name, AccountType type, Currency currency, User user) {
		this.name = name;
		this.type = type;
		this.currency = currency;
		this.user = user;
		createAt = LocalDateTime.now();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AccountType getType() {
		return type;
	}

	public void setType(AccountType type) {
		this.type = type;
	}

	public Currency getCurrency() {
		return currency;
	}

	public void setCurrency(Currency currency) {
		this.currency = currency;
	}

	public Long getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getCreateAt() {
		return createAt;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof Account account))
			return false;
		return id != null && id.equals(account.id);

	}

}
