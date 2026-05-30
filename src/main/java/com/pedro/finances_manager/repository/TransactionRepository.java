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
				t.category.id,
				t.category.name,
				t.category.type,
				coalesce(sum(t.amount), 0))
				from Transaction t
				where t.user.id = :userId
				group by t.category.id, t.category.name, t.category.type
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

		@Query("""
				select new com.pedro.finances_manager.dto.report.MonthlyBalance(
				YEAR(t.transactionDate),
				MONTH(t.transactionDate),
				coalesce(sum(case when t.category.type = com.pedro.finances_manager.entities.enums.CategoryType.INCOME then t.amount else 0 end), 0),
				coalesce(sum(case when t.category.type = com.pedro.finances_manager.entities.enums.CategoryType.EXPENSE then t.amount else 0 end), 0)
				)
				from Transaction t
				where t.user.id = :userId
				group by YEAR(t.transactionDate), MONTH(t.transactionDate)
				order by YEAR(t.transactionDate) desc, MONTH(t.transactionDate) desc
				""")
		List<com.pedro.finances_manager.dto.report.MonthlyBalance> findMonthlyBalanceByUser(Long userId);

		List<Transaction> findByUserIdAndCategoryId(Long userId, Long categoryId);

		List<Transaction> findByUserIdAndAccountId(Long userId, Long accountId);

		@Query("""
				select t from Transaction t
				where t.user.id = :userId
				and t.account.id = :accountId
				and t.transactionDate >= :startDate
				and t.transactionDate <= :endDate
				order by t.transactionDate desc
				""")
		List<Transaction> findByUserIdAndAccountIdAndDateRange(Long userId, Long accountId, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);

		@Query("""
				select new com.pedro.finances_manager.dto.report.AccountBalance(
				t.account.id,
				t.account.name,
				t.account.type,
				t.account.currency,
				coalesce(sum(case when t.category.type = com.pedro.finances_manager.entities.enums.CategoryType.INCOME then t.amount else 0 end), 0),
				coalesce(sum(case when t.category.type = com.pedro.finances_manager.entities.enums.CategoryType.EXPENSE then t.amount else 0 end), 0)
				)
				from Transaction t
				where t.user.id = :userId
				group by t.account.id, t.account.name, t.account.type, t.account.currency
				""")
		List<com.pedro.finances_manager.dto.report.AccountBalance> findAccountBalancesByUser(Long userId);
	}
