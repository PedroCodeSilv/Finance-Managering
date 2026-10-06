package com.pedro.finances_manager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedro.finances_manager.entities.Category;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	

	Optional<Category> findByIdAndUserId(Long id, Long userId);
	List<Category> findAllByUserId(Long userId);

	@Query("""
			select t.category
			from Transaction t
			where t.account.id in :id
			and t.user.id = :userId
			""")
	List<Category> findCategoryByAccountId(List<Long> id, Long userId);

	@Query("""
	select c
	from Category c
	where c.user.id = :userId and c.name = 'Recebimento'
""")
	Optional<Category> findReceiptCategoryById(Long userId);

	@Query("""
	select c
	from Category c
	where c.user.id = :userId and c.name = 'Deposito'
""")
	Optional<Category> findDepositCategoryById(Long userId);
}
