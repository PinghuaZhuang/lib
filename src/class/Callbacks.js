import z from '../core';

/*
 * 创建队列
 *
 * Possible options:
 *
 *	once:			是否只执行一次
 *
 *	memory:			添加新函数时, 是否立即执行
 *
 *	unique:			是否保证函数的唯一性
 *
 *	stopOnFalse:	函数返回 false 是否结束当前队列
 *
 */
export default function ( options ) {

    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === 'string' ?
        z.createOptions( options ) :
        z.extend( {}, options );

    var // Flag to know if list is currently firing
        firing,

        // Last fire value for non-forgettable lists
        memory,

        // Flag to know if list was already fired
        fired,

        // Flag to prevent firing
        locked,

        // Actual callback list
        list = [],

        // Queue of execution data for repeatable lists
        queue = [],

        // Index of currently firing callback (modified by add/remove as needed)
        firingIndex = -1,

        // Fire callbacks
        fire = function () {

            // Enforce single-firing
            locked = locked || options.once;

            // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
            fired = firing = true;
            for ( ; queue.length; firingIndex = -1 ) {
                memory = queue.shift();
                while ( ++firingIndex < list.length ) {

                    // Run callback and check for early termination
                    if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

                        // Jump to end and forget the data so .add doesn't re-fire
                        firingIndex = list.length;
                        memory = false;
                    }
                }
            }

            // Forget the data if we're done with it
            if ( !options.memory ) {
                memory = false;
            }

            firing = false;

            // Clean up if we're done firing for good
            if ( locked ) {

                // Keep an empty list if we have data for future add calls
                if ( memory ) {
                    list = [];

                    // Otherwise, this object is spent
                } else {
                    list = '';
                }
            }
        },

        // Actual Callbacks object
        self = {

            // Add a callback or a collection of callbacks to the list
            add: function ( ...rest ) {
                if ( list ) {

                    // If we have memory from a past run, we should fire after adding
                    if ( memory && !firing ) {
                        firingIndex = list.length - 1;
                        queue.push( memory );
                    }

                    ( function add ( args ) {
                        z.each( args, function ( _, arg ) {
                            if ( z.isFunction( arg ) ) {
                                if ( !options.unique || !self.has( arg ) ) {
                                    list.push( arg );
                                }
                            } else if ( arg && arg.length && z.type( arg ) !== 'string' ) {

                                // Inspect recursively
                                add( arg );
                            }
                        } );
                    } )( rest );

                    if ( memory && !firing ) {
                        fire();
                    }
                }
                return this;
            },

            // Remove a callback from the list
            remove: function ( ...rest ) {
                z.each( rest, function ( _, arg ) {
                    var index;
                    while ( ( index = z.inArray( arg, list, index ) ) > -1 ) {
                        list.splice( index, 1 );

                        // Handle firing indexes
                        if ( index <= firingIndex ) {
                            firingIndex--;
                        }
                    }
                } );
                return this;
            },

            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function ( fn ) {
                return fn ?
                    z.inArray( fn, list ) > -1 :
                    list.length > 0;
            },

            // Remove all callbacks from the list
            empty: function () {
                if ( list ) {
                    list = [];
                }
                return this;
            },

            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function () {
                locked = queue = [];
                list = memory = '';
                return this;
            },
            disabled: function () {
                return !list;
            },

            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function () {
                locked = queue = [];
                if ( !memory && !firing ) {
                    list = memory = '';
                }
                return this;
            },
            locked: function () {
                return !!locked;
            },

            // Call all callbacks with the given context and arguments
            fireWith: function ( context, args ) {
                if ( !locked ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    queue.push( args );
                    if ( !firing ) {
                        fire();
                    }
                }
                return this;
            },

            // Call all the callbacks with the given arguments
            fire: function ( ...rest ) {
                self.fireWith( this, rest );
                return this;
            },

            // To know if the callbacks have already been called at least once
            fired: function () {
                return !!fired;
            }
        };

    return self;
};
