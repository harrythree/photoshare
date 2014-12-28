exports.definition = {
  config: {
    "adapter": {
      "type": "acs",
      "collection_name": "photos"
    }
  },
  extendModel: function(Model) {        
    _.extend(Model.prototype, {
      // Extend, override or implement Backbone.Model 
    });
    // end extend

    return Model;
  },
  extendCollection: function(Collection) {      
    _.extend(Collection.prototype, {
      // Extend, override or implement Backbone.Collection 
    });
    // end extend

    return Collection;
  }
}