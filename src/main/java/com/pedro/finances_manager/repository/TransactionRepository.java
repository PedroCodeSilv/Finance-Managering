	package com.pedro.finances_manager.repository;

	import java.math.BigDecimal;
	import java.util.List;

	import com.pedro.finances_manager.dto.report.IdentifyIdFinances;
	import com.pedro.finances_manager.dto.report.TransactionByCategory;
	import com.pedro.finances_manager.dto.transaction.project.AccountCategoryLink;
	import org.springframework.data.jpa.repository.JpaRepository;
	import org.springframework.data.jpa.repository.Query;

	import com.pedro.finances_manager.entities.Transaction;
	import com.pedro.finances_manager.entities.enums.CategoryType;

	public interface TransactionRepository extends JpaRepository<Transaction, Long>{

		List<Transaction> findByUserId(Long userId);



		/*!Queries!*/
		 @Query("""
					select coalesce(sum(t.amount), 0)
					from Transaction t
					where t.user.id = :userId
					  and t.category.type = :categoryType
				""")
				BigDecimal sumByUserAndCategoryType(Long userId, CategoryType categoryType);

		@Query("""
				select new com.pedro.finances_manager.dto.report.TransactionByCategory(
				t.category.name,
				t.category.type,
				coalesce(sum(t.amount), 0))
				from Transaction t
				where t.user.id = :userId
				group by t.category.name, t.category.type
				""")
		List<TransactionByCategory> listAllTransactionByCategoryByUser(Long userId);

		@Query("""
				select new com.pedro.finances_manager.dto.report.IdentifyIdFinances(
				t.account.id,
				t.category.id,
				t.id
				)
				from Transaction t
				where t.user.id = :userId
				""")
		List<IdentifyIdFinances> identifyIdFinance(Long userId);

		@Query("""
				select new com.pedro.finances_manager.dto.transaction.project.AccountCategoryLink(
				t.account.id,
				t.category
				)
				from Transaction t
				where t.account.id in :id
				and t.user.id = :userId
				""")
		List<AccountCategoryLink> accountCategoryLink(List<Long> id,Long userId);
	}
