package com.amazonaws;

import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.UpdateInfoRequest;
import com.amazonaws.http.snippet.UpdateInfoResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class UpdateInfoHandler implements RequestHandler<UpdateInfoRequest, UpdateInfoResponse>{
	
	LambdaLogger logger;
	
	@Override
	public UpdateInfoResponse handleRequest(UpdateInfoRequest input, Context context) {
		
		logger = context.getLogger();
		
		if (context != null) {
			context.getLogger();
		}
		
		logger.log("-> Snippet Update Info Request: " + input.toString());
		
		UpdateInfoResponse response;
		
		try {
			SnippetDAO snipdao = new SnippetDAO();
			
			Snippet snippet = snipdao.getSnippet(input.id);
			snippet.setInfo(input.info);
			snippet.setLang(input.lang);
			if (snipdao.updateSnippetInfo(snippet, input.password)){
				response = new UpdateInfoResponse(200);
			} else {
				response = new UpdateInfoResponse(405);
			}
		} catch(Exception e) {
			logger.log(e.getMessage());
			return new UpdateInfoResponse(404);
		}
		
		return response;
	}
}
