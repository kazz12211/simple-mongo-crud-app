package jp.tsubakicraft.mongocrud.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import jp.tsubakicraft.mongocrud.service.BrandRepository;

@RestController
public class BrandController {
	
	@Autowired
	private BrandRepository repo;
	
	@RequestMapping(value="/api/brands/listAll", method=RequestMethod.GET)
	public List<Brand> listAll() {
		Sort sort = new Sort(Sort.Direction.ASC, "name");
		return repo.findAll(sort);
	}
	
	@RequestMapping(value="/api/brands", method=RequestMethod.GET)
	public Page<?> listBrands(@RequestParam(value="page", required=true) int page, @RequestParam(value="limit",required=true) int limit) {
		Pageable pageRequest = new PageRequest(page, limit);
		Page<Brand> p = repo.findAll(pageRequest);
		return p;
	}

	@RequestMapping(value="/api/brands", method=RequestMethod.PUT)
	public Brand updateBrand(@RequestBody Brand brand) {
		Brand b = repo.findOne(brand.id);
		if(b != null) {
			b.name = brand.name;
			repo.save(b);
		}
		return b;
	}
	
	@RequestMapping(value="/api/brands", method=RequestMethod.DELETE)
	public Brand deleteBrand(@RequestBody Brand brand) {
		repo.delete(brand.id);
		return brand;
	}
	
	@RequestMapping(value="/api/brands", method=RequestMethod.POST)
	public Brand createBrand(@RequestBody Brand brand) {
		Brand b = new Brand();
		b.name = brand.name;
		repo.save(b);
		return b;
	}
}
