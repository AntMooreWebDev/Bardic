var Bardic = (function() {
    function AJAXParams(params) {
         this.url = params.url || "";
         this.onSuccess = params.onSuccess || function(){};
         this.onError = params.onError || function(){};
         this.includeDebugData = params.includeDebugData || false;
         this.type = params.type || "GET";
    }

    function JSONParams(url, onSuccess, includeDebugData) {
        this.url = url || "";
        this.onSuccess = onSuccess || function(){};
        this.includeDebugData = includeDebugData || false;
        this.type = "GET";
    }

    function openRequest(type_, url) {
        var request = new XMLHttpRequest();
        request.open(type_, url, true);

        return request;
    }

    function getErrorData(params, request) {
        var data = {};

        if (params.includeDebugData) {
            data.DebugData = {
                request: request
            }
            console.error(request.status + ": " + request.statusText, data);
        }

        if (params.onError) {
            params.onError(request, request.statusText);
        }
    }

    return {
        getJSON: function(url, onSuccess, includeDebugData) {
            var Params = new JSONParams(url, onSuccess, includeDebugData);
            var request = openRequest(Params.type, url);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);

                    if (Params.includeDebugData) {
                        data.DebugData = {
                            request: request
                        }
                    }

                    Params.onSuccess(data);
                } else {
                    getErrorData(Params, request);
                }
            }

            request.onerror = function() {
                getErrorData(Params, request);
            };

            request.send();
        },
        ajax: function(params) {
            var Params = new AJAXParams(params);
            var request = openRequest(Params.type, Params.url, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);                    
                    
                    if (Params.includeDebugData) {
                    	data.DebugData = {
                        	response: request
                        }
                    }
                    
                    Params.onSuccess(data);
                } else {
                    getErrorData(Params, request);
                }
            }

            request.onerror = function() {
                getErrorData(Params, request);
            }

            request.send();
        }
    }
})();