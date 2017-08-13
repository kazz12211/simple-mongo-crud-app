package jp.tsubakicraft.mongocrud.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="salesperformance")
public class SalesPerformance {
	@Id public String id;
	@DBRef public Model model;
	public Integer quarter;
	public Integer year;
	public double amount;
	
	public SalesPerformance() {
		
	}
	
	public SalesPerformance(String id) {
		this.id = id;
	}
}
