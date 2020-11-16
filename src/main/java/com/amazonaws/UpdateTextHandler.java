package com.amazonaws;

import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.UpdateTextRequest;
import com.amazonaws.http.snippet.UpdateTextResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class UpdateTextHandler implements RequestHandler<UpdateTextRequest, UpdateTextResponse>{

	LambdaLogger logger;
	
	@Override
	public UpdateTextResponse handleRequest(UpdateTextRequest input, Context context) {
		
		logger = context.getLogger();
		
		if(context != null) {
			context.getLogger();
		}
		logger.log("->Snippet Update Text Request: " + input.toString());
	
		UpdateTextResponse response;
		try {
			SnippetDAO snipdao = new SnippetDAO();
			
			// TODO: Make function to update Snippet without having to create a snippet object
			Snippet snippet = snipdao.getSnippet(input.id);
			snippet.setText(input.text);
			snipdao.updateSnippetText(snippet);
			
			response = new UpdateTextResponse(200);
			
		} catch(Exception e) {
			logger.log(e.getMessage());
			return new UpdateTextResponse(404);
		}
		
		return response;
	}
}
