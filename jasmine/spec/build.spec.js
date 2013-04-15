describe("Backbone HAL", function(){

	describe("Test framework", function(){

		it("can load module and run tests", function(){

			expect(true).toBe(true);
			expect(require).toBeDefined();
			expect(require('backbone-hal')).toBeTruthy();

		});

	});

	describe("Module", function(){

		it("exports Model and Collection", function(){

			var hal = require('backbone-hal');
			expect(hal.Model).toBeDefined();
			expect(hal.Collection).toBeDefined();

		});

		describe("Model", function(){

			it("can create a model", function(){

				var Model = require('backbone-hal').Model;

				var Test = Model.extend({ defaults : { jasmine : true }});

				var test = new Test();

				expect(test.cid).toBeDefined();
				expect(test.attributes).toBeDefined();
				expect(test.get("jasmine")).toBe(true);

			});

			it("can parse _links", function(){

				var Model = require('backbone-hal').Model;

				var Test = Model.extend({});

				var test = new Test({ _links : { self : { href : "/jasmine"}}});

				expect(test.url()).toBe('/jasmine');

			});

			it("can parse _embedded", function(){

				var Model = require('backbone-hal').Model;

				var Test = Model.extend({});

				var test = new Test({ _embedded : { jasmine : [{ id : 0}, { id : 1}] }});

				expect(test.embedded.jasmine[0]).toEqual({id : 0})
				expect(test.embedded.jasmine[1]).toEqual({id : 1})
				

			});

			it("can map embedded to types", function(){

				var Model = require('backbone-hal').Model;
				var Collection = require('backbone-hal').Collection;

				var Item = Model.extend({});
				var List = Collection.extend({
					model : Item
				});

				var Test = Model.extend({
					embed : {
						jasmine : List
					}
				});

				var test = new Test({ _embedded : { jasmine : [{ id : 0}, { id : 1}] }});

				expect(test.get("jasmine").at(0).id).toEqual(0)
				expect(test.get("jasmine").at(1).id).toEqual(1)
				expect(test.get("jasmine").length).toEqual(2)

				console.log(test.get("jasmine").toJSON());

			});

		});
	})

});