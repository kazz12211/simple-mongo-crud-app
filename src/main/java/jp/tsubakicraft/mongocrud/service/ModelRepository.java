package jp.tsubakicraft.mongocrud.service;

import org.springframework.data.mongodb.repository.MongoRepository;

import jp.tsubakicraft.mongocrud.model.Model;

public interface ModelRepository extends MongoRepository<Model, String> {

}
