package jp.tsubakicraft.mongocrud.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="car")
public class Car {
	@Id public String id;
	public String name;
	public Double price;
	public Integer year;
	@DBRef public Model model;

	public Car() {
		
	}
	
	public Car(String id) {
		this.id = id;
	}
}
