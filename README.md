# simple-mongo-crud-app



このサンプルアプリケーションはサーバーサイドにSpring Boot、クライアントサイドにAngularJSを使い、バックエンドのMongoDBをアクセスする業務アプリケーションの例を示します。

データベースにはbrand（メーカー）、model（モデル）、car（自動車）、salesperformance（販売実績）のコレクションがあります。これらのコレクションの新規追加、更新、削除、検索の機能と販売実績をグラフ表示する機能を持たせます。

*注意
このプロジェクトは諸機能の開発を終えていないため、現時点ですべての機能が正しく動作しません。*


## 開発環境
- Ubuntu 16.0.4 LTS
- Spring Tool Suite 3.8.3 (Eclipse Java EE IDE Neon Release 4.6.0)
- Java 1.8.0
- MongoDB 2.6.10
- jQuery 2.1.1
- AngularJS 1.6.2
- Bootstrap 3.3.7
- ui-bootstrap 2.5.0
- ngDialog 0.4.0
- angular-chart 1.1.1
- chart.js 2.6.0

## Spring関連

## AngularJS関連

## BootStrap関連

## MongoRepository関連

MongoRepositoryはCrudRepositoryのサブインターフェースで、データの挿入、更新、削除、検索の機能やページネーションの機能を持ったもの。

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
