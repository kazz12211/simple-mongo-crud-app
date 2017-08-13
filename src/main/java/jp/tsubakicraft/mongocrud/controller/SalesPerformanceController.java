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

import jp.tsubakicraft.mongocrud.model.Model;
import jp.tsubakicraft.mongocrud.model.SalesPerformance;
import jp.tsubakicraft.mongocrud.service.ModelRepository;
import jp.tsubakicraft.mongocrud.service.SalesPerformanceRepository;

@RestController
public class SalesPerformanceController {

	@Autowired
	private SalesPerformanceRepository repo;

	@Autowired
	private ModelRepository modelRepo;

	@RequestMapping(value = "/api/sales", method = RequestMethod.GET)
	public Page<SalesPerformance> listSales(@RequestParam(value = "page", required = true) int page,
			@RequestParam(value = "limit", required = true) int limit,
			@RequestParam(value = "fromYear", required = true) int fromYear,
			@RequestParam(value = "toYear", required = true) int toYear) {
		Sort sort = new Sort(new Sort.Order[] { new Sort.Order("year"), new Sort.Order("quarter") });
		Pageable pageRequest = new PageRequest(page, limit, sort);
		return repo.findAll(pageRequest);
	}

	@RequestMapping(value = "/api/sales", method = RequestMethod.POST)
	public SalesPerformance createSales(@RequestBody SalesPerformance sales) {
		SalesPerformance s = new SalesPerformance();
		Model m = modelRepo.findOne(sales.model.id);
		s.year = sales.year;
		s.quarter = sales.quarter;
		s.amount = sales.amount;
		if (m != null) {
			s.model = m;
		}
		repo.save(s);
		return s;
	}

	@RequestMapping(value = "/api/sales", method = RequestMethod.DELETE)
	public SalesPerformance deleteSales(@RequestBody SalesPerformance sales) {
		repo.delete(sales.id);
		return sales;
	}

	@RequestMapping(value = "/api/sales", method = RequestMethod.PUT)
	public SalesPerformance updateSales(@RequestBody SalesPerformance sales) {
		Model m = modelRepo.findOne(sales.model.id);
		SalesPerformance s = repo.findOne(sales.id);
		if (s != null) {
			s.model = m;
			s.amount = sales.amount;
			s.quarter = sales.quarter;
			s.year = sales.year;
			repo.save(s);
			return s;
		} else {
			return null;
		}
	}

}
