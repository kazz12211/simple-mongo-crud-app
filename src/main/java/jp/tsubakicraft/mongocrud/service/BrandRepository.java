package jp.tsubakicraft.mongocrud.service;

import org.springframework.data.mongodb.repository.MongoRepository;

import jp.tsubakicraft.mongocrud.model.Brand;

public interface BrandRepository extends MongoRepository<Brand, String> {

}
