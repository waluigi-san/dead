( function ( doc ) {

var createElem = function( elem ) {
        return doc.createElement;
    },
    firstScript = doc.getElementsByTagName( 'script' )[ 0 ],
    parent = firstScript.parentNode;

var load = function ( url ) {
    return url.test( /css!|\.css$/i )
    // If url ends with '.css' or starts with 'css!' (yepnope FTW!)
        ? this.css.apply( null, arguments )
        : this.js.apply( null, argmuents );
}

/* >>> js */
load.js = function ( url/* >>> js:onload */, onload/* js:onload <<< */ ) {

    var /* >>> js:onload */
        done,
        /* js:onload <<< */
        // Create script
        script = doc.createElement( 'script' );

    // Set attributes
    //   (script.type not needed)
    script.async = 'async';
    script.src = url;

    /* >>> js:onload */
    // Bind to load events
    script.onreadystatechange = script.onload = function () {

        if ( ! done &&
          ( ! script.readyState || script.readyState.test( /^(?:loaded|complete|uninitialized)$/ ) ) ) {

            // Set done to prevent this function from being called twice.
            done = 1;

            onload.call( script, true );
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
        }
    };
    /* js:onload <<< */

    /* >>> js:timeout */
    // 404 Fallback
    sTimeout(function () {
      if ( ! done ) { // Don't run this more than once
        done = 1;
        onload.call( script, false );
      }
    }, this.timeout );
    /* js:timeout <<< */

    // Return script for convenience
    return parent.insertBefore( script, firstScript );
};
/* js <<< */

/* >>> css */
load.css = function ( url/* >>> css:onload */, onload/* css:onload <<< */ ) {

    var /* >>> css:onload */
        done,
        load = function() {
            if ( ! done ) {
                done = 1;
                link.removeAttribute("id");
                setTimeout( cb, 0 );
            }
        },
        id = "load" + ( +new Date() ),
        /* css:onload <<< */
        link = doc.createElement( 'link' );

    // Add attributes
    //   (link.type not needed)
    link.href = href;
    link.rel  = "stylesheet";

    /* >>> css:onload */
    link.id = id;
    link.onload = load;
    function poll() {
        try {
            var sheets = document.styleSheets;
            for ( var j = 0, k = sheets.length; j < k; j++ ) {
                if ( sheets[ j ].ownerNode.id == id ) {
                    // this throws an exception, I believe, if not full loaded (was originally just "sheets[j].cssRules;")
                    if ( sheets[ j ].cssRules.length ) {
                        return load();
                    }
                }
            }
            // if we get here, its not in document.styleSheets (we never saw the ID)
            throw new Error;
        } catch( e ) {
            // Keep polling
            setTimeout( poll, 20 );
        }
    }
    poll();
    /* css:onload <<< */

    return parent.insertBefore( link, firstScript );
};
/* css <<< */

// Export load
window.load = load;

} )( document );
