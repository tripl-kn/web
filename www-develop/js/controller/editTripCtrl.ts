module Controller {

    export class EditTripCtrl {


        myLocations = [];
        publicLocations = [];
        selectedLocations = [];

        showCities:string = 'showCitiesCreate';
        showMoods:string = 'showMoodsCreate';
        showDays:string = 'showDaysCreate';

        moods:any;
        open:any;
        selectedMood:any;

        justShowMyLocations:boolean = false;


        cities:any;
        selectedCity:any;

        days:any;
        selectedDay:any;

        tripMeta:any = {
            title: '',
            persons: '',
            accommodation: false,
            description: '',
            budget: '',
            accommodationEquipment: [],
            city: {}
        };

        accommodationEquipmentSelectable = false;

        dataAvailable:boolean = false;

        locationSearch = '';


        constructor(private $q, private lodash, private $scope, private $timeout, private $rootScope, private $state, private $anchorScroll, private $location, private InsertTripService, private TripService, private LocationService, private UserService, private DataService, private HelperService) {

            var moods = this.DataService.getMoods();
            var cities = this.DataService.getCities();
            var days = this.DataService.getAvailableAmountOfDays();

            this.$q.all([moods, cities, days])
                .then((responsesArray) => {

                    this.moods = responsesArray[0].data;
                    this.cities = responsesArray[1].data;
                    this.days = responsesArray[2].data;
                    this.dataAvailable = true;

                    $scope.selectedMood = HelperService.getObjectByQueryName(this.moods, $state.params.moods) || this.moods[Math.floor((Math.random() * this.moods.length))];
                    $scope.selectedCity = HelperService.getCityByTitle(this.cities, $state.params.city) || this.cities[Math.floor((Math.random() * this.cities.length))];
                    $scope.selectedDay = HelperService.getObjectByQueryName(this.days, $state.params.days) || this.days[Math.floor((Math.random() * this.days.length))];


                    this.fetchLocations();
                });

            $scope.$watch('selectedCity', (newval, oldval) => {
                if (newval) {
                    this.fetchLocations();
                }

            }, true);


        }

        toggleAccommodation() {
            this.tripMeta.accommodation = !this.tripMeta.accommodation;
            if (this.tripMeta.accommodation) {
                this.accommodationEquipmentSelectable = true;
            } else {
                this.tripMeta.accommodationEquipment = [];
                this.accommodationEquipmentSelectable = false;
            }
        }

        fetchLocations() {
            console.info(this.selectedCity);
            this.LocationService.getLocationsByCity(this.$scope.selectedCity.title)
                .then(result => {
                    this.publicLocations = result.data;
                }).catch(err => {
                    console.info(err);
                });

            this.LocationService.getMyLocationsByCity(this.$scope.selectedCity.title)
                .then(result => {
                    this.myLocations = result.data;
                }).catch(err => {
                    console.info(err);
                });
        }

        selectLocation(location) {

            var _public = this._removeLocation(this.publicLocations, location);
            var _private = this._removeLocation(this.myLocations, location);

            if (_public && _private) {
                this._addLocation(this.selectedLocations, location, 'both');

            } else if (_public) {
                this._addLocation(this.selectedLocations, location, 'public');

            } else if (_private) {
                this._addLocation(this.selectedLocations, location, 'private');
            }

        }

        deSelectLocation(locationtodeselect) {
            this._removeLocation(this.selectedLocations, locationtodeselect);

            if (locationtodeselect.origin === 'both') {
                this.publicLocations.push(locationtodeselect);
                this.myLocations.push(locationtodeselect);

            } else if (locationtodeselect.origin === 'private') {
                this.myLocations.push(locationtodeselect);

            } else if (locationtodeselect.origin === 'public') {
                this.publicLocations.push(locationtodeselect);
            }
        }

        _removeLocation(locations, locationtoremove) {
            var index = this.lodash.findIndex(locations, {'_id': locationtoremove._id});
            if (index === -1) return false;
            locations.splice(index, 1);
            return true;
        }

        _addLocation(locations, locationtoadd, origin) {
            locationtoadd.origin = origin;
            locations.push(locationtoadd);
        }

        getSelectedLocations() {

            var sl = {};
            this.selectedLocations.forEach(location => {
                sl[location._id] = location.images;
            });

            return sl;
        }


        static controllerId:string = "EditTripCtrl";
    }
}
