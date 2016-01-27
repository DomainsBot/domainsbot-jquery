/*Copyright 2012, DomainsBot Inc. */

(function ($) {

	var data = [];
	var maxCounter = 50;
	var checkDelay = 10;

	var isStart = false;

	var methods = {

		init: function (options) {
			//checkDelay = options.delay;
			this.each(function () {

				var dummy ={};
				dummy.target = $(this);
				dummy.name = "";
				dummy.isTyping = false;
				dummy.notChangedCounter = 0;
				dummy.onType = options.onType;
				dummy.onTyped = options.onTyped;
				data.push(dummy);
			});
			isStart = true;
			setTimeout(CheckTyping, checkDelay);
			return this;

		},
		start: function () {


		},
		destroy: function () {
			data =[];
			maxCounter = 50;
			checkDelay = 10;
			isStart = false;

		}

	};


	$.fn.InstantSearch = function (method) {
		if (methods[method]) {


			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.InstantSearch');
		}
	};


	function CheckTyping() {
		if (!isStart)
			return;

		$.each(data, function (index, item) {

			//Changed?
			var text = item.target.val();

			if (item.name != text) {

				item.isTyping = true;
				item.notChangedCounter = 0;

				item.name = text;

				// Callback
				if(item.onType != null)
					item.onType(text);


			}
			else if (item.notChangedCounter >= 0) {
				item.notChangedCounter++;
			}

			if (item.notChangedCounter > maxCounter && item.name != "") {
				item.isTyping = false;
				item.notChangedCounter = -1;

				if(item.onTyped != null)
					item.onTyped(text);

			}

		});

		setTimeout(CheckTyping, checkDelay);

	}
})(jQuery);

