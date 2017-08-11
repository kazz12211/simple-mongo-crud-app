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

import jp.tsubakicraft.mongocrud.model.Car;
import jp.tsubakicraft.mongocrud.model.Model;
import jp.tsubakicraft.mongocrud.service.CarRepository;
import jp.tsubakicraft.mongocrud.service.ModelRepository;

@RestController
public class CarController {

	@Autowired
	private CarRepository repo;
	
	@Autowired
	private ModelRepository modelRepo;
	
	@RequestMapping(value="/api/cars", method=RequestMethod.GET)
	public Page<?> listCars(@RequestParam(value="page", required=true) int page, @RequestParam(value="limit",required=true) int limit) {
		Pageable pageRequest = new PageRequest(page, limit);
		Page<Car> p = repo.findAll(pageRequest);
		return p;
	}
	
	@RequestMapping(value="/api/cars", method=RequestMethod.PUT)
	public Car updateCar(@RequestBody Car car) {
		Model m = modelRepo.findOne(car.model.id);
		Car c = repo.findOne(car.id);
		if(c != null) {
			c.model = m;
			c.name = car.name;
			c.price = car.price;
			c.year = car.year;
			repo.save(c);
			return c;
		} else {
			return null;
		}
	}
	
	@RequestMapping(value="/api/cars", method=RequestMethod.DELETE)
	public Car deleteCar(@RequestBody Car car) {
		repo.delete(car.id);
		return car;
	}
	
	@RequestMapping(value="/api/cars", method=RequestMethod.POST)
	public Car createCar(@RequestBody Car car) {
		Model m = modelRepo.findOne(car.model.id);
		Car c = new Car();
		c.name = car.name;
		c.price = car.price;
		c.year = car.year;
		if(m != null) {
			c.model = m;
		}
		repo.save(c);
		return c;
	}
}
