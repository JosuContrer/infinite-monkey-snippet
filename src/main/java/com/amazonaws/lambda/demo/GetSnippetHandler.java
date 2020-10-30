package com.amazonaws.lambda.demo;

import com.amazonaws.labda.demo.http.GetRequest;
import com.amazonaws.labda.demo.http.GetResponse;
import com.amazonaws.lambda.demo.db.SnippetDAO;
import com.amazonaws.lambda.demo.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class GetSnippetHandler implements RequestHandler<GetRequest, GetResponse>{

	LambdaLogger logger;
	
	@Override
	public GetResponse handleRequest(GetRequest input, Context context) {
		logger = context.getLogger();
		logger.log(input.toString());
		
		GetResponse response;
		
		try {
			// Check Database for Snippet with given ID
			SnippetDAO snipdao = new SnippetDAO();
			Snippet snippet = snipdao.getSnippet(input.getSnippetId());
			
			// Create snippet response
			response = new GetResponse(200, snippet);
			
		} catch(Exception e) {
			return new GetResponse(400, input.getSnippetId()); // 400: Invalid ID supplied	
		}
		
		return response;
	}
}