(function( $ ) {

	var DomainsBotApi  = function(options)
	{
		var loader;
		var checking;

		if(typeof options.urlCheckout == "string")
		{
			var defaultDb = "available";

			if(options.parameters != null && options.parameters.database != null)
			{
				defaultDb = options.parameters.database.split(" ")[0];
			}

			var checkoutHash = {};
			checkoutHash[defaultDb] = options.urlCheckout;
			options.urlCheckout = checkoutHash;
		}

		var settings = $.extend( {
			'urlApi' : 'https://api-2445581410012.apicast.io/v5/recommend',
			'urlCheckout' : null,
			'searchTextbox' : null,
			'searchSubmit' : null,
			'loading' : null,
			'checking' : null,
			'results' : null,
			'searchParameter' : null,
			'parameters' : null,
			'onSuccess' : null,
			'onError' : null,
			'onLoading' : null,
			'onCheckout' : null,
			'autoComplete' : false

		}, options);

		var getDataField = function (fieldName,data)
		{

			for(var i = 0; i<data.length; i++)
			{
				if(data[i].Name == fieldName)
					return data[i].Data;
			}
			return null;
		};

		var getUrlVars =  function ()
		{
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++)
			{
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		};

		var GetDomains = function (key,options)
		{
			var cnt = 0; var i;

			// Define an empty string
			var postString = "";


			// Binds the post string with key term and suggestion
			postString = "q=" + escape(key);
            postString += "&callback=_domainsbot";
			for(var index in options.parameters) {
				postString += "&"+index+"="+escape(options.parameters[index]);
			}


			if(options.results != null)
				$(options.results).html("");

			if(options.loading != null){
				$(options.results).append(loader);
				// Set teh ajax loader image
				$(loader).css('display','block');
			}

			if(options.onLoading != null){
				options.onLoading();
			}

			$.ajax({
				url:options.urlApi +"?" + postString,
				dataType: 'jsonp',
                jsonpCallback: '_domainsbot',
				success:function(data)
				{
					if(data === null || data.error != null){
						if(options.onError != null){

							options.onError(data.error);
						}
						if(options.results != null)
						{
							$(options.results).html(data.error.message);
						}
						return;
					}

					if(options.onSuccess != null){
						options.onSuccess(data);
					}

					if(options.results != null){
						$(options.results).html("");
						var htmlItem = "";
						if(data){
							$.each(data, function(i,domain){

								htmlItem += "<div >";
								var database = null;
								if(domain.Data != null && domain.Data.length > 0)
								{
									database = getDataField("database", domain.Data[0]);
								}

								var url = "";
								if(options.urlCheckout  != null && database != null)
								{

									url = options.urlCheckout[database].replace("%domain%",domain.DomainName);
								}

								// cart url
								htmlItem += "<a href='"+url+"' bind='domainsbotDomainLink' domainName='"+domain.Domain+"' >"+domain.Domain+"</a>";

								//htmlItem += "<div bind='domainsbotDomain' index='"+i+"' domainName = '"+domain.DomainName+"' >" + ((options.checking != null && ((options.urlAvailability != null && options.urlAvailability != "") || (options.onAvailabilitySuccess != null && options.onAvailabilitySuccess != ""))) ? 	$(options.checking).clone().css('display','block').wrap('<p>').parent().html()  : "" )	+"</div>";

								htmlItem += "</div>";

							});

						}
						else
						{
							if(options.onError != null){
								options.onError(data);
							}
						}



						$(options.results).html(htmlItem);

						if(options.onCheckout != null)
						{
							$(options.results).find("a[bind='domainsbotDomainLink']").click(function(evt)
							{

								options.onCheckout({ Domain: $(this).attr("domainName")}, evt );
							});
						}

					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
                	if(options.onError != null){

						options.onError(thrownError);
					}
					else if(options.results != null)
					{
						$(options.results).html(thrownError);
					}

				}
			});


		};


		if(settings.searchTextbox != null){
			// Sets focus the search text box
			$(settings.searchTextbox).focus();
			// Enter button
			// Check for Key down event on Search text box
			$(settings.searchTextbox).keydown(function(event) {

				// Check if user hits the <enter>
				if(event.keyCode == 13){
					// calls to function
					GetDomains($(settings.searchTextbox).val(),settings);
				}
			});


			if(settings.autoComplete)
			{
				$(settings.searchTextbox).InstantSearch({
					onTyped: function(text){
						if(text != null && text != "")
						{
							GetDomains(text,settings);
						}
						else
						{
							if(options.results != null)
								$(options.results).html("");
						}
					},
					onType: function(text){
						if(options.results != null)
							$(options.results).html("");
						if(text != null && text != "")
						{
							if(options.loading != null){
								$(options.results).append(loader);
								// Set teh ajax loader image
								$(loader).css('display','block');
							}

							if(options.onLoading != null){
								options.onLoading();
							}
						}

					}
				});
			}
			else if($(settings.searchTextbox).val().length > 0)
			{
				GetDomains($(settings.searchTextbox).val(),settings);
			}

		}


		if(settings.loading != null){
			// Sets variable with ajax loader image
			$(settings.loading).css('display','none');

			loader = $(settings.loading).clone();

			//this.loader.remove();
		}

		if(settings.checking != null){
			// Sets variable with ajax loader image
			$(settings.checking).css('display','none');

			checking = $(settings.checking).clone();

			//this.checking.remove();
		}


		if(settings.searchSubmit != null && settings.searchTextbox != null){
			// Check the click event, search btn pressed
			$(settings.searchSubmit).click(function(){

				//call the function to get result
				GetDomains($(settings.searchTextbox).val(), settings);
			});
		}

		if(settings.searchParameter != null && settings.searchParameter != ""){

			var p = getUrlVars();

			if(p != null && p[settings.searchParameter] != null && p[settings.searchParameter] != ""){
				console.log(p[settings.searchParameter] );
				GetDomains(p[settings.searchParameter], settings);
			}
		}




		// Public method
		this.search = function(key)
		{
			GetDomains(key, settings);
		};
	};




	var methods = {
		init : function( options ) {
            return new DomainsBotApi(options);
		}
	};

	$.fn.domainsbot = function ( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.domainsbot' );
		}

	};
})( jQuery );