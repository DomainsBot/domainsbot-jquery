/*Copyright 2012, DomainsBot Inc. */

(function( $ ) {

	   var DomainsBotApi  = function(options)
	   {
		var loader;
		var checking;
		var settings = null;
		
		
		
		this.settings = $.extend( {
			'urlApi'         : '',
			'urlAvailability' : "",
			'urlCheckout' : "",  
			'textbox' : null,
			'submit' : null,
			'loading' : null,
			'checking' : null,
			'results' : null,
			'parameters' : null,
			'onSuccess' : null,
			'onError' : null,
			'onLoading' : null,
			'onAvailabilitySuccess' : null,
			'onAvailabilityError' : null,
			'onCheckout' : null
			    
		 }, options);
		 
		 if(this.settings.textbox != null){
			// Sets focus the search text box
			$(this.settings.textbox).focus();
		}


		if(this.settings.loading != null){
			// Sets variable with ajax loader image
			$(this.settings.loading).css('display','none');
			
			this.loader = $(this.settings.loading);
			
			this.loader.remove();
		}

		if(this.settings.checking != null){
			// Sets variable with ajax loader image
			$(this.settings.checking).css('display','none');
			
			this.checking = $(this.settings.checking);
			
			this.checking.remove();
		}

		if(this.settings.textbox != null){
			// Check for Key down event on Search text box
			$(this.settings.textbox).keydown(function(event) {

				// Check if user hits the <enter>
				if(event.keyCode == 13){
					// calls to function
					GetDomains($(this.settings.textbox).val(),settings);
				}
			});
		}

		if(this.settings.submit != null && this.settings.textbox != null){
			// Check the click event, search btn pressed
			$(this.settings.submit).click(function(){

					//call the function to get result
					GetDomains($(this.settings.textbox).val(), settings);
			});
		}
			
		var GetDomains = function (key,options)
		{
			 var cnt = 0; var i;
			
			// Define an empty string
			var postString = "";
			
			
			// Binds the post string with key term and suggestion
			postString = "q=" + escape(key);
			
			for(var index in options.parameters) {
					postString += "&"+index+"="+escape(options.parameters[index]);
			}
			
			
			
			$(options.results).html("");
			
			if(options.loading != null){
				$(options.results).append(this.loader);
				// Set teh ajax loader image
				$(this.loader).css('display','');
			}
			
			if(options.onLoad != null){
				options.onLoad();
			}
			//console.log(options.urlApi +"?" + postString);
			// Make the ajax call to domain.php
			$.ajax({
				url:options.urlApi +"?" + postString + "&callback=?",
				dataType: 'json',
				success:function(data)
				{	
					if(options.onSuccess != null){
						options.onSuccess(data);
					}
					else{
						var htmlItem = "";
						if(data && data.Domains){
							$.each(data.Domains, function(i,domain){
								
								htmlItem += "<div class='domainsbot_domainName'>";
								
								var url = "";
								if(options.urlCheckout  != null && options.urlCheckout != "")
								{
									url = options.urlCheckout.toLowerCase().replace("%domain%",domain.DomainName);
								}
								
								// cart url
								htmlItem += "<a href='"+url+"' bind='domainsbotDomainLink' domainName='"+domain.DomainName+"' >"+domain.DomainName+"</a>";
															
								htmlItem += "<div bind='domainsbotDomain' index='"+i+"' domainName = '"+domain.DomainName+"' class='domainsbot_domainImg'>" 
									+ (((options.urlAvailability != null && options.urlAvailability != "") || (options.onAvailabilitySuccess != null && options.onAvailabilitySuccess != "") && options.checking != null)? this.checking.clone().css('display','block').wrap('<p>').parent().html()  : "" )
									+"</div>";
								
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
							$("a[bind='domainsbotDomainLink']").click(function(evt)
							{
								
								options.onCheckout({ Domain: $(this).attr("domainName")}, evt );
							});
						}
						

						
						
						if((options.urlAvailability != null && options.urlAvailability != "") || (options.onAvailabilitySuccess != null && options.onAvailabilitySuccess != "")){
							
							for(i = 0; i < data.Domains.length; i++)
							{
								checkAvailability(data.Domains[i].DomainName, i, options);
							}
							
						}
						
						
					}
				},
				error: function(data)
				{
					if(options.onError != null){
						options.onError(data);
					}
					
				}
			});
			
			
		};
	    
		var checkAvailability = function (domain, id, options)
		{
		    
		// Built the post string.
		var postString = options.urlAvailability.toLowerCase().replace("%domain%",domain);

		//check if domain not empty
		if(domain!="")
		{ 
			$.ajax({
				url: postString,
				method:'POST',
				success:function(response)
				{
					if(options.onAvailabilitySuccess != null){
						options.onAvailabilitySuccess({ Domain: domain, Index: id, Available:  response == "1"? true : false} );
					}
					if(options.urlAvailability != null && options.urlAvailability != "")
					{
						
						//Check if domain name is available or not
						if(response == 0)
						{
							
							$("div[bind='domainsbotDomain'][index='" + id+"']").parent().hide();	
						}
						else
						{
							
							$("div[bind='domainsbotDomain'][index='" + id+"']").hide();
						}
								
								
					}
				},
				error: function(response){
					if(options.onAvailabilityError != null){
						options.onAvailabilityError (response);
					}
				}
			});
		}
		    
		};
		

		// Public method
		this.search = function(key)
		{
			
			GetDomains(key, this.settings);
		};
	   };
	
	   
    
	
	    var methods = {
		    init : function( options ) { 
			var ret = new DomainsBotApi(options);
			
			return ret;
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