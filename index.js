var Backbone = require('backbone.js');
var _ = require('underscore');


var oldPrototype = Backbone.Model.prototype;

var Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if( attributes.embed ){
		this.embed = _.clone(attributes.embed);
		delete attributes.embed;    	
    }
    if (options && options.collection) this.collection = options.collection;
    if (options && options.parse){
	 	attributes = this.parse(this.halParse(attributes));
	} else {
		attributes = this.halParse(attributes);
	}
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
};

_.extend(Model.prototype, oldPrototype, {

	halParse : function(attributes){
		if(attributes == null){
			attributes = {};
		}
		this.links = attributes._links || {};

    _.each(this.links, function(link, id){
      if(_.isArray(link) && link.length===1){
        this.links[id] = link[0];
      }      
    }, this)

    this.embedded = {};
    this.controls = {};
		attributes._embedded = attributes._embedded || {};

		_.each(attributes._embedded, function(value, key){

			if(this.embed && this.embed[key]){
				attributes[key] = new this.embed[key](value)			
			}else{
				this.embedded[key] = value ;
			}

		}, this);

    _.each(attributes._controls, function(value, key){

      this.controls[key] = value;

    }, this);

		delete attributes._links;
		delete attributes._controls;
    delete attributes._embedded;
		return attributes;

	},

  fetch: function(options) {
    options = options ? _.clone(options) : {};
    var model = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      if (!model.set(model.parse(model.halParse(resp), xhr), options)) return false;
      if (success) success(model, resp, options);
      model.trigger('sync', model, resp, options);
    };
    options.error = Backbone.wrapError(options.error, model, options);
    return this.sync('read', this, options);
  },

	url : function(){
        var _ref, _ref1;
        if(this.links && this.links.self){
            if(_.isArray(this.links.self)){
              return (_.first(this.links.self)).href;
            }else{
              return this.links.self.href;
            }
        }else{
          Model.__super__.url.call(this);
        }
	},

	isNew : function(){
		var _ref;
        return !((_ref = this.links) != null ? _ref.self : void 0);	
	}

});

 // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = extend;

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

module.exports.Model = Model;
module.exports.Collection = Backbone.Collection;