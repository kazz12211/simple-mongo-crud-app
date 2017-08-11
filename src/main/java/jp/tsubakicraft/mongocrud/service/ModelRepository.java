package jp.tsubakicraft.mongocrud.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import jp.tsubakicraft.mongocrud.model.Model;

public interface ModelRepository extends MongoRepository<Model, String> {

	@Query(value="{brand.$id : ?0}")
	public List<Model> findByBrandId(ObjectId brandId);
}
