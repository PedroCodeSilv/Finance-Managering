package com.pedro.finances_manager.entities;

import java.time.LocalDateTime;
import java.util.Objects;


import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="users")

public class User {
	
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="name",  nullable=false )
	private String name;
	
	@JsonProperty(access= JsonProperty.Access.WRITE_ONLY)
	@Column(name="password_hash", nullable=false )
	private String passwordHash;
	
	@Column(name="email",  nullable=false )
	private String email;
	@Column(name="create_at")
	private LocalDateTime createdAt;
	
	
	
	protected User() {/*JPA persistence, constructor protected*/}


	public User(String name, String passwordHash, String Email) {
		
		this.name = name;
		
		
		this.passwordHash = passwordHash;
		this.email = Email;
		this.createdAt = LocalDateTime.now();
	};


	public String getName() {
		return name;
	};


	public void setName(String name) {
		this.name = name;
	};


	public String getPasswordHash() {
		return passwordHash;
	};


	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	};


	public String getEmail() {
		return email;
	};


	public void setEmail(String Email) {
		this.email = Email;
	};


	public Long getId() {
		return id;
	};


	public LocalDateTime getCreatedAt() {
		return createdAt;
	};
	
	/*Equal/Hash it's do some id, don't include all camps*/
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	};
	
	@Override
	public boolean equals(Object o) {
		
		if(this == o) return true;
		if(!(o instanceof User other)) return false;
		return id != null && id.equals(other.id);
		
		
	};
	
	/*comment
	 * 
	 * 
	 * 
	 * 
	 * */

};
