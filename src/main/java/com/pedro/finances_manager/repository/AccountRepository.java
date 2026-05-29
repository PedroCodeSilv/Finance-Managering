package com.pedro.finances_manager.repository;

import java.math.BigDecimal;
import java.util.Optional;

import com.pedro.finances_manager.dto.account.collection.AccountFindByCategory;
import com.pedro.finances_manager.entities.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Account;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
	
	Optional<Account> findByIdAndUserId(Long id, Long userId);

	//Get List Account by User
	List<Account> findByUserId(Long userId);


//Amount Account by Category
	@Query("""
			select coalesce(sum(t.amount), 0)
			from Transaction t
			where t.user.id = :id
			AND t.category.type = :type
			""")
	BigDecimal sumUserByIdAndCategoryType(Long id, CategoryType type);

//Get Category for Account id by Transaction

	@Query("""
			select new com.pedro.finances_manager.dto.account.collection.AccountFindByCategory(
			t.account.id,
			t.account.name,
			t.account.currency,
			t.account.type,
			null,
			coalesce(sum(t.amount), 0)
			)
			from Transaction t
			where t.user.id = :userId
			and t.account.id in :id
			group by t.account.id, t.account.name, t.account.currency, t.account.type
			""")
	List<AccountFindByCategory> reportByCategory(List<Long> id, Long userId);


}
