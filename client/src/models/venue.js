var Venue = function(options){
    this._id = options._id || "";
    this.name = options.name;
    this.addressLine1 = options.addressLine1;
    this.addressLine2 = options.addressLine2;
    this.town = options.town;
    this.region = options.region;
    this.postCode = options.postCode;
    this.phone = options.phone;
    this.email = options.email;
    this.facilities = options.facilities || [];
    this.openingTimes = options.openingTimes;
    this.coords = options.coords;
};

module.exports = Venue;