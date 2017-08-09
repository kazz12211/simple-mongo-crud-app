package jp.tsubakicraft.mongocrud.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="model")
public class Model {
	
	@Id String id;
	public String name;
	@DBRef public Brand brand;
	@DBRef public List<Car> cars;
	

}
