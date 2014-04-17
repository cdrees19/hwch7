/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);













(function() {
  var CSRFToken, anchoredLink, assetsChanged, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, extractTrackAssets, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, initialized, installClickHandlerLast, intersection, invalidContent, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberInitialPage, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initialized = false;

  currentState = null;

  referer = document.location.href;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  visit = function(url) {
    if (browserSupportsPushState && browserIsntBuggy) {
      cacheCurrentPage();
      reflectNewUrl(url);
      return fetchReplacement(url);
    } else {
      return document.location.href = url;
    }
  };

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = (function(_this) {
      return function() {
        var doc;
        triggerEvent('page:receive');
        if (invalidContent(xhr) || assetsChanged((doc = createDocument(xhr.responseText)))) {
          return document.location.reload();
        } else {
          changePage.apply(null, extractTitleAndBody(doc));
          reflectRedirectedUrl(xhr);
          if (document.location.hash) {
            document.location.href = document.location.href;
          } else {
            resetScrollPosition();
          }
          return triggerEvent('page:load');
        }
      };
    })(this);
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(state) {
    var page;
    cacheCurrentPage();
    if (page = pageCache[state.position]) {
      if (xhr != null) {
        xhr.abort();
      }
      changePage(page.title, page.body);
      recallScrollPosition(page);
      return triggerEvent('page:restore');
    } else {
      return fetchReplacement(document.location.href);
    }
  };

  cacheCurrentPage = function() {
    rememberInitialPage();
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(10);
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.getElementsByTagName('script'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== document.location.href) {
      referer = document.location.href;
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function(xhr) {
    var location;
    if ((location = xhr.getResponseHeader('X-XHR-Current-Location')) && location !== document.location.pathname + document.location.search) {
      return window.history.replaceState(currentState, '', location + document.location.hash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  rememberInitialPage = function() {
    if (!initialized) {
      rememberCurrentUrl();
      rememberCurrentState();
      createDocument = browserCompatibleDocumentParser();
      return initialized = true;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  invalidContent = function(xhr) {
    return !xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
  };

  extractTrackAssets = function(doc) {
    var node, _i, _len, _ref1, _results;
    _ref1 = doc.head.childNodes;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      node = _ref1[_i];
      if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
        _results.push(node.src || node.href);
      }
    }
    return _results;
  };

  assetsChanged = function(doc) {
    var fetchedAssets;
    loadedAssets || (loadedAssets = extractTrackAssets(document));
    fetchedAssets = extractTrackAssets(doc);
    return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
  };

  intersection = function(a, b) {
    var value, _i, _len, _ref1, _results;
    if (a.length > b.length) {
      _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
    }
    _results = [];
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      value = a[_i];
      if (__indexOf.call(b, value) >= 0) {
        _results.push(value);
      }
    }
    return _results;
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        visit(link.href);
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var _ref1;
      if ((_ref1 = event.state) != null ? _ref1.turbolinks : void 0) {
        return fetchHistory(event.state);
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    initializeTurbolinks();
  }

  this.Turbolinks = {
    visit: visit
  };

}).call(this);
function updateCountdown() {
  // 140 characters max
  var left = 140 - jQuery('.micropost_text_area').val().length;
  if(left == 1) {
    var charactersLeft = ' character left.'
  }
  else if(left < 0){
    var charactersLeft = ' characters too many.'
  }
  else{
    var charactersLeft = ' characters left.'
  }
  jQuery('.countdown').text(Math.abs(left) + charactersLeft);
}

jQuery(document).ready(function($) {
  updateCountdown();
  $('.micropost_text_area').change(updateCountdown);
  $('.micropost_text_area').keyup(updateCountdown);
});
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// Instantiate the object
var I18n = I18n || {};

// Set default locale to english
I18n.defaultLocale = "en";

// Set default handling of translation fallbacks to false
I18n.fallbacks = false;

// Set default separator
I18n.defaultSeparator = ".";

// Set current locale to null
I18n.locale = null;

// Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm;

I18n.isValidNode = function(obj, node, undefined) {
    return obj[node] !== null && obj[node] !== undefined;
}

I18n.lookup = function(scope, options) {
  var options = options || {}
    , lookupInitialScope = scope
    , translations = this.prepareOptions(I18n.translations)
    , messages = translations[options.locale || I18n.currentLocale()]
    , options = this.prepareOptions(options)
    , currentScope
  ;

  if (!messages){
    return;
  }

  if (typeof(scope) == "object") {
    scope = scope.join(this.defaultSeparator);
  }

  if (options.scope) {
    scope = options.scope.toString() + this.defaultSeparator + scope;
  }

  scope = scope.split(this.defaultSeparator);

  while (scope.length > 0) {
    currentScope = scope.shift();
    messages = messages[currentScope];

    if (!messages) {
      if (I18n.fallbacks && !options.fallback) {
        messages = I18n.lookup(lookupInitialScope, this.prepareOptions({ locale: I18n.defaultLocale, fallback: true }, options));
      }
      break;
    }
  }

  if (!messages && this.isValidNode(options, "defaultValue")) {
    messages = options.defaultValue;
  }

  return messages;
};

// Merge serveral hash options, checking if value is set before
// overwriting any value. The precedence is from left to right.
//
//   I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
//   #=> {name: "John Doe", role: "user"}
//
I18n.prepareOptions = function() {
  var options = {}
    , opts
    , count = arguments.length
  ;

  for (var i = 0; i < count; i++) {
    opts = arguments[i];

    if (!opts) {
      continue;
    }

    for (var key in opts) {
      if (!this.isValidNode(options, key)) {
        options[key] = opts[key];
      }
    }
  }

  return options;
};

I18n.interpolate = function(message, options) {
  options = this.prepareOptions(options);
  var matches = message.match(this.PLACEHOLDER)
    , placeholder
    , value
    , name
  ;

  if (!matches) {
    return message;
  }

  for (var i = 0; placeholder = matches[i]; i++) {
    name = placeholder.replace(this.PLACEHOLDER, "$1");

    value = options[name];

    if (!this.isValidNode(options, name)) {
      value = "[missing " + placeholder + " value]";
    }

    regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
    message = message.replace(regex, value);
  }

  return message;
};

I18n.translate = function(scope, options) {
  options = this.prepareOptions(options);
  var translation = this.lookup(scope, options);

  try {
    if (typeof(translation) == "object") {
      if (typeof(options.count) == "number") {
        return this.pluralize(options.count, scope, options);
      } else {
        return translation;
      }
    } else {
      return this.interpolate(translation, options);
    }
  } catch(err) {
    return this.missingTranslation(scope);
  }
};

I18n.localize = function(scope, value) {
  switch (scope) {
    case "currency":
      return this.toCurrency(value);
    case "number":
      scope = this.lookup("number.format");
      return this.toNumber(value, scope);
    case "percentage":
      return this.toPercentage(value);
    default:
      if (scope.match(/^(date|time)/)) {
        return this.toTime(scope, value);
      } else {
        return value.toString();
      }
  }
};

I18n.parseDate = function(date) {
  var matches, convertedDate;

  // we have a date, so just return it.
  if (typeof(date) == "object") {
    return date;
  };

  // it matches the following formats:
  //   yyyy-mm-dd
  //   yyyy-mm-dd[ T]hh:mm::ss
  //   yyyy-mm-dd[ T]hh:mm::ss
  //   yyyy-mm-dd[ T]hh:mm::ssZ
  //   yyyy-mm-dd[ T]hh:mm::ss+0000
  //
  matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);

  if (matches) {
    for (var i = 1; i <= 6; i++) {
      matches[i] = parseInt(matches[i], 10) || 0;
    }

    // month starts on 0
    matches[2] -= 1;

    if (matches[7]) {
      convertedDate = new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]));
    } else {
      convertedDate = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]);
    }
  } else if (typeof(date) == "number") {
    // UNIX timestamp
    convertedDate = new Date();
    convertedDate.setTime(date);
  } else if (date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
    // a valid javascript format with timezone info
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date))
  } else {
    // an arbitrary javascript string
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date));
  }

  return convertedDate;
};

I18n.toTime = function(scope, d) {
  var date = this.parseDate(d)
    , format = this.lookup(scope)
  ;

  if (date.toString().match(/invalid/i)) {
    return date.toString();
  }

  if (!format) {
    return date.toString();
  }

  return this.strftime(date, format);
};

I18n.strftime = function(date, format) {
  var options = this.lookup("date");

  if (!options) {
    return date.toString();
  }

  options.meridian = options.meridian || ["AM", "PM"];

  var weekDay = date.getDay()
    , day = date.getDate()
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , hour = date.getHours()
    , hour12 = hour
    , meridian = hour > 11 ? 1 : 0
    , secs = date.getSeconds()
    , mins = date.getMinutes()
    , offset = date.getTimezoneOffset()
    , absOffsetHours = Math.floor(Math.abs(offset / 60))
    , absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60)
    , timezoneoffset = (offset > 0 ? "-" : "+") + (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) + (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes)
  ;

  if (hour12 > 12) {
    hour12 = hour12 - 12;
  } else if (hour12 === 0) {
    hour12 = 12;
  }

  var padding = function(n) {
    var s = "0" + n.toString();
    return s.substr(s.length - 2);
  };

  var f = format;
  f = f.replace("%a", options.abbr_day_names[weekDay]);
  f = f.replace("%A", options.day_names[weekDay]);
  f = f.replace("%b", options.abbr_month_names[month]);
  f = f.replace("%B", options.month_names[month]);
  f = f.replace("%d", padding(day));
  f = f.replace("%e", day);
  f = f.replace("%-d", day);
  f = f.replace("%H", padding(hour));
  f = f.replace("%-H", hour);
  f = f.replace("%I", padding(hour12));
  f = f.replace("%-I", hour12);
  f = f.replace("%m", padding(month));
  f = f.replace("%-m", month);
  f = f.replace("%M", padding(mins));
  f = f.replace("%-M", mins);
  f = f.replace("%p", options.meridian[meridian]);
  f = f.replace("%S", padding(secs));
  f = f.replace("%-S", secs);
  f = f.replace("%w", weekDay);
  f = f.replace("%y", padding(year));
  f = f.replace("%-y", padding(year).replace(/^0+/, ""));
  f = f.replace("%Y", year);
  f = f.replace("%z", timezoneoffset);

  return f;
};

I18n.toNumber = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.format"),
    {precision: 3, separator: ".", delimiter: ",", strip_insignificant_zeros: false}
  );

  var negative = number < 0
    , string = Math.abs(number).toFixed(options.precision).toString()
    , parts = string.split(".")
    , precision
    , buffer = []
    , formattedNumber
  ;

  number = parts[0];
  precision = parts[1];

  while (number.length > 0) {
    buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
    number = number.substr(0, number.length -3);
  }

  formattedNumber = buffer.join(options.delimiter);

  if (options.precision > 0) {
    formattedNumber += options.separator + parts[1];
  }

  if (negative) {
    formattedNumber = "-" + formattedNumber;
  }

  if (options.strip_insignificant_zeros) {
    var regex = {
        separator: new RegExp(options.separator.replace(/\./, "\\.") + "$")
      , zeros: /0+$/
    };

    formattedNumber = formattedNumber
      .replace(regex.zeros, "")
      .replace(regex.separator, "")
    ;
  }

  return formattedNumber;
};

I18n.toCurrency = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.currency.format"),
    this.lookup("number.format"),
    {unit: "$", precision: 2, format: "%u%n", delimiter: ",", separator: "."}
  );

  number = this.toNumber(number, options);
  number = options.format
    .replace("%u", options.unit)
    .replace("%n", number)
  ;

  return number;
};

I18n.toHumanSize = function(number, options) {
  var kb = 1024
    , size = number
    , iterations = 0
    , unit
    , precision
  ;

  while (size >= kb && iterations < 4) {
    size = size / kb;
    iterations += 1;
  }

  if (iterations === 0) {
    unit = this.t("number.human.storage_units.units.byte", {count: size});
    precision = 0;
  } else {
    unit = this.t("number.human.storage_units.units." + [null, "kb", "mb", "gb", "tb"][iterations]);
    precision = (size - Math.floor(size) === 0) ? 0 : 1;
  }

  options = this.prepareOptions(
    options,
    {precision: precision, format: "%n%u", delimiter: ""}
  );

  number = this.toNumber(size, options);
  number = options.format
    .replace("%u", unit)
    .replace("%n", number)
  ;

  return number;
};

I18n.toPercentage = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.percentage.format"),
    this.lookup("number.format"),
    {precision: 3, separator: ".", delimiter: ""}
  );

  number = this.toNumber(number, options);
  return number + "%";
};

I18n.pluralize = function(count, scope, options) {
  var translation;

  try {
    translation = this.lookup(scope, options);
  } catch (error) {}

  if (!translation) {
    return this.missingTranslation(scope);
  }

  var message;
  options = this.prepareOptions(options);
  options.count = count.toString();

  switch(Math.abs(count)) {
    case 0:
      message = this.isValidNode(translation, "zero") ? translation.zero :
                this.isValidNode(translation, "none") ? translation.none :
                this.isValidNode(translation, "other") ? translation.other :
                this.missingTranslation(scope, "zero");
      break;
    case 1:
      message = this.isValidNode(translation, "one") ? translation.one : this.missingTranslation(scope, "one");
      break;
    default:
      message = this.isValidNode(translation, "other") ? translation.other : this.missingTranslation(scope, "other");
  }

  return this.interpolate(message, options);
};

I18n.missingTranslation = function() {
  var message = '[missing "' + this.currentLocale()
    , count = arguments.length
  ;

  for (var i = 0; i < count; i++) {
    message += "." + arguments[i];
  }

  message += '" translation]';

  return message;
};

I18n.currentLocale = function() {
  return (I18n.locale || I18n.defaultLocale);
};

