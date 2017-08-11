package jp.tsubakicraft.mongocrud.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection="model")
public class Model {
	
	@Id public String id;
	public String name;
	@DBRef public Brand brand;
	
	public Model() {
		
	}
	
	public Model(String id) {
		this.id = id;
	}
}
