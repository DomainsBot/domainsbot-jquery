/*Copyright 2012, DomainsBot Inc. */

(function( $ ) {

   var loader;
   	
  $.fn.domainsbot = function( options ) {  

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
	'url'         : '',
	'urlAvailability' : "",
	'urlCheckout' : "",
	'checkAvailable' : false,    
	'textbox' : null,
	'submit' : null,
	'loader' : null,
	'results' : 'results',
	'tlds' : 'com,net,org,biz',
	'limit' : 10,
        'removeKeys' : false,
	'advanced' : null,
	'key': null,
	'onSuccess' : null,
	'onError' : null,
	'onLoading' : null,
	'onAvailabilitySuccess' : null,
	'onAvailabilityError' : null    
      	    
    }, options);
	
	if(settings['textbox'] != null){
		// Sets focus the search text box
		$(settings['textbox']).focus();
	}
	
	
	if(settings['loader'] != null){
		// Sets variable with ajax loader image
		$(settings['loader']).css('display','none');
		
		loader = $(settings['loader']);
		
		loader.remove();
	}
	if(settings['textbox'] != null){
		// Check for Key down event on Search text box
		$(settings['textbox']).keydown(function(event) {

			// Check if user hits the <enter>
			if(event.keyCode == 13){
				// calls to function
				getDomains($(options["textbox"]).val(),settings);
			}
		});
	}
	
	if(settings['submit'] != null && settings['textbox'] != null){
		// Check the click event, search btn pressed
		$(settings['submit']).click(function(){

				//call the function to get result
				getDomains($(options["textbox"]).val(), settings);
		});
	}
	
	if(settings['key'] != null){
		getDomains(settings['key'],settings);
	}
  };
  
  function getDomains(key,options)
	{
		var cnt = 0; var i;
		
		// Define an empty string
		var postString = "";
		
		
		// Binds the post string with key term and suggestion
		postString = "q=" + key + "&tlds=" + options['tlds'] + "&limit=" + options['limit'] + "&removeKeys=" + options['removeKeys'] ;
		
		for(var index in options["advanced"]) {
				postString += "&"+index+"="+options["advanced"][index];
		}
		
		$(options["results"]).html("");
		
		if(options['loader'] != null){
			$(options["results"]).append(loader);
			// Set teh ajax loader image
			$(loader).css('display','');
		}
		
		if(options['onLoad'] != null){
			options['onLoad']();
		}
		

		// Make the ajax call to domain.php
		$.ajax({
			url:options['url'] +"?" + postString,
			dataType: 'json',
			success:function(data)
			{	
				if(options['onSuccess'] != null){
					options['onSuccess'](data);
				}
				else{
					var htmlItem = "<div class='domainsbot_suggestionBox'><h2>Suggestions</h2>";
					if(data && data.Domains){
						$.each(data.Domains, function(i,domain){
							
							htmlItem +=  "<div id = 'rowBox" +i+ "' class='domainsbot_rowBox'>";
				
							htmlItem += "<a href='#' class='domainsbot_starBox' disabled><img src='images/star.png' alt='' border='0' /></a>";
							// cart url!!
							htmlItem += "<span class='domainsbot_domainName'><a href='"+options['urlCheckout'] +"?domain="  +domain.DomainName+ "'>"+domain.DomainName+"</a></span>";	
							
							htmlItem += "<span id = 'dn_"+i+ "' domainName = '"+domain.DomainName+"' class='domainsbot_domainImg'>Checking..</span>";
							
							htmlItem += "</div>";
							
							});
						if(data.Domains.length == 0)
							htmlItem += "<span class='domainsbot_domainName'>No Suggestions found!</span>";
					}
					else
					{
						htmlItem += "<span class='domainsbot_domainName'>An error occured</span>";
					}

					htmlItem += "<div class='domainsbot_clear'></div></div>";
					
					$(options["results"]).html(htmlItem);

					// Check the result is nonempty?
					cnt = (".domainsbot_domainImg").length;
					
					if(options["checkAvailable"]){
						if(cnt!=0)		
						{
							for(i=0;i<cnt;i++)
								// Make the function call to check the domain name availablity
								checkAvailability(i, options);
						}
					}
					
					
				}
			},
			error: function(data)
			{
				if(options['onError'] != null){
					options['onError'](data);
				}
				else{
					$(options["results"]).html("<span class='domainsbot_domainName'>An error occured</span>");
				}
				
			}
		});
	}
 
	function checkAvailability(id, options)
	{
		//Get the domain name to check.
		var domain = $("#dn_" + id).attr('domainName');
		
		// Built the post string.
		var postString = "domain=" + domain;

		//check if domain not empty
		if(domain!="")
		{ 
			$.ajax({
				url: options['url_availability']+'?' + postString,
				method:'POST',
				success:function(response)
				{
					if(options["onAvailabilitySuccess"] != null){
						options["onAvailabilitySuccess"]({ Domain: domain, Index: id, Available:  response == "1"? true : false} );
					}
					else
					{
						//Check if domain name is available or not
						if(response == "1")
									//Add the html to span 
								$("#span" + id).html("Available");
						else
							//Add the html to span 
								$("#rowBox" + id).hide();
					}
				},
				error: function(response){
					if(options["onAvailabilityError"] != null){
						options["onAvailabilityError"] (response);
					}
					else
					{
						$("#rowBox" + id).hide();	
					}
				}
			});
		}
	}
  
})( jQuery );