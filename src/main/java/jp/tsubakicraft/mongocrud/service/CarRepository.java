package jp.tsubakicraft.mongocrud.service;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import jp.tsubakicraft.mongocrud.model.Car;

public interface CarRepository extends MongoRepository<Car, String> {

	@Query(value="{model.$id : ?0}", count=true)
	public Long countModelCar(ObjectId objectId);

}
