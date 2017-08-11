package jp.tsubakicraft.mongocrud.controller;

import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.tsubakicraft.mongocrud.model.Brand;
import jp.tsubakicraft.mongocrud.model.Model;
import jp.tsubakicraft.mongocrud.service.BrandRepository;
import jp.tsubakicraft.mongocrud.service.ModelRepository;

@RestController
public class ModelController {

	@Autowired
	private ModelRepository repo;
	
	@Autowired
	private BrandRepository brandRepo;
	
	@RequestMapping(value="/api/models", method=RequestMethod.GET)
	public Page<?> listModels(@RequestParam(value="page", required=true) int page, @RequestParam(value="limit",required=true) int limit) {
		Pageable pageRequest = new PageRequest(page, limit);
		Page<Model> p = repo.findAll(pageRequest);
		return p;
	}
	
	@RequestMapping(value="/api/models", method=RequestMethod.PUT)
	public Model updateModel(@RequestBody Model model) {
		Brand b = brandRepo.findOne(model.brand.id);
		Model m = repo.findOne(model.id);
		if(m != null) {
			m.name = model.name;
			m.brand = b;
			repo.save(m);
			return m;
		} else {
			return null;
		}
	}
	
	@RequestMapping(value="/api/models", method=RequestMethod.DELETE)
	public Model deleteModel(@RequestBody Model model) {
		repo.delete(model.id);
		return model;
	}
	
	@RequestMapping(value="/api/models", method=RequestMethod.POST)
	public Model createModel(@RequestBody Map<String, Object> model) {
		Brand b = brandRepo.findOne((String) ((Map)model.get("brand")).get("id"));
		Model m = new Model();
		m.name = (String) model.get("name");
		if(b != null) {
			m.brand = b;
		} 
		repo.save(m);
		return m;
	}
	
	@RequestMapping(value="/api/models/listBrandModels", method=RequestMethod.GET)
	public List<Model> listBrandModels(@RequestParam(value="brandId", required=true) String brandId) {
		return repo.findByBrandId(new ObjectId(brandId));
	}
}
