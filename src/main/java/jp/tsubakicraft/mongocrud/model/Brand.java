package jp.tsubakicraft.mongocrud.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="brand")
public class Brand {

	@Id public String id;
	public String name;
	@DBRef public List<Model> models;
}
