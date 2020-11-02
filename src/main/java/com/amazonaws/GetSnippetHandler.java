package com.amazonaws;

import com.amazonaws.http.GetRequest;
import com.amazonaws.http.GetResponse;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class GetSnippetHandler implements RequestHandler<GetRequest, GetResponse>{

	LambdaLogger logger;
	
	@Override
	public GetResponse handleRequest(GetRequest input, Context context) {
		// We gonna make this pretty json
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		
		logger = context.getLogger();
		if (context != null) { 
			context.getLogger();
		}
		logger.log("->Snippet ID GET Requested: " + input.toString());
		logger.log(gson.toJson(context));
		
		GetResponse response;
		
		try {
			// Check Database for Snippet with given ID
			SnippetDAO snipdao = new SnippetDAO();
			
			Snippet snippet = snipdao.getSnippet(input.id);
			logger.log("->Input Snippet to get form DB: " + input.id);
			logger.log("     |->beautify: " + gson.toJson(input));
			logger.log("->Event Type: " + input.getClass().toString()); 
			// Create snippet response
			response = new GetResponse(200, snippet);
			
		} catch(Exception e) {
			return new GetResponse(400, input.id); // 400: Invalid ID supplied	
		}
		
		return response;
	}
}
