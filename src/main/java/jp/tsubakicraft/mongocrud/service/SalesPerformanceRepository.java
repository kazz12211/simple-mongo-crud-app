package jp.tsubakicraft.mongocrud.service;

import org.springframework.data.mongodb.repository.MongoRepository;

import jp.tsubakicraft.mongocrud.model.SalesPerformance;

public interface SalesPerformanceRepository extends MongoRepository<SalesPerformance, String> {

}