// shortcuts
I18n.t = I18n.translate;
I18n.l = I18n.localize;
I18n.p = I18n.pluralize;
var I18n = I18n || {};
I18n.translations = {"en":{"date":{"formats":{"default":"%Y-%m-%d","short":"%b %d","long":"%B %d, %Y"},"day_names":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"abbr_day_names":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"month_names":[null,"January","February","March","April","May","June","July","August","September","October","November","December"],"abbr_month_names":[null,"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"order":["year","month","day"]},"time":{"formats":{"default":"%a, %d %b %Y %H:%M:%S %z","short":"%d %b %H:%M","long":"%B %d, %Y %H:%M"},"am":"am","pm":"pm"},"support":{"array":{"words_connector":", ","two_words_connector":" and ","last_word_connector":", and "}},"number":{"format":{"separator":".","delimiter":",","precision":3,"significant":false,"strip_insignificant_zeros":false},"currency":{"format":{"format":"%u%n","unit":"$","separator":".","delimiter":",","precision":2,"significant":false,"strip_insignificant_zeros":false}},"percentage":{"format":{"delimiter":"","format":"%n%"}},"precision":{"format":{"delimiter":""}},"human":{"format":{"delimiter":"","precision":3,"significant":true,"strip_insignificant_zeros":true},"storage_units":{"format":"%n %u","units":{"byte":{"one":"Byte","other":"Bytes"},"kb":"KB","mb":"MB","gb":"GB","tb":"TB"}},"decimal_units":{"format":"%n %u","units":{"unit":"","thousand":"Thousand","million":"Million","billion":"Billion","trillion":"Trillion","quadrillion":"Quadrillion"}}}},"errors":{"format":"%{attribute} %{message}","messages":{"inclusion":"is not included in the list","exclusion":"is reserved","invalid":"is invalid","confirmation":"doesn't match %{attribute}","accepted":"must be accepted","empty":"can't be empty","blank":"can't be blank","present":"must be blank","too_long":"is too long (maximum is %{count} characters)","too_short":"is too short (minimum is %{count} characters)","wrong_length":"is the wrong length (should be %{count} characters)","not_a_number":"is not a number","not_an_integer":"must be an integer","greater_than":"must be greater than %{count}","greater_than_or_equal_to":"must be greater than or equal to %{count}","equal_to":"must be equal to %{count}","less_than":"must be less than %{count}","less_than_or_equal_to":"must be less than or equal to %{count}","other_than":"must be other than %{count}","odd":"must be odd","even":"must be even","taken":"has already been taken"}},"activerecord":{"errors":{"messages":{"record_invalid":"Validation failed: %{errors}","restrict_dependent_destroy":{"one":"Cannot delete record because a dependent %{record} exists","many":"Cannot delete record because dependent %{record} exist"}}}},"datetime":{"distance_in_words":{"half_a_minute":"half a minute","less_than_x_seconds":{"one":"less than 1 second","other":"less than %{count} seconds"},"x_seconds":{"one":"1 second","other":"%{count} seconds"},"less_than_x_minutes":{"one":"less than a minute","other":"less than %{count} minutes"},"x_minutes":{"one":"1 minute","other":"%{count} minutes"},"about_x_hours":{"one":"about 1 hour","other":"about %{count} hours"},"x_days":{"one":"1 day","other":"%{count} days"},"about_x_months":{"one":"about 1 month","other":"about %{count} months"},"x_months":{"one":"1 month","other":"%{count} months"},"about_x_years":{"one":"about 1 year","other":"about %{count} years"},"over_x_years":{"one":"over 1 year","other":"over %{count} years"},"almost_x_years":{"one":"almost 1 year","other":"almost %{count} years"}},"prompts":{"year":"Year","month":"Month","day":"Day","hour":"Hour","minute":"Minute","second":"Seconds"}},"helpers":{"select":{"prompt":"Please select"},"submit":{"create":"Create %{model}","update":"Update %{model}","submit":"Save %{model}"}},"faker":{"address":{"city_prefix":["North","East","West","South","New","Lake","Port"],"city_suffix":["town","ton","land","ville","berg","burgh","borough","bury","view","port","mouth","stad","furt","chester","mouth","fort","haven","side","shire"],"country":["Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica (the territory South of 60 deg S)","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island (Bouvetoya)","Brazil","British Indian Ocean Territory (Chagos Archipelago)","British Virgin Islands","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo","Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Faroe Islands","Falkland Islands (Malvinas)","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea","Korea","Kuwait","Kyrgyz Republic","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands Antilles","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn Islands","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","Rwanda","Saint Barthelemy","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia (Slovak Republic)","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","Spain","Sri Lanka","Sudan","Suriname","Svalbard \u0026 Jan Mayen Islands","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","United States Minor Outlying Islands","United States Virgin Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"],"building_number":["#####","####","###"],"street_suffix":["Alley","Avenue","Branch","Bridge","Brook","Brooks","Burg","Burgs","Bypass","Camp","Canyon","Cape","Causeway","Center","Centers","Circle","Circles","Cliff","Cliffs","Club","Common","Corner","Corners","Course","Court","Courts","Cove","Coves","Creek","Crescent","Crest","Crossing","Crossroad","Curve","Dale","Dam","Divide","Drive","Drive","Drives","Estate","Estates","Expressway","Extension","Extensions","Fall","Falls","Ferry","Field","Fields","Flat","Flats","Ford","Fords","Forest","Forge","Forges","Fork","Forks","Fort","Freeway","Garden","Gardens","Gateway","Glen","Glens","Green","Greens","Grove","Groves","Harbor","Harbors","Haven","Heights","Highway","Hill","Hills","Hollow","Inlet","Inlet","Island","Island","Islands","Islands","Isle","Isle","Junction","Junctions","Key","Keys","Knoll","Knolls","Lake","Lakes","Land","Landing","Lane","Light","Lights","Loaf","Lock","Locks","Locks","Lodge","Lodge","Loop","Mall","Manor","Manors","Meadow","Meadows","Mews","Mill","Mills","Mission","Mission","Motorway","Mount","Mountain","Mountain","Mountains","Mountains","Neck","Orchard","Oval","Overpass","Park","Parks","Parkway","Parkways","Pass","Passage","Path","Pike","Pine","Pines","Place","Plain","Plains","Plains","Plaza","Plaza","Point","Points","Port","Port","Ports","Ports","Prairie","Prairie","Radial","Ramp","Ranch","Rapid","Rapids","Rest","Ridge","Ridges","River","Road","Road","Roads","Roads","Route","Row","Rue","Run","Shoal","Shoals","Shore","Shores","Skyway","Spring","Springs","Springs","Spur","Spurs","Square","Square","Squares","Squares","Station","Station","Stravenue","Stravenue","Stream","Stream","Street","Street","Streets","Summit","Summit","Terrace","Throughway","Trace","Track","Trafficway","Trail","Trail","Tunnel","Tunnel","Turnpike","Turnpike","Underpass","Union","Unions","Valley","Valleys","Via","Viaduct","View","Views","Village","Village","Villages","Ville","Vista","Vista","Walk","Walks","Wall","Way","Ways","Well","Wells"],"secondary_address":["Apt. ###","Suite ###"],"postcode":["#####","#####-####"],"state":["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],"state_abbr":["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY","AE","AA","AP"],"city":["#{city_prefix} #{Name.first_name}#{city_suffix}","#{city_prefix} #{Name.first_name}","#{Name.first_name}#{city_suffix}","#{Name.last_name}#{city_suffix}"],"street_name":["#{Name.first_name} #{street_suffix}","#{Name.last_name} #{street_suffix}"],"street_address":["#{building_number} #{street_name}"],"default_country":["United States of America"]},"company":{"suffix":["Inc","and Sons","LLC","Group"],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","assymetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} and #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","biz","info","name","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"first_name":["Aaliyah","Aaron","Abagail","Abbey","Abbie","Abbigail","Abby","Abdiel","Abdul","Abdullah","Abe","Abel","Abelardo","Abigail","Abigale","Abigayle","Abner","Abraham","Ada","Adah","Adalberto","Adaline","Adam","Adan","Addie","Addison","Adela","Adelbert","Adele","Adelia","Adeline","Adell","Adella","Adelle","Aditya","Adolf","Adolfo","Adolph","Adolphus","Adonis","Adrain","Adrian","Adriana","Adrianna","Adriel","Adrien","Adrienne","Afton","Aglae","Agnes","Agustin","Agustina","Ahmad","Ahmed","Aida","Aidan","Aiden","Aileen","Aimee","Aisha","Aiyana","Akeem","Al","Alaina","Alan","Alana","Alanis","Alanna","Alayna","Alba","Albert","Alberta","Albertha","Alberto","Albin","Albina","Alda","Alden","Alec","Aleen","Alejandra","Alejandrin","Alek","Alena","Alene","Alessandra","Alessandro","Alessia","Aletha","Alex","Alexa","Alexander","Alexandra","Alexandre","Alexandrea","Alexandria","Alexandrine","Alexandro","Alexane","Alexanne","Alexie","Alexis","Alexys","Alexzander","Alf","Alfonso","Alfonzo","Alford","Alfred","Alfreda","Alfredo","Ali","Alia","Alice","Alicia","Alisa","Alisha","Alison","Alivia","Aliya","Aliyah","Aliza","Alize","Allan","Allen","Allene","Allie","Allison","Ally","Alphonso","Alta","Althea","Alva","Alvah","Alvena","Alvera","Alverta","Alvina","Alvis","Alyce","Alycia","Alysa","Alysha","Alyson","Alysson","Amalia","Amanda","Amani","Amara","Amari","Amaya","Amber","Ambrose","Amelia","Amelie","Amely","America","Americo","Amie","Amina","Amir","Amira","Amiya","Amos","Amparo","Amy","Amya","Ana","Anabel","Anabelle","Anahi","Anais","Anastacio","Anastasia","Anderson","Andre","Andreane","Andreanne","Andres","Andrew","Andy","Angel","Angela","Angelica","Angelina","Angeline","Angelita","Angelo","Angie","Angus","Anibal","Anika","Anissa","Anita","Aniya","Aniyah","Anjali","Anna","Annabel","Annabell","Annabelle","Annalise","Annamae","Annamarie","Anne","Annetta","Annette","Annie","Ansel","Ansley","Anthony","Antoinette","Antone","Antonetta","Antonette","Antonia","Antonietta","Antonina","Antonio","Antwan","Antwon","Anya","April","Ara","Araceli","Aracely","Arch","Archibald","Ardella","Arden","Ardith","Arely","Ari","Ariane","Arianna","Aric","Ariel","Arielle","Arjun","Arlene","Arlie","Arlo","Armand","Armando","Armani","Arnaldo","Arne","Arno","Arnold","Arnoldo","Arnulfo","Aron","Art","Arthur","Arturo","Arvel","Arvid","Arvilla","Aryanna","Asa","Asha","Ashlee","Ashleigh","Ashley","Ashly","Ashlynn","Ashton","Ashtyn","Asia","Assunta","Astrid","Athena","Aubree","Aubrey","Audie","Audra","Audreanne","Audrey","August","Augusta","Augustine","Augustus","Aurelia","Aurelie","Aurelio","Aurore","Austen","Austin","Austyn","Autumn","Ava","Avery","Avis","Axel","Ayana","Ayden","Ayla","Aylin","Baby","Bailee","Bailey","Barbara","Barney","Baron","Barrett","Barry","Bart","Bartholome","Barton","Baylee","Beatrice","Beau","Beaulah","Bell","Bella","Belle","Ben","Benedict","Benjamin","Bennett","Bennie","Benny","Benton","Berenice","Bernadette","Bernadine","Bernard","Bernardo","Berneice","Bernhard","Bernice","Bernie","Berniece","Bernita","Berry","Bert","Berta","Bertha","Bertram","Bertrand","Beryl","Bessie","Beth","Bethany","Bethel","Betsy","Bette","Bettie","Betty","Bettye","Beulah","Beverly","Bianka","Bill","Billie","Billy","Birdie","Blair","Blaise","Blake","Blanca","Blanche","Blaze","Bo","Bobbie","Bobby","Bonita","Bonnie","Boris","Boyd","Brad","Braden","Bradford","Bradley","Bradly","Brady","Braeden","Brain","Brandi","Brando","Brandon","Brandt","Brandy","Brandyn","Brannon","Branson","Brant","Braulio","Braxton","Brayan","Breana","Breanna","Breanne","Brenda","Brendan","Brenden","Brendon","Brenna","Brennan","Brennon","Brent","Bret","Brett","Bria","Brian","Briana","Brianne","Brice","Bridget","Bridgette","Bridie","Brielle","Brigitte","Brionna","Brisa","Britney","Brittany","Brock","Broderick","Brody","Brook","Brooke","Brooklyn","Brooks","Brown","Bruce","Bryana","Bryce","Brycen","Bryon","Buck","Bud","Buddy","Buford","Bulah","Burdette","Burley","Burnice","Buster","Cade","Caden","Caesar","Caitlyn","Cale","Caleb","Caleigh","Cali","Calista","Callie","Camden","Cameron","Camila","Camilla","Camille","Camren","Camron","Camryn","Camylle","Candace","Candelario","Candice","Candida","Candido","Cara","Carey","Carissa","Carlee","Carleton","Carley","Carli","Carlie","Carlo","Carlos","Carlotta","Carmel","Carmela","Carmella","Carmelo","Carmen","Carmine","Carol","Carolanne","Carole","Carolina","Caroline","Carolyn","Carolyne","Carrie","Carroll","Carson","Carter","Cary","Casandra","Casey","Casimer","Casimir","Casper","Cassandra","Cassandre","Cassidy","Cassie","Catalina","Caterina","Catharine","Catherine","Cathrine","Cathryn","Cathy","Cayla","Ceasar","Cecelia","Cecil","Cecile","Cecilia","Cedrick","Celestine","Celestino","Celia","Celine","Cesar","Chad","Chadd","Chadrick","Chaim","Chance","Chandler","Chanel","Chanelle","Charity","Charlene","Charles","Charley","Charlie","Charlotte","Chase","Chasity","Chauncey","Chaya","Chaz","Chelsea","Chelsey","Chelsie","Chesley","Chester","Chet","Cheyanne","Cheyenne","Chloe","Chris","Christ","Christa","Christelle","Christian","Christiana","Christina","Christine","Christop","Christophe","Christopher","Christy","Chyna","Ciara","Cicero","Cielo","Cierra","Cindy","Citlalli","Clair","Claire","Clara","Clarabelle","Clare","Clarissa","Clark","Claud","Claude","Claudia","Claudie","Claudine","Clay","Clemens","Clement","Clementina","Clementine","Clemmie","Cleo","Cleora","Cleta","Cletus","Cleve","Cleveland","Clifford","Clifton","Clint","Clinton","Clotilde","Clovis","Cloyd","Clyde","Coby","Cody","Colby","Cole","Coleman","Colin","Colleen","Collin","Colt","Colten","Colton","Columbus","Concepcion","Conner","Connie","Connor","Conor","Conrad","Constance","Constantin","Consuelo","Cooper","Cora","Coralie","Corbin","Cordelia","Cordell","Cordia","Cordie","Corene","Corine","Cornelius","Cornell","Corrine","Cortez","Cortney","Cory","Coty","Courtney","Coy","Craig","Crawford","Creola","Cristal","Cristian","Cristina","Cristobal","Cristopher","Cruz","Crystal","Crystel","Cullen","Curt","Curtis","Cydney","Cynthia","Cyril","Cyrus","Dagmar","Dahlia","Daija","Daisha","Daisy","Dakota","Dale","Dallas","Dallin","Dalton","Damaris","Dameon","Damian","Damien","Damion","Damon","Dan","Dana","Dandre","Dane","D'angelo","Dangelo","Danial","Daniela","Daniella","Danielle","Danika","Dannie","Danny","Dante","Danyka","Daphne","Daphnee","Daphney","Darby","Daren","Darian","Dariana","Darien","Dario","Darion","Darius","Darlene","Daron","Darrel","Darrell","Darren","Darrick","Darrin","Darrion","Darron","Darryl","Darwin","Daryl","Dashawn","Dasia","Dave","David","Davin","Davion","Davon","Davonte","Dawn","Dawson","Dax","Dayana","Dayna","Dayne","Dayton","Dean","Deangelo","Deanna","Deborah","Declan","Dedric","Dedrick","Dee","Deion","Deja","Dejah","Dejon","Dejuan","Delaney","Delbert","Delfina","Delia","Delilah","Dell","Della","Delmer","Delores","Delpha","Delphia","Delphine","Delta","Demarco","Demarcus","Demario","Demetris","Demetrius","Demond","Dena","Denis","Dennis","Deon","Deondre","Deontae","Deonte","Dereck","Derek","Derick","Deron","Derrick","Deshaun","Deshawn","Desiree","Desmond","Dessie","Destany","Destin","Destinee","Destiney","Destini","Destiny","Devan","Devante","Deven","Devin","Devon","Devonte","Devyn","Dewayne","Dewitt","Dexter","Diamond","Diana","Dianna","Diego","Dillan","Dillon","Dimitri","Dina","Dino","Dion","Dixie","Dock","Dolly","Dolores","Domenic","Domenica","Domenick","Domenico","Domingo","Dominic","Dominique","Don","Donald","Donato","Donavon","Donna","Donnell","Donnie","Donny","Dora","Dorcas","Dorian","Doris","Dorothea","Dorothy","Dorris","Dortha","Dorthy","Doug","Douglas","Dovie","Doyle","Drake","Drew","Duane","Dudley","Dulce","Duncan","Durward","Dustin","Dusty","Dwight","Dylan","Earl","Earlene","Earline","Earnest","Earnestine","Easter","Easton","Ebba","Ebony","Ed","Eda","Edd","Eddie","Eden","Edgar","Edgardo","Edison","Edmond","Edmund","Edna","Eduardo","Edward","Edwardo","Edwin","Edwina","Edyth","Edythe","Effie","Efrain","Efren","Eileen","Einar","Eino","Eladio","Elaina","Elbert","Elda","Eldon","Eldora","Eldred","Eldridge","Eleanora","Eleanore","Eleazar","Electa","Elena","Elenor","Elenora","Eleonore","Elfrieda","Eli","Elian","Eliane","Elias","Eliezer","Elijah","Elinor","Elinore","Elisa","Elisabeth","Elise","Eliseo","Elisha","Elissa","Eliza","Elizabeth","Ella","Ellen","Ellie","Elliot","Elliott","Ellis","Ellsworth","Elmer","Elmira","Elmo","Elmore","Elna","Elnora","Elody","Eloisa","Eloise","Elouise","Eloy","Elroy","Elsa","Else","Elsie","Elta","Elton","Elva","Elvera","Elvie","Elvis","Elwin","Elwyn","Elyse","Elyssa","Elza","Emanuel","Emelia","Emelie","Emely","Emerald","Emerson","Emery","Emie","Emil","Emile","Emilia","Emiliano","Emilie","Emilio","Emily","Emma","Emmalee","Emmanuel","Emmanuelle","Emmet","Emmett","Emmie","Emmitt","Emmy","Emory","Ena","Enid","Enoch","Enola","Enos","Enrico","Enrique","Ephraim","Era","Eriberto","Eric","Erica","Erich","Erick","Ericka","Erik","Erika","Erin","Erling","Erna","Ernest","Ernestina","Ernestine","Ernesto","Ernie","Ervin","Erwin","Eryn","Esmeralda","Esperanza","Esta","Esteban","Estefania","Estel","Estell","Estella","Estelle","Estevan","Esther","Estrella","Etha","Ethan","Ethel","Ethelyn","Ethyl","Ettie","Eudora","Eugene","Eugenia","Eula","Eulah","Eulalia","Euna","Eunice","Eusebio","Eva","Evalyn","Evan","Evangeline","Evans","Eve","Eveline","Evelyn","Everardo","Everett","Everette","Evert","Evie","Ewald","Ewell","Ezekiel","Ezequiel","Ezra","Fabian","Fabiola","Fae","Fannie","Fanny","Fatima","Faustino","Fausto","Favian","Fay","Faye","Federico","Felicia","Felicita","Felicity","Felipa","Felipe","Felix","Felton","Fermin","Fern","Fernando","Ferne","Fidel","Filiberto","Filomena","Finn","Fiona","Flavie","Flavio","Fleta","Fletcher","Flo","Florence","Florencio","Florian","Florida","Florine","Flossie","Floy","Floyd","Ford","Forest","Forrest","Foster","Frances","Francesca","Francesco","Francis","Francisca","Francisco","Franco","Frank","Frankie","Franz","Fred","Freda","Freddie","Freddy","Frederic","Frederick","Frederik","Frederique","Fredrick","Fredy","Freeda","Freeman","Freida","Frida","Frieda","Friedrich","Fritz","Furman","Gabe","Gabriel","Gabriella","Gabrielle","Gaetano","Gage","Gail","Gardner","Garett","Garfield","Garland","Garnet","Garnett","Garret","Garrett","Garrick","Garrison","Garry","Garth","Gaston","Gavin","Gay","Gayle","Gaylord","Gene","General","Genesis","Genevieve","Gennaro","Genoveva","Geo","Geoffrey","George","Georgette","Georgiana","Georgianna","Geovanni","Geovanny","Geovany","Gerald","Geraldine","Gerard","Gerardo","Gerda","Gerhard","Germaine","German","Gerry","Gerson","Gertrude","Gia","Gianni","Gideon","Gilbert","Gilberto","Gilda","Giles","Gillian","Gina","Gino","Giovani","Giovanna","Giovanni","Giovanny","Gisselle","Giuseppe","Gladyce","Gladys","Glen","Glenda","Glenna","Glennie","Gloria","Godfrey","Golda","Golden","Gonzalo","Gordon","Grace","Gracie","Graciela","Grady","Graham","Grant","Granville","Grayce","Grayson","Green","Greg","Gregg","Gregoria","Gregorio","Gregory","Greta","Gretchen","Greyson","Griffin","Grover","Guadalupe","Gudrun","Guido","Guillermo","Guiseppe","Gunnar","Gunner","Gus","Gussie","Gust","Gustave","Guy","Gwen","Gwendolyn","Hadley","Hailee","Hailey","Hailie","Hal","Haleigh","Haley","Halie","Halle","Hallie","Hank","Hanna","Hannah","Hans","Hardy","Harley","Harmon","Harmony","Harold","Harrison","Harry","Harvey","Haskell","Hassan","Hassie","Hattie","Haven","Hayden","Haylee","Hayley","Haylie","Hazel","Hazle","Heath","Heather","Heaven","Heber","Hector","Heidi","Helen","Helena","Helene","Helga","Hellen","Helmer","Heloise","Henderson","Henri","Henriette","Henry","Herbert","Herman","Hermann","Hermina","Herminia","Herminio","Hershel","Herta","Hertha","Hester","Hettie","Hilario","Hilbert","Hilda","Hildegard","Hillard","Hillary","Hilma","Hilton","Hipolito","Hiram","Hobart","Holden","Hollie","Hollis","Holly","Hope","Horace","Horacio","Hortense","Hosea","Houston","Howard","Howell","Hoyt","Hubert","Hudson","Hugh","Hulda","Humberto","Hunter","Hyman","Ian","Ibrahim","Icie","Ida","Idell","Idella","Ignacio","Ignatius","Ike","Ila","Ilene","Iliana","Ima","Imani","Imelda","Immanuel","Imogene","Ines","Irma","Irving","Irwin","Isaac","Isabel","Isabell","Isabella","Isabelle","Isac","Isadore","Isai","Isaiah","Isaias","Isidro","Ismael","Isobel","Isom","Israel","Issac","Itzel","Iva","Ivah","Ivory","Ivy","Izabella","Izaiah","Jabari","Jace","Jacey","Jacinthe","Jacinto","Jack","Jackeline","Jackie","Jacklyn","Jackson","Jacky","Jaclyn","Jacquelyn","Jacques","Jacynthe","Jada","Jade","Jaden","Jadon","Jadyn","Jaeden","Jaida","Jaiden","Jailyn","Jaime","Jairo","Jakayla","Jake","Jakob","Jaleel","Jalen","Jalon","Jalyn","Jamaal","Jamal","Jamar","Jamarcus","Jamel","Jameson","Jamey","Jamie","Jamil","Jamir","Jamison","Jammie","Jan","Jana","Janae","Jane","Janelle","Janessa","Janet","Janice","Janick","Janie","Janis","Janiya","Jannie","Jany","Jaquan","Jaquelin","Jaqueline","Jared","Jaren","Jarod","Jaron","Jarred","Jarrell","Jarret","Jarrett","Jarrod","Jarvis","Jasen","Jasmin","Jason","Jasper","Jaunita","Javier","Javon","Javonte","Jay","Jayce","Jaycee","Jayda","Jayde","Jayden","Jaydon","Jaylan","Jaylen","Jaylin","Jaylon","Jayme","Jayne","Jayson","Jazlyn","Jazmin","Jazmyn","Jazmyne","Jean","Jeanette","Jeanie","Jeanne","Jed","Jedediah","Jedidiah","Jeff","Jefferey","Jeffery","Jeffrey","Jeffry","Jena","Jenifer","Jennie","Jennifer","Jennings","Jennyfer","Jensen","Jerad","Jerald","Jeramie","Jeramy","Jerel","Jeremie","Jeremy","Jermain","Jermaine","Jermey","Jerod","Jerome","Jeromy","Jerrell","Jerrod","Jerrold","Jerry","Jess","Jesse","Jessica","Jessie","Jessika","Jessy","Jessyca","Jesus","Jett","Jettie","Jevon","Jewel","Jewell","Jillian","Jimmie","Jimmy","Jo","Joan","Joana","Joanie","Joanne","Joannie","Joanny","Joany","Joaquin","Jocelyn","Jodie","Jody","Joe","Joel","Joelle","Joesph","Joey","Johan","Johann","Johanna","Johathan","John","Johnathan","Johnathon","Johnnie","Johnny","Johnpaul","Johnson","Jolie","Jon","Jonas","Jonatan","Jonathan","Jonathon","Jordan","Jordane","Jordi","Jordon","Jordy","Jordyn","Jorge","Jose","Josefa","Josefina","Joseph","Josephine","Josh","Joshua","Joshuah","Josiah","Josiane","Josianne","Josie","Josue","Jovan","Jovani","Jovanny","Jovany","Joy","Joyce","Juana","Juanita","Judah","Judd","Jude","Judge","Judson","Judy","Jules","Julia","Julian","Juliana","Julianne","Julie","Julien","Juliet","Julio","Julius","June","Junior","Junius","Justen","Justice","Justina","Justine","Juston","Justus","Justyn","Juvenal","Juwan","Kacey","Kaci","Kacie","Kade","Kaden","Kadin","Kaela","Kaelyn","Kaia","Kailee","Kailey","Kailyn","Kaitlin","Kaitlyn","Kale","Kaleb","Kaleigh","Kaley","Kali","Kallie","Kameron","Kamille","Kamren","Kamron","Kamryn","Kane","Kara","Kareem","Karelle","Karen","Kari","Kariane","Karianne","Karina","Karine","Karl","Karlee","Karley","Karli","Karlie","Karolann","Karson","Kasandra","Kasey","Kassandra","Katarina","Katelin","Katelyn","Katelynn","Katharina","Katherine","Katheryn","Kathleen","Kathlyn","Kathryn","Kathryne","Katlyn","Katlynn","Katrina","Katrine","Kattie","Kavon","Kay","Kaya","Kaycee","Kayden","Kayla","Kaylah","Kaylee","Kayleigh","Kayley","Kayli","Kaylie","Kaylin","Keagan","Keanu","Keara","Keaton","Keegan","Keeley","Keely","Keenan","Keira","Keith","Kellen","Kelley","Kelli","Kellie","Kelly","Kelsi","Kelsie","Kelton","Kelvin","Ken","Kendall","Kendra","Kendrick","Kenna","Kennedi","Kennedy","Kenneth","Kennith","Kenny","Kenton","Kenya","Kenyatta","Kenyon","Keon","Keshaun","Keshawn","Keven","Kevin","Kevon","Keyon","Keyshawn","Khalid","Khalil","Kian","Kiana","Kianna","Kiara","Kiarra","Kiel","Kiera","Kieran","Kiley","Kim","Kimberly","King","Kip","Kira","Kirk","Kirsten","Kirstin","Kitty","Kobe","Koby","Kody","Kolby","Kole","Korbin","Korey","Kory","Kraig","Kris","Krista","Kristian","Kristin","Kristina","Kristofer","Kristoffer","Kristopher","Kristy","Krystal","Krystel","Krystina","Kurt","Kurtis","Kyla","Kyle","Kylee","Kyleigh","Kyler","Kylie","Kyra","Lacey","Lacy","Ladarius","Lafayette","Laila","Laisha","Lamar","Lambert","Lamont","Lance","Landen","Lane","Laney","Larissa","Laron","Larry","Larue","Laura","Laurel","Lauren","Laurence","Lauretta","Lauriane","Laurianne","Laurie","Laurine","Laury","Lauryn","Lavada","Lavern","Laverna","Laverne","Lavina","Lavinia","Lavon","Lavonne","Lawrence","Lawson","Layla","Layne","Lazaro","Lea","Leann","Leanna","Leanne","Leatha","Leda","Lee","Leif","Leila","Leilani","Lela","Lelah","Leland","Lelia","Lempi","Lemuel","Lenna","Lennie","Lenny","Lenora","Lenore","Leo","Leola","Leon","Leonard","Leonardo","Leone","Leonel","Leonie","Leonor","Leonora","Leopold","Leopoldo","Leora","Lera","Lesley","Leslie","Lesly","Lessie","Lester","Leta","Letha","Letitia","Levi","Lew","Lewis","Lexi","Lexie","Lexus","Lia","Liam","Liana","Libbie","Libby","Lila","Lilian","Liliana","Liliane","Lilla","Lillian","Lilliana","Lillie","Lilly","Lily","Lilyan","Lina","Lincoln","Linda","Lindsay","Lindsey","Linnea","Linnie","Linwood","Lionel","Lisa","Lisandro","Lisette","Litzy","Liza","Lizeth","Lizzie","Llewellyn","Lloyd","Logan","Lois","Lola","Lolita","Loma","Lon","London","Lonie","Lonnie","Lonny","Lonzo","Lora","Loraine","Loren","Lorena","Lorenz","Lorenza","Lorenzo","Lori","Lorine","Lorna","Lottie","Lou","Louie","Louisa","Lourdes","Louvenia","Lowell","Loy","Loyal","Loyce","Lucas","Luciano","Lucie","Lucienne","Lucile","Lucinda","Lucio","Lucious","Lucius","Lucy","Ludie","Ludwig","Lue","Luella","Luigi","Luis","Luisa","Lukas","Lula","Lulu","Luna","Lupe","Lura","Lurline","Luther","Luz","Lyda","Lydia","Lyla","Lynn","Lyric","Lysanne","Mabel","Mabelle","Mable","Mac","Macey","Maci","Macie","Mack","Mackenzie","Macy","Madaline","Madalyn","Maddison","Madeline","Madelyn","Madelynn","Madge","Madie","Madilyn","Madisen","Madison","Madisyn","Madonna","Madyson","Mae","Maegan","Maeve","Mafalda","Magali","Magdalen","Magdalena","Maggie","Magnolia","Magnus","Maia","Maida","Maiya","Major","Makayla","Makenna","Makenzie","Malachi","Malcolm","Malika","Malinda","Mallie","Mallory","Malvina","Mandy","Manley","Manuel","Manuela","Mara","Marc","Marcel","Marcelina","Marcelino","Marcella","Marcelle","Marcellus","Marcelo","Marcia","Marco","Marcos","Marcus","Margaret","Margarete","Margarett","Margaretta","Margarette","Margarita","Marge","Margie","Margot","Margret","Marguerite","Maria","Mariah","Mariam","Marian","Mariana","Mariane","Marianna","Marianne","Mariano","Maribel","Marie","Mariela","Marielle","Marietta","Marilie","Marilou","Marilyne","Marina","Mario","Marion","Marisa","Marisol","Maritza","Marjolaine","Marjorie","Marjory","Mark","Markus","Marlee","Marlen","Marlene","Marley","Marlin","Marlon","Marques","Marquis","Marquise","Marshall","Marta","Martin","Martina","Martine","Marty","Marvin","Mary","Maryam","Maryjane","Maryse","Mason","Mateo","Mathew","Mathias","Mathilde","Matilda","Matilde","Matt","Matteo","Mattie","Maud","Maude","Maudie","Maureen","Maurice","Mauricio","Maurine","Maverick","Mavis","Max","Maxie","Maxime","Maximilian","Maximillia","Maximillian","Maximo","Maximus","Maxine","Maxwell","May","Maya","Maybell","Maybelle","Maye","Maymie","Maynard","Mayra","Mazie","Mckayla","Mckenna","Mckenzie","Meagan","Meaghan","Meda","Megane","Meggie","Meghan","Mekhi","Melany","Melba","Melisa","Melissa","Mellie","Melody","Melvin","Melvina","Melyna","Melyssa","Mercedes","Meredith","Merl","Merle","Merlin","Merritt","Mertie","Mervin","Meta","Mia","Micaela","Micah","Michael","Michaela","Michale","Micheal","Michel","Michele","Michelle","Miguel","Mikayla","Mike","Mikel","Milan","Miles","Milford","Miller","Millie","Milo","Milton","Mina","Minerva","Minnie","Miracle","Mireille","Mireya","Misael","Missouri","Misty","Mitchel","Mitchell","Mittie","Modesta","Modesto","Mohamed","Mohammad","Mohammed","Moises","Mollie","Molly","Mona","Monica","Monique","Monroe","Monserrat","Monserrate","Montana","Monte","Monty","Morgan","Moriah","Morris","Mortimer","Morton","Mose","Moses","Moshe","Mossie","Mozell","Mozelle","Muhammad","Muriel","Murl","Murphy","Murray","Mustafa","Mya","Myah","Mylene","Myles","Myra","Myriam","Myrl","Myrna","Myron","Myrtice","Myrtie","Myrtis","Myrtle","Nadia","Nakia","Name","Nannie","Naomi","Naomie","Napoleon","Narciso","Nash","Nasir","Nat","Natalia","Natalie","Natasha","Nathan","Nathanael","Nathanial","Nathaniel","Nathen","Nayeli","Neal","Ned","Nedra","Neha","Neil","Nelda","Nella","Nelle","Nellie","Nels","Nelson","Neoma","Nestor","Nettie","Neva","Newell","Newton","Nia","Nicholas","Nicholaus","Nichole","Nick","Nicklaus","Nickolas","Nico","Nicola","Nicolas","Nicole","Nicolette","Nigel","Nikita","Nikki","Nikko","Niko","Nikolas","Nils","Nina","Noah","Noble","Noe","Noel","Noelia","Noemi","Noemie","Noemy","Nola","Nolan","Nona","Nora","Norbert","Norberto","Norene","Norma","Norris","Norval","Norwood","Nova","Novella","Nya","Nyah","Nyasia","Obie","Oceane","Ocie","Octavia","Oda","Odell","Odessa","Odie","Ofelia","Okey","Ola","Olaf","Ole","Olen","Oleta","Olga","Olin","Oliver","Ollie","Oma","Omari","Omer","Ona","Onie","Opal","Ophelia","Ora","Oral","Oran","Oren","Orie","Orin","Orion","Orland","Orlando","Orlo","Orpha","Orrin","Orval","Orville","Osbaldo","Osborne","Oscar","Osvaldo","Oswald","Oswaldo","Otha","Otho","Otilia","Otis","Ottilie","Ottis","Otto","Ova","Owen","Ozella","Pablo","Paige","Palma","Pamela","Pansy","Paolo","Paris","Parker","Pascale","Pasquale","Pat","Patience","Patricia","Patrick","Patsy","Pattie","Paul","Paula","Pauline","Paxton","Payton","Pearl","Pearlie","Pearline","Pedro","Peggie","Penelope","Percival","Percy","Perry","Pete","Peter","Petra","Peyton","Philip","Phoebe","Phyllis","Pierce","Pierre","Pietro","Pink","Pinkie","Piper","Polly","Porter","Precious","Presley","Preston","Price","Prince","Princess","Priscilla","Providenci","Prudence","Queen","Queenie","Quentin","Quincy","Quinn","Quinten","Quinton","Rachael","Rachel","Rachelle","Rae","Raegan","Rafael","Rafaela","Raheem","Rahsaan","Rahul","Raina","Raleigh","Ralph","Ramiro","Ramon","Ramona","Randal","Randall","Randi","Randy","Ransom","Raoul","Raphael","Raphaelle","Raquel","Rashad","Rashawn","Rasheed","Raul","Raven","Ray","Raymond","Raymundo","Reagan","Reanna","Reba","Rebeca","Rebecca","Rebeka","Rebekah","Reece","Reed","Reese","Regan","Reggie","Reginald","Reid","Reilly","Reina","Reinhold","Remington","Rene","Renee","Ressie","Reta","Retha","Retta","Reuben","Reva","Rex","Rey","Reyes","Reymundo","Reyna","Reynold","Rhea","Rhett","Rhianna","Rhiannon","Rhoda","Ricardo","Richard","Richie","Richmond","Rick","Rickey","Rickie","Ricky","Rico","Rigoberto","Riley","Rita","River","Robb","Robbie","Robert","Roberta","Roberto","Robin","Robyn","Rocio","Rocky","Rod","Roderick","Rodger","Rodolfo","Rodrick","Rodrigo","Roel","Rogelio","Roger","Rogers","Rolando","Rollin","Roma","Romaine","Roman","Ron","Ronaldo","Ronny","Roosevelt","Rory","Rosa","Rosalee","Rosalia","Rosalind","Rosalinda","Rosalyn","Rosamond","Rosanna","Rosario","Roscoe","Rose","Rosella","Roselyn","Rosemarie","Rosemary","Rosendo","Rosetta","Rosie","Rosina","Roslyn","Ross","Rossie","Rowan","Rowena","Rowland","Roxane","Roxanne","Roy","Royal","Royce","Rozella","Ruben","Rubie","Ruby","Rubye","Rudolph","Rudy","Rupert","Russ","Russel","Russell","Rusty","Ruth","Ruthe","Ruthie","Ryan","Ryann","Ryder","Rylan","Rylee","Ryleigh","Ryley","Sabina","Sabrina","Sabryna","Sadie","Sadye","Sage","Saige","Sallie","Sally","Salma","Salvador","Salvatore","Sam","Samanta","Samantha","Samara","Samir","Sammie","Sammy","Samson","Sandra","Sandrine","Sandy","Sanford","Santa","Santiago","Santina","Santino","Santos","Sarah","Sarai","Sarina","Sasha","Saul","Savanah","Savanna","Savannah","Savion","Scarlett","Schuyler","Scot","Scottie","Scotty","Seamus","Sean","Sebastian","Sedrick","Selena","Selina","Selmer","Serena","Serenity","Seth","Shad","Shaina","Shakira","Shana","Shane","Shanel","Shanelle","Shania","Shanie","Shaniya","Shanna","Shannon","Shanny","Shanon","Shany","Sharon","Shaun","Shawn","Shawna","Shaylee","Shayna","Shayne","Shea","Sheila","Sheldon","Shemar","Sheridan","Sherman","Sherwood","Shirley","Shyann","Shyanne","Sibyl","Sid","Sidney","Sienna","Sierra","Sigmund","Sigrid","Sigurd","Silas","Sim","Simeon","Simone","Sincere","Sister","Skye","Skyla","Skylar","Sofia","Soledad","Solon","Sonia","Sonny","Sonya","Sophia","Sophie","Spencer","Stacey","Stacy","Stan","Stanford","Stanley","Stanton","Stefan","Stefanie","Stella","Stephan","Stephania","Stephanie","Stephany","Stephen","Stephon","Sterling","Steve","Stevie","Stewart","Stone","Stuart","Summer","Sunny","Susan","Susana","Susanna","Susie","Suzanne","Sven","Syble","Sydnee","Sydney","Sydni","Sydnie","Sylvan","Sylvester","Sylvia","Tabitha","Tad","Talia","Talon","Tamara","Tamia","Tania","Tanner","Tanya","Tara","Taryn","Tate","Tatum","Tatyana","Taurean","Tavares","Taya","Taylor","Teagan","Ted","Telly","Terence","Teresa","Terrance","Terrell","Terrence","Terrill","Terry","Tess","Tessie","Tevin","Thad","Thaddeus","Thalia","Thea","Thelma","Theo","Theodora","Theodore","Theresa","Therese","Theresia","Theron","Thomas","Thora","Thurman","Tia","Tiana","Tianna","Tiara","Tierra","Tiffany","Tillman","Timmothy","Timmy","Timothy","Tina","Tito","Titus","Tobin","Toby","Tod","Tom","Tomas","Tomasa","Tommie","Toney","Toni","Tony","Torey","Torrance","Torrey","Toy","Trace","Tracey","Tracy","Travis","Travon","Tre","Tremaine","Tremayne","Trent","Trenton","Tressa","Tressie","Treva","Trever","Trevion","Trevor","Trey","Trinity","Trisha","Tristian","Tristin","Triston","Troy","Trudie","Trycia","Trystan","Turner","Twila","Tyler","Tyra","Tyree","Tyreek","Tyrel","Tyrell","Tyrese","Tyrique","Tyshawn","Tyson","Ubaldo","Ulices","Ulises","Una","Unique","Urban","Uriah","Uriel","Ursula","Vada","Valentin","Valentina","Valentine","Valerie","Vallie","Van","Vance","Vanessa","Vaughn","Veda","Velda","Vella","Velma","Velva","Vena","Verda","Verdie","Vergie","Verla","Verlie","Vern","Verna","Verner","Vernice","Vernie","Vernon","Verona","Veronica","Vesta","Vicenta","Vicente","Vickie","Vicky","Victor","Victoria","Vida","Vidal","Vilma","Vince","Vincent","Vincenza","Vincenzo","Vinnie","Viola","Violet","Violette","Virgie","Virgil","Virginia","Virginie","Vita","Vito","Viva","Vivian","Viviane","Vivianne","Vivien","Vivienne","Vladimir","Wade","Waino","Waldo","Walker","Wallace","Walter","Walton","Wanda","Ward","Warren","Watson","Wava","Waylon","Wayne","Webster","Weldon","Wellington","Wendell","Wendy","Werner","Westley","Weston","Whitney","Wilber","Wilbert","Wilburn","Wiley","Wilford","Wilfred","Wilfredo","Wilfrid","Wilhelm","Wilhelmine","Will","Willa","Willard","William","Willie","Willis","Willow","Willy","Wilma","Wilmer","Wilson","Wilton","Winfield","Winifred","Winnifred","Winona","Winston","Woodrow","Wyatt","Wyman","Xander","Xavier","Xzavier","Yadira","Yasmeen","Yasmin","Yasmine","Yazmin","Yesenia","Yessenia","Yolanda","Yoshiko","Yvette","Yvonne","Zachariah","Zachary","Zachery","Zack","Zackary","Zackery","Zakary","Zander","Zane","Zaria","Zechariah","Zelda","Zella","Zelma","Zena","Zetta","Zion","Zita","Zoe","Zoey","Zoie","Zoila","Zola","Zora","Zula"],"last_name":["Abbott","Abernathy","Abshire","Adams","Altenwerth","Anderson","Ankunding","Armstrong","Auer","Aufderhar","Bahringer","Bailey","Balistreri","Barrows","Bartell","Bartoletti","Barton","Bashirian","Batz","Bauch","Baumbach","Bayer","Beahan","Beatty","Bechtelar","Becker","Bednar","Beer","Beier","Berge","Bergnaum","Bergstrom","Bernhard","Bernier","Bins","Blanda","Blick","Block","Bode","Boehm","Bogan","Bogisich","Borer","Bosco","Botsford","Boyer","Boyle","Bradtke","Brakus","Braun","Breitenberg","Brekke","Brown","Bruen","Buckridge","Carroll","Carter","Cartwright","Casper","Cassin","Champlin","Christiansen","Cole","Collier","Collins","Conn","Connelly","Conroy","Considine","Corkery","Cormier","Corwin","Cremin","Crist","Crona","Cronin","Crooks","Cruickshank","Cummerata","Cummings","Dach","D'Amore","Daniel","Dare","Daugherty","Davis","Deckow","Denesik","Dibbert","Dickens","Dicki","Dickinson","Dietrich","Donnelly","Dooley","Douglas","Doyle","DuBuque","Durgan","Ebert","Effertz","Eichmann","Emard","Emmerich","Erdman","Ernser","Fadel","Fahey","Farrell","Fay","Feeney","Feest","Feil","Ferry","Fisher","Flatley","Frami","Franecki","Friesen","Fritsch","Funk","Gaylord","Gerhold","Gerlach","Gibson","Gislason","Gleason","Gleichner","Glover","Goldner","Goodwin","Gorczany","Gottlieb","Goyette","Grady","Graham","Grant","Green","Greenfelder","Greenholt","Grimes","Gulgowski","Gusikowski","Gutkowski","Gutmann","Haag","Hackett","Hagenes","Hahn","Haley","Halvorson","Hamill","Hammes","Hand","Hane","Hansen","Harber","Harris","Hartmann","Harvey","Hauck","Hayes","Heaney","Heathcote","Hegmann","Heidenreich","Heller","Herman","Hermann","Hermiston","Herzog","Hessel","Hettinger","Hickle","Hilll","Hills","Hilpert","Hintz","Hirthe","Hodkiewicz","Hoeger","Homenick","Hoppe","Howe","Howell","Hudson","Huel","Huels","Hyatt","Jacobi","Jacobs","Jacobson","Jakubowski","Jaskolski","Jast","Jenkins","Jerde","Jewess","Johns","Johnson","Johnston","Jones","Kassulke","Kautzer","Keebler","Keeling","Kemmer","Kerluke","Kertzmann","Kessler","Kiehn","Kihn","Kilback","King","Kirlin","Klein","Kling","Klocko","Koch","Koelpin","Koepp","Kohler","Konopelski","Koss","Kovacek","Kozey","Krajcik","Kreiger","Kris","Kshlerin","Kub","Kuhic","Kuhlman","Kuhn","Kulas","Kunde","Kunze","Kuphal","Kutch","Kuvalis","Labadie","Lakin","Lang","Langosh","Langworth","Larkin","Larson","Leannon","Lebsack","Ledner","Leffler","Legros","Lehner","Lemke","Lesch","Leuschke","Lind","Lindgren","Littel","Little","Lockman","Lowe","Lubowitz","Lueilwitz","Luettgen","Lynch","Macejkovic","MacGyver","Maggio","Mann","Mante","Marks","Marquardt","Marvin","Mayer","Mayert","McClure","McCullough","McDermott","McGlynn","McKenzie","McLaughlin","Medhurst","Mertz","Metz","Miller","Mills","Mitchell","Moen","Mohr","Monahan","Moore","Morar","Morissette","Mosciski","Mraz","Mueller","Muller","Murazik","Murphy","Murray","Nader","Nicolas","Nienow","Nikolaus","Nitzsche","Nolan","Oberbrunner","O'Connell","O'Conner","O'Hara","O'Keefe","O'Kon","Okuneva","Olson","Ondricka","O'Reilly","Orn","Ortiz","Osinski","Pacocha","Padberg","Pagac","Parisian","Parker","Paucek","Pfannerstill","Pfeffer","Pollich","Pouros","Powlowski","Predovic","Price","Prohaska","Prosacco","Purdy","Quigley","Quitzon","Rath","Ratke","Rau","Raynor","Reichel","Reichert","Reilly","Reinger","Rempel","Renner","Reynolds","Rice","Rippin","Ritchie","Robel","Roberts","Rodriguez","Rogahn","Rohan","Rolfson","Romaguera","Roob","Rosenbaum","Rowe","Ruecker","Runolfsdottir","Runolfsson","Runte","Russel","Rutherford","Ryan","Sanford","Satterfield","Sauer","Sawayn","Schaden","Schaefer","Schamberger","Schiller","Schimmel","Schinner","Schmeler","Schmidt","Schmitt","Schneider","Schoen","Schowalter","Schroeder","Schulist","Schultz","Schumm","Schuppe","Schuster","Senger","Shanahan","Shields","Simonis","Sipes","Skiles","Smith","Smitham","Spencer","Spinka","Sporer","Stamm","Stanton","Stark","Stehr","Steuber","Stiedemann","Stokes","Stoltenberg","Stracke","Streich","Stroman","Strosin","Swaniawski","Swift","Terry","Thiel","Thompson","Tillman","Torp","Torphy","Towne","Toy","Trantow","Tremblay","Treutel","Tromp","Turcotte","Turner","Ullrich","Upton","Vandervort","Veum","Volkman","Von","VonRueden","Waelchi","Walker","Walsh","Walter","Ward","Waters","Watsica","Weber","Wehner","Weimann","Weissnat","Welch","West","White","Wiegand","Wilderman","Wilkinson","Will","Williamson","Willms","Windler","Wintheiser","Wisoky","Wisozk","Witting","Wiza","Wolf","Wolff","Wuckert","Wunsch","Wyman","Yost","Yundt","Zboncak","Zemlak","Ziemann","Zieme","Zulauf"],"prefix":["Mr.","Mrs.","Ms.","Miss","Dr."],"suffix":["Jr.","Sr.","I","II","III","IV","V","MD","DDS","PhD","DVM"],"title":{"descriptor":["Lead","Senior","Direct","Corporate","Dynamic","Future","Product","National","Regional","District","Central","Global","Customer","Investor","Dynamic","International","Legacy","Forward","Internal","Human","Chief","Principal"],"level":["Solutions","Program","Brand","Security","Research","Marketing","Directives","Implementation","Integration","Functionality","Response","Paradigm","Tactics","Identity","Markets","Group","Division","Applications","Optimization","Operations","Infrastructure","Intranet","Communications","Web","Branding","Quality","Assurance","Mobility","Accounts","Data","Creative","Configuration","Accountability","Interactions","Factors","Usability","Metrics"],"job":["Supervisor","Associate","Executive","Liason","Officer","Manager","Engineer","Specialist","Director","Coordinator","Administrator","Architect","Analyst","Designer","Planner","Orchestrator","Technician","Developer","Producer","Consultant","Assistant","Facilitator","Agent","Representative","Strategist"]},"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["###-###-####","(###)###-####","1-###-###-####","###.###.####","###-###-####","(###)###-####","1-###-###-####","###.###.####","###-###-#### x###","(###)###-#### x###","1-###-###-#### x###","###.###.#### x###","###-###-#### x####","(###)###-#### x####","1-###-###-#### x####","###.###.#### x####","###-###-#### x#####","(###)###-#### x#####","1-###-###-#### x#####","###.###.#### x#####"]}},"will_paginate":{"previous_label":"\u0026#8592; Previous","next_label":"Next \u0026#8594;","page_gap":"\u0026hellip;","page_entries_info":{"single_page":{"zero":"No %{model} found","one":"Displaying 1 %{model}","other":"Displaying all %{count} %{model}"},"single_page_html":{"zero":"No %{model} found","one":"Displaying \u003Cb\u003E1\u003C/b\u003E %{model}","other":"Displaying \u003Cb\u003Eall\u0026nbsp;%{count}\u003C/b\u003E %{model}"},"multi_page":"Displaying %{model} %{from} - %{to} of %{count} in total","multi_page_html":"Displaying %{model} \u003Cb\u003E%{from}\u0026nbsp;-\u0026nbsp;%{to}\u003C/b\u003E of \u003Cb\u003E%{count}\u003C/b\u003E in total"}},"hello":"Hello world"},"de-ch":{"faker":{"address":{"country_code":["CH","CH","CH","DE","AT","US","LI","US","HK","VN"],"postcode":["1###","2###","3###","4###","5###","6###","7###","8###","9###"],"default_country":["Schweiz"]},"company":{"suffix":["AG","GmbH","und Söhne","und Partner","\u0026 Co.","Gruppe","LLC","Inc."],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} und #{Name.last_name}"]},"internet":{"domain_suffix":["com","net","biz","ch","de","li","at","ch","ch"]},"phone_number":{"formats":["0800 ### ###","0800 ## ## ##","0## ### ## ##","0## ### ## ##","+41 ## ### ## ##","0900 ### ###","076 ### ## ##","+4178 ### ## ##","0041 79 ### ## ##"]}}},"de":{"faker":{"address":{"city_prefix":["Nord","Ost","West","Süd","Neu","Alt","Bad"],"city_suffix":["stadt","dorf","land","scheid","burg"],"country":["Ägypten","Äquatorialguinea","Äthiopien","Österreich","Afghanistan","Albanien","Algerien","Amerikanisch-Samoa","Amerikanische Jungferninseln","Andorra","Angola","Anguilla","Antarktis","Antigua und Barbuda","Argentinien","Armenien","Aruba","Aserbaidschan","Australien","Bahamas","Bahrain","Bangladesch","Barbados","Belarus","Belgien","Belize","Benin","die Bermudas","Bhutan","Bolivien","Bosnien und Herzegowina","Botsuana","Bouvetinsel","Brasilien","Britische Jungferninseln","Britisches Territorium im Indischen Ozean","Brunei Darussalam","Bulgarien","Burkina Faso","Burundi","Chile","China","Cookinseln","Costa Rica","Dänemark","Demokratische Republik Kongo","Demokratische Volksrepublik Korea","Deutschland","Dominica","Dominikanische Republik","Dschibuti","Ecuador","El Salvador","Eritrea","Estland","Färöer","Falklandinseln","Fidschi","Finnland","Frankreich","Französisch-Guayana","Französisch-Polynesien","Französische Gebiete im südlichen Indischen Ozean","Gabun","Gambia","Georgien","Ghana","Gibraltar","Grönland","Grenada","Griechenland","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Heard und McDonaldinseln","Honduras","Hongkong","Indien","Indonesien","Irak","Iran","Irland","Island","Israel","Italien","Jamaika","Japan","Jemen","Jordanien","Jugoslawien","Kaimaninseln","Kambodscha","Kamerun","Kanada","Kap Verde","Kasachstan","Katar","Kenia","Kirgisistan","Kiribati","Kleinere amerikanische Überseeinseln","Kokosinseln","Kolumbien","Komoren","Kongo","Kroatien","Kuba","Kuwait","Laos","Lesotho","Lettland","Libanon","Liberia","Libyen","Liechtenstein","Litauen","Luxemburg","Macau","Madagaskar","Malawi","Malaysia","Malediven","Mali","Malta","ehemalige jugoslawische Republik Mazedonien","Marokko","Marshallinseln","Martinique","Mauretanien","Mauritius","Mayotte","Mexiko","Mikronesien","Monaco","Mongolei","Montserrat","Mosambik","Myanmar","Nördliche Marianen","Namibia","Nauru","Nepal","Neukaledonien","Neuseeland","Nicaragua","Niederländische Antillen","Niederlande","Niger","Nigeria","Niue","Norfolkinsel","Norwegen","Oman","Osttimor","Pakistan","Palau","Panama","Papua-Neuguinea","Paraguay","Peru","Philippinen","Pitcairninseln","Polen","Portugal","Puerto Rico","Réunion","Republik Korea","Republik Moldau","Ruanda","Rumänien","Russische Föderation","São Tomé und Príncipe","Südafrika","Südgeorgien und Südliche Sandwichinseln","Salomonen","Sambia","Samoa","San Marino","Saudi-Arabien","Schweden","Schweiz","Senegal","Seychellen","Sierra Leone","Simbabwe","Singapur","Slowakei","Slowenien","Somalien","Spanien","Sri Lanka","St. Helena","St. Kitts und Nevis","St. Lucia","St. Pierre und Miquelon","St. Vincent und die Grenadinen","Sudan","Surinam","Svalbard und Jan Mayen","Swasiland","Syrien","Türkei","Tadschikistan","Taiwan","Tansania","Thailand","Togo","Tokelau","Tonga","Trinidad und Tobago","Tschad","Tschechische Republik","Tunesien","Turkmenistan","Turks- und Caicosinseln","Tuvalu","Uganda","Ukraine","Ungarn","Uruguay","Usbekistan","Vanuatu","Vatikanstadt","Venezuela","Vereinigte Arabische Emirate","Vereinigte Staaten","Vereinigtes Königreich","Vietnam","Wallis und Futuna","Weihnachtsinsel","Westsahara","Zentralafrikanische Republik","Zypern"],"street_root":["Ackerweg","Adalbert-Stifter-Str.","Adalbertstr.","Adolf-Baeyer-Str.","Adolf-Kaschny-Str.","Adolf-Reichwein-Str.","Adolfsstr.","Ahornweg","Ahrstr.","Akazienweg","Albert-Einstein-Str.","Albert-Schweitzer-Str.","Albertus-Magnus-Str.","Albert-Zarthe-Weg","Albin-Edelmann-Str.","Albrecht-Haushofer-Str.","Aldegundisstr.","Alexanderstr.","Alfred-Delp-Str.","Alfred-Kubin-Str.","Alfred-Stock-Str.","Alkenrather Str.","Allensteiner Str.","Alsenstr.","Alt Steinbücheler Weg","Alte Garten","Alte Heide","Alte Landstr.","Alte Ziegelei","Altenberger Str.","Altenhof","Alter Grenzweg","Altstadtstr.","Am Alten Gaswerk","Am Alten Schafstall","Am Arenzberg","Am Benthal","Am Birkenberg","Am Blauen Berg","Am Borsberg","Am Brungen","Am Büchelter Hof","Am Buttermarkt","Am Ehrenfriedhof","Am Eselsdamm","Am Falkenberg","Am Frankenberg","Am Gesundheitspark","Am Gierlichshof","Am Graben","Am Hagelkreuz","Am Hang","Am Heidkamp","Am Hemmelrather Hof","Am Hofacker","Am Hohen Ufer","Am Höllers Eck","Am Hühnerberg","Am Jägerhof","Am Junkernkamp","Am Kemperstiegel","Am Kettnersbusch","Am Kiesberg","Am Klösterchen","Am Knechtsgraben","Am Köllerweg","Am Köttersbach","Am Kreispark","Am Kronefeld","Am Küchenhof","Am Kühnsbusch","Am Lindenfeld","Am Märchen","Am Mittelberg","Am Mönchshof","Am Mühlenbach","Am Neuenhof","Am Nonnenbruch","Am Plattenbusch","Am Quettinger Feld","Am Rosenhügel","Am Sandberg","Am Scherfenbrand","Am Schokker","Am Silbersee","Am Sonnenhang","Am Sportplatz","Am Stadtpark","Am Steinberg","Am Telegraf","Am Thelenhof","Am Vogelkreuz","Am Vogelsang","Am Vogelsfeldchen","Am Wambacher Hof","Am Wasserturm","Am Weidenbusch","Am Weiher","Am Weingarten","Am Werth","Amselweg","An den Irlen","An den Rheinauen","An der Bergerweide","An der Dingbank","An der Evangelischen Kirche","An der Evgl. Kirche","An der Feldgasse","An der Fettehenne","An der Kante","An der Laach","An der Lehmkuhle","An der Lichtenburg","An der Luisenburg","An der Robertsburg","An der Schmitten","An der Schusterinsel","An der Steinrütsch","An St. Andreas","An St. Remigius","Andreasstr.","Ankerweg","Annette-Kolb-Str.","Apenrader Str.","Arnold-Ohletz-Str.","Atzlenbacher Str.","Auerweg","Auestr.","Auf dem Acker","Auf dem Blahnenhof","Auf dem Bohnbüchel","Auf dem Bruch","Auf dem End","Auf dem Forst","Auf dem Herberg","Auf dem Lehn","Auf dem Stein","Auf dem Weierberg","Auf dem Weiherhahn","Auf den Reien","Auf der Donnen","Auf der Grieße","Auf der Ohmer","Auf der Weide","Auf'm Berg","Auf'm Kamp","Augustastr.","August-Kekulé-Str.","A.-W.-v.-Hofmann-Str.","Bahnallee","Bahnhofstr.","Baltrumstr.","Bamberger Str.","Baumberger Str.","Bebelstr.","Beckers Kämpchen","Beerenstr.","Beethovenstr.","Behringstr.","Bendenweg","Bensberger Str.","Benzstr.","Bergische Landstr.","Bergstr.","Berliner Platz","Berliner Str.","Bernhard-Letterhaus-Str.","Bernhard-Lichtenberg-Str.","Bernhard-Ridder-Str.","Bernsteinstr.","Bertha-Middelhauve-Str.","Bertha-von-Suttner-Str.","Bertolt-Brecht-Str.","Berzeliusstr.","Bielertstr.","Biesenbach","Billrothstr.","Birkenbergstr.","Birkengartenstr.","Birkenweg","Bismarckstr.","Bitterfelder Str.","Blankenburg","Blaukehlchenweg","Blütenstr.","Boberstr.","Böcklerstr.","Bodelschwinghstr.","Bodestr.","Bogenstr.","Bohnenkampsweg","Bohofsweg","Bonifatiusstr.","Bonner Str.","Borkumstr.","Bornheimer Str.","Borsigstr.","Borussiastr.","Bracknellstr.","Brahmsweg","Brandenburger Str.","Breidenbachstr.","Breslauer Str.","Bruchhauser Str.","Brückenstr.","Brucknerstr.","Brüder-Bonhoeffer-Str.","Buchenweg","Bürgerbuschweg","Burgloch","Burgplatz","Burgstr.","Burgweg","Bürriger Weg","Burscheider Str.","Buschkämpchen","Butterheider Str.","Carl-Duisberg-Platz","Carl-Duisberg-Str.","Carl-Leverkus-Str.","Carl-Maria-von-Weber-Platz","Carl-Maria-von-Weber-Str.","Carlo-Mierendorff-Str.","Carl-Rumpff-Str.","Carl-von-Ossietzky-Str.","Charlottenburger Str.","Christian-Heß-Str.","Claasbruch","Clemens-Winkler-Str.","Concordiastr.","Cranachstr.","Dahlemer Str.","Daimlerstr.","Damaschkestr.","Danziger Str.","Debengasse","Dechant-Fein-Str.","Dechant-Krey-Str.","Deichtorstr.","Dhünnberg","Dhünnstr.","Dianastr.","Diedenhofener Str.","Diepental","Diepenthaler Str.","Dieselstr.","Dillinger Str.","Distelkamp","Dohrgasse","Domblick","Dönhoffstr.","Dornierstr.","Drachenfelsstr.","Dr.-August-Blank-Str.","Dresdener Str.","Driescher Hecke","Drosselweg","Dudweilerstr.","Dünenweg","Dünfelder Str.","Dünnwalder Grenzweg","Düppeler Str.","Dürerstr.","Dürscheider Weg","Düsseldorfer Str.","Edelrather Weg","Edmund-Husserl-Str.","Eduard-Spranger-Str.","Ehrlichstr.","Eichenkamp","Eichenweg","Eidechsenweg","Eifelstr.","Eifgenstr.","Eintrachtstr.","Elbestr.","Elisabeth-Langgässer-Str.","Elisabethstr.","Elisabeth-von-Thadden-Str.","Elisenstr.","Elsa-Brändström-Str.","Elsbachstr.","Else-Lasker-Schüler-Str.","Elsterstr.","Emil-Fischer-Str.","Emil-Nolde-Str.","Engelbertstr.","Engstenberger Weg","Entenpfuhl","Erbelegasse","Erftstr.","Erfurter Str.","Erich-Heckel-Str.","Erich-Klausener-Str.","Erich-Ollenhauer-Str.","Erlenweg","Ernst-Bloch-Str.","Ernst-Ludwig-Kirchner-Str.","Erzbergerstr.","Eschenallee","Eschenweg","Esmarchstr.","Espenweg","Euckenstr.","Eulengasse","Eulenkamp","Ewald-Flamme-Str.","Ewald-Röll-Str.","Fährstr.","Farnweg","Fasanenweg","Faßbacher Hof","Felderstr.","Feldkampstr.","Feldsiefer Weg","Feldsiefer Wiesen","Feldstr.","Feldtorstr.","Felix-von-Roll-Str.","Ferdinand-Lassalle-Str.","Fester Weg","Feuerbachstr.","Feuerdornweg","Fichtenweg","Fichtestr.","Finkelsteinstr.","Finkenweg","Fixheider Str.","Flabbenhäuschen","Flensburger Str.","Fliederweg","Florastr.","Florianweg","Flotowstr.","Flurstr.","Föhrenweg","Fontanestr.","Forellental","Fortunastr.","Franz-Esser-Str.","Franz-Hitze-Str.","Franz-Kail-Str.","Franz-Marc-Str.","Freiburger Str.","Freiheitstr.","Freiherr-vom-Stein-Str.","Freudenthal","Freudenthaler Weg","Fridtjof-Nansen-Str.","Friedenberger Str.","Friedensstr.","Friedhofstr.","Friedlandstr.","Friedlieb-Ferdinand-Runge-Str.","Friedrich-Bayer-Str.","Friedrich-Bergius-Platz","Friedrich-Ebert-Platz","Friedrich-Ebert-Str.","Friedrich-Engels-Str.","Friedrich-List-Str.","Friedrich-Naumann-Str.","Friedrich-Sertürner-Str.","Friedrichstr.","Friedrich-Weskott-Str.","Friesenweg","Frischenberg","Fritz-Erler-Str.","Fritz-Henseler-Str.","Fröbelstr.","Fürstenbergplatz","Fürstenbergstr.","Gabriele-Münter-Str.","Gartenstr.","Gebhardstr.","Geibelstr.","Gellertstr.","Georg-von-Vollmar-Str.","Gerhard-Domagk-Str.","Gerhart-Hauptmann-Str.","Gerichtsstr.","Geschwister-Scholl-Str.","Gezelinallee","Gierener Weg","Ginsterweg","Gisbert-Cremer-Str.","Glücksburger Str.","Gluckstr.","Gneisenaustr.","Goetheplatz","Goethestr.","Golo-Mann-Str.","Görlitzer Str.","Görresstr.","Graebestr.","Graf-Galen-Platz","Gregor-Mendel-Str.","Greifswalder Str.","Grillenweg","Gronenborner Weg","Große Kirchstr.","Grunder Wiesen","Grundermühle","Grundermühlenhof","Grundermühlenweg","Grüner Weg","Grunewaldstr.","Grünstr.","Günther-Weisenborn-Str.","Gustav-Freytag-Str.","Gustav-Heinemann-Str.","Gustav-Radbruch-Str.","Gut Reuschenberg","Gutenbergstr.","Haberstr.","Habichtgasse","Hafenstr.","Hagenauer Str.","Hahnenblecher","Halenseestr.","Halfenleimbach","Hallesche Str.","Halligstr.","Hamberger Str.","Hammerweg","Händelstr.","Hannah-Höch-Str.","Hans-Arp-Str.","Hans-Gerhard-Str.","Hans-Sachs-Str.","Hans-Schlehahn-Str.","Hans-von-Dohnanyi-Str.","Hardenbergstr.","Haselweg","Hauptstr.","Haus-Vorster-Str.","Hauweg","Havelstr.","Havensteinstr.","Haydnstr.","Hebbelstr.","Heckenweg","Heerweg","Hegelstr.","Heidberg","Heidehöhe","Heidestr.","Heimstättenweg","Heinrich-Böll-Str.","Heinrich-Brüning-Str.","Heinrich-Claes-Str.","Heinrich-Heine-Str.","Heinrich-Hörlein-Str.","Heinrich-Lübke-Str.","Heinrich-Lützenkirchen-Weg","Heinrichstr.","Heinrich-Strerath-Str.","Heinrich-von-Kleist-Str.","Heinrich-von-Stephan-Str.","Heisterbachstr.","Helenenstr.","Helmestr.","Hemmelrather Weg","Henry-T.-v.-Böttinger-Str.","Herderstr.","Heribertstr.","Hermann-Ehlers-Str.","Hermann-Hesse-Str.","Hermann-König-Str.","Hermann-Löns-Str.","Hermann-Milde-Str.","Hermann-Nörrenberg-Str.","Hermann-von-Helmholtz-Str.","Hermann-Waibel-Str.","Herzogstr.","Heymannstr.","Hindenburgstr.","Hirzenberg","Hitdorfer Kirchweg","Hitdorfer Str.","Höfer Mühle","Höfer Weg","Hohe Str.","Höhenstr.","Höltgestal","Holunderweg","Holzer Weg","Holzer Wiesen","Hornpottweg","Hubertusweg","Hufelandstr.","Hufer Weg","Humboldtstr.","Hummelsheim","Hummelweg","Humperdinckstr.","Hüscheider Gärten","Hüscheider Str.","Hütte","Ilmstr.","Im Bergischen Heim","Im Bruch","Im Buchenhain","Im Bühl","Im Burgfeld","Im Dorf","Im Eisholz","Im Friedenstal","Im Frohental","Im Grunde","Im Hederichsfeld","Im Jücherfeld","Im Kalkfeld","Im Kirberg","Im Kirchfeld","Im Kreuzbruch","Im Mühlenfeld","Im Nesselrader Kamp","Im Oberdorf","Im Oberfeld","Im Rosengarten","Im Rottland","Im Scheffengarten","Im Staderfeld","Im Steinfeld","Im Weidenblech","Im Winkel","Im Ziegelfeld","Imbach","Imbacher Weg","Immenweg","In den Blechenhöfen","In den Dehlen","In der Birkenau","In der Dasladen","In der Felderhütten","In der Hartmannswiese","In der Höhle","In der Schaafsdellen","In der Wasserkuhl","In der Wüste","In Holzhausen","Insterstr.","Jacob-Fröhlen-Str.","Jägerstr.","Jahnstr.","Jakob-Eulenberg-Weg","Jakobistr.","Jakob-Kaiser-Str.","Jenaer Str.","Johannes-Baptist-Str.","Johannes-Dott-Str.","Johannes-Popitz-Str.","Johannes-Wislicenus-Str.","Johannisburger Str.","Johann-Janssen-Str.","Johann-Wirtz-Weg","Josefstr.","Jüch","Julius-Doms-Str.","Julius-Leber-Str.","Kaiserplatz","Kaiserstr.","Kaiser-Wilhelm-Allee","Kalkstr.","Kämpchenstr.","Kämpenwiese","Kämper Weg","Kamptalweg","Kanalstr.","Kandinskystr.","Kantstr.","Kapellenstr.","Karl-Arnold-Str.","Karl-Bosch-Str.","Karl-Bückart-Str.","Karl-Carstens-Ring","Karl-Friedrich-Goerdeler-Str.","Karl-Jaspers-Str.","Karl-König-Str.","Karl-Krekeler-Str.","Karl-Marx-Str.","Karlstr.","Karl-Ulitzka-Str.","Karl-Wichmann-Str.","Karl-Wingchen-Str.","Käsenbrod","Käthe-Kollwitz-Str.","Katzbachstr.","Kerschensteinerstr.","Kiefernweg","Kieler Str.","Kieselstr.","Kiesweg","Kinderhausen","Kleiberweg","Kleine Kirchstr.","Kleingansweg","Kleinheider Weg","Klief","Kneippstr.","Knochenbergsweg","Kochergarten","Kocherstr.","Kockelsberg","Kolberger Str.","Kolmarer Str.","Kölner Gasse","Kölner Str.","Kolpingstr.","Königsberger Platz","Konrad-Adenauer-Platz","Köpenicker Str.","Kopernikusstr.","Körnerstr.","Köschenberg","Köttershof","Kreuzbroicher Str.","Kreuzkamp","Krummer Weg","Kruppstr.","Kuhlmannweg","Kump","Kumper Weg","Kunstfeldstr.","Küppersteger Str.","Kursiefen","Kursiefer Weg","Kurtekottenweg","Kurt-Schumacher-Ring","Kyllstr.","Langenfelder Str.","Längsleimbach","Lärchenweg","Legienstr.","Lehner Mühle","Leichlinger Str.","Leimbacher Hof","Leinestr.","Leineweberstr.","Leipziger Str.","Lerchengasse","Lessingstr.","Libellenweg","Lichstr.","Liebigstr.","Lindenstr.","Lingenfeld","Linienstr.","Lippe","Löchergraben","Löfflerstr.","Loheweg","Lohrbergstr.","Lohrstr.","Löhstr.","Lortzingstr.","Lötzener Str.","Löwenburgstr.","Lucasstr.","Ludwig-Erhard-Platz","Ludwig-Girtler-Str.","Ludwig-Knorr-Str.","Luisenstr.","Lupinenweg","Lurchenweg","Lützenkirchener Str.","Lycker Str.","Maashofstr.","Manforter Str.","Marc-Chagall-Str.","Maria-Dresen-Str.","Maria-Terwiel-Str.","Marie-Curie-Str.","Marienburger Str.","Mariendorfer Str.","Marienwerderstr.","Marie-Schlei-Str.","Marktplatz","Markusweg","Martin-Buber-Str.","Martin-Heidegger-Str.","Martin-Luther-Str.","Masurenstr.","Mathildenweg","Maurinusstr.","Mauspfad","Max-Beckmann-Str.","Max-Delbrück-Str.","Max-Ernst-Str.","Max-Holthausen-Platz","Max-Horkheimer-Str.","Max-Liebermann-Str.","Max-Pechstein-Str.","Max-Planck-Str.","Max-Scheler-Str.","Max-Schönenberg-Str.","Maybachstr.","Meckhofer Feld","Meisenweg","Memelstr.","Menchendahler Str.","Mendelssohnstr.","Merziger Str.","Mettlacher Str.","Metzer Str.","Michaelsweg","Miselohestr.","Mittelstr.","Mohlenstr.","Moltkestr.","Monheimer Str.","Montanusstr.","Montessoriweg","Moosweg","Morsbroicher Str.","Moselstr.","Moskauer Str.","Mozartstr.","Mühlenweg","Muhrgasse","Muldestr.","Mülhausener Str.","Mülheimer Str.","Münsters Gäßchen","Münzstr.","Müritzstr.","Myliusstr.","Nachtigallenweg","Nauener Str.","Neißestr.","Nelly-Sachs-Str.","Netzestr.","Neuendriesch","Neuenhausgasse","Neuenkamp","Neujudenhof","Neukronenberger Str.","Neustadtstr.","Nicolai-Hartmann-Str.","Niederblecher","Niederfeldstr.","Nietzschestr.","Nikolaus-Groß-Str.","Nobelstr.","Norderneystr.","Nordstr.","Ober dem Hof","Obere Lindenstr.","Obere Str.","Oberölbach","Odenthaler Str.","Oderstr.","Okerstr.","Olof-Palme-Str.","Ophovener Str.","Opladener Platz","Opladener Str.","Ortelsburger Str.","Oskar-Moll-Str.","Oskar-Schlemmer-Str.","Oststr.","Oswald-Spengler-Str.","Otto-Dix-Str.","Otto-Grimm-Str.","Otto-Hahn-Str.","Otto-Müller-Str.","Otto-Stange-Str.","Ottostr.","Otto-Varnhagen-Str.","Otto-Wels-Str.","Ottweilerstr.","Oulustr.","Overfeldweg","Pappelweg","Paracelsusstr.","Parkstr.","Pastor-Louis-Str.","Pastor-Scheibler-Str.","Pastorskamp","Paul-Klee-Str.","Paul-Löbe-Str.","Paulstr.","Peenestr.","Pescher Busch","Peschstr.","Pestalozzistr.","Peter-Grieß-Str.","Peter-Joseph-Lenné-Str.","Peter-Neuenheuser-Str.","Petersbergstr.","Peterstr.","Pfarrer-Jekel-Str.","Pfarrer-Klein-Str.","Pfarrer-Röhr-Str.","Pfeilshofstr.","Philipp-Ott-Str.","Piet-Mondrian-Str.","Platanenweg","Pommernstr.","Porschestr.","Poststr.","Potsdamer Str.","Pregelstr.","Prießnitzstr.","Pützdelle","Quarzstr.","Quettinger Str.","Rat-Deycks-Str.","Rathenaustr.","Ratherkämp","Ratiborer Str.","Raushofstr.","Regensburger Str.","Reinickendorfer Str.","Renkgasse","Rennbaumplatz","Rennbaumstr.","Reuschenberger Str.","Reusrather Str.","Reuterstr.","Rheinallee","Rheindorfer Str.","Rheinstr.","Rhein-Wupper-Platz","Richard-Wagner-Str.","Rilkestr.","Ringstr.","Robert-Blum-Str.","Robert-Koch-Str.","Robert-Medenwald-Str.","Rolandstr.","Romberg","Röntgenstr.","Roonstr.","Ropenstall","Ropenstaller Weg","Rosenthal","Rostocker Str.","Rotdornweg","Röttgerweg","Rückertstr.","Rudolf-Breitscheid-Str.","Rudolf-Mann-Platz","Rudolf-Stracke-Str.","Ruhlachplatz","Ruhlachstr.","Rüttersweg","Saalestr.","Saarbrücker Str.","Saarlauterner Str.","Saarstr.","Salamanderweg","Samlandstr.","Sanddornstr.","Sandstr.","Sauerbruchstr.","Schäfershütte","Scharnhorststr.","Scheffershof","Scheidemannstr.","Schellingstr.","Schenkendorfstr.","Schießbergstr.","Schillerstr.","Schlangenhecke","Schlebuscher Heide","Schlebuscher Str.","Schlebuschrath","Schlehdornstr.","Schleiermacherstr.","Schloßstr.","Schmalenbruch","Schnepfenflucht","Schöffenweg","Schöllerstr.","Schöne Aussicht","Schöneberger Str.","Schopenhauerstr.","Schubertplatz","Schubertstr.","Schulberg","Schulstr.","Schumannstr.","Schwalbenweg","Schwarzastr.","Sebastianusweg","Semmelweisstr.","Siebelplatz","Siemensstr.","Solinger Str.","Sonderburger Str.","Spandauer Str.","Speestr.","Sperberweg","Sperlingsweg","Spitzwegstr.","Sporrenberger Mühle","Spreestr.","St. Ingberter Str.","Starenweg","Stauffenbergstr.","Stefan-Zweig-Str.","Stegerwaldstr.","Steglitzer Str.","Steinbücheler Feld","Steinbücheler Str.","Steinstr.","Steinweg","Stephan-Lochner-Str.","Stephanusstr.","Stettiner Str.","Stixchesstr.","Stöckenstr.","Stralsunder Str.","Straßburger Str.","Stresemannplatz","Strombergstr.","Stromstr.","Stüttekofener Str.","Sudestr.","Sürderstr.","Syltstr.","Talstr.","Tannenbergstr.","Tannenweg","Taubenweg","Teitscheider Weg","Telegrafenstr.","Teltower Str.","Tempelhofer Str.","Theodor-Adorno-Str.","Theodor-Fliedner-Str.","Theodor-Gierath-Str.","Theodor-Haubach-Str.","Theodor-Heuss-Ring","Theodor-Storm-Str.","Theodorstr.","Thomas-Dehler-Str.","Thomas-Morus-Str.","Thomas-von-Aquin-Str.","Tönges Feld","Torstr.","Treptower Str.","Treuburger Str.","Uhlandstr.","Ulmenweg","Ulmer Str.","Ulrichstr.","Ulrich-von-Hassell-Str.","Umlag","Unstrutstr.","Unter dem Schildchen","Unterölbach","Unterstr.","Uppersberg","Van\\'t-Hoff-Str.","Veit-Stoß-Str.","Vereinsstr.","Viktor-Meyer-Str.","Vincent-van-Gogh-Str.","Virchowstr.","Voigtslach","Volhardstr.","Völklinger Str.","Von-Brentano-Str.","Von-Diergardt-Str.","Von-Eichendorff-Str.","Von-Ketteler-Str.","Von-Knoeringen-Str.","Von-Pettenkofer-Str.","Von-Siebold-Str.","Wacholderweg","Waldstr.","Walter-Flex-Str.","Walter-Hempel-Str.","Walter-Hochapfel-Str.","Walter-Nernst-Str.","Wannseestr.","Warnowstr.","Warthestr.","Weddigenstr.","Weichselstr.","Weidenstr.","Weidfeldstr.","Weiherfeld","Weiherstr.","Weinhäuser Str.","Weißdornweg","Weißenseestr.","Weizkamp","Werftstr.","Werkstättenstr.","Werner-Heisenberg-Str.","Werrastr.","Weyerweg","Widdauener Str.","Wiebertshof","Wiehbachtal","Wiembachallee","Wiesdorfer Platz","Wiesenstr.","Wilhelm-Busch-Str.","Wilhelm-Hastrich-Str.","Wilhelm-Leuschner-Str.","Wilhelm-Liebknecht-Str.","Wilhelmsgasse","Wilhelmstr.","Willi-Baumeister-Str.","Willy-Brandt-Ring","Winand-Rossi-Str.","Windthorststr.","Winkelweg","Winterberg","Wittenbergstr.","Wolf-Vostell-Str.","Wolkenburgstr.","Wupperstr.","Wuppertalstr.","Wüstenhof","Yitzhak-Rabin-Str.","Zauberkuhle","Zedernweg","Zehlendorfer Str.","Zehntenweg","Zeisigweg","Zeppelinstr.","Zschopaustr.","Zum Claashäuschen","Zündhütchenweg","Zur Alten Brauerei","Zur alten Fabrik"],"building_number":["###","##","#","##a","##b","##c"],"secondary_address":["Apt. ###","Zimmer ###","# OG"],"postcode":["#####","#####"],"state":["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"],"state_abbr":["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"],"city":["#{city_prefix} #{Name.first_name}#{city_suffix}","#{city_prefix} #{Name.first_name}","#{Name.first_name}#{city_suffix}","#{Name.last_name}#{city_suffix}"],"street_name":["#{street_root}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Deutschland"]},"company":{"suffix":["GmbH","AG","Gruppe","KG","GmbH \u0026 Co. KG","UG","OHG"],"legal_form":["GmbH","AG","Gruppe","KG","GmbH \u0026 Co. KG","UG","OHG"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} und #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","info","name","net","org","de","ch"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"]},"name":{"first_name":["Aaron","Abdul","Abdullah","Adam","Adrian","Adriano","Ahmad","Ahmed","Ahmet","Alan","Albert","Alessandro","Alessio","Alex","Alexander","Alfred","Ali","Amar","Amir","Amon","Andre","Andreas","Andrew","Angelo","Ansgar","Anthony","Anton","Antonio","Arda","Arian","Armin","Arne","Arno","Arthur","Artur","Arved","Arvid","Ayman","Baran","Baris","Bastian","Batuhan","Bela","Ben","Benedikt","Benjamin","Bennet","Bennett","Benno","Bent","Berat","Berkay","Bernd","Bilal","Bjarne","Björn","Bo","Boris","Brandon","Brian","Bruno","Bryan","Burak","Calvin","Can","Carl","Carlo","Carlos","Caspar","Cedric","Cedrik","Cem","Charlie","Chris","Christian","Christiano","Christoph","Christopher","Claas","Clemens","Colin","Collin","Conner","Connor","Constantin","Corvin","Curt","Damian","Damien","Daniel","Danilo","Danny","Darian","Dario","Darius","Darren","David","Davide","Davin","Dean","Deniz","Dennis","Denny","Devin","Diego","Dion","Domenic","Domenik","Dominic","Dominik","Dorian","Dustin","Dylan","Ecrin","Eddi","Eddy","Edgar","Edwin","Efe","Ege","Elia","Eliah","Elias","Elijah","Emanuel","Emil","Emilian","Emilio","Emir","Emirhan","Emre","Enes","Enno","Enrico","Eren","Eric","Erik","Etienne","Fabian","Fabien","Fabio","Fabrice","Falk","Felix","Ferdinand","Fiete","Filip","Finlay","Finley","Finn","Finnley","Florian","Francesco","Franz","Frederic","Frederick","Frederik","Friedrich","Fritz","Furkan","Fynn","Gabriel","Georg","Gerrit","Gian","Gianluca","Gino","Giuliano","Giuseppe","Gregor","Gustav","Hagen","Hamza","Hannes","Hanno","Hans","Hasan","Hassan","Hauke","Hendrik","Hennes","Henning","Henri","Henrick","Henrik","Henry","Hugo","Hussein","Ian","Ibrahim","Ilias","Ilja","Ilyas","Immanuel","Ismael","Ismail","Ivan","Iven","Jack","Jacob","Jaden","Jakob","Jamal","James","Jamie","Jan","Janek","Janis","Janne","Jannek","Jannes","Jannik","Jannis","Jano","Janosch","Jared","Jari","Jarne","Jarno","Jaron","Jason","Jasper","Jay","Jayden","Jayson","Jean","Jens","Jeremias","Jeremie","Jeremy","Jermaine","Jerome","Jesper","Jesse","Jim","Jimmy","Joe","Joel","Joey","Johann","Johannes","John","Johnny","Jon","Jona","Jonah","Jonas","Jonathan","Jonte","Joost","Jordan","Joris","Joscha","Joschua","Josef","Joseph","Josh","Joshua","Josua","Juan","Julian","Julien","Julius","Juri","Justin","Justus","Kaan","Kai","Kalle","Karim","Karl","Karlo","Kay","Keanu","Kenan","Kenny","Keno","Kerem","Kerim","Kevin","Kian","Kilian","Kim","Kimi","Kjell","Klaas","Klemens","Konrad","Konstantin","Koray","Korbinian","Kurt","Lars","Lasse","Laurence","Laurens","Laurenz","Laurin","Lean","Leander","Leandro","Leif","Len","Lenn","Lennard","Lennart","Lennert","Lennie","Lennox","Lenny","Leo","Leon","Leonard","Leonardo","Leonhard","Leonidas","Leopold","Leroy","Levent","Levi","Levin","Lewin","Lewis","Liam","Lian","Lias","Lino","Linus","Lio","Lion","Lionel","Logan","Lorenz","Lorenzo","Loris","Louis","Luan","Luc","Luca","Lucas","Lucian","Lucien","Ludwig","Luis","Luiz","Luk","Luka","Lukas","Luke","Lutz","Maddox","Mads","Magnus","Maik","Maksim","Malik","Malte","Manuel","Marc","Marcel","Marco","Marcus","Marek","Marian","Mario","Marius","Mark","Marko","Markus","Marlo","Marlon","Marten","Martin","Marvin","Marwin","Mateo","Mathis","Matis","Mats","Matteo","Mattes","Matthias","Matthis","Matti","Mattis","Maurice","Max","Maxim","Maximilian","Mehmet","Meik","Melvin","Merlin","Mert","Michael","Michel","Mick","Miguel","Mika","Mikail","Mike","Milan","Milo","Mio","Mirac","Mirco","Mirko","Mohamed","Mohammad","Mohammed","Moritz","Morten","Muhammed","Murat","Mustafa","Nathan","Nathanael","Nelson","Neo","Nevio","Nick","Niclas","Nico","Nicolai","Nicolas","Niels","Nikita","Niklas","Niko","Nikolai","Nikolas","Nils","Nino","Noah","Noel","Norman","Odin","Oke","Ole","Oliver","Omar","Onur","Oscar","Oskar","Pascal","Patrice","Patrick","Paul","Peer","Pepe","Peter","Phil","Philip","Philipp","Pierre","Piet","Pit","Pius","Quentin","Quirin","Rafael","Raik","Ramon","Raphael","Rasmus","Raul","Rayan","René","Ricardo","Riccardo","Richard","Rick","Rico","Robert","Robin","Rocco","Roman","Romeo","Ron","Ruben","Ryan","Said","Salih","Sam","Sami","Sammy","Samuel","Sandro","Santino","Sascha","Sean","Sebastian","Selim","Semih","Shawn","Silas","Simeon","Simon","Sinan","Sky","Stefan","Steffen","Stephan","Steve","Steven","Sven","Sönke","Sören","Taha","Tamino","Tammo","Tarik","Tayler","Taylor","Teo","Theo","Theodor","Thies","Thilo","Thomas","Thorben","Thore","Thorge","Tiago","Til","Till","Tillmann","Tim","Timm","Timo","Timon","Timothy","Tino","Titus","Tizian","Tjark","Tobias","Tom","Tommy","Toni","Tony","Torben","Tore","Tristan","Tyler","Tyron","Umut","Valentin","Valentino","Veit","Victor","Viktor","Vin","Vincent","Vito","Vitus","Wilhelm","Willi","William","Willy","Xaver","Yannic","Yannick","Yannik","Yannis","Yasin","Youssef","Yunus","Yusuf","Yven","Yves","Ömer","Aaliyah","Abby","Abigail","Ada","Adelina","Adriana","Aileen","Aimee","Alana","Alea","Alena","Alessa","Alessia","Alexa","Alexandra","Alexia","Alexis","Aleyna","Alia","Alica","Alice","Alicia","Alina","Alisa","Alisha","Alissa","Aliya","Aliyah","Allegra","Alma","Alyssa","Amalia","Amanda","Amelia","Amelie","Amina","Amira","Amy","Ana","Anabel","Anastasia","Andrea","Angela","Angelina","Angelique","Anja","Ann","Anna","Annabel","Annabell","Annabelle","Annalena","Anne","Anneke","Annelie","Annemarie","Anni","Annie","Annika","Anny","Anouk","Antonia","Arda","Ariana","Ariane","Arwen","Ashley","Asya","Aurelia","Aurora","Ava","Ayleen","Aylin","Ayse","Azra","Betty","Bianca","Bianka","Caitlin","Cara","Carina","Carla","Carlotta","Carmen","Carolin","Carolina","Caroline","Cassandra","Catharina","Catrin","Cecile","Cecilia","Celia","Celina","Celine","Ceyda","Ceylin","Chantal","Charleen","Charlotta","Charlotte","Chayenne","Cheyenne","Chiara","Christin","Christina","Cindy","Claire","Clara","Clarissa","Colleen","Collien","Cora","Corinna","Cosima","Dana","Daniela","Daria","Darleen","Defne","Delia","Denise","Diana","Dilara","Dina","Dorothea","Ecrin","Eda","Eileen","Ela","Elaine","Elanur","Elea","Elena","Eleni","Eleonora","Eliana","Elif","Elina","Elisa","Elisabeth","Ella","Ellen","Elli","Elly","Elsa","Emelie","Emely","Emilia","Emilie","Emily","Emma","Emmely","Emmi","Emmy","Enie","Enna","Enya","Esma","Estelle","Esther","Eva","Evelin","Evelina","Eveline","Evelyn","Fabienne","Fatima","Fatma","Felicia","Felicitas","Felina","Femke","Fenja","Fine","Finia","Finja","Finnja","Fiona","Flora","Florentine","Francesca","Franka","Franziska","Frederike","Freya","Frida","Frieda","Friederike","Giada","Gina","Giulia","Giuliana","Greta","Hailey","Hana","Hanna","Hannah","Heidi","Helen","Helena","Helene","Helin","Henriette","Henrike","Hermine","Ida","Ilayda","Imke","Ina","Ines","Inga","Inka","Irem","Isa","Isabel","Isabell","Isabella","Isabelle","Ivonne","Jacqueline","Jamie","Jamila","Jana","Jane","Janin","Janina","Janine","Janna","Janne","Jara","Jasmin","Jasmina","Jasmine","Jella","Jenna","Jennifer","Jenny","Jessica","Jessy","Jette","Jil","Jill","Joana","Joanna","Joelina","Joeline","Joelle","Johanna","Joleen","Jolie","Jolien","Jolin","Jolina","Joline","Jona","Jonah","Jonna","Josefin","Josefine","Josephin","Josephine","Josie","Josy","Joy","Joyce","Judith","Judy","Jule","Julia","Juliana","Juliane","Julie","Julienne","Julika","Julina","Juna","Justine","Kaja","Karina","Karla","Karlotta","Karolina","Karoline","Kassandra","Katarina","Katharina","Kathrin","Katja","Katrin","Kaya","Kayra","Kiana","Kiara","Kim","Kimberley","Kimberly","Kira","Klara","Korinna","Kristin","Kyra","Laila","Lana","Lara","Larissa","Laura","Laureen","Lavinia","Lea","Leah","Leana","Leandra","Leann","Lee","Leila","Lena","Lene","Leni","Lenia","Lenja","Lenya","Leona","Leoni","Leonie","Leonora","Leticia","Letizia","Levke","Leyla","Lia","Liah","Liana","Lili","Lilia","Lilian","Liliana","Lilith","Lilli","Lillian","Lilly","Lily","Lina","Linda","Lindsay","Line","Linn","Linnea","Lisa","Lisann","Lisanne","Liv","Livia","Liz","Lola","Loreen","Lorena","Lotta","Lotte","Louisa","Louise","Luana","Luca","Lucia","Lucie","Lucienne","Lucy","Luisa","Luise","Luka","Luna","Luzie","Lya","Lydia","Lyn","Lynn","Madeleine","Madita","Madleen","Madlen","Magdalena","Maike","Mailin","Maira","Maja","Malena","Malia","Malin","Malina","Mandy","Mara","Marah","Mareike","Maren","Maria","Mariam","Marie","Marieke","Mariella","Marika","Marina","Marisa","Marissa","Marit","Marla","Marleen","Marlen","Marlena","Marlene","Marta","Martha","Mary","Maryam","Mathilda","Mathilde","Matilda","Maxi","Maxima","Maxine","Maya","Mayra","Medina","Medine","Meike","Melanie","Melek","Melike","Melina","Melinda","Melis","Melisa","Melissa","Merle","Merve","Meryem","Mette","Mia","Michaela","Michelle","Mieke","Mila","Milana","Milena","Milla","Mina","Mira","Miray","Miriam","Mirja","Mona","Monique","Nadine","Nadja","Naemi","Nancy","Naomi","Natalia","Natalie","Nathalie","Neele","Nela","Nele","Nelli","Nelly","Nia","Nicole","Nika","Nike","Nikita","Nila","Nina","Nisa","Noemi","Nora","Olivia","Patricia","Patrizia","Paula","Paulina","Pauline","Penelope","Philine","Phoebe","Pia","Rahel","Rania","Rebecca","Rebekka","Riana","Rieke","Rike","Romina","Romy","Ronja","Rosa","Rosalie","Ruby","Sabrina","Sahra","Sally","Salome","Samantha","Samia","Samira","Sandra","Sandy","Sanja","Saphira","Sara","Sarah","Saskia","Selin","Selina","Selma","Sena","Sidney","Sienna","Silja","Sina","Sinja","Smilla","Sofia","Sofie","Sonja","Sophia","Sophie","Soraya","Stefanie","Stella","Stephanie","Stina","Sude","Summer","Susanne","Svea","Svenja","Sydney","Tabea","Talea","Talia","Tamara","Tamia","Tamina","Tanja","Tara","Tarja","Teresa","Tessa","Thalea","Thalia","Thea","Theresa","Tia","Tina","Tomke","Tuana","Valentina","Valeria","Valerie","Vanessa","Vera","Veronika","Victoria","Viktoria","Viola","Vivian","Vivien","Vivienne","Wibke","Wiebke","Xenia","Yara","Yaren","Yasmin","Ylvi","Ylvie","Yvonne","Zara","Zehra","Zeynep","Zoe","Zoey","Zoé"],"last_name":["Abel","Abicht","Abraham","Abramovic","Abt","Achilles","Achkinadze","Ackermann","Adam","Adams","Ade","Agostini","Ahlke","Ahrenberg","Ahrens","Aigner","Albert","Albrecht","Alexa","Alexander","Alizadeh","Allgeyer","Amann","Amberg","Anding","Anggreny","Apitz","Arendt","Arens","Arndt","Aryee","Aschenbroich","Assmus","Astafei","Auer","Axmann","Baarck","Bachmann","Badane","Bader","Baganz","Bahl","Bak","Balcer","Balck","Balkow","Balnuweit","Balzer","Banse","Barr","Bartels","Barth","Barylla","Baseda","Battke","Bauer","Bauermeister","Baumann","Baumeister","Bauschinger","Bauschke","Bayer","Beavogui","Beck","Beckel","Becker","Beckmann","Bedewitz","Beele","Beer","Beggerow","Beh","Behr","Behrenbruch","Belz","Bender","Benecke","Benner","Benninger","Benzing","Berends","Berger","Berner","Berning","Bertenbreiter","Best","Bethke","Betz","Beushausen","Beutelspacher","Beyer","Biba","Bichler","Bickel","Biedermann","Bieler","Bielert","Bienasch","Bienias","Biesenbach","Bigdeli","Birkemeyer","Bittner","Blank","Blaschek","Blassneck","Bloch","Blochwitz","Blockhaus","Blum","Blume","Bock","Bode","Bogdashin","Bogenrieder","Bohge","Bolm","Borgschulze","Bork","Bormann","Bornscheuer","Borrmann","Borsch","Boruschewski","Bos","Bosler","Bourrouag","Bouschen","Boxhammer","Boyde","Bozsik","Brand","Brandenburg","Brandis","Brandt","Brauer","Braun","Brehmer","Breitenstein","Bremer","Bremser","Brenner","Brettschneider","Breu","Breuer","Briesenick","Bringmann","Brinkmann","Brix","Broening","Brosch","Bruckmann","Bruder","Bruhns","Brunner","Bruns","Bräutigam","Brömme","Brüggmann","Buchholz","Buchrucker","Buder","Bultmann","Bunjes","Burger","Burghagen","Burkhard","Burkhardt","Burmeister","Busch","Buschbaum","Busemann","Buss","Busse","Bussmann","Byrd","Bäcker","Böhm","Bönisch","Börgeling","Börner","Böttner","Büchele","Bühler","Büker","Büngener","Bürger","Bürklein","Büscher","Büttner","Camara","Carlowitz","Carlsohn","Caspari","Caspers","Chapron","Christ","Cierpinski","Clarius","Cleem","Cleve","Co","Conrad","Cordes","Cornelsen","Cors","Cotthardt","Crews","Cronjäger","Crosskofp","Da","Dahm","Dahmen","Daimer","Damaske","Danneberg","Danner","Daub","Daubner","Daudrich","Dauer","Daum","Dauth","Dautzenberg","De","Decker","Deckert","Deerberg","Dehmel","Deja","Delonge","Demut","Dengler","Denner","Denzinger","Derr","Dertmann","Dethloff","Deuschle","Dieckmann","Diedrich","Diekmann","Dienel","Dies","Dietrich","Dietz","Dietzsch","Diezel","Dilla","Dingelstedt","Dippl","Dittmann","Dittmar","Dittmer","Dix","Dobbrunz","Dobler","Dohring","Dolch","Dold","Dombrowski","Donie","Doskoczynski","Dragu","Drechsler","Drees","Dreher","Dreier","Dreissigacker","Dressler","Drews","Duma","Dutkiewicz","Dyett","Dylus","Dächert","Döbel","Döring","Dörner","Dörre","Dück","Eberhard","Eberhardt","Ecker","Eckhardt","Edorh","Effler","Eggenmueller","Ehm","Ehmann","Ehrig","Eich","Eichmann","Eifert","Einert","Eisenlauer","Ekpo","Elbe","Eleyth","Elss","Emert","Emmelmann","Ender","Engel","Engelen","Engelmann","Eplinius","Erdmann","Erhardt","Erlei","Erm","Ernst","Ertl","Erwes","Esenwein","Esser","Evers","Everts","Ewald","Fahner","Faller","Falter","Farber","Fassbender","Faulhaber","Fehrig","Feld","Felke","Feller","Fenner","Fenske","Feuerbach","Fietz","Figl","Figura","Filipowski","Filsinger","Fincke","Fink","Finke","Fischer","Fitschen","Fleischer","Fleischmann","Floder","Florczak","Flore","Flottmann","Forkel","Forst","Frahmeke","Frank","Franke","Franta","Frantz","Franz","Franzis","Franzmann","Frauen","Frauendorf","Freigang","Freimann","Freimuth","Freisen","Frenzel","Frey","Fricke","Fried","Friedek","Friedenberg","Friedmann","Friedrich","Friess","Frisch","Frohn","Frosch","Fuchs","Fuhlbrügge","Fusenig","Fust","Förster","Gaba","Gabius","Gabler","Gadschiew","Gakstädter","Galander","Gamlin","Gamper","Gangnus","Ganzmann","Garatva","Gast","Gastel","Gatzka","Gauder","Gebhardt","Geese","Gehre","Gehrig","Gehring","Gehrke","Geiger","Geisler","Geissler","Gelling","Gens","Gerbennow","Gerdel","Gerhardt","Gerschler","Gerson","Gesell","Geyer","Ghirmai","Ghosh","Giehl","Gierisch","Giesa","Giesche","Gilde","Glatting","Goebel","Goedicke","Goldbeck","Goldfuss","Goldkamp","Goldkühle","Goller","Golling","Gollnow","Golomski","Gombert","Gotthardt","Gottschalk","Gotz","Goy","Gradzki","Graf","Grams","Grasse","Gratzky","Grau","Greb","Green","Greger","Greithanner","Greschner","Griem","Griese","Grimm","Gromisch","Gross","Grosser","Grossheim","Grosskopf","Grothaus","Grothkopp","Grotke","Grube","Gruber","Grundmann","Gruning","Gruszecki","Gröss","Grötzinger","Grün","Grüner","Gummelt","Gunkel","Gunther","Gutjahr","Gutowicz","Gutschank","Göbel","Göckeritz","Göhler","Görlich","Görmer","Götz","Götzelmann","Güldemeister","Günther","Günz","Gürbig","Haack","Haaf","Habel","Hache","Hackbusch","Hackelbusch","Hadfield","Hadwich","Haferkamp","Hahn","Hajek","Hallmann","Hamann","Hanenberger","Hannecker","Hanniske","Hansen","Hardy","Hargasser","Harms","Harnapp","Harter","Harting","Hartlieb","Hartmann","Hartwig","Hartz","Haschke","Hasler","Hasse","Hassfeld","Haug","Hauke","Haupt","Haverney","Heberstreit","Hechler","Hecht","Heck","Hedermann","Hehl","Heidelmann","Heidler","Heinemann","Heinig","Heinke","Heinrich","Heinze","Heiser","Heist","Hellmann","Helm","Helmke","Helpling","Hengmith","Henkel","Hennes","Henry","Hense","Hensel","Hentel","Hentschel","Hentschke","Hepperle","Herberger","Herbrand","Hering","Hermann","Hermecke","Herms","Herold","Herrmann","Herschmann","Hertel","Herweg","Herwig","Herzenberg","Hess","Hesse","Hessek","Hessler","Hetzler","Heuck","Heydemüller","Hiebl","Hildebrand","Hildenbrand","Hilgendorf","Hillard","Hiller","Hingsen","Hingst","Hinrichs","Hirsch","Hirschberg","Hirt","Hodea","Hoffman","Hoffmann","Hofmann","Hohenberger","Hohl","Hohn","Hohnheiser","Hold","Holdt","Holinski","Holl","Holtfreter","Holz","Holzdeppe","Holzner","Hommel","Honz","Hooss","Hoppe","Horak","Horn","Horna","Hornung","Hort","Howard","Huber","Huckestein","Hudak","Huebel","Hugo","Huhn","Hujo","Huke","Huls","Humbert","Huneke","Huth","Häber","Häfner","Höcke","Höft","Höhne","Hönig","Hördt","Hübenbecker","Hübl","Hübner","Hügel","Hüttcher","Hütter","Ibe","Ihly","Illing","Isak","Isekenmeier","Itt","Jacob","Jacobs","Jagusch","Jahn","Jahnke","Jakobs","Jakubczyk","Jambor","Jamrozy","Jander","Janich","Janke","Jansen","Jarets","Jaros","Jasinski","Jasper","Jegorov","Jellinghaus","Jeorga","Jerschabek","Jess","John","Jonas","Jossa","Jucken","Jung","Jungbluth","Jungton","Just","Jürgens","Kaczmarek","Kaesmacher","Kahl","Kahlert","Kahles","Kahlmeyer","Kaiser","Kalinowski","Kallabis","Kallensee","Kampf","Kampschulte","Kappe","Kappler","Karhoff","Karrass","Karst","Karsten","Karus","Kass","Kasten","Kastner","Katzinski","Kaufmann","Kaul","Kausemann","Kawohl","Kazmarek","Kedzierski","Keil","Keiner","Keller","Kelm","Kempe","Kemper","Kempter","Kerl","Kern","Kesselring","Kesselschläger","Kette","Kettenis","Keutel","Kick","Kiessling","Kinadeter","Kinzel","Kinzy","Kirch","Kirst","Kisabaka","Klaas","Klabuhn","Klapper","Klauder","Klaus","Kleeberg","Kleiber","Klein","Kleinert","Kleininger","Kleinmann","Kleinsteuber","Kleiss","Klemme","Klimczak","Klinger","Klink","Klopsch","Klose","Kloss","Kluge","Kluwe","Knabe","Kneifel","Knetsch","Knies","Knippel","Knobel","Knoblich","Knoll","Knorr","Knorscheidt","Knut","Kobs","Koch","Kochan","Kock","Koczulla","Koderisch","Koehl","Koehler","Koenig","Koester","Kofferschlager","Koha","Kohle","Kohlmann","Kohnle","Kohrt","Koj","Kolb","Koleiski","Kolokas","Komoll","Konieczny","Konig","Konow","Konya","Koob","Kopf","Kosenkow","Koster","Koszewski","Koubaa","Kovacs","Kowalick","Kowalinski","Kozakiewicz","Krabbe","Kraft","Kral","Kramer","Krauel","Kraus","Krause","Krauspe","Kreb","Krebs","Kreissig","Kresse","Kreutz","Krieger","Krippner","Krodinger","Krohn","Krol","Kron","Krueger","Krug","Kruger","Krull","Kruschinski","Krämer","Kröckert","Kröger","Krüger","Kubera","Kufahl","Kuhlee","Kuhnen","Kulimann","Kulma","Kumbernuss","Kummle","Kunz","Kupfer","Kupprion","Kuprion","Kurnicki","Kurrat","Kurschilgen","Kuschewitz","Kuschmann","Kuske","Kustermann","Kutscherauer","Kutzner","Kwadwo","Kähler","Käther","Köhler","Köhrbrück","Köhre","Kölotzei","König","Köpernick","Köseoglu","Kúhn","Kúhnert","Kühn","Kühnel","Kühnemund","Kühnert","Kühnke","Küsters","Küter","Laack","Lack","Ladewig","Lakomy","Lammert","Lamos","Landmann","Lang","Lange","Langfeld","Langhirt","Lanig","Lauckner","Lauinger","Laurén","Lausecker","Laux","Laws","Lax","Leberer","Lehmann","Lehner","Leibold","Leide","Leimbach","Leipold","Leist","Leiter","Leiteritz","Leitheim","Leiwesmeier","Lenfers","Lenk","Lenz","Lenzen","Leo","Lepthin","Lesch","Leschnik","Letzelter","Lewin","Lewke","Leyckes","Lg","Lichtenfeld","Lichtenhagen","Lichtl","Liebach","Liebe","Liebich","Liebold","Lieder","Lienshöft","Linden","Lindenberg","Lindenmayer","Lindner","Linke","Linnenbaum","Lippe","Lipske","Lipus","Lischka","Lobinger","Logsch","Lohmann","Lohre","Lohse","Lokar","Loogen","Lorenz","Losch","Loska","Lott","Loy","Lubina","Ludolf","Lufft","Lukoschek","Lutje","Lutz","Löser","Löwa","Lübke","Maak","Maczey","Madetzky","Madubuko","Mai","Maier","Maisch","Malek","Malkus","Mallmann","Malucha","Manns","Manz","Marahrens","Marchewski","Margis","Markowski","Marl","Marner","Marquart","Marschek","Martel","Marten","Martin","Marx","Marxen","Mathes","Mathies","Mathiszik","Matschke","Mattern","Matthes","Matula","Mau","Maurer","Mauroff","May","Maybach","Mayer","Mebold","Mehl","Mehlhorn","Mehlorn","Meier","Meisch","Meissner","Meloni","Melzer","Menga","Menne","Mensah","Mensing","Merkel","Merseburg","Mertens","Mesloh","Metzger","Metzner","Mewes","Meyer","Michallek","Michel","Mielke","Mikitenko","Milde","Minah","Mintzlaff","Mockenhaupt","Moede","Moedl","Moeller","Moguenara","Mohr","Mohrhard","Molitor","Moll","Moller","Molzan","Montag","Moormann","Mordhorst","Morgenstern","Morhelfer","Moritz","Moser","Motchebon","Motzenbbäcker","Mrugalla","Muckenthaler","Mues","Muller","Mulrain","Mächtig","Mäder","Möcks","Mögenburg","Möhsner","Möldner","Möllenbeck","Möller","Möllinger","Mörsch","Mühleis","Müller","Münch","Nabein","Nabow","Nagel","Nannen","Nastvogel","Nau","Naubert","Naumann","Ne","Neimke","Nerius","Neubauer","Neubert","Neuendorf","Neumair","Neumann","Neupert","Neurohr","Neuschwander","Newton","Ney","Nicolay","Niedermeier","Nieklauson","Niklaus","Nitzsche","Noack","Nodler","Nolte","Normann","Norris","Northoff","Nowak","Nussbeck","Nwachukwu","Nytra","Nöh","Oberem","Obergföll","Obermaier","Ochs","Oeser","Olbrich","Onnen","Ophey","Oppong","Orth","Orthmann","Oschkenat","Osei","Osenberg","Ostendarp","Ostwald","Otte","Otto","Paesler","Pajonk","Pallentin","Panzig","Paschke","Patzwahl","Paukner","Peselman","Peter","Peters","Petzold","Pfeiffer","Pfennig","Pfersich","Pfingsten","Pflieger","Pflügner","Philipp","Pichlmaier","Piesker","Pietsch","Pingpank","Pinnock","Pippig","Pitschugin","Plank","Plass","Platzer","Plauk","Plautz","Pletsch","Plotzitzka","Poehn","Poeschl","Pogorzelski","Pohl","Pohland","Pohle","Polifka","Polizzi","Pollmächer","Pomp","Ponitzsch","Porsche","Porth","Poschmann","Poser","Pottel","Prah","Prange","Prediger","Pressler","Preuk","Preuss","Prey","Priemer","Proske","Pusch","Pöche","Pöge","Raabe","Rabenstein","Rach","Radtke","Rahn","Ranftl","Rangen","Ranz","Rapp","Rath","Rau","Raubuch","Raukuc","Rautenkranz","Rehwagen","Reiber","Reichardt","Reichel","Reichling","Reif","Reifenrath","Reimann","Reinberg","Reinelt","Reinhardt","Reinke","Reitze","Renk","Rentz","Renz","Reppin","Restle","Restorff","Retzke","Reuber","Reumann","Reus","Reuss","Reusse","Rheder","Rhoden","Richards","Richter","Riedel","Riediger","Rieger","Riekmann","Riepl","Riermeier","Riester","Riethmüller","Rietmüller","Rietscher","Ringel","Ringer","Rink","Ripken","Ritosek","Ritschel","Ritter","Rittweg","Ritz","Roba","Rockmeier","Rodehau","Rodowski","Roecker","Roggatz","Rohländer","Rohrer","Rokossa","Roleder","Roloff","Roos","Rosbach","Roschinsky","Rose","Rosenauer","Rosenbauer","Rosenthal","Rosksch","Rossberg","Rossler","Roth","Rother","Ruch","Ruckdeschel","Rumpf","Rupprecht","Ruth","Ryjikh","Ryzih","Rädler","Räntsch","Rödiger","Röse","Röttger","Rücker","Rüdiger","Rüter","Sachse","Sack","Saflanis","Sagafe","Sagonas","Sahner","Saile","Sailer","Salow","Salzer","Salzmann","Sammert","Sander","Sarvari","Sattelmaier","Sauer","Sauerland","Saumweber","Savoia","Scc","Schacht","Schaefer","Schaffarzik","Schahbasian","Scharf","Schedler","Scheer","Schelk","Schellenbeck","Schembera","Schenk","Scherbarth","Scherer","Schersing","Scherz","Scheurer","Scheuring","Scheytt","Schielke","Schieskow","Schildhauer","Schilling","Schima","Schimmer","Schindzielorz","Schirmer","Schirrmeister","Schlachter","Schlangen","Schlawitz","Schlechtweg","Schley","Schlicht","Schlitzer","Schmalzle","Schmid","Schmidt","Schmidtchen","Schmitt","Schmitz","Schmuhl","Schneider","Schnelting","Schnieder","Schniedermeier","Schnürer","Schoberg","Scholz","Schonberg","Schondelmaier","Schorr","Schott","Schottmann","Schouren","Schrader","Schramm","Schreck","Schreiber","Schreiner","Schreiter","Schroder","Schröder","Schuermann","Schuff","Schuhaj","Schuldt","Schult","Schulte","Schultz","Schultze","Schulz","Schulze","Schumacher","Schumann","Schupp","Schuri","Schuster","Schwab","Schwalm","Schwanbeck","Schwandke","Schwanitz","Schwarthoff","Schwartz","Schwarz","Schwarzer","Schwarzkopf","Schwarzmeier","Schwatlo","Schweisfurth","Schwennen","Schwerdtner","Schwidde","Schwirkschlies","Schwuchow","Schäfer","Schäffel","Schäffer","Schäning","Schöckel","Schönball","Schönbeck","Schönberg","Schönebeck","Schönenberger","Schönfeld","Schönherr","Schönlebe","Schötz","Schüler","Schüppel","Schütz","Schütze","Seeger","Seelig","Sehls","Seibold","Seidel","Seiders","Seigel","Seiler","Seitz","Semisch","Senkel","Sewald","Siebel","Siebert","Siegling","Sielemann","Siemon","Siener","Sievers","Siewert","Sihler","Sillah","Simon","Sinnhuber","Sischka","Skibicki","Sladek","Slotta","Smieja","Soboll","Sokolowski","Soller","Sollner","Sommer","Somssich","Sonn","Sonnabend","Spahn","Spank","Spelmeyer","Spiegelburg","Spielvogel","Spinner","Spitzmüller","Splinter","Sporrer","Sprenger","Spöttel","Stahl","Stang","Stanger","Stauss","Steding","Steffen","Steffny","Steidl","Steigauf","Stein","Steinecke","Steinert","Steinkamp","Steinmetz","Stelkens","Stengel","Stengl","Stenzel","Stepanov","Stephan","Stern","Steuk","Stief","Stifel","Stoll","Stolle","Stolz","Storl","Storp","Stoutjesdijk","Stratmann","Straub","Strausa","Streck","Streese","Strege","Streit","Streller","Strieder","Striezel","Strogies","Strohschank","Strunz","Strutz","Stube","Stöckert","Stöppler","Stöwer","Stürmer","Suffa","Sujew","Sussmann","Suthe","Sutschet","Swillims","Szendrei","Sören","Sürth","Tafelmeier","Tang","Tasche","Taufratshofer","Tegethof","Teichmann","Tepper","Terheiden","Terlecki","Teufel","Theele","Thieke","Thimm","Thiomas","Thomas","Thriene","Thränhardt","Thust","Thyssen","Thöne","Tidow","Tiedtke","Tietze","Tilgner","Tillack","Timmermann","Tischler","Tischmann","Tittman","Tivontschik","Tonat","Tonn","Trampeli","Trauth","Trautmann","Travan","Treff","Tremmel","Tress","Tsamonikian","Tschiers","Tschirch","Tuch","Tucholke","Tudow","Tuschmo","Tächl","Többen","Töpfer","Uhlemann","Uhlig","Uhrig","Uibel","Uliczka","Ullmann","Ullrich","Umbach","Umlauft","Umminger","Unger","Unterpaintner","Urban","Urbaniak","Urbansky","Urhig","Vahlensieck","Van","Vangermain","Vater","Venghaus","Verniest","Verzi","Vey","Viellehner","Vieweg","Voelkel","Vogel","Vogelgsang","Vogt","Voigt","Vokuhl","Volk","Volker","Volkmann","Von","Vona","Vontein","Wachenbrunner","Wachtel","Wagner","Waibel","Wakan","Waldmann","Wallner","Wallstab","Walter","Walther","Walton","Walz","Wanner","Wartenberg","Waschbüsch","Wassilew","Wassiluk","Weber","Wehrsen","Weidlich","Weidner","Weigel","Weight","Weiler","Weimer","Weis","Weiss","Weller","Welsch","Welz","Welzel","Weniger","Wenk","Werle","Werner","Werrmann","Wessel","Wessinghage","Weyel","Wezel","Wichmann","Wickert","Wiebe","Wiechmann","Wiegelmann","Wierig","Wiese","Wieser","Wilhelm","Wilky","Will","Willwacher","Wilts","Wimmer","Winkelmann","Winkler","Winter","Wischek","Wischer","Wissing","Wittich","Wittl","Wolf","Wolfarth","Wolff","Wollenberg","Wollmann","Woytkowska","Wujak","Wurm","Wyludda","Wölpert","Wöschler","Wühn","Wünsche","Zach","Zaczkiewicz","Zahn","Zaituc","Zandt","Zanner","Zapletal","Zauber","Zeidler","Zekl","Zender","Zeuch","Zeyen","Zeyhle","Ziegler","Zimanyi","Zimmer","Zimmermann","Zinser","Zintl","Zipp","Zipse","Zschunke","Zuber","Zwiener","Zümsande","Östringer","Überacker"],"prefix":["Hr.","Fr.","Dr.","Prof. Dr."],"nobility_title_prefix":["zu","von","vom","von der"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{nobility_title_prefix} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["(0###) #########","(0####) #######","+49-###-#######","+49-####-########"]},"cell_phone":{"formats":["+49-1##-#######","+49-1###-########"]}}},"en-au":{"faker":{"name":{"first_name":["William","Jack","Oliver","Joshua","Thomas","Lachlan","Cooper","Noah","Ethan","Lucas","James","Samuel","Jacob","Liam","Alexander","Benjamin","Max","Isaac","Daniel","Riley","Ryan","Charlie","Tyler","Jake","Matthew","Xavier","Harry","Jayden","Nicholas","Harrison","Levi","Luke","Adam","Henry","Aiden","Dylan","Oscar","Michael","Jackson","Logan","Joseph","Blake","Nathan","Connor","Elijah","Nate","Archie","Bailey","Marcus","Cameron","Jordan","Zachary","Caleb","Hunter","Ashton","Toby","Aidan","Hayden","Mason","Hamish","Edward","Angus","Eli","Sebastian","Christian","Patrick","Andrew","Anthony","Luca","Kai","Beau","Alex","George","Callum","Finn","Zac","Mitchell","Jett","Jesse","Gabriel","Leo","Declan","Charles","Jasper","Jonathan","Aaron","Hugo","David","Christopher","Chase","Owen","Justin","Ali","Darcy","Lincoln","Cody","Phoenix","Sam","John","Joel","Isabella","Ruby","Chloe","Olivia","Charlotte","Mia","Lily","Emily","Ella","Sienna","Sophie","Amelia","Grace","Ava","Zoe","Emma","Sophia","Matilda","Hannah","Jessica","Lucy","Georgia","Sarah","Abigail","Zara","Eva","Scarlett","Jasmine","Chelsea","Lilly","Ivy","Isla","Evie","Isabelle","Maddison","Layla","Summer","Annabelle","Alexis","Elizabeth","Bella","Holly","Lara","Madison","Alyssa","Maya","Tahlia","Claire","Hayley","Imogen","Jade","Ellie","Sofia","Addison","Molly","Phoebe","Alice","Savannah","Gabriella","Kayla","Mikayla","Abbey","Eliza","Willow","Alexandra","Poppy","Samantha","Stella","Amy","Amelie","Anna","Piper","Gemma","Isabel","Victoria","Stephanie","Caitlin","Heidi","Paige","Rose","Amber","Audrey","Claudia","Taylor","Madeline","Angelina","Natalie","Charli","Lauren","Ashley","Violet","Mackenzie","Abby","Skye","Lillian","Alana","Lola","Leah","Eve","Kiara"],"last_name":["Smith","Jones","Williams","Brown","Wilson","Taylor","Johnson","White","Martin","Anderson","Thompson","Nguyen","Thomas","Walker","Harris","Lee","Ryan","Robinson","Kelly","King","Davis","Wright","Evans","Roberts","Green","Hall","Wood","Jackson","Clarke","Patel","Khan","Lewis","James","Phillips","Mason","Mitchell","Rose","Davies","Rodríguez","Cox","Alexander","Garden","Campbell","Johnston","Moore","Smyth","O’neill","Doherty","Stewart","Quinn","Murphy","Graham","Mclaughlin","Hamilton","Murray","Hughes","Robertson","Thomson","Scott","Macdonald","Reid","Clark","Ross","Young","Watson","Paterson","Morrison","Morgan","Griffiths","Edwards","Rees","Jenkins","Owen","Price","Moss","Richards","Abbott","Adams","Armstrong","Bahringer","Bailey","Barrows","Bartell","Bartoletti","Barton","Bauch","Baumbach","Bayer","Beahan","Beatty","Becker","Beier","Berge","Bergstrom","Bode","Bogan","Borer","Bosco","Botsford","Boyer","Boyle","Braun","Bruen","Carroll","Carter","Cartwright","Casper","Cassin","Champlin","Christiansen","Cole","Collier","Collins","Connelly","Conroy","Corkery","Cormier","Corwin","Cronin","Crooks","Cruickshank","Cummings","D'amore","Daniel","Dare","Daugherty","Dickens","Dickinson","Dietrich","Donnelly","Dooley","Douglas","Doyle","Durgan","Ebert","Emard","Emmerich","Erdman","Ernser","Fadel","Fahey","Farrell","Fay","Feeney","Feil","Ferry","Fisher","Flatley","Gibson","Gleason","Glover","Goldner","Goodwin","Grady","Grant","Greenfelder","Greenholt","Grimes","Gutmann","Hackett","Hahn","Haley","Hammes","Hand","Hane","Hansen","Harber","Hartmann","Harvey","Hayes","Heaney","Heathcote","Heller","Hermann","Hermiston","Hessel","Hettinger","Hickle","Hill","Hills","Hoppe","Howe","Howell","Hudson","Huel","Hyatt","Jacobi","Jacobs","Jacobson","Jerde","Johns","Keeling","Kemmer","Kessler","Kiehn","Kirlin","Klein","Koch","Koelpin","Kohler","Koss","Kovacek","Kreiger","Kris","Kuhlman","Kuhn","Kulas","Kunde","Kutch","Lakin","Lang","Langworth","Larkin","Larson","Leannon","Leffler","Little","Lockman","Lowe","Lynch","Mann","Marks","Marvin","Mayer","Mccullough","Mcdermott","Mckenzie","Miller","Mills","Monahan","Morissette","Mueller","Muller","Nader","Nicolas","Nolan","O'connell","O'conner","O'hara","O'keefe","Olson","O'reilly","Parisian","Parker","Quigley","Reilly","Reynolds","Rice","Ritchie","Rohan","Rolfson","Rowe","Russel","Rutherford","Sanford","Sauer","Schmidt","Schmitt","Schneider","Schroeder","Schultz","Shields","Smitham","Spencer","Stanton","Stark","Stokes","Swift","Tillman","Towne","Tremblay","Tromp","Turcotte","Turner","Walsh","Walter","Ward","Waters","Weber","Welch","West","Wilderman","Wilkinson","Williamson","Windler","Wolf"]},"company":{"suffix":["Pty Ltd","and Sons","Corp","Group","Brothers","Partners"]},"internet":{"domain_suffix":["com.au","com","net.au","net","org.au","org"]},"address":{"state_abbr":["NSW","QLD","NT","SA","WA","TAS","ACT","VIC"],"state":["New South Wales","Queensland","Northern Territory","South Australia","Western Australia","Tasmania","Australian Capital Territory","Victoria"],"postcode":["0###","2###","3###","4###","5###","6###","7###"],"building_number":["####","###","##"],"street_suffix":["Avenue","Boulevard","Circle","Circuit","Court","Crescent","Crest","Drive","Estate Dr","Grove","Hill","Island","Junction","Knoll","Lane","Loop","Mall","Manor","Meadow","Mews","Parade","Parkway","Pass","Place","Plaza","Ridge","Road","Run","Square","Station St","Street","Summit","Terrace","Track","Trail","View Rd","Way"],"default_country":["Australia"]},"phone_number":{"formats":["0# #### ####","+61 # #### ####","04## #### ####","+61 4## #### ####"]}}},"en-bork":{"faker":{"lorem":{"words":["Boot","I","Nu","Nur","Tu","Um","a","becoose-a","boot","bork","burn","chuuses","cumplete-a","cun","cunseqooences","curcoomstunces","dee","deeslikes","denuoonceeng","desures","du","eccuoont","ectooel","edfuntege-a","efueeds","egeeen","ell","ere-a","feend","foolt","frum","geefe-a","gesh","greet","heem","heppeeness","hes","hoo","hoomun","idea","ifer","in","incuoonter","injuy","itselff","ixcept","ixemple-a","ixerceese-a","ixpleeen","ixplurer","ixpuoond","ixtremely","knoo","lebureeuoos","lufes","meestekee","mester-booeelder","moost","mun","nu","nut","oobteeen","oocceseeunelly","ooccoor","ooff","oone-a","oor","peeen","peeenffool","physeecel","pleesoore-a","poorsooe-a","poorsooes","preeesing","prucoore-a","prudooces","reeght","reshunelly","resooltunt","sume-a","teecheengs","teke-a","thees","thet","thuse-a","treefiel","troot","tu","tueel","und","undertekes","unnuyeeng","uny","unyune-a","us","veell","veet","ves","vheech","vhu","yuoo","zee","zeere-a"]}}},"en-ca":{"faker":{"address":{"postcode":["?#? #?#","?#?#?#"],"state":["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Nova Scotia","Northwest Territories","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"],"state_abbr":["AB","BC","MB","NB","NL","NS","NU","NT",true,"PE","QC","SK","YK"],"default_country":["Canada"]},"internet":{"free_email":["gmail.com","yahoo.ca","hotmail.com"],"domain_suffix":["ca","com","biz","info","name","net","org"]},"phone_number":{"formats":["###-###-####","(###)###-####","###.###.####","1-###-###-####","###-###-#### x###","(###)###-#### x###","1-###-###-#### x###","###.###.#### x###","###-###-#### x####","(###)###-#### x####","1-###-###-#### x####","###.###.#### x####","###-###-#### x#####","(###)###-#### x#####","1-###-###-#### x#####","###.###.#### x#####"]}}},"en-gb":{"faker":{"address":{"postcode":"/[A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}/","county":["Avon","Bedfordshire","Berkshire","Borders","Buckinghamshire","Cambridgeshire","Central","Cheshire","Cleveland","Clwyd","Cornwall","County Antrim","County Armagh","County Down","County Fermanagh","County Londonderry","County Tyrone","Cumbria","Derbyshire","Devon","Dorset","Dumfries and Galloway","Durham","Dyfed","East Sussex","Essex","Fife","Gloucestershire","Grampian","Greater Manchester","Gwent","Gwynedd County","Hampshire","Herefordshire","Hertfordshire","Highlands and Islands","Humberside","Isle of Wight","Kent","Lancashire","Leicestershire","Lincolnshire","Lothian","Merseyside","Mid Glamorgan","Norfolk","North Yorkshire","Northamptonshire","Northumberland","Nottinghamshire","Oxfordshire","Powys","Rutland","Shropshire","Somerset","South Glamorgan","South Yorkshire","Staffordshire","Strathclyde","Suffolk","Surrey","Tayside","Tyne and Wear","Warwickshire","West Glamorgan","West Midlands","West Sussex","West Yorkshire","Wiltshire","Worcestershire"],"uk_country":["England","Scotland","Wales","Northern Ireland"],"default_country":["England","Scotland","Wales","Northern Ireland"]},"internet":{"domain_suffix":["co.uk","com","biz","info","name"]},"phone_number":{"formats":["01#### #####","01### ######","01#1 ### ####","011# ### ####","02# #### ####","03## ### ####","055 #### ####","056 #### ####","0800 ### ####","08## ### ####","09## ### ####","016977 ####","01### #####","0500 ######","0800 ######"]},"cell_phone":{"formats":["074## ######","075## ######","076## ######","077## ######","078## ######","079## ######"]}}},"en-ind":{"faker":{"name":{"first_name":["Aadrika","Aanandinii","Aaratrika","Aarya","Arya","Aashritha","Aatmaja","Atmaja","Abhaya","Adwitiya","Agrata","Ahilya","Ahalya","Aishani","Akshainie","Akshata","Akshita","Akula","Ambar","Amodini","Amrita","Amritambu","Anala","Anamika","Ananda","Anandamayi","Ananta","Anila","Anjali","Anjushri","Anjushree","Annapurna","Anshula","Anuja","Anusuya","Anasuya","Anasooya","Anwesha","Apsara","Aruna","Asha","Aasa","Aasha","Aslesha","Atreyi","Atreyee","Avani","Abani","Avantika","Ayushmati","Baidehi","Vaidehi","Bala","Baala","Balamani","Basanti","Vasanti","Bela","Bhadra","Bhagirathi","Bhagwanti","Bhagwati","Bhamini","Bhanumati","Bhaanumati","Bhargavi","Bhavani","Bhilangana","Bilwa","Bilva","Buddhana","Chakrika","Chanda","Chandi","Chandni","Chandini","Chandani","Chandra","Chandira","Chandrabhaga","Chandrakala","Chandrakin","Chandramani","Chandrani","Chandraprabha","Chandraswaroopa","Chandravati","Chapala","Charumati","Charvi","Chatura","Chitrali","Chitramala","Chitrangada","Daksha","Dakshayani","Damayanti","Darshwana","Deepali","Dipali","Deeptimoyee","Deeptimayee","Devangana","Devani","Devasree","Devi","Daevi","Devika","Daevika","Dhaanyalakshmi","Dhanalakshmi","Dhana","Dhanadeepa","Dhara","Dharani","Dharitri","Dhatri","Diksha","Deeksha","Divya","Draupadi","Dulari","Durga","Durgeshwari","Ekaparnika","Elakshi","Enakshi","Esha","Eshana","Eshita","Gautami","Gayatri","Geeta","Geetanjali","Gitanjali","Gemine","Gemini","Girja","Girija","Gita","Hamsini","Harinakshi","Harita","Heema","Himadri","Himani","Hiranya","Indira","Jaimini","Jaya","Jyoti","Jyotsana","Kali","Kalinda","Kalpana","Kalyani","Kama","Kamala","Kamla","Kanchan","Kanishka","Kanti","Kashyapi","Kumari","Kumuda","Lakshmi","Laxmi","Lalita","Lavanya","Leela","Lila","Leela","Madhuri","Malti","Malati","Mandakini","Mandaakin","Mangala","Mangalya","Mani","Manisha","Manjusha","Meena","Mina","Meenakshi","Minakshi","Menka","Menaka","Mohana","Mohini","Nalini","Nikita","Ojaswini","Omana","Oormila","Urmila","Opalina","Opaline","Padma","Parvati","Poornima","Purnima","Pramila","Prasanna","Preity","Prema","Priya","Priyala","Pushti","Radha","Rageswari","Rageshwari","Rajinder","Ramaa","Rati","Rita","Rohana","Rukhmani","Rukmin","Rupinder","Sanya","Sarada","Sharda","Sarala","Sarla","Saraswati","Sarisha","Saroja","Shakti","Shakuntala","Shanti","Sharmila","Shashi","Shashikala","Sheela","Shivakari","Shobhana","Shresth","Shresthi","Shreya","Shreyashi","Shridevi","Shrishti","Shubha","Shubhaprada","Siddhi","Sitara","Sloka","Smita","Smriti","Soma","Subhashini","Subhasini","Sucheta","Sudeva","Sujata","Sukanya","Suma","Suma","Sumitra","Sunita","Suryakantam","Sushma","Swara","Swarnalata","Sweta","Shwet","Tanirika","Tanushree","Tanushri","Tanushri","Tanya","Tara","Trisha","Uma","Usha","Vaijayanti","Vaijayanthi","Baijayanti","Vaishvi","Vaishnavi","Vaishno","Varalakshmi","Vasudha","Vasundhara","Veda","Vedanshi","Vidya","Vimala","Vrinda","Vrund","Aadi","Aadidev","Aadinath","Aaditya","Aagam","Aagney","Aamod","Aanandaswarup","Anand Swarup","Aanjaneya","Anjaneya","Aaryan","Aryan","Aatmaj","Aatreya","Aayushmaan","Aayushman","Abhaidev","Abhaya","Abhirath","Abhisyanta","Acaryatanaya","Achalesvara","Acharyanandana","Acharyasuta","Achintya","Achyut","Adheesh","Adhiraj","Adhrit","Adikavi","Adinath","Aditeya","Aditya","Adityanandan","Adityanandana","Adripathi","Advaya","Agasti","Agastya","Agneya","Aagneya","Agnimitra","Agniprava","Agnivesh","Agrata","Ajit","Ajeet","Akroor","Akshaj","Akshat","Akshayakeerti","Alok","Aalok","Amaranaath","Amarnath","Amaresh","Ambar","Ameyatma","Amish","Amogh","Amrit","Anaadi","Anagh","Anal","Anand","Aanand","Anang","Anil","Anilaabh","Anilabh","Anish","Ankal","Anunay","Anurag","Anuraag","Archan","Arindam","Arjun","Arnesh","Arun","Ashlesh","Ashok","Atmanand","Atmananda","Avadhesh","Baalaaditya","Baladitya","Baalagopaal","Balgopal","Balagopal","Bahula","Bakula","Bala","Balaaditya","Balachandra","Balagovind","Bandhu","Bandhul","Bankim","Bankimchandra","Bhadrak","Bhadraksh","Bhadran","Bhagavaan","Bhagvan","Bharadwaj","Bhardwaj","Bharat","Bhargava","Bhasvan","Bhaasvan","Bhaswar","Bhaaswar","Bhaumik","Bhaves","Bheeshma","Bhisham","Bhishma","Bhima","Bhoj","Bhramar","Bhudev","Bhudeva","Bhupati","Bhoopati","Bhoopat","Bhupen","Bhushan","Bhooshan","Bhushit","Bhooshit","Bhuvanesh","Bhuvaneshwar","Bilva","Bodhan","Brahma","Brahmabrata","Brahmanandam","Brahmaanand","Brahmdev","Brajendra","Brajesh","Brijesh","Birjesh","Budhil","Chakor","Chakradhar","Chakravartee","Chakravarti","Chanakya","Chaanakya","Chandak","Chandan","Chandra","Chandraayan","Chandrabhan","Chandradev","Chandraketu","Chandramauli","Chandramohan","Chandran","Chandranath","Chapal","Charak","Charuchandra","Chaaruchandra","Charuvrat","Chatur","Chaturaanan","Chaturbhuj","Chetan","Chaten","Chaitan","Chetanaanand","Chidaakaash","Chidaatma","Chidambar","Chidambaram","Chidananda","Chinmayanand","Chinmayananda","Chiranjeev","Chiranjeeve","Chitraksh","Daiwik","Daksha","Damodara","Dandak","Dandapaani","Darshan","Datta","Dayaamay","Dayamayee","Dayaananda","Dayaanidhi","Kin","Deenabandhu","Deepan","Deepankar","Dipankar","Deependra","Dipendra","Deepesh","Dipesh","Deeptanshu","Deeptendu","Diptendu","Deeptiman","Deeptimoy","Deeptimay","Dev","Deb","Devadatt","Devagya","Devajyoti","Devak","Devdan","Deven","Devesh","Deveshwar","Devi","Devvrat","Dhananjay","Dhanapati","Dhanpati","Dhanesh","Dhanu","Dhanvin","Dharmaketu","Dhruv","Dhyanesh","Dhyaneshwar","Digambar","Digambara","Dinakar","Dinkar","Dinesh","Divaakar","Divakar","Deevakar","Divjot","Dron","Drona","Dwaipayan","Dwaipayana","Eekalabya","Ekalavya","Ekaksh","Ekaaksh","Ekaling","Ekdant","Ekadant","Gajaadhar","Gajadhar","Gajbaahu","Gajabahu","Ganak","Ganaka","Ganapati","Gandharv","Gandharva","Ganesh","Gangesh","Garud","Garuda","Gati","Gatik","Gaurang","Gauraang","Gauranga","Gouranga","Gautam","Gautama","Goutam","Ghanaanand","Ghanshyam","Ghanashyam","Giri","Girik","Girika","Girindra","Giriraaj","Giriraj","Girish","Gopal","Gopaal","Gopi","Gopee","Gorakhnath","Gorakhanatha","Goswamee","Goswami","Gotum","Gautam","Govinda","Gobinda","Gudakesha","Gudakesa","Gurdev","Guru","Hari","Harinarayan","Harit","Himadri","Hiranmay","Hiranmaya","Hiranya","Inder","Indra","Indra","Jagadish","Jagadisha","Jagathi","Jagdeep","Jagdish","Jagmeet","Jahnu","Jai","Javas","Jay","Jitendra","Jitender","Jyotis","Kailash","Kama","Kamalesh","Kamlesh","Kanak","Kanaka","Kannan","Kannen","Karan","Karthik","Kartik","Karunanidhi","Kashyap","Kiran","Kirti","Keerti","Krishna","Krishnadas","Krishnadasa","Kumar","Lai","Lakshman","Laxman","Lakshmidhar","Lakshminath","Lal","Laal","Mahendra","Mohinder","Mahesh","Maheswar","Mani","Manik","Manikya","Manoj","Marut","Mayoor","Meghnad","Meghnath","Mohan","Mukesh","Mukul","Nagabhushanam","Nanda","Narayan","Narendra","Narinder","Naveen","Navin","Nawal","Naval","Nimit","Niranjan","Nirbhay","Niro","Param","Paramartha","Pran","Pranay","Prasad","Prathamesh","Prayag","Prem","Puneet","Purushottam","Rahul","Raj","Rajan","Rajendra","Rajinder","Rajiv","Rakesh","Ramesh","Rameshwar","Ranjit","Ranjeet","Ravi","Ritesh","Rohan","Rohit","Rudra","Sachin","Sameer","Samir","Sanjay","Sanka","Sarvin","Satish","Satyen","Shankar","Shantanu","Shashi","Sher","Shiv","Siddarth","Siddhran","Som","Somu","Somnath","Subhash","Subodh","Suman","Suresh","Surya","Suryakant","Suryakanta","Sushil","Susheel","Swami","Swapnil","Tapan","Tara","Tarun","Tej","Tejas","Trilochan","Trilochana","Trilok","Trilokesh","Triloki","Triloki Nath","Trilokanath","Tushar","Udai","Udit","Ujjawal","Ujjwal","Umang","Upendra","Uttam","Vasudev","Vasudeva","Vedang","Vedanga","Vidhya","Vidur","Vidhur","Vijay","Vimal","Vinay","Vishnu","Bishnu","Vishwamitra","Vyas","Yogendra","Yoginder","Yogesh"],"last_name":["Abbott","Achari","Acharya","Adiga","Agarwal","Ahluwalia","Ahuja","Arora","Asan","Bandopadhyay","Banerjee","Bharadwaj","Bhat","Butt","Bhattacharya","Bhattathiri","Chaturvedi","Chattopadhyay","Chopra","Desai","Deshpande","Devar","Dhawan","Dubashi","Dutta","Dwivedi","Embranthiri","Ganaka","Gandhi","Gill","Gowda","Guha","Guneta","Gupta","Iyer","Iyengar","Jain","Jha","Johar","Joshi","Kakkar","Kaniyar","Kapoor","Kaul","Kaur","Khan","Khanna","Khatri","Kocchar","Mahajan","Malik","Marar","Menon","Mehra","Mehrotra","Mishra","Mukhopadhyay","Nayar","Naik","Nair","Nambeesan","Namboothiri","Nehru","Pandey","Panicker","Patel","Patil","Pilla","Pillai","Pothuvaal","Prajapat","Rana","Reddy","Saini","Sethi","Shah","Sharma","Shukla","Singh","Sinha","Somayaji","Tagore","Talwar","Tandon","Trivedi","Varrier","Varma","Varman","Verma"]},"address":{"postcode":["?#? #?#"],"state":["Andra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Rajasthan","Sikkim","Tamil Nadu","Tripura","Uttaranchal","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadar and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Pondicherry"],"state_abbr":["AP","AR","AS","BR","CG","DL","GA","GJ","HR","HP","JK","JS","KA","KL","MP","MH","MN","ML","MZ","NL","OR","PB","RJ","SK","TN","TR","UK","UP","WB","AN","CH","DN","DD","LD","PY"],"default_country":["India","Indian Republic","Bharat","Hindustan"]},"internet":{"free_email":["gmail.com","yahoo.co.in","hotmail.com"],"domain_suffix":["in","com","biz","info","name","net","org","co.in"]},"company":{"suffix":["Pvt Ltd","Limited","Ltd","and Sons","Corp","Group","Brothers"]},"phone_number":{"formats":["###-###-####","+91##########","+91-###-#######"]}}},"en-us":{"faker":{"internet":{"domain_suffix":["com","us","biz","info","name","net","org"]},"address":{"default_country":["United States","United States of America","USA"]}}},"fr":{"faker":{"address":{"building_number":["####","###","##","#"],"street_prefix":["Allée","Voie","Rue","Avenue","Boulevard","Quai","Passage","Impasse","Place"],"secondary_address":["Apt. ###","# étage"],"postcode":["#####"],"state":["Alsace","Aquitaine","Auvergne","Basse-Normandie","Bourgogne","Bretagne","Centre","Champagne-Ardenne","Corse","Franche-Comté","Haute-Normandie","Île-de-France","Languedoc-Roussillon","Limousin","Lorraine","Midi-Pyrénées","Nord-Pas-de-Calais","Pays de la Loire","Picardie","Poitou-Charentes","Provence-Alpes-Côte d'Azur","Rhône-Alpes"],"city":["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille13","Rennes","Reims","Le Havre","Saint-Étienne","Toulon","Grenoble","Dijon","Angers","Saint-Denis","Villeurbanne","Le Mans","Aix-en-Provence","Brest","Nîmes","Limoges","Clermont-Ferrand","Tours","Amiens","Metz","Perpignan","Besançon","Orléans","Boulogne-Billancourt","Mulhouse","Rouen","Caen","Nancy","Saint-Denis","Saint-Paul","Montreuil","Argenteuil","Roubaix","Dunkerque14","Tourcoing","Nanterre","Avignon","Créteil","Poitiers","Fort-de-France","Courbevoie","Versailles","Vitry-sur-Seine","Colombes","Pau","Aulnay-sous-Bois","Asnières-sur-Seine","Rueil-Malmaison","Saint-Pierre","Antibes","Saint-Maur-des-Fossés","Champigny-sur-Marne","La Rochelle","Aubervilliers","Calais","Cannes","Le Tampon","Béziers","Colmar","Bourges","Drancy","Mérignac","Saint-Nazaire","Valence","Ajaccio","Issy-les-Moulineaux","Villeneuve-d'Ascq","Levallois-Perret","Noisy-le-Grand","Quimper","La Seyne-sur-Mer","Antony","Troyes","Neuilly-sur-Seine","Sarcelles","Les Abymes","Vénissieux","Clichy","Lorient","Pessac","Ivry-sur-Seine","Cergy","Cayenne","Niort","Chambéry","Montauban","Saint-Quentin","Villejuif","Hyères","Beauvais","Cholet"],"name":["de l'Abbaye","Adolphe Mille","d'Alésia","d'Argenteuil","d'Assas","du Bac, Paris","La Boétie","Bonaparte","de la Bûcherie","de Caumartin","Charlemagne","du Chat-qui-Pêche","de la Chaussée-d'Antin","du Dahomey","Dauphine","Delesseux","du Faubourg Saint-Honoré","du Faubourg-Saint-Denis","de la Ferronnerie","des Francs-Bourgeois","des Grands Augustins","de la Harpe","du Havre","de la Huchette","Joubert","Laffitte","Lepic","des Lombards","Marcadet","Molière","Monsieur-le-Prince","de Montmorency","Montorgueil","Mouffetard","de Nesle","Oberkampf","de l'Odéon","d'Orsel","de la Paix","des Panoramas","Pastourelle","Pierre Charron","de la Pompe","de Presbourg","de Provence","de Richelieu","de Rivoli","des Rosiers","Royale","d'Abbeville","Saint-Honoré","Saint-Bernard","Saint-Denis","Saint-Dominique","Saint-Jacques","Saint-Séverin","des Saussaies","de Seine","de Solférino","Du Sommerard","de Tilsitt","Vaneau","de Vaugirard","de la Victoire","Zadkine"],"street_name":["#{street_prefix} #{name}"],"street_address":["#{building_number} #{street_name}"],"default_country":["France"]},"company":{"suffix":["SARL","SA","EURL","SAS","SEM","SCOP","GIE","EI"],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","assymetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name} et #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.fr","hotmail.fr"],"domain_suffix":["com","fr","eu","info","name","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"first_name":["Enzo Lucas Mathis Nathan Thomas Hugo Théo Tom  Louis  Raphaël  Clément  Léo  Mathéo Maxime Alexandre  Antoine  Yanis  Paul Baptiste Alexis Gabriel  Arthur Jules  Ethan  Noah Quentin  Axel Evan Mattéo Romain Valentin Maxence  Noa  Adam Nicolas  Julien Mael Pierre Rayan  Victor Mohamed  Adrien Kylian Sacha  Benjamin Léa Clara Manon Chloé Camille Ines  Sarah Jade  Lola  Anaïs Lucie Océane  Lilou Marie Eva Romane  Lisa  Zoe Julie Mathilde  Louise  Juliette  Clémence  Célia Laura Lena  Maëlys  Charlotte Ambre Maeva Pauline Lina  Jeanne  Lou Noémie  Justine Louna Elisa Alice Emilie  Carla Maëlle  Alicia  Mélissa"],"last_name":["Martin Bernard Dubois Thomas Robert Richard Petit Durand Leroy Moreau Simon Laurent Lefebvre Michel Garcia David Bertrand Roux Vincent Fournier Morel Girard Andre Lefevre Mercier Dupont Lambert Bonnet Francois Martinez Legrand Garnier Faure Rousseau Blanc Guerin Muller Henry Roussel Nicolas Perrin Morin Mathieu Clement Gauthier Dumont Lopez Fontaine Chevalier Robin Masson Sanchez Gerard Nguyen Boyer Denis Lemaire Duval Joly Gautier Roger Roche Roy Noel Meyer Lucas Meunier Jean Perez Marchand Dufour Blanchard Marie Barbier Brun Dumas Brunet Schmitt Leroux Colin Fernandez Pierre Renard Arnaud Rolland Caron Aubert Giraud Leclerc Vidal Bourgeois Renaud Lemoine Picard Gaillard Philippe Leclercq Lacroix Fabre Dupuis Olivier Rodriguez Da silva Hubert Louis Charles Guillot Riviere Le gall Guillaume Adam Rey Moulin Gonzalez Berger Lecomte Menard Fleury Deschamps Carpentier Julien Benoit Paris Maillard Marchal Aubry Vasseur Le roux Renault Jacquet Collet Prevost Poirier Charpentier Royer Huet Baron Dupuy Pons Paul Laine Carre Breton Remy Schneider Perrot Guyot Barre Marty Cousin"],"prefix":["M","Mme","Mlle","Dr","Prof"],"title":{"job":["Superviseur","Executif","Manager","Ingenieur","Specialiste","Directeur","Coordinateur","Administrateur","Architecte","Analyste","Designer","Technicien","Developpeur","Producteur","Consultant","Assistant","Agent","Stagiaire"]},"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name}","#{last_name} #{name_name}"]},"phone_number":{"formats":["01########","02########","03########","04########","05########","06########","07########","+33 1########","+33 2########","+33 3########","+33 4########","+33 5########","+33 6########","+33 7########"]}}},"nl":{"faker":{"address":{"city_prefix":["Noord","Oost","West","Zuid","Nieuw","Oud"],"city_suffix":["dam","berg"," aan de Rijn"," aan de IJssel","swaerd","endrecht","recht","ambacht","enmaes","wijk","sland","stroom","sluus","dijk","dorp","burg","veld","sluis","koop","lek","hout","geest","kerk","woude","hoven","hoten","ingen","plas","meer"],"city":["#{Name.first_name}#{city_suffix}","#{Name.last_name}#{city_suffix}","#{city_prefix} #{Name.first_name}#{city_suffix}","#{city_prefix} #{Name.last_name}#{city_suffix}"],"country":["Afghanistan","Akrotiri","Albanië","Algerije","Amerikaanse Maagdeneilanden","Amerikaans-Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua en Barbuda","Arctic Ocean","Argentinië","Armenië","Aruba","Ashmore and Cartier Islands","Atlantic Ocean","Australië","Azerbeidzjan","Bahama's","Bahrein","Bangladesh","Barbados","Belarus","België","Belize","Benin","Bermuda","Bhutan","Bolivië","Bosnië-Herzegovina","Botswana","Bouvet Island","Brazilië","British Indian Ocean Territory","Britse Maagdeneilanden","Brunei","Bulgarije","Burkina Faso","Burundi","Cambodja","Canada","Caymaneilanden","Centraal-Afrikaanse Republiek","Chili","China","Christmas Island","Clipperton Island","Cocos (Keeling) Islands","Colombia","Comoren (Unie)","Congo (Democratische Republiek)","Congo (Volksrepubliek)","Cook","Coral Sea Islands","Costa Rica","Cuba","Cyprus","Denemarken","Dhekelia","Djibouti","Dominica","Dominicaanse Republiek","Duitsland","Ecuador","Egypte","El Salvador","Equatoriaal-Guinea","Eritrea","Estland","Ethiopië","European Union","Falkland","Faroe Islands","Fiji","Filipijnen","Finland","Frankrijk","Frans-Polynesië","French Southern and Antarctic Lands","Gabon","Gambia","Gaza Strip","Georgië","Ghana","Gibraltar","Grenada","Griekenland","Groenland","Guam","Guatemala","Guernsey","Guinea","Guinee-Bissau","Guyana","Haïti","Heard Island and McDonald Islands","Heilige Stoel","Honduras","Hongarije","Hongkong","Ierland","IJsland","India","Indian Ocean","Indonesië","Irak","Iran","Isle of Man","Israël","Italië","Ivoorkust","Jamaica","Jan Mayen","Japan","Jemen","Jersey","Jordanië","Kaapverdië","Kameroen","Kazachstan","Kenia","Kirgizstan","Kiribati","Koeweit","Kroatië","Laos","Lesotho","Letland","Libanon","Liberia","Libië","Liechtenstein","Litouwen","Luxemburg","Macao","Macedonië","Madagaskar","Malawi","Maldiven","Maleisië","Mali","Malta","Marokko","Marshall Islands","Mauritanië","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldavië","Monaco","Mongolië","Montenegro","Montserrat","Mozambique","Myanmar","Namibië","Nauru","Navassa Island","Nederland","Nederlandse Antillen","Nepal","Ngwane","Nicaragua","Nieuw-Caledonië","Nieuw-Zeeland","Niger","Nigeria","Niue","Noordelijke Marianen","Noord-Korea","Noorwegen","Norfolk Island","Oekraïne","Oezbekistan","Oman","Oostenrijk","Pacific Ocean","Pakistan","Palau","Panama","Papoea-Nieuw-Guinea","Paracel Islands","Paraguay","Peru","Pitcairn","Polen","Portugal","Puerto Rico","Qatar","Roemenië","Rusland","Rwanda","Saint Helena","Saint Lucia","Saint Vincent en de Grenadines","Saint-Pierre en Miquelon","Salomon","Samoa","San Marino","São Tomé en Principe","Saudi-Arabië","Senegal","Servië","Seychellen","Sierra Leone","Singapore","Sint-Kitts en Nevis","Slovenië","Slowakije","Soedan","Somalië","South Georgia and the South Sandwich Islands","Southern Ocean","Spanje","Spratly Islands","Sri Lanka","Suriname","Svalbard","Syrië","Tadzjikistan","Taiwan","Tanzania","Thailand","Timor Leste","Togo","Tokelau","Tonga","Trinidad en Tobago","Tsjaad","Tsjechië","Tunesië","Turkije","Turkmenistan","Turks-en Caicoseilanden","Tuvalu","Uganda","Uruguay","Vanuatu","Venezuela","Verenigd Koninkrijk","Verenigde Arabische Emiraten","Verenigde Staten van Amerika","Vietnam","Wake Island","Wallis en Futuna","Wereld","West Bank","Westelijke Sahara","Zambia","Zimbabwe","Zuid-Afrika","Zuid-Korea","Zweden","Zwitserland"],"building_number":["#","##","###","###a","###b","###c","### I","### II","### III"],"street_suffix":["straat","laan","weg","plantsoen","park"],"secondary_address":["1 hoog","2 hoog","3 hoog"],"street_name":["#{Name.first_name}#{street_suffix}","#{Name.last_name}#{street_suffix}"],"street_address":["#{street_name} #{building_number}"],"postcode":["#### ??"],"state":["Noord-Holland","Zuid-Holland","Utrecht","Zeeland","Overijssel","Gelderland","Drenthe","Friesland","Groningen","Noord-Braband","Limburg"],"default_country":["Nederland"]},"company":{"suffix":["BV","V.O.F.","Group","en Zonen"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["nl","com","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"first_name":["Amber","Anna","Anne","Anouk","Bas","Bram","Britt","Daan","Emma","Eva","Femke","Finn","Fleur","Iris","Isa","Jan","Jasper","Jayden","Jesse","Johannes","Julia","Julian","Kevin","Lars","Lieke","Lisa","Lotte","Lucas","Luuk","Maud","Max","Mike","Milan","Nick","Niels","Noa","Rick","Roos","Ruben","Sander","Sanne","Sem","Sophie","Stijn","Sven","Thijs","Thijs","Thomas","Tim","Tom"],"tussenvoegsel":["van","van de","van den","van 't","van het","de","den"],"last_name":["Bakker","Beek","Berg","Boer","Bos","Bosch","Brink","Broek","Brouwer","Bruin","Dam","Dekker","Dijk","Dijkstra","Graaf","Groot","Haan","Hendriks","Heuvel","Hoek","Jacobs","Jansen","Janssen","Jong","Klein","Kok","Koning","Koster","Leeuwen","Linden","Maas","Meer","Meijer","Mulder","Peters","Ruiter","Schouten","Smit","Smits","Stichting","Veen","Ven","Vermeulen","Visser","Vliet","Vos","Vries","Wal","Willems","Wit"],"prefix":["Dhr.","Mevr. Dr.","Bsc","Msc","Prof."],"suffix":["Jr.","Sr.","I","II","III","IV","V"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{tussenvoegsel} #{last_name}","#{first_name} #{tussenvoegsel} #{last_name}"]},"phone_number":{"formats":["(####) ######","##########","06########","06 #### ####"]}}},"no-nb":{"faker":{"address":{"city_root":["Fet","Gjes","Høy","Inn","Fager","Lille","Lo","Mal","Nord","Nær","Sand","Sme","Stav","Stor","Tand","Ut","Vest"],"city_suffix":["berg","borg","by","bø","dal","eid","fjell","fjord","foss","grunn","hamn","havn","helle","mark","nes","odden","sand","sjøen","stad","strand","strøm","sund","vik","vær","våg","ø","øy","ås"],"street_prefix":["Øvre","Nedre","Søndre","Gamle","Østre","Vestre"],"street_root":["Eike","Bjørke","Gran","Vass","Furu","Litj","Lille","Høy","Fosse","Elve","Ku","Konvall","Soldugg","Hestemyr","Granitt","Hegge","Rogne","Fiol","Sol","Ting","Malm","Klokker","Preste","Dam","Geiterygg","Bekke","Berg","Kirke","Kors","Bru","Blåveis","Torg","Sjø"],"street_suffix":["alléen","bakken","berget","bråten","eggen","engen","ekra","faret","flata","gata","gjerdet","grenda","gropa","hagen","haugen","havna","holtet","høgda","jordet","kollen","kroken","lia","lunden","lyngen","løkka","marka","moen","myra","plassen","ringen","roa","røa","skogen","skrenten","spranget","stien","stranda","stubben","stykket","svingen","tjernet","toppen","tunet","vollen","vika","åsen"],"common_street_suffix":["sgate","svei","s Gate","s Vei","gata","veien"],"building_number":["#","##"],"secondary_address":["Leil. ###","Oppgang A","Oppgang B"],"postcode":["####","####","####","0###"],"state":[""],"city":["#{city_root}#{city_suffix}"],"street_name":["#{street_root}#{street_suffix}","#{street_prefix} #{street_root}#{street_suffix}","#{Name.first_name}#{common_street_suffix}","#{Name.last_name}#{common_street_suffix}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Norge"]},"company":{"suffix":["Gruppen","AS","ASA","BA","RFH","og Sønner"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} og #{Name.last_name}"]},"internet":{"domain_suffix":["no","com","net","org"]},"name":{"first_name":["Emma","Sara","Thea","Ida","Julie","Nora","Emilie","Ingrid","Hanna","Maria","Sofie","Anna","Malin","Amalie","Vilde","Frida","Andrea","Tuva","Victoria","Mia","Karoline","Mathilde","Martine","Linnea","Marte","Hedda","Marie","Helene","Silje","Leah","Maja","Elise","Oda","Kristine","Aurora","Kaja","Camilla","Mari","Maren","Mina","Selma","Jenny","Celine","Eline","Sunniva","Natalie","Tiril","Synne","Sandra","Madeleine","Markus","Mathias","Kristian","Jonas","Andreas","Alexander","Martin","Sander","Daniel","Magnus","Henrik","Tobias","Kristoffer","Emil","Adrian","Sebastian","Marius","Elias","Fredrik","Thomas","Sondre","Benjamin","Jakob","Oliver","Lucas","Oskar","Nikolai","Filip","Mats","William","Erik","Simen","Ole","Eirik","Isak","Kasper","Noah","Lars","Joakim","Johannes","Håkon","Sindre","Jørgen","Herman","Anders","Jonathan","Even","Theodor","Mikkel","Aksel"],"feminine_name":["Emma","Sara","Thea","Ida","Julie","Nora","Emilie","Ingrid","Hanna","Maria","Sofie","Anna","Malin","Amalie","Vilde","Frida","Andrea","Tuva","Victoria","Mia","Karoline","Mathilde","Martine","Linnea","Marte","Hedda","Marie","Helene","Silje","Leah","Maja","Elise","Oda","Kristine","Aurora","Kaja","Camilla","Mari","Maren","Mina","Selma","Jenny","Celine","Eline","Sunniva","Natalie","Tiril","Synne","Sandra","Madeleine"],"masculine_name":["Markus","Mathias","Kristian","Jonas","Andreas","Alexander","Martin","Sander","Daniel","Magnus","Henrik","Tobias","Kristoffer","Emil","Adrian","Sebastian","Marius","Elias","Fredrik","Thomas","Sondre","Benjamin","Jakob","Oliver","Lucas","Oskar","Nikolai","Filip","Mats","William","Erik","Simen","Ole","Eirik","Isak","Kasper","Noah","Lars","Joakim","Johannes","Håkon","Sindre","Jørgen","Herman","Anders","Jonathan","Even","Theodor","Mikkel","Aksel"],"last_name":["Johansen","Hansen","Andersen","Kristiansen","Larsen","Olsen","Solberg","Andresen","Pedersen","Nilsen","Berg","Halvorsen","Karlsen","Svendsen","Jensen","Haugen","Martinsen","Eriksen","Sørensen","Johnsen","Myhrer","Johannessen","Nielsen","Hagen","Pettersen","Bakke","Skuterud","Løken","Gundersen","Strand","Jørgensen","Kvarme","Røed","Sæther","Stensrud","Moe","Kristoffersen","Jakobsen","Holm","Aas","Lie","Moen","Andreassen","Vedvik","Nguyen","Jacobsen","Torgersen","Ruud","Krogh","Christiansen","Bjerke","Aalerud","Borge","Sørlie","Berge","Østli","Ødegård","Torp","Henriksen","Haukelidsæter","Fjeld","Danielsen","Aasen","Fredriksen","Dahl","Berntsen","Arnesen","Wold","Thoresen","Solheim","Skoglund","Bakken","Amundsen","Solli","Smogeli","Kristensen","Glosli","Fossum","Evensen","Eide","Carlsen","Østby","Vegge","Tangen","Smedsrud","Olstad","Lunde","Kleven","Huseby","Bjørnstad","Ryan","Rasmussen","Nygård","Nordskaug","Nordby","Mathisen","Hopland","Gran","Finstad","Edvardsen"],"prefix":["Dr.","Prof."],"suffix":["Jr.","Sr.","I","II","III","IV","V"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{feminine_name} #{feminine_name} #{last_name}","#{masculine_name} #{masculine_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["########","## ## ## ##","### ## ###","+47 ## ## ## ##"]}}},"pl":{"faker":{"name":{"first_name":["Aaron","Abraham","Adam","Adrian","Atanazy","Agaton","Alan","Albert","Aleksander","Aleksy","Alfred","Alwar","Ambroży","Anatol","Andrzej","Antoni","Apollinary","Apollo","Arkady","Arkadiusz","Archibald","Arystarch","Arnold","Arseniusz","Artur","August","Baldwin","Bazyli","Benedykt","Beniamin","Bernard","Bertrand","Bertram","Borys","Brajan","Bruno","Cezary","Cecyliusz","Karol","Krystian","Krzysztof","Klarencjusz","Klaudiusz","Klemens","Konrad","Konstanty","Konstantyn","Kornel","Korneliusz","Korneli","Cyryl","Cyrus","Damian","Daniel","Dariusz","Dawid","Dionizy","Demetriusz","Dominik","Donald","Dorian","Edgar","Edmund","Edward","Edwin","Efrem","Efraim","Eliasz","Eleazar","Emil","Emanuel","Erast","Ernest","Eugeniusz","Eustracjusz","Fabian","Feliks","Florian","Franciszek","Fryderyk","Gabriel","Gedeon","Galfryd","Jerzy","Gerald","Gerazym","Gilbert","Gonsalwy","Grzegorz","Gwido","Harald","Henryk","Herbert","Herman","Hilary","Horacy","Hubert","Hugo","Ignacy","Igor","Hilarion","Innocenty","Hipolit","Ireneusz","Erwin","Izaak","Izajasz","Izydor","Jakub","Jeremi","Jeremiasz","Hieronim","Gerald","Joachim","Jan","Janusz","Jonatan","Józef","Jozue","Julian","Juliusz","Justyn","Kalistrat","Kazimierz","Wawrzyniec","Laurenty","Laurencjusz","Łazarz","Leon","Leonard","Leonid","Leon","Ludwik","Łukasz","Lucjan","Magnus","Makary","Marceli","Marek","Marcin","Mateusz","Maurycy","Maksym","Maksymilian","Michał","Miron","Modest","Mojżesz","Natan","Natanael","Nazariusz","Nazary","Nestor","Mikołaj","Nikodem","Olaf","Oleg","Oliwier","Onufry","Orestes","Oskar","Ansgary","Osmund","Pankracy","Pantaleon","Patryk","Patrycjusz","Patrycy","Paweł","Piotr","Filemon","Filip","Platon","Polikarp","Porfiry","Porfiriusz","Prokles","Prokul","Prokop","Kwintyn","Randolf","Rafał","Rajmund","Reginald","Rajnold","Ryszard","Robert","Roderyk","Roger","Roland","Roman","Romeo","Reginald","Rudolf","Samson","Samuel","Salwator","Sebastian","Serafin","Sergiusz","Seweryn","Zygmunt","Sylwester","Szymon","Salomon","Spirydion","Stanisław","Szczepan","Stefan","Terencjusz","Teodor","Tomasz","Tymoteusz","Tobiasz","Walenty","Walentyn","Walerian","Walery","Wiktor","Wincenty","Witalis","Włodzimierz","Władysław","Błażej","Walter","Walgierz","Wacław","Wilfryd","Wilhelm","Ksawery","Ksenofont","Jerzy","Zachariasz","Zachary","Ada","Adelajda","Agata","Agnieszka","Agrypina","Aida","Aleksandra","Alicja","Alina","Amanda","Anastazja","Angela","Andżelika","Angelina","Anna","Hanna","—","Antonina","Ariadna","Aurora","Barbara","Beatrycze","Berta","Brygida","Kamila","Karolina","Karolina","Kornelia","Katarzyna","Cecylia","Karolina","Chloe","Krystyna","Klara","Klaudia","Klementyna","Konstancja","Koralia","Daria","Diana","Dina","Dorota","Edyta","Eleonora","Eliza","Elżbieta","Izabela","Elwira","Emilia","Estera","Eudoksja","Eudokia","Eugenia","Ewa","Ewelina","Ferdynanda","Florencja","Franciszka","Gabriela","Gertruda","Gloria","Gracja","Jadwiga","Helena","Henryka","Nadzieja","Ida","Ilona","Helena","Irena","Irma","Izabela","Izolda","Jakubina","Joanna","Janina","Żaneta","Joanna","Ginewra","Józefina","Judyta","Julia","Julia","Julita","Justyna","Kira","Cyra","Kleopatra","Larysa","Laura","Laurencja","Laurentyna","Lea","Leila","Eleonora","Liliana","Lilianna","Lilia","Lilla","Liza","Eliza","Laura","Ludwika","Luiza","Łucja","Lucja","Lidia","Amabela","Magdalena","Malwina","Małgorzata","Greta","Marianna","Maryna","Marta","Martyna","Maria","Matylda","Maja","Maja","Melania","Michalina","Monika","Nadzieja","Noemi","Natalia","Nikola","Nina","Olga","Olimpia","Oliwia","Ofelia","Patrycja","Paula","Pelagia","Penelopa","Filipa","Paulina","Rachela","Rebeka","Regina","Renata","Rozalia","Róża","Roksana","Rufina","Ruta","Sabina","Sara","Serafina","Sybilla","Sylwia","Zofia","Stella","Stefania","Zuzanna","Tamara","Tacjana","Tekla","Teodora","Teresa","Walentyna","Waleria","Wanesa","Wiara","Weronika","Wiktoria","Wirginia","Bibiana","Bibianna","Wanda","Wilhelmina","Ksawera","Ksenia","Zoe"],"last_name":["Adamczak","Adamczyk","Adamek","Adamiak","Adamiec","Adamowicz","Adamski","Adamus","Aleksandrowicz","Andrzejczak","Andrzejewski","Antczak","Augustyn","Augustyniak","Bagiński","Balcerzak","Banach","Banasiak","Banasik","Banaś","Baran","Baranowski","Barański","Bartczak","Bartkowiak","Bartnik","Bartosik","Bednarczyk","Bednarek","Bednarski","Bednarz","Białas","Białek","Białkowski","Bielak","Bielawski","Bielecki","Bielski","Bieniek","Biernacki","Biernat","Bieńkowski","Bilski","Bober","Bochenek","Bogucki","Bogusz","Borek","Borkowski","Borowiec","Borowski","Bożek","Broda","Brzeziński","Brzozowski","Buczek","Buczkowski","Buczyński","Budziński","Budzyński","Bujak","Bukowski","Burzyński","Bąk","Bąkowski","Błaszczak","Błaszczyk","Cebula","Chmiel","Chmielewski","Chmura","Chojnacki","Chojnowski","Cholewa","Chrzanowski","Chudzik","Cichocki","Cichoń","Cichy","Ciesielski","Cieśla","Cieślak","Cieślik","Ciszewski","Cybulski","Cygan","Czaja","Czajka","Czajkowski","Czapla","Czarnecki","Czech","Czechowski","Czekaj","Czerniak","Czerwiński","Czyż","Czyżewski","Dec","Dobosz","Dobrowolski","Dobrzyński","Domagała","Domański","Dominiak","Drabik","Drozd","Drozdowski","Drzewiecki","Dróżdż","Dubiel","Duda","Dudek","Dudziak","Dudzik","Dudziński","Duszyński","Dziedzic","Dziuba","Dąbek","Dąbkowski","Dąbrowski","Dębowski","Dębski","Długosz","Falkowski","Fijałkowski","Filipek","Filipiak","Filipowicz","Flak","Flis","Florczak","Florek","Frankowski","Frąckowiak","Frączek","Frątczak","Furman","Gadomski","Gajda","Gajewski","Gaweł","Gawlik","Gawron","Gawroński","Gałka","Gałązka","Gil","Godlewski","Golec","Gołąb","Gołębiewski","Gołębiowski","Grabowski","Graczyk","Grochowski","Grudzień","Gruszczyński","Gruszka","Grzegorczyk","Grzelak","Grzesiak","Grzesik","Grześkowiak","Grzyb","Grzybowski","Grzywacz","Gutowski","Guzik","Gwóźdź","Góra","Góral","Górecki","Górka","Górniak","Górny","Górski","Gąsior","Gąsiorowski","Głogowski","Głowacki","Głąb","Hajduk","Herman","Iwański","Izdebski","Jabłoński","Jackowski","Jagielski","Jagiełło","Jagodziński","Jakubiak","Jakubowski","Janas","Janiak","Janicki","Janik","Janiszewski","Jankowiak","Jankowski","Janowski","Janus","Janusz","Januszewski","Jaros","Jarosz","Jarząbek","Jasiński","Jastrzębski","Jaworski","Jaśkiewicz","Jezierski","Jurek","Jurkiewicz","Jurkowski","Juszczak","Jóźwiak","Jóźwik","Jędrzejczak","Jędrzejczyk","Jędrzejewski","Kacprzak","Kaczmarczyk","Kaczmarek","Kaczmarski","Kaczor","Kaczorowski","Kaczyński","Kaleta","Kalinowski","Kalisz","Kamiński","Kania","Kaniewski","Kapusta","Karaś","Karczewski","Karpiński","Karwowski","Kasperek","Kasprzak","Kasprzyk","Kaszuba","Kawa","Kawecki","Kałuża","Kaźmierczak","Kiełbasa","Kisiel","Kita","Klimczak","Klimek","Kmiecik","Kmieć","Knapik","Kobus","Kogut","Kolasa","Komorowski","Konieczna","Konieczny","Konopka","Kopczyński","Koper","Kopeć","Korzeniowski","Kos","Kosiński","Kosowski","Kostecki","Kostrzewa","Kot","Kotowski","Kowal","Kowalczuk","Kowalczyk","Kowalewski","Kowalik","Kowalski","Koza","Kozak","Kozieł","Kozioł","Kozłowski","Kołakowski","Kołodziej","Kołodziejczyk","Kołodziejski","Krajewski","Krakowiak","Krawczyk","Krawiec","Kruk","Krukowski","Krupa","Krupiński","Kruszewski","Krysiak","Krzemiński","Krzyżanowski","Król","Królikowski","Książek","Kubacki","Kubiak","Kubica","Kubicki","Kubik","Kuc","Kucharczyk","Kucharski","Kuchta","Kuciński","Kuczyński","Kujawa","Kujawski","Kula","Kulesza","Kulig","Kulik","Kuliński","Kurek","Kurowski","Kuś","Kwaśniewski","Kwiatkowski","Kwiecień","Kwieciński","Kędzierski","Kędziora","Kępa","Kłos","Kłosowski","Lach","Laskowski","Lasota","Lech","Lenart","Lesiak","Leszczyński","Lewandowski","Lewicki","Leśniak","Leśniewski","Lipiński","Lipka","Lipski","Lis","Lisiecki","Lisowski","Maciejewski","Maciąg","Mackiewicz","Madej","Maj","Majcher","Majchrzak","Majewski","Majka","Makowski","Malec","Malicki","Malinowski","Maliszewski","Marchewka","Marciniak","Marcinkowski","Marczak","Marek","Markiewicz","Markowski","Marszałek","Marzec","Masłowski","Matusiak","Matuszak","Matuszewski","Matysiak","Mazur","Mazurek","Mazurkiewicz","Maćkowiak","Małecki","Małek","Maślanka","Michalak","Michalczyk","Michalik","Michalski","Michałek","Michałowski","Mielczarek","Mierzejewski","Mika","Mikołajczak","Mikołajczyk","Mikulski","Milczarek","Milewski","Miller","Misiak","Misztal","Miśkiewicz","Modzelewski","Molenda","Morawski","Motyka","Mroczek","Mroczkowski","Mrozek","Mróz","Mucha","Murawski","Musiał","Muszyński","Młynarczyk","Napierała","Nawrocki","Nawrot","Niedziela","Niedzielski","Niedźwiecki","Niemczyk","Niemiec","Niewiadomski","Noga","Nowacki","Nowaczyk","Nowak","Nowakowski","Nowicki","Nowiński","Olczak","Olejniczak","Olejnik","Olszewski","Orzechowski","Orłowski","Osiński","Ossowski","Ostrowski","Owczarek","Paczkowski","Pająk","Pakuła","Paluch","Panek","Partyka","Pasternak","Paszkowski","Pawelec","Pawlak","Pawlicki","Pawlik","Pawlikowski","Pawłowski","Pałka","Piasecki","Piechota","Piekarski","Pietras","Pietruszka","Pietrzak","Pietrzyk","Pilarski","Pilch","Piotrowicz","Piotrowski","Piwowarczyk","Piórkowski","Piątek","Piątkowski","Piłat","Pluta","Podgórski","Polak","Popławski","Porębski","Prokop","Prus","Przybylski","Przybysz","Przybył","Przybyła","Ptak","Puchalski","Pytel","Płonka","Raczyński","Radecki","Radomski","Rak","Rakowski","Ratajczak","Robak","Rogala","Rogalski","Rogowski","Rojek","Romanowski","Rosa","Rosiak","Rosiński","Ruciński","Rudnicki","Rudziński","Rudzki","Rusin","Rutkowski","Rybak","Rybarczyk","Rybicki","Rzepka","Różański","Różycki","Sadowski","Sawicki","Serafin","Siedlecki","Sienkiewicz","Sieradzki","Sikora","Sikorski","Sitek","Siwek","Skalski","Skiba","Skibiński","Skoczylas","Skowron","Skowronek","Skowroński","Skrzypczak","Skrzypek","Skóra","Smoliński","Sobczak","Sobczyk","Sobieraj","Sobolewski","Socha","Sochacki","Sokołowski","Sokół","Sosnowski","Sowa","Sowiński","Sołtys","Sołtysiak","Sroka","Stachowiak","Stachowicz","Stachura","Stachurski","Stanek","Staniszewski","Stanisławski","Stankiewicz","Stasiak","Staszewski","Stawicki","Stec","Stefaniak","Stefański","Stelmach","Stolarczyk","Stolarski","Strzelczyk","Strzelecki","Stępień","Stępniak","Surma","Suski","Szafrański","Szatkowski","Szczepaniak","Szczepanik","Szczepański","Szczerba","Szcześniak","Szczygieł","Szczęsna","Szczęsny","Szeląg","Szewczyk","Szostak","Szulc","Szwarc","Szwed","Szydłowski","Szymański","Szymczak","Szymczyk","Szymkowiak","Szyszka","Sławiński","Słowik","Słowiński","Tarnowski","Tkaczyk","Tokarski","Tomala","Tomaszewski","Tomczak","Tomczyk","Tracz","Trojanowski","Trzciński","Trzeciak","Turek","Twardowski","Urban","Urbanek","Urbaniak","Urbanowicz","Urbańczyk","Urbański","Walczak","Walkowiak","Warchoł","Wasiak","Wasilewski","Wawrzyniak","Wesołowski","Wieczorek","Wierzbicki","Wilczek","Wilczyński","Wilk","Winiarski","Witczak","Witek","Witkowski","Wiącek","Więcek","Więckowski","Wiśniewski","Wnuk","Wojciechowski","Wojtas","Wojtasik","Wojtczak","Wojtkowiak","Wolak","Woliński","Wolny","Wolski","Woś","Woźniak","Wrona","Wroński","Wróbel","Wróblewski","Wypych","Wysocki","Wyszyński","Wójcicki","Wójcik","Wójtowicz","Wąsik","Węgrzyn","Włodarczyk","Włodarski","Zaborowski","Zabłocki","Zagórski","Zając","Zajączkowski","Zakrzewski","Zalewski","Zaremba","Zarzycki","Zaręba","Zawada","Zawadzki","Zdunek","Zieliński","Zielonka","Ziółkowski","Zięba","Ziętek","Zwoliński","Zych","Zygmunt","Łapiński","Łuczak","Łukasiewicz","Łukasik","Łukaszewski","Śliwa","Śliwiński","Ślusarczyk","Świderski","Świerczyński","Świątek","Żak","Żebrowski","Żmuda","Żuk","Żukowski","Żurawski","Żurek","Żyła"],"prefix":["Pan","Pani"],"title":{"descriptor":["Lead","Senior","Direct","Corporate","Dynamic","Future","Product","National","Regional","District","Central","Global","Customer","Investor","Dynamic","International","Legacy","Forward","Internal","Human","Chief","Principal"],"level":["Solutions","Program","Brand","Security","Research","Marketing","Directives","Implementation","Integration","Functionality","Response","Paradigm","Tactics","Identity","Markets","Group","Division","Applications","Optimization","Operations","Infrastructure","Intranet","Communications","Web","Branding","Quality","Assurance","Mobility","Accounts","Data","Creative","Configuration","Accountability","Interactions","Factors","Usability","Metrics"],"job":["Supervisor","Associate","Executive","Liason","Officer","Manager","Engineer","Specialist","Director","Coordinator","Administrator","Architect","Analyst","Designer","Planner","Orchestrator","Technician","Developer","Producer","Consultant","Assistant","Facilitator","Agent","Representative","Strategist"]},"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"address":{"country":["Afganistan","Albania","Algieria","Andora","Angola","Antigua i Barbuda","Arabia Saudyjska","Argentyna","Armenia","Australia","Austria","Azerbejdżan","Bahamy","Bahrajn","Bangladesz","Barbados","Belgia","Belize","Benin","Bhutan","Białoruś","Birma","Boliwia","Sucre","Bośnia i Hercegowina","Botswana","Brazylia","Brunei","Bułgaria","Burkina Faso","Burundi","Chile","Chiny","Chorwacja","Cypr","Czad","Czarnogóra","Czechy","Dania","Demokratyczna Republika Konga","Dominika","Dominikana","Dżibuti","Egipt","Ekwador","Erytrea","Estonia","Etiopia","Fidżi","Filipiny","Finlandia","Francja","Gabon","Gambia","Ghana","Grecja","Grenada","Gruzja","Gujana","Gwatemala","Gwinea","Gwinea Bissau","Gwinea Równikowa","Haiti","Hiszpania","Holandia","Haga","Honduras","Indie","Indonezja","Irak","Iran","Irlandia","Islandia","Izrael","Jamajka","Japonia","Jemen","Jordania","Kambodża","Kamerun","Kanada","Katar","Kazachstan","Kenia","Kirgistan","Kiribati","Kolumbia","Komory","Kongo","Korea Południowa","Korea Północna","Kostaryka","Kuba","Kuwejt","Laos","Lesotho","Liban","Liberia","Libia","Liechtenstein","Litwa","Luksemburg","Łotwa","Macedonia","Madagaskar","Malawi","Malediwy","Malezja","Mali","Malta","Maroko","Mauretania","Mauritius","Meksyk","Mikronezja","Mołdawia","Monako","Mongolia","Mozambik","Namibia","Nauru","Nepal","Niemcy","Niger","Nigeria","Nikaragua","Norwegia","Nowa Zelandia","Oman","Pakistan","Palau","Panama","Papua-Nowa Gwinea","Paragwaj","Peru","Polska","322 575","Portugalia","Republika Południowej Afryki","Republika Środkowoafrykańska","Republika Zielonego Przylądka","Rosja","Rumunia","Rwanda","Saint Kitts i Nevis","Saint Lucia","Saint Vincent i Grenadyny","Salwador","Samoa","San Marino","Senegal","Serbia","Seszele","Sierra Leone","Singapur","Słowacja","Słowenia","Somalia","Sri Lanka","Stany Zjednoczone","Suazi","Sudan","Sudan Południowy","Surinam","Syria","Szwajcaria","Szwecja","Tadżykistan","Tajlandia","Tanzania","Timor Wschodni","Togo","Tonga","Trynidad i Tobago","Tunezja","Turcja","Turkmenistan","Tuvalu","Funafuti","Uganda","Ukraina","Urugwaj",2008,"Uzbekistan","Vanuatu","Watykan","Wenezuela","Węgry","Wielka Brytania","Wietnam","Włochy","Wybrzeże Kości Słoniowej","Wyspy Marshalla","Wyspy Salomona","Wyspy Świętego Tomasza i Książęca","Zambia","Zimbabwe","Zjednoczone Emiraty Arabskie"],"building_number":["#####","####","###"],"street_prefix":["ul. ","al. "],"secondary_address":["Apt. ###","Suite ###"],"postcode":["##-###"],"state":["Dolnośląskie","Kujawsko-pomorskie","Lubelskie","Lubuskie","Łódzkie","Małopolskie","Mazowieckie","Opolskie","Podkarpackie","Podlaskie","Pomorskie","Śląskie","Świętokrzyskie","Warmińsko-mazurskie","Wielkopolskie","Zachodniopomorskie"],"state_abbr":["DŚ","KP","LB","LS","ŁD","MP","MZ","OP","PK","PL","PM","ŚL","ŚK","WM","WP","ZP"],"city_name":["Aleksandrów Kujawski","Aleksandrów Łódzki","Alwernia","Andrychów","Annopol","Augustów","Babimost","Baborów","Baranów Sandomierski","Barcin","Barczewo","Bardo","Barlinek","Bartoszyce","Barwice","Bełchatów","Bełżyce","Będzin","Biała","Biała Piska","Biała Podlaska","Biała Rawska","Białobrzegi","Białogard","Biały Bór","Białystok","Biecz","Bielawa","Bielsk Podlaski","Bielsko-Biała","Bieruń","Bierutów","Bieżuń","Biłgoraj","Biskupiec","Bisztynek","Blachownia","Błaszki","Błażowa","Błonie","Bobolice","Bobowa","Bochnia","Bodzentyn","Bogatynia","Boguchwała","Boguszów-Gorce","Bojanowo","Bolesławiec","Bolków","Borek Wielkopolski","Borne Sulinowo","Braniewo","Brańsk","Brodnica","Brok","Brusy","Brwinów","Brzeg","Brzeg Dolny","Brzesko","Brzeszcze","Brześć Kujawski","Brzeziny","Brzostek","Brzozów","Buk","Bukowno","Busko-Zdrój","Bychawa","Byczyna","Bydgoszcz","Bystrzyca Kłodzka","Bytom","Bytom Odrzański","Bytów","Cedynia","Chełm","Chełmek","Chełmno","Chełmża","Chęciny","Chmielnik","Chocianów","Chociwel","Chodecz","Chodzież","Chojna","Chojnice","Chojnów","Choroszcz","Chorzele","Chorzów","Choszczno","Chrzanów","Ciechanowiec","Ciechanów","Ciechocinek","Cieszanów","Cieszyn","Ciężkowice","Cybinka","Czaplinek","Czarna Białostocka","Czarna Woda","Czarne","Czarnków","Czchów","Czechowice-Dziedzice","Czeladź","Czempiń","Czerniejewo","Czersk","Czerwieńsk","Czerwionka-Leszczyny","Częstochowa","Człopa","Człuchów","Czyżew","Ćmielów","Daleszyce","Darłowo","Dąbie","Dąbrowa Białostocka","Dąbrowa Górnicza","Dąbrowa Tarnowska","Debrzno","Dębica","Dęblin","Dębno","Dobczyce","Dobiegniew","Dobra (powiat łobeski)","Dobra (powiat turecki)","Dobre Miasto","Dobrodzień","Dobrzany","Dobrzyń nad Wisłą","Dolsk","Drawno","Drawsko Pomorskie","Drezdenko","Drobin","Drohiczyn","Drzewica","Dukla","Duszniki-Zdrój","Dynów","Działdowo","Działoszyce","Działoszyn","Dzierzgoń","Dzierżoniów","Dziwnów","Elbląg","Ełk","Frampol","Frombork","Garwolin","Gąbin","Gdańsk","Gdynia","Giżycko","Glinojeck","Gliwice","Głogów","Głogów Małopolski","Głogówek","Głowno","Głubczyce","Głuchołazy","Głuszyca","Gniew","Gniewkowo","Gniezno","Gogolin","Golczewo","Goleniów","Golina","Golub-Dobrzyń","Gołańcz","Gołdap","Goniądz","Gorlice","Gorzów Śląski","Gorzów Wielkopolski","Gostynin","Gostyń","Gościno","Gozdnica","Góra","Góra Kalwaria","Górowo Iławeckie","Górzno","Grabów nad Prosną","Grajewo","Grodków","Grodzisk Mazowiecki","Grodzisk Wielkopolski","Grójec","Grudziądz","Grybów","Gryfice","Gryfino","Gryfów Śląski","Gubin","Hajnówka","Halinów","Hel","Hrubieszów","Iława","Iłowa","Iłża","Imielin","Inowrocław","Ińsko","Iwonicz-Zdrój","Izbica Kujawska","Jabłonowo Pomorskie","Janikowo","Janowiec Wielkopolski","Janów Lubelski","Jarocin","Jarosław","Jasień","Jasło","Jastarnia","Jastrowie","Jastrzębie-Zdrój","Jawor","Jaworzno","Jaworzyna Śląska","Jedlicze","Jedlina-Zdrój","Jedwabne","Jelcz-Laskowice","Jelenia Góra","Jeziorany","Jędrzejów","Jordanów","Józefów (powiat biłgorajski)","Józefów (powiat otwocki)","Jutrosin","Kalety","Kalisz","Kalisz Pomorski","Kalwaria Zebrzydowska","Kałuszyn","Kamienna Góra","Kamień Krajeński","Kamień Pomorski","Kamieńsk","Kańczuga","Karczew","Kargowa","Karlino","Karpacz","Kartuzy","Katowice","Kazimierz Dolny","Kazimierza Wielka","Kąty Wrocławskie","Kcynia","Kędzierzyn-Koźle","Kępice","Kępno","Kętrzyn","Kęty","Kielce","Kietrz","Kisielice","Kleczew","Kleszczele","Kluczbork","Kłecko","Kłobuck","Kłodawa","Kłodzko","Knurów","Knyszyn","Kobylin","Kobyłka","Kock","Kolbuszowa","Kolno","Kolonowskie","Koluszki","Kołaczyce","Koło","Kołobrzeg","Koniecpol","Konin","Konstancin-Jeziorna","Konstantynów Łódzki","Końskie","Koprzywnica","Korfantów","Koronowo","Korsze","Kosów Lacki","Kostrzyn","Kostrzyn nad Odrą","Koszalin","Kościan","Kościerzyna","Kowal","Kowalewo Pomorskie","Kowary","Koziegłowy","Kozienice","Koźmin Wielkopolski","Kożuchów","Kórnik","Krajenka","Kraków","Krapkowice","Krasnobród","Krasnystaw","Kraśnik","Krobia","Krosno","Krosno Odrzańskie","Krośniewice","Krotoszyn","Kruszwica","Krynica Morska","Krynica-Zdrój","Krynki","Krzanowice","Krzepice","Krzeszowice","Krzywiń","Krzyż Wielkopolski","Książ Wielkopolski","Kudowa-Zdrój","Kunów","Kutno","Kuźnia Raciborska","Kwidzyn","Lądek-Zdrój","Legionowo","Legnica","Lesko","Leszno","Leśna","Leśnica","Lewin Brzeski","Leżajsk","Lębork","Lędziny","Libiąż","Lidzbark","Lidzbark Warmiński","Limanowa","Lipiany","Lipno","Lipsk","Lipsko","Lubaczów","Lubań","Lubartów","Lubawa","Lubawka","Lubień Kujawski","Lubin","Lublin","Lubliniec","Lubniewice","Lubomierz","Luboń","Lubraniec","Lubsko","Lwówek","Lwówek Śląski","Łabiszyn","Łańcut","Łapy","Łasin","Łask","Łaskarzew","Łaszczów","Łaziska Górne","Łazy","Łeba","Łęczna","Łęczyca","Łęknica","Łobez","Łobżenica","Łochów","Łomianki","Łomża","Łosice","Łowicz","Łódź","Łuków","Maków Mazowiecki","Maków Podhalański","Malbork","Małogoszcz","Małomice","Margonin","Marki","Maszewo","Miasteczko Śląskie","Miastko","Michałowo","Miechów","Miejska Górka","Mielec","Mieroszów","Mieszkowice","Międzybórz","Międzychód","Międzylesie","Międzyrzec Podlaski","Międzyrzecz","Międzyzdroje","Mikołajki","Mikołów","Mikstat","Milanówek","Milicz","Miłakowo","Miłomłyn","Miłosław","Mińsk Mazowiecki","Mirosławiec","Mirsk","Mława","Młynary","Mogielnica","Mogilno","Mońki","Morąg","Mordy","Moryń","Mosina","Mrągowo","Mrocza","Mszana Dolna","Mszczonów","Murowana Goślina","Muszyna","Mysłowice","Myszków","Myszyniec","Myślenice","Myślibórz","Nakło nad Notecią","Nałęczów","Namysłów","Narol","Nasielsk","Nekla","Nidzica","Niemcza","Niemodlin","Niepołomice","Nieszawa","Nisko","Nowa Dęba","Nowa Ruda","Nowa Sarzyna","Nowa Sól","Nowe","Nowe Brzesko","Nowe Miasteczko","Nowe Miasto Lubawskie","Nowe Miasto nad Pilicą","Nowe Skalmierzyce","Nowe Warpno","Nowogard","Nowogrodziec","Nowogród","Nowogród Bobrzański","Nowy Dwór Gdański","Nowy Dwór Mazowiecki","Nowy Sącz","Nowy Staw","Nowy Targ","Nowy Tomyśl","Nowy Wiśnicz","Nysa","Oborniki","Oborniki Śląskie","Obrzycko","Odolanów","Ogrodzieniec","Okonek","Olecko","Olesno","Oleszyce","Oleśnica","Olkusz","Olsztyn","Olsztynek","Olszyna","Oława","Opalenica","Opatów","Opoczno","Opole","Opole Lubelskie","Orneta","Orzesze","Orzysz","Osieczna","Osiek","Ostrołęka","Ostroróg","Ostrowiec Świętokrzyski","Ostróda","Ostrów Lubelski","Ostrów Mazowiecka","Ostrów Wielkopolski","Ostrzeszów","Ośno Lubuskie","Oświęcim","Otmuchów","Otwock","Ozimek","Ozorków","Ożarów","Ożarów Mazowiecki","Pabianice","Paczków","Pajęczno","Pakość","Parczew","Pasłęk","Pasym","Pelplin","Pełczyce","Piaseczno","Piaski","Piastów","Piechowice","Piekary Śląskie","Pieniężno","Pieńsk","Pieszyce","Pilawa","Pilica","Pilzno","Piła","Piława Górna","Pińczów","Pionki","Piotrków Kujawski","Piotrków Trybunalski","Pisz","Piwniczna-Zdrój","Pleszew","Płock","Płońsk","Płoty","Pniewy","Pobiedziska","Poddębice","Podkowa Leśna","Pogorzela","Polanica-Zdrój","Polanów","Police","Polkowice","Połaniec","Połczyn-Zdrój","Poniatowa","Poniec","Poręba","Poznań","Prabuty","Praszka","Prochowice","Proszowice","Prószków","Pruchnik","Prudnik","Prusice","Pruszcz Gdański","Pruszków","Przasnysz","Przecław","Przedbórz","Przedecz","Przemków","Przemyśl","Przeworsk","Przysucha","Pszczyna","Pszów","Puck","Puławy","Pułtusk","Puszczykowo","Pyrzyce","Pyskowice","Pyzdry","Rabka-Zdrój","Raciąż","Racibórz","Radków","Radlin","Radłów","Radom","Radomsko","Radomyśl Wielki","Radymno","Radziejów","Radzionków","Radzymin","Radzyń Chełmiński","Radzyń Podlaski","Rajgród","Rakoniewice","Raszków","Rawa Mazowiecka","Rawicz","Recz","Reda","Rejowiec Fabryczny","Resko","Reszel","Rogoźno","Ropczyce","Różan","Ruciane-Nida","Ruda Śląska","Rudnik nad Sanem","Rumia","Rybnik","Rychwał","Rydułtowy","Rydzyna","Ryglice","Ryki","Rymanów","Ryn","Rypin","Rzepin","Rzeszów","Rzgów","Sandomierz","Sanok","Sejny","Serock","Sędziszów","Sędziszów Małopolski","Sępopol","Sępólno Krajeńskie","Sianów","Siechnice","Siedlce","Siemianowice Śląskie","Siemiatycze","Sieniawa","Sieradz","Sieraków","Sierpc","Siewierz","Skalbmierz","Skała","Skarszewy","Skaryszew","Skarżysko-Kamienna","Skawina","Skępe","Skierniewice","Skoczów","Skoki","Skórcz","Skwierzyna","Sława","Sławków","Sławno","Słomniki","Słubice","Słupca","Słupsk","Sobótka","Sochaczew","Sokołów Małopolski","Sokołów Podlaski","Sokółka","Solec Kujawski","Sompolno","Sopot","Sosnowiec","Sośnicowice","Stalowa Wola","Starachowice","Stargard Szczeciński","Starogard Gdański","Stary Sącz","Staszów","Stawiski","Stawiszyn","Stąporków","Stęszew","Stoczek Łukowski","Stronie Śląskie","Strumień","Stryków","Strzegom","Strzelce Krajeńskie","Strzelce Opolskie","Strzelin","Strzelno","Strzyżów","Sucha Beskidzka","Suchań","Suchedniów","Suchowola","Sulechów","Sulejów","Sulejówek","Sulęcin","Sulmierzyce","Sułkowice","Supraśl","Suraż","Susz","Suwałki","Swarzędz","Syców","Szadek","Szamocin","Szamotuły","Szczawnica","Szczawno-Zdrój","Szczebrzeszyn","Szczecin","Szczecinek","Szczekociny","Szczucin","Szczuczyn","Szczyrk","Szczytna","Szczytno","Szepietowo","Szklarska Poręba","Szlichtyngowa","Szprotawa","Sztum","Szubin","Szydłowiec","Ścinawa","Ślesin","Śmigiel","Śrem","Środa Śląska","Środa Wielkopolska","Świątniki Górne","Świdnica","Świdnik","Świdwin","Świebodzice","Świebodzin","Świecie","Świeradów-Zdrój","Świerzawa","Świętochłowice","Świnoujście","Tarczyn","Tarnobrzeg","Tarnogród","Tarnowskie Góry","Tarnów","Tczew","Terespol","Tłuszcz","Tolkmicko","Tomaszów Lubelski","Tomaszów Mazowiecki","Toruń","Torzym","Toszek","Trzcianka","Trzciel","Trzcińsko-Zdrój","Trzebiatów","Trzebinia","Trzebnica","Trzemeszno","Tuchola","Tuchów","Tuczno","Tuliszków","Turek","Tuszyn","Twardogóra","Tychowo","Tychy","Tyczyn","Tykocin","Tyszowce","Ujazd","Ujście","Ulanów","Uniejów","Ustka","Ustroń","Ustrzyki Dolne","Wadowice","Wałbrzych","Wałcz","Warka","Warszawa","Warta","Wasilków","Wąbrzeźno","Wąchock","Wągrowiec","Wąsosz","Wejherowo","Węgliniec","Węgorzewo","Węgorzyno","Węgrów","Wiązów","Wieleń","Wielichowo","Wieliczka","Wieluń","Wieruszów","Więcbork","Wilamowice","Wisła","Witkowo","Witnica","Wleń","Władysławowo","Włocławek","Włodawa","Włoszczowa","Wodzisław Śląski","Wojcieszów","Wojkowice","Wojnicz","Wolbórz","Wolbrom","Wolin","Wolsztyn","Wołczyn","Wołomin","Wołów","Woźniki","Wrocław","Wronki","Września","Wschowa","Wyrzysk","Wysoka","Wysokie Mazowieckie","Wyszków","Wyszogród","Wyśmierzyce","Zabłudów","Zabrze","Zagórów","Zagórz","Zakliczyn","Zakopane","Zakroczym","Zalewo","Zambrów","Zamość","Zator","Zawadzkie","Zawichost","Zawidów","Zawiercie","Ząbki","Ząbkowice Śląskie","Zbąszynek","Zbąszyń","Zduny","Zduńska Wola","Zdzieszowice","Zelów","Zgierz","Zgorzelec","Zielona Góra","Zielonka","Ziębice","Złocieniec","Złoczew","Złotoryja","Złotów","Złoty Stok","Zwierzyniec","Zwoleń","Żabno","Żagań","Żarki","Żarów","Żary","Żelechów","Żerków","Żmigród","Żnin","Żory","Żukowo","Żuromin","Żychlin","Żyrardów","Żywiec"],"city":["#{city_name}"],"street_name":["#{street_prefix} #{Name.last_name}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Polska"]},"company":{"suffix":["Inc","and Sons","LLC","Group"],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","assymetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} and #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","pl","com.pl","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"phone_number":{"formats":["61-####-###"]},"cell_phone":{"formats":["50#-###-###","51#-###-###","53#-###-###","60#-###-###","66#-###-###"]}}},"pt-br":{"faker":{"address":{"city_prefix":["Nova","Velha","Grande","Vila","Município de"],"city_suffix":["do Descoberto","de Nossa Senhora","do Norte","do Sul"],"country":["Afeganistão","Albânia","Algéria","Samoa","Andorra","Angola","Anguilla","Antigua and Barbada","Argentina","Armênia","Aruba","Austrália","Áustria","Alzerbajão","Bahamas","Barém","Bangladesh","Barbado","Belgrado","Bélgica","Belize","Benin","Bermuda","Bhutan","Bolívia","Bôsnia","Botuasuna","Bouvetoia","Brasil","Arquipélago de Chagos","Ilhas Virgens","Brunei","Bulgária","Burkina Faso","Burundi","Cambójia","Camarões","Canadá","Cabo Verde","Ilhas Caiman","República da África Central","Chad","Chile","China","Ilhas Natal","Ilhas Cocos","Colômbia","Comoros","Congo","Ilhas Cook","Costa Rica","Costa do Marfim","Croácia","Cuba","Cyprus","República Tcheca","Dinamarca","Djibouti","Dominica","República Dominicana","Equador","Egito","El Salvador","Guiné Equatorial","Eritrea","Estônia","Etiópia","Ilhas Faroe","Malvinas","Fiji","Finlândia","França","Guiné Francesa","Polinésia Francesa","Gabão","Gâmbia","Georgia","Alemanha","Gana","Gibraltar","Grécia","Groelândia","Granada","Guadalupe","Guano","Guatemala","Guernsey","Guiné","Guiné-Bissau","Guiana","Haiti","Heard Island and McDonald Islands","Vaticano","Honduras","Hong Kong","Hungria","Iceland","Índia","Indonésia","Irã","Iraque","Irlanda","Ilha de Man","Israel","Itália","Jamaica","Japão","Jersey","Jordânia","Cazaquistão","Quênia","Kiribati","Coreia do Norte","Coreia do Sul","Kuwait","Kyrgyz Republic","República Democrática de Lao People","Latvia","Líbano","Lesotho","Libéria","Libyan Arab Jamahiriya","Liechtenstein","Lituânia","Luxemburgo","Macao","Macedônia","Madagascar","Malawi","Malásia","Maldives","Mali","Malta","Ilhas Marshall","Martinica","Mauritânia","Mauritius","Mayotte","México","Micronésia","Moldova","Mônaco","Mongólia","Montenegro","Montserrat","Marrocos","Moçambique","Myanmar","Namibia","Nauru","Nepal","Antilhas Holandesas","Holanda","Nova Caledonia","Nova Zelândia","Nicarágua","Nigéria","Niue","Ilha Norfolk","Northern Mariana Islands","Noruega","Oman","Paquistão","Palau","Território da Palestina","Panamá","Nova Guiné Papua","Paraguai","Peru","Filipinas","Polônia","Portugal","Puerto Rico","Qatar","Romênia","Rússia","Ruanda","São Bartolomeu","Santa Helena","Santa Lúcia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tomé e Príncipe","Arábia Saudita","Senegal","Sérvia","Seychelles","Serra Leoa","Singapura","Eslováquia","Eslovênia","Ilhas Salomão","Somália","África do Sul","South Georgia and the South Sandwich Islands","Spanha","Sri Lanka","Sudão","Suriname","Svalbard \u0026 Jan Mayen Islands","Swaziland","Suécia","Suíça","Síria","Taiwan","Tajiquistão","Tanzânia","Tailândia","Timor-Leste","Togo","Tokelau","Tonga","Trinidá e Tobago","Tunísia","Turquia","Turcomenistão","Turks and Caicos Islands","Tuvalu","Uganda","Ucrânia","Emirados Árabes Unidos","Reino Unido","Estados Unidos da América","Estados Unidos das Ilhas Virgens","Uruguai","Uzbequistão","Vanuatu","Venezuela","Vietnã","Wallis and Futuna","Sahara","Yemen","Zâmbia","Zimbábue"],"building_number":["#####","####","###"],"street_suffix":["Rua","Avenida","Travessa","Ponte","Alameda","Marginal","Viela","Rodovia"],"secondary_address":["Apto. ###","Sobrado ##","Casa #","Lote ##","Quadra ##"],"postcode":["#####","#####-###"],"state":["Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"],"state_abbr":["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP"],"default_country":["Brasil"]},"company":{"suffix":["S.A.","LTDA","e Associados","Comércio"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} e #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com","live.com","bol.com.br"],"domain_suffix":["br","com","biz","info","name","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"]},"name":{"first_name":["Alessandro","Alessandra","Alexandre","Aline","Antônio","Breno","Bruna","Carlos","Carla","Célia","Cecília","César","Danilo","Dalila","Deneval","Eduardo","Eduarda","Esther","Elísio","Fábio","Fabrício","Fabrícia","Félix","Felícia","Feliciano","Frederico","Fabiano","Gustavo","Guilherme","Gúbio","Heitor","Hélio","Hugo","Isabel","Isabela","Ígor","João","Joana","Júlio César","Júlio","Júlia","Janaína","Karla","Kléber","Lucas","Lorena","Lorraine","Larissa","Ladislau","Marcos","Meire","Marcelo","Marcela","Margarida","Mércia","Márcia","Marli","Morgana","Maria","Norberto","Natália","Nataniel","Núbia","Ofélia","Paulo","Paula","Pablo","Pedro","Raul","Rafael","Rafaela","Ricardo","Roberto","Roberta","Sílvia","Sílvia","Silas","Suélen","Sara","Salvador","Sirineu","Talita","Tertuliano","Vicente","Víctor","Vitória","Yango","Yago","Yuri","Washington","Warley"],"last_name":["Silva","Souza","Carvalho","Santos","Reis","Xavier","Franco","Braga","Macedo","Batista","Barros","Moraes","Costa","Pereira","Carvalho","Melo","Saraiva","Nogueira","Oliveira","Martins","Moreira","Albuquerque"],"prefix":["Sr.","Sra.","Srta.","Dr."],"suffix":["Jr.","Neto","Filho"]},"phone_number":{"formats":["###-###-####","(##)###-####","55-(##)-###-####","###.####"]}}},"vi":{"faker":{"address":{"city_root":["Bắc Giang","Bắc Kạn","Bắc Ninh","Cao Bằng","Điện Biên","Hà Giang","Hà Nam","Hà Tây","Hải Dương","TP Hải Phòng","Hòa Bình","Hưng Yên","Lai Châu","Lào Cai","Lạng Sơn","Nam Định","Ninh Bình","Phú Thọ","Quảng Ninh","Sơn La","Thái Bình","Thái Nguyên","Tuyên Quang","Vĩnh Phúc","Yên Bái","TP Đà Nẵng","Bình Định","Đắk Lắk","Đắk Nông","Gia Lai","Hà Tĩnh","Khánh Hòa","Kon Tum","Nghệ An","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Trị","Thanh Hóa","Thừa Thiên Huế","TP TP. Hồ Chí Minh","An Giang","Bà Rịa Vũng Tàu","Bạc Liêu","Bến Tre","Bình Dương","Bình Phước","Bình Thuận","Cà Mau","TP Cần Thơ","Đồng Nai","Đồng Tháp","Hậu Giang","Kiên Giang","Lâm Đồng","Long An","Ninh Thuận","Sóc Trăng","Tây Ninh","Tiền Giang","Trà Vinh","Vĩnh Long"],"city":["#{city_root}"],"postcode":"/[A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}/","county":["Avon","Bedfordshire","Berkshire","Borders","Buckinghamshire","Cambridgeshire","Central","Cheshire","Cleveland","Clwyd","Cornwall","County Antrim","County Armagh","County Down","County Fermanagh","County Londonderry","County Tyrone","Cumbria","Derbyshire","Devon","Dorset","Dumfries and Galloway","Durham","Dyfed","East Sussex","Essex","Fife","Gloucestershire","Grampian","Greater Manchester","Gwent","Gwynedd County","Hampshire","Herefordshire","Hertfordshire","Highlands and Islands","Humberside","Isle of Wight","Kent","Lancashire","Leicestershire","Lincolnshire","Lothian","Merseyside","Mid Glamorgan","Norfolk","North Yorkshire","Northamptonshire","Northumberland","Nottinghamshire","Oxfordshire","Powys","Rutland","Shropshire","Somerset","South Glamorgan","South Yorkshire","Staffordshire","Strathclyde","Suffolk","Surrey","Tayside","Tyne and Wear","Việt Nam","Warwickshire","West Glamorgan","West Midlands","West Sussex","West Yorkshire","Wiltshire","Worcestershire"],"default_country":["Việt Nam"]},"internet":{"domain_suffix":["com","net","info","vn","com.vn"]},"phone_number":{"formats":["01#### #####","01### ######","01#1 ### ####","011# ### ####","02# #### ####","03## ### ####","055 #### ####","056 #### ####","0800 ### ####","08## ### ####","09## ### ####","016977 ####","01### #####","0500 ######","0800 ######"]},"cell_phone":{"formats":["074## ######","075## ######","076## ######","077## ######","078## ######","079## ######"]},"name":{"first_name":["Phạm","Nguyễn","Trần","Lê","Lý","Hoàng","Phan","Vũ","Tăng","Đặng","Bùi","Đỗ","Hồ","Ngô","Dương","Đào","Đoàn","Vương","Trịnh","Đinh","Lâm","Phùng","Mai","Tô","Trương","Hà"],"last_name":["Nam","Trung","Thanh","Thị","Văn","Dương","Tăng","Quốc","Như","Phạm","Nguyễn","Trần","Lê","Lý","Hoàng","Phan","Vũ","Tăng","Đặng","Bùi","Đỗ","Hồ","Ngô","Dương","Đào","Đoàn","Vương","Trịnh","Đinh","Lâm","Phùng","Mai","Tô","Trương","Hà","Vinh","Nhung","Hòa","Tiến","Tâm","Bửu","Loan","Hiền","Hải","Vân","Kha","Minh","Nhân","Triệu","Tuân","Hữu","Đức","Phú","Khoa","Thắgn","Sơn","Dung","Tú","Trinh","Thảo","Sa","Kim","Long","Thi","Cường","Ngọc","Sinh","Khang","Phong","Thắm","Thu","Thủy","Nhàn"],"name":["#{first_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name} #{last_name} #{last_name}"]},"company":{"prefix":["Công ty","Cty TNHH","Cty","Cửa hàng","Trung tâm","Chi nhánh"],"name":["#{prefix} #{Name.last_name}"]},"lorem":{"words":["đã","đang","ừ","ờ","á","không","biết","gì","hết","đâu","nha","thế","thì","là","đánh","đá","đập","phá","viết","vẽ","tô","thuê","mướn","mượn","mua","một","hai","ba","bốn","năm","sáu","bảy","tám","chín","mười","thôi","việc","nghỉ","làm","nhà","cửa","xe","đạp","ác","độc","khoảng","khoan","thuyền","tàu","bè","lầu","xanh","đỏ","tím","vàng","kim","chỉ","khâu","may","vá","em","anh","yêu","thương","thích","con","cái","bàn","ghế","tủ","quần","áo","nón","dép","giày","lỗi","được","ghét","giết","chết","hết","tôi","bạn","tui","trời","trăng","mây","gió","máy","hàng","hóa","leo","núi","bơi","biển","chìm","xuồng","nước","ngọt","ruộng","đồng","quê","hương"]}}}};
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//







;
