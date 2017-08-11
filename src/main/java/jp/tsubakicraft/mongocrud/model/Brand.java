package jp.tsubakicraft.mongocrud.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection="brand")
public class Brand {

	@Id public String id;
	public String name;
	
	public Brand(String id) {
		this.id = id;
	}
	
	public Brand() {
	}
}
