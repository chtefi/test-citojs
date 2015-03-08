(function() {

    // ----------------------------------------------------------------------------
    // Wait for the file to be loaded.
    // ----------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function() {
        // init call
        var DOMNode = document.getElementById('app');
        var app = new App(DOMNode);
    });

    // ----------------------------------------------------------------------------
    // The main component: App
    // ----------------------------------------------------------------------------
    var App = function(rootDOMNode) {
        this.users = null;
        this.rootDOMNode = rootDOMNode;
        this.citoDOM = null;
        this.init();
    }

    App.prototype = {
        init: function() {
            this.bindEvents();
            this.setState(UserStore.getUsers());
            this.render();
        },

        // react on UserStore changes
        bindEvents: function() {
            // listen to users updates, and update the view
            UserStore.on('change', function(users) {
                this.setState(users);
                this.update();
            }.bind(this));
        },

        // called on init and when UserStore changes
        setState: function(users) {
            this.users = users;
        },


        // returns the virtual dom of the current state
        getVirtualDOM: function() {

            // loading... if no users yet
            if (!this.users) {
                return {
                    tag: 'div',
                    children: 'Loading...'
                }
            }

            // create the tree
            var usersList = {
                tag: 'ul',
                children: []
            };
            var tree = {
                tag: 'div',
                children: [
                    function(oldChild) {
                        return AppHeader.getVirtualDOM();
                    },
                    usersList
                ]
            };

            // add a <li> for each user
            for (var i = 0, l = this.users.length; i < l; i++) {
                var u = this.users[i];
                var id = u.username;
                var fullname = u.name.first + ' ' + u.name.last;
                var pic = u.picture.thumbnail;
                var email = u.email;

                tree.children.push({
                    tag: 'li',
                    children: [{
                        tag: 'img',
                        attrs: {
                            'class': 'user__picture',
                            src: pic
                        }
                    }, {
                        tag: 'div',
                        attrs: {
                            'class': 'user__details'
                        },
                        children: [{
                            tag: 'span',
                            attrs: {
                                'class': 'user__details__fullname'
                            },
                            children: fullname
                        }, {
                            tag: 'span',
                            attrs: {
                                'class': 'user__details__email'
                            },
                            children: email
                        }]
                    }],
                    events: {
                        click: this.onItemClick.bind(this, u)
                    },
                    attrs: {
                        'class': 'user' + (u.selected ? ' user--selected' : '')
                    },
                    key: id
                });
            }

            return tree;
        },

        onItemClick: function(user) {
            UserStore.toggleSelection(user.username);
        },

        // called once. render the virtual dom the first time and store the citoDOM result to be used in update
        render: function() {
            this.citoDOM = cito.vdom.append(this.rootDOMNode, this.getVirtualDOM());
        },

        // reevaluate the virtual dom and let cito do the diff with the DOM
        update: function() {
            cito.vdom.update(this.citoDOM, this.getVirtualDOM());
        }

    };



    // Is there a way to make an independant component à la React ?


    // var AppHeader = function(rootDOMNode) {
    //     this.init();
    // }

    // AppHeader.prototype = {
    //     init: function() {
    //         this.bindEvents();
    //     },

    //     bindEvents: function() {
    //         // listen to users updates, and update the view
    //         UserStore.on('change', function(users) {
    //             //            this.update();
    //         }.bind(this));
    //     },

    //     setState: function(users) {

    //     },

    //     getVirtualDOM: function() {
    //         return {
    //             tag: 'div',
    //             children: 'you have selected ' + UserStore.getSelectedCount() + '/' + UserStore.getCount() + ' users'
    //         };
    //     }
    // };

    // ----------------------------------------------------------------------------
    // AppHeader is another 'component' that is rendered in App.
    // Right now, it's not truly a component but just more a helper.
    // I didn't really find a way to make that as a reusable class easily when rendering the App virtual DOM
    // ----------------------------------------------------------------------------
    var AppHeader = {

        getVirtualDOM: function() {
            var selectedCount = UserStore.getSelectedCount();
            return {
                tag: 'div',
                attrs: {
                    'class': 'app-header'
                },
                children: [{
                    tag: '#',
                    children: 'you have selected ' + UserStore.getSelectedCount() + '/' + UserStore.getCount() + ' users'
                }, {
                    tag: 'button',
                    children: 'delete',
                    attrs: {
                        'type': 'button',
                        'class': 'app-header__delete-button',
                        'disabled': !selectedCount
                    },
                    events: {
                        'click': this.deleteSelectedUsers.bind(this)
                    }
                }, {
                    tag: 'button',
                    children: 'add more',
                    attrs: {
                        'type': 'button',
                        'class': 'app-header__delete-button'
                    },
                    events: {
                        'click': this.addUsers.bind(this)
                    }
                }]
            };
        },

        deleteSelectedUsers: function() {
            UserStore.deleteSelectedUsers();
        },

        addUsers: function() {
            UserStore.addUsers(5);
        }
    };


}());
