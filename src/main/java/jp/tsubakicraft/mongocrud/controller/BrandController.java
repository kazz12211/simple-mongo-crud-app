package jp.tsubakicraft.mongocrud.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.tsubakicraft.mongocrud.model.Brand;
import jp.tsubakicraft.mongocrud.service.BrandRepository;

@RestController
public class BrandController {
	
	@Autowired
	private BrandRepository repo;
	
	@RequestMapping(value="/api/brands", method=RequestMethod.GET)
	public Page<?> listBrands(@RequestParam(value="page", required=true) int page, @RequestParam(value="limit",required=true) int limit) {
		Pageable pageRequest = new PageRequest(page, limit);
		Page<Brand> p = repo.findAll(pageRequest);
		System.out.println(p);
		return p;
	}

	@RequestMapping(value="/api/brands", method=RequestMethod.PUT)
	public Brand updateBrand(@RequestBody Map<String, Object> brand) {
		Brand b = repo.findOne((String) brand.get("id"));
		if(b != null) {
			b.name = (String) brand.get("name");
			repo.save(b);
		}
		return b;
	}
	
	@RequestMapping(value="/api/brands", method=RequestMethod.DELETE)
	public String deleteBrand(@RequestParam(value="id", required=true) String brandId) {
		repo.delete(brandId);
		return brandId;
	}
	
	@RequestMapping(value="/api/brands", method=RequestMethod.POST)
	public Brand createBrand(@RequestBody Map<String, Object> brand) {
		Brand b = new Brand();
		b.name = (String) brand.get("name");
		repo.save(b);
		return b;
	}
}
