module Service {
    export class SearchService {

        citiesWithTrips = [];
        searchQuery:any;
        pageSize:number = 10;

        constructor(private $http, private $location, private basePath, private DataService, private lodash, private $q) {

        }

        getAllTrips() {
            return this.$http.get(this.basePath + '/api/v1/trips');
        }

        getTripsByQuery(searchQuery) {
            // create a copy by value
            var sq = this.lodash.cloneDeep(searchQuery);
            // clone query
            this.searchQuery = this.lodash.cloneDeep(searchQuery);
            sq.page_size = this.pageSize;
            sq.page = 1;
            return this.getTrips(sq);
        }

        getMoreTrips(pageCount) {
            // create a copy by value
            var sq = this.lodash.cloneDeep(this.searchQuery);
            sq.page_size = this.pageSize;
            sq.page = pageCount;
            return this.getTrips(sq);
        }

        getTrips(sq) {
            var query = this.basePath + '/trips/search';
            return this.getCityId(sq.city).then(cityid => {
                // delete city from query since it is part of the path
                delete sq.city;
                // returning a promise inside a promise will make the outside promise resolving if inside is resolved.
                return this.$http({
                    url: query + '/' + cityid,
                    params: sq,
                    method: 'GET'
                });
            });
        }

        getCityId(city) {
            var promise = this.$q((resolve, reject) => {
                this.DataService.getAvailableCities()
                    .then(result => {
                        this.citiesWithTrips = result.data;
                        var cityObject = this.lodash.findWhere(this.citiesWithTrips, {title: city});
                        if(cityObject.place_id) {
                            return resolve(cityObject.id);
                        }
                        reject({msg: 'not found'});
                    });

            });

            return promise;
        }

        getTripById(tripId) {
            return this.$http.get(this.basePath + '/trips/'+tripId);
        }


        static serviceId:string = "SearchService";
    }
}
