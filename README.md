# simple-mongo-crud-app



このサンプルアプリケーションはサーバーサイドにSpring Boot、クライアントサイドにAngularJSを使い、バックエンドのMongoDBをアクセスする業務アプリケーションの例です。

データベースにはbrand（メーカー）、model（モデル）、car（自動車）、salesperformance（販売実績）のコレクションがあります。これらのコレクションの新規追加、更新、削除、検索の機能と販売実績をグラフ表示する機能を持たせます。

この文書はアプリケーションを理解する上で必要になる主要な技術的なテーマについてのメモです。
理解を速めるためにはSpringの[ガイドページのチュートリアル](https://spring.io/guides) を一通りやっておくと良いと思います。

*注意
このプロジェクトは諸機能の開発を終えていないため、現時点ですべての機能が正しく動作しません。*

## とりあえず動かしてみる

事前にMongoDBをインストールしてmongodを動かしておきます。mongodbの認証機能は設定しない状態にしておきます。（インストールして何も設定しないで起動した状態です）

このプロジェクトをgit cloneします。適当なディレクトリを作成してそのディレクトリで次のコマンドを実行します。

	$ git clone https://github.com/kazz12211/simple-mongo-crud-app.git

同ディレクトリで次のコマンドを実行してアプリケーションを起動します。

	$ ./mvnw spring-boot:run

ブラウザから次のURLにアクセスします。

	http://localhost:8080

## 開発環境
- Ubuntu 16.0.4 LTS
- [Spring Tool Suite 3.8.3 (Eclipse Java EE IDE Neon Release 4.6.0)](https://spring.io/tools/sts) 
- Java 1.8.0
- Maven
- [MongoDB 2.6.10](https://www.mongodb.com/) 
- [jQuery 2.1.1](https://jquery.com/) 
- [AngularJS 1.6.2](https://angularjs.org/) 
- [Bootstrap 3.3.7](https://getbootstrap.com/docs/3.3/getting-started/) 
- [ui-bootstrap 2.5.0](https://angular-ui.github.io/bootstrap/) 
- [ngDialog 0.4.0](https://github.com/likeastore/ngDialog) 
- [angular-chart 1.1.1](http://jtblin.github.io/angular-chart.js/) 
- [chart.js 2.6.0](http://www.chartjs.org/) 

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
	
### Natural routesを使用した際のPage Not Foundエラーへの対処

	package jp.tsubakicraft.mongocrud.controller;
	
	import org.springframework.stereotype.Controller;
	import org.springframework.web.bind.annotation.RequestMapping;
	
	@Controller
	public class ErrorHandler {
		@RequestMapping(value = "/{[path:[^\\.]*}")
		public String redirect() {
		  return "forward:/";
		}
	}
	

## AngularJS関連

### HTMLテンプレートの部品化 （$routeProviderの使用）

	in app.js
	
	var app = angular.module("app", ['ngRoute', 'ngDialog', 'ui.bootstrap', 'chart.js']);
	
	app.config(['$routeProvider', function($routeProvider) {
			
	    $routeProvider
		.when("/", {
			controller: 'home_controller',
			templateUrl: 'views/home.html'
		})
		.when("/brand/", {
			controller: 'brand_controller',
			templateUrl: 'views/brands.html'
		})
		.when("/newbrand/", {
			controller: 'brand_controller',
			templateUrl: 'views/newBrand.html'
		})
		.when("/model/", {
			controller: 'model_controller',
			templateUrl: 'views/models.html'
		})
		.when("/newmodel/", {
			controller: 'model_controller',
			templateUrl: 'views/newModel.html'
		})
		.when("/car/", {
			controller: 'car_controller',
			templateUrl: 'views/cars.html'
		})
		.when("/newcar/", {
			controller: 'car_controller',
			templateUrl: 'views/newCar.html'
		})
		.when("/sales/", {
			controller: 'sales_controller',
			templateUrl: 'views/sales.html'
		})
		.when("/newsales/", {
			controller: 'sales_controller',
			templateUrl: 'views/newSales.html'
		})
		.otherwise({
			redirectTo: "/"
		});
	}]);
	app.config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true);
	}]);
	



### REST APIの呼び出し （$httpの使用）

例えばBrandController (REST Controller)の/api/brandsルートにGETリクエストを行う場合は、$http.get()を使います。(brand_controller.jsを参照)

	app.controller("brand_controller", function($scope, $http, $location, $q, ngDialog) {
		$scope.brands = [];
	....
	....
		$scope.listBrands = function() {
			$http.get("/api/brands", {params: {page: $scope.page, limit: $scope.limit, sortColumn: $scope.sortColumn, sortDir: $scope.sortDir}}).then(function(response) {
				// データを正常に受信できた
				$scope.brands = response.data;
				....
				....
			}, function(error) {
				// HTTPリクエストがエラーになった
				....
			});
		};
	....
	....
	
		$scope.listBrands();
	});
	

### フォームの入力チェック

ValidationはHTMLテンプレート内で行う方法もありますが、このアプリケーションではコントローラーで行っています。(brand_controller.jsを参照)

	....
	....
	$scope.createBrand = function() {
		if(!$scope.validateForm()) {
			$http.post("/api/brands", $scope.brand).then(function(response) {
		        $scope.show = true;
		        $scope.hide = true;
		        $scope.hideObj = false;
		        $scope.showObj = false;
		        $scope.brandId = "";
		    	$location.path("/brand");
			}, function(error) {
				$scope.error = error;
			});
		}
	};
	....
	....
	$scope.validateForm = function() {
		$scope.validationMessages = [];
		if($scope.brand.name == null || $scope.brand.name == null) {
			$scope.validationMessages.push("Name is required.");
		}
		$scope.hasErrors =  $scope.validationMessages.length > 0;
		return $scope.hasErrors;
	};


HTMLテンプレート側にはエラーがあった（$scopeのhasErrorsがtrueの）場合に表示するブロックを用意しておきます。

	<div class="panel panel-default">
		<div class="panel-heading">ADD A BRAND</div>
		<form name="brand-form">
			<div ng-show="hasErrors">
				<div class="alert alert-danger" role="alert">
					<div ng-repeat="message in validationMessages">
						<strong>{{message}}</strong></br/>
					</div>
				</div>
			</div>
			<div class="form-group">
				<label for="brand-name">Name</label> <input name="brand-name"
					type="text" class="form-control" ng-model="brand.name" required>
			</div>
			<button class="btn btn-primary" type="submit" ng-click="createBrand()">
				<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
				Save
			</button>
	
			<button class="btn btn-default" ng-click="linkTo('/brand/')">
				<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
				Cancel
			</button>
		</form>
	</div>
	


### ページネーション （ui-bootstrapの使用） 

[ui-bootstrapのページ](https://angular-ui.github.io/bootstrap/) に方法が解説されています。


### テーブルのカラムソート




## BootStrap関連

### Bootstrap CSSのオーバーライド
Bootstrap CSSに限定されたことではありませんがCSSのオーバーライドの方法です。
次のコードはBootstrapのナビゲーションバーのスタイルをオーバーライドしています。HTMLファイルのCSSを読み込んでいる部分で、Bootstrap CSSよりも後に読み込むように設定します。

	.navbar {
		margin-bottom: 1px;
	        border-radius: 0px;
	}
	
	.navbar-inverse {
		background-color: rgb(12, 140, 213);
		border-color: rgb(12,140,213);	
	}
	
	.navbar-inverse .navbar-brand {
		color: #fff;
	}
	
	.navbar-inverse .navbar-nav>li>a {
		color: #fff;
	}
	
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
