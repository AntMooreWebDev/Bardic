var Bardic = (function() {
    function RootParams(params) {
         this.url = params.url || "";
         this.onSuccess = params.onSuccess || function(){};
         this.includeDebugData || false;
         this.type = params.type || "GET";
    }

    return {
        getJSON: function(params) {
            params.type = "GET";
            this.ajax(params);
        },
        ajax: function(params) {
            var rootParams = new RootParams(params);

            var request = new XMLHttpRequest();
            request.open(rootParams.type, rootParams.url, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);                    
                    
                    if (rootParams.includeDebugData) {
                    	data.DebugData = {
                        	response: request
                        }
                    }
                    
                    rootParams.onSuccess(data);
                } else {
                    // We reached our target server, but it returned an error
                }
            }

            request.send();
        }
    }
})();


/*

Bardic.getJSON({
	url: "https://api.myjson.com/bins/146swf",
	onSuccess: function(data) {
		console.log("returned data", data);
	}
});

*/