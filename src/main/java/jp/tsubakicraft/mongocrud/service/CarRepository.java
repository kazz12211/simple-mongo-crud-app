package jp.tsubakicraft.mongocrud.service;

import org.springframework.data.mongodb.repository.MongoRepository;

import jp.tsubakicraft.mongocrud.model.Car;

public interface CarRepository extends MongoRepository<Car, String> {

}
