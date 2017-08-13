package jp.tsubakicraft.mongocrud.controller;

import org.bson.types.ObjectId;
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

	@RequestMapping(value = "/api/cars", method = RequestMethod.GET)
	public Page<?> listCars(@RequestParam(value = "page", required = true) int page,
			@RequestParam(value = "limit", required = true) int limit,
			@RequestParam(value = "sortColumn", required = true) String column,
			@RequestParam(value = "sortDir", required = true) String dir) {
		Sort sort = new Sort(
				new Sort.Order("asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC, column));
		Pageable pageRequest = new PageRequest(page, limit, sort);
		Page<Car> p = repo.findAll(pageRequest);
		return p;
	}

	@RequestMapping(value = "/api/cars", method = RequestMethod.PUT)
	public Car updateCar(@RequestBody Car car) {
		Model m = modelRepo.findOne(car.model.id);
		Car c = repo.findOne(car.id);
		if (c != null) {
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

	@RequestMapping(value = "/api/cars", method = RequestMethod.DELETE)
	public Car deleteCar(@RequestBody Car car) {
		repo.delete(car.id);
		return car;
	}

	@RequestMapping(value = "/api/cars", method = RequestMethod.POST)
	public Car createCar(@RequestBody Car car) {
		Model m = modelRepo.findOne(car.model.id);
		Car c = new Car();
		c.name = car.name;
		c.price = car.price;
		c.year = car.year;
		if (m != null) {
			c.model = m;
		}
		repo.save(c);
		return c;
	}

	@RequestMapping(value = "/api/cars/countModelCar", method = RequestMethod.GET)
	public Long countModelCar(@RequestParam(value = "modelId", required = true) String modelId) {
		return repo.countModelCar(new ObjectId(modelId));
	}
}
