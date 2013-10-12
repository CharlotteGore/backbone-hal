# DEPRECATED

This component is no longer being maintained. It is rubbish. It has been replaced with the signicantly better - in terms of features and having test coverage - by (Hyperbone Model)[https://github.com/green-mesa/hyperbone-model]

Thanks!

# backbone-hal

  HAL Integration for Backbone.
  
  Basically this takes care of mapping embedded resources to Backbone model types. So

```
/productlist

{
  _embedded :{
    "products" : [
       ....
    ]
  }
}

```

becomes

```

productList.get("products").each(function(product){
   
   // do something with Product.
  
})

```

## Installation

    $ component install charlottegore/backbone-hal

## Example

```

var Model = require('backbone-hal').Model;
var Backbone = require('backbone.js');

// some basic empty models
var ProductHistory = Model.extend({});
var ProductDownload = Model.extend({});

// a product that automatically adds _embedded 'product-history' and 'product-download' to the model's attributes, using the correct Model.
var Product = Model.Extend({
  embed : {
    "product-history" : ProductHistory
  }
});

// a collection of products
var ProductList = Backbone.Collection.extend({
  model : Product
})

// Products hypermedia contains an embedded collection.
var Products = Model.extend({
  embed : {
    "product" : ProductList
  }
})

```
   

## License

  MIT
