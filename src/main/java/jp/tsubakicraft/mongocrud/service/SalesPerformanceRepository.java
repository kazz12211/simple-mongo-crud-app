package jp.tsubakicraft.mongocrud.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import jp.tsubakicraft.mongocrud.model.SalesPerformance;

public interface SalesPerformanceRepository extends MongoRepository<SalesPerformance, String> {

	@Query("{year: {$eq: ?0}}")
	public List<SalesPerformance> findYearPerformances(int fiscalYear, Sort sort);
}
