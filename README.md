# simple-mongo-crud-app



このサンプルアプリケーションはサーバーサイドにSpring Boot、クライアントサイドにAngularJSを使い、バックエンドのMongoDBをアクセスする業務アプリケーションの例を示します。

データベースにはbrand（メーカー）、model（モデル）、car（自動車）、salesperformance（販売実績）のコレクションがあります。これらのコレクションの新規追加、更新、削除、検索の機能と販売実績をグラフ表示する機能を持たせます。

*注意
このプロジェクトは諸機能の開発を終えていないため、現時点ですべての機能が正しく動作しません。*


## 開発環境
- Ubuntu 16.0.4 LTS
- Spring Tool Suite 3.8.3 (Eclipse Java EE IDE Neon Release 4.6.0)
- Java 1.8.0
- Maven
- MongoDB 2.6.10
- jQuery 2.1.1
- AngularJS 1.6.2
- Bootstrap 3.3.7
- ui-bootstrap 2.5.0
- ngDialog 0.4.0
- angular-chart 1.1.1
- chart.js 2.6.0

## Spring関連

### Mavenプロジェクト

このアプリケーションはSpring BootのMavenプロジェクトです。依存するライブラリについてはpom.xmlを参照してください。

### RestController

@RestControllerアノテーションによりRestControllerを生成します。
CRUDアプリケーションでは、データの挿入、更新、削除、検索をそれぞれHTTPリクエストのPOST、PUT、DELETE、GETにマッピングすることが一般的なようです。

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
	
		@RequestMapping(value = "/api/brands/listAll", method = RequestMethod.GET)
		public List<Brand> listAll() {
			Sort sort = new Sort(Sort.Direction.ASC, "name");
			return repo.findAll(sort);
		}
	
		@RequestMapping(value = "/api/brands", method = RequestMethod.GET)
		public Page<?> listBrands(@RequestParam(value = "page", required = true) int page,
				@RequestParam(value = "limit", required = true) int limit,
				@RequestParam(value = "sortColumn", required = true) String column,
				@RequestParam(value = "sortDir", required = true) String dir) {
			Sort sort = new Sort(
					new Sort.Order("asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC, column));
			Pageable pageRequest = new PageRequest(page, limit, sort);
			Page<Brand> p = repo.findAll(pageRequest);
			return p;
		}
	
		@RequestMapping(value = "/api/brands", method = RequestMethod.PUT)
		public Brand updateBrand(@RequestBody Brand brand) {
			Brand b = repo.findOne(brand.id);
			if (b != null) {
				b.name = brand.name;
				repo.save(b);
			}
			return b;
		}
	
		@RequestMapping(value = "/api/brands", method = RequestMethod.DELETE)
		public Brand deleteBrand(@RequestBody Brand brand) {
			repo.delete(brand.id);
			return brand;
		}
	
		@RequestMapping(value = "/api/brands", method = RequestMethod.POST)
		public Brand createBrand(@RequestBody Brand brand) {
			Brand b = new Brand();
			b.name = brand.name;
			repo.save(b);
			return b;
		}
	}
	
このアプリケーションではUIにui-bootstrapを使ったページネーション機能を実装していますが、ページ単位でオブジェクトを検索するには、PageRequestを使用します。
例えばBrandオブジェクトの11件目から20件目までを検索するには次のようにPageRequestを引数にしてPagingAndSortingRepositoryのfindAll()を呼び出します。

	int page = 1;
	int size = 10;
	Pageable pageRequest = new PageRequest(page, size);
	Page<Brand> page = repo.findAll(pageRequest);
	

## AngularJS関連

## BootStrap関連

## MongoRepository関連

MongoRepositoryはPagingAndSortingRepositoryのサブインターフェースで、データの挿入、更新、削除、検索の機能やページネーションの機能を持ったもの。

### MongoDBのコンフィグレーション

MongoDBのデータベースの選択を設定しているコードです。

	package jp.tsubakicraft.mongocrud.config;
	
	import org.springframework.context.annotation.Configuration;
	import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
	
	import com.mongodb.Mongo;
	import com.mongodb.MongoClient;
	
	@Configuration
	public class MongoConfiguration extends AbstractMongoConfiguration {
	
		@Override
		protected String getDatabaseName() {
			return "simplecrud";
		}
	
		@Override
		public Mongo mongo() throws Exception {
			return new MongoClient("127.0.0.1", 27017);
		}
	
	}

*jp.tsubakicraft.mongocrud.config.MongoConfiguration.javaを参照*

### MongoDBのエンティティ

BrandエンティティとModelエンティティの例。
Modelエンティティは@DBRefアノテーションによりBrandエンティティを参照します。この場合Modelを検索すると参照しているBrandも検索して結合します。

 jp.tsubakicraft.mongocrud.modeｌ.Brand.java
 
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

 jp.tsubakicraft.mongocrud.modeｌ.Model.java
 
	 package jp.tsubakicraft.mongocrud.model;
	
	
	import org.springframework.data.annotation.Id;
	import org.springframework.data.mongodb.core.mapping.DBRef;
	import org.springframework.data.mongodb.core.mapping.Document;
	
	
	@Document(collection="model")
	public class Model {
		
		@Id public String id;
		public String name;
		@DBRef public Brand brand;
		
		public Model() {
			
		}
		
		public Model(String id) {
			this.id = id;
		}
	}
	
### MongoRepositoryの拡張
 
 DBRefのプロパティを検索条件に指定する方法。
 
	@Query(value="{brand.$id : ?0}")
	public List<Model> findByBrandId(ObjectId brandId);

 
 コレクションの数を取得する方法。@Queryアノテーションのパラメーターとして count=trueを設定します。
 
	@Query(value="{brand.$id : ?0}", count=true)
	public Long countBrandModel(ObjectId brandId);
	
 
*jp.tsubakicraft.mongocrud.service.ModelRepository.javaを参照*


### MongoRepositoryを使ったページネーション

PageRequestを使用してMongoRepositoryのメソッドを呼び出す。

	@Autowired
	private BrandRepository repo;
	...
	@RequestMapping(value="/api/brands", method=RequestMethod.GET)
	public Page<Brand> listBrands(@RequestParam(value="page", required=true) int page, @RequestParam(value="limit", required=true) int limit) {
		Pageable pageRequest = new PageRequest(page, limit);
		return repo.findAll(pageRequest);
	}
	
*jp.tsubakicraft.mongocrud.service.BrandRepository.javaを参照*
