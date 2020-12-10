package com.amazonaws;

import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class GetSnippetHandler implements RequestHandler<GetRequest, GetResponse>{

	LambdaLogger logger;
	
	@Override
	public GetResponse handleRequest(GetRequest input, Context context) {
		logger = context.getLogger();
		if (context != null) { 
			context.getLogger();
		}
		
		GetResponse response;
		
		try {
			// Check Database for Snippet with given ID
			SnippetDAO snipdao = new SnippetDAO();
			Snippet snippet = snipdao.getSnippetNoPass(input.id);

			// Create snippet response
			response = new GetResponse(200, snippet);
			
		} catch(Exception e) {
			return new GetResponse(400, input.id); // 400: Invalid ID supplied	
		}
		
		return response;
	}
}
