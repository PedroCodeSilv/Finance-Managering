package com.pedro.finances_manager.dto.request;

import java.math.BigDecimal;

public class TransictionRequest {
	
	private BigDecimal amount;
	private String description;
	private Long accountId;
	private Long categoryId;
	
	public TransictionRequest(BigDecimal amount, String description, Long accountId, Long categoryId) {
		this.amount = amount;
		this.description = description;
		this.accountId = accountId;
		this.categoryId = categoryId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
	
	

}
