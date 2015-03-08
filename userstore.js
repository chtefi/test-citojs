(function() {

    // ----------------------------------------------------------------------------
    // This is the store containing users data.
    // ----------------------------------------------------------------------------
    var UserStore = function() {
        this.users = [];

        // init : create 5 users and notify the listeners
        this.addUsers(5);
    };

    UserStore.prototype = extend({
        addUsers: function(count) {
            while (count--) {
                xhr('http://api.randomuser.me/', function(userAsJSON) {
                    var user = JSON.parse(userAsJSON).results[0].user;
                    this.users.push(user); // not immutable :(
                    this.emit('change', this.users);
                }.bind(this));
            }
        },

        getUsers: function() {
            return this.users;
        },

        toggleSelection: function(username) {
            var user = null;
            for (var i = 0, l = this.users.length; i < l; i++) {
                if (this.users[i].username === username) {
                    this.users[i].selected = !this.users[i].selected;
                    this.emit('change', this.users);
                    return; // exit loop
                }
            }
        },

        getCount: function() {
            return this.users.length;
        },

        getSelectedCount: function() {
            var count = 0;
            for (var i = 0, l = this.users.length; i < l; i++) {
                if (this.users[i].selected) {
                    count++;
                }
            }
            return count;
        },

        deleteSelectedUsers: function() {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].selected) {
                    this.users.splice(i, 1);
                    i--;
                }
            }
            this.emit('change', this.users);
        },

        

    }, EventEmitter.prototype);

    // ------------------------------------------------------------------------
    // create an unique instance of the store on window. ! 
    // ------------------------------------------------------------------------
    window.UserStore = new UserStore();

}());
