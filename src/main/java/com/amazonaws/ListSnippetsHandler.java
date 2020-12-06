package com.amazonaws;

import java.util.ArrayList;

import com.amazonaws.db.SnippetDAO;
import com.amazonaws.model.SnippetDescriptor;
import com.amazonaws.http.snippet.ListRequest;
import com.amazonaws.http.snippet.ListResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class ListSnippetsHandler implements RequestHandler<ListRequest, ListResponse>{

	LambdaLogger logger;

	@Override
	public ListResponse handleRequest(ListRequest input, Context context) {
		
		logger = context.getLogger();
		if(context != null) {
			context.getLogger();
		}
		
		// Check for admin privileges
		String aPass = System.getenv("adminPass");
		
		if(aPass == null) {
			logger.log("Env var does not exist for Admin");
			return new ListResponse(404, "No Admin Setup");
		}
		
		ListResponse responseListResult = new ListResponse(404);
		
		try {
					
			if(input.getAdminPass().equals(aPass)) {
				SnippetDAO snipdao = new SnippetDAO();
				ArrayList<SnippetDescriptor> snipList = snipdao.getAllSnippetsDescriptors();
				
				responseListResult = new ListResponse(200, "List Snippets", snipList);		
			}else {
				return new ListResponse(405, "List snippets not allowed");
			}
			
		}catch(Exception e) {
			logger.log(e.getLocalizedMessage());
			logger.log("admin pass " + input.getAdminPass());
			return new ListResponse(404, "Error list snippets");
		}
		
		return responseListResult;
	}	
}
