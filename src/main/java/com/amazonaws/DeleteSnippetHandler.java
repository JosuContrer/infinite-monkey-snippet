package com.amazonaws;

import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.DeleteSnippetRequest;
import com.amazonaws.http.snippet.DeleteSnippetResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

/*
 * The Status codes for this delete handler:
 * 		200: Snippet deleted
 * 		404: No Snippet found with the provided ID
 * 		405: Could not delete Snippet
 */
public class DeleteSnippetHandler implements RequestHandler<DeleteSnippetRequest, DeleteSnippetResponse>{
	
	LambdaLogger logger;
	
	@Override
	public DeleteSnippetResponse handleRequest(DeleteSnippetRequest input, Context context) {
		logger = context.getLogger();
		if(context != null) {
			context.getLogger();
		}
		
		logger.log("->Snippet Delete Request: " + input.toString());
		
		DeleteSnippetResponse response;
		int statusCode = 200;
		
		try {
			SnippetDAO snipdao = new SnippetDAO();
			Snippet snip = snipdao.getSnippet(input.getId());
			
			//Delete Snippet 
			if(snipdao.deleteSnippet(input.getId(), input.getPassword())) {
				response = new DeleteSnippetResponse(statusCode);
				
				CommentDAO comdao = new CommentDAO();
				
				if (comdao.deleteCommentsBySnippet(snip, input.getPassword())) {
					logger.log("    Deleted Comments with Snippet");
				}
				else {
					logger.log("    No Comments to delete");
				}
			} else {
				statusCode = 405;
				response = new DeleteSnippetResponse(statusCode);
			}
			
		} catch(Exception e) {
			statusCode = 404;
			return new DeleteSnippetResponse(statusCode);
		}
		
		return response;
	}

}
