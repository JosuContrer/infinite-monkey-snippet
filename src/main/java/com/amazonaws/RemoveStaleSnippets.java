package com.amazonaws;

import java.util.ArrayList;
import java.util.Date;

import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.RemoveStaleRequest;
import com.amazonaws.http.snippet.RemoveStaleResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class RemoveStaleSnippets implements RequestHandler<RemoveStaleRequest, RemoveStaleResponse>{

	LambdaLogger logger;
	
	@Override
	public RemoveStaleResponse handleRequest(RemoveStaleRequest input, Context context) {
		
		if(context != null) {
			logger = context.getLogger();
		}
		
		String aPass = System.getenv("adminPass");
		RemoveStaleResponse response = new RemoveStaleResponse(400);
		
		try {
			if(input.getaPass().equals(aPass)) {
				
				Long staleTime = input.getStaleUnixTime();
				logger.log("Unix Stale Time: " + staleTime.toString());
				logger.log("Readable Stale Time: " + input.toString());
				
				SnippetDAO snipdao = new SnippetDAO();
				CommentDAO comdao = new CommentDAO();
				
				// Check valid time, current or past time
				if(input.getID() != "") {
					snipdao.deleteSnippetNoPass(input.getID());
					comdao.deleteCommentsBySnippetNoPass(input.getID());
					
					response = new RemoveStaleResponse(200, "Deleted Snippet" + input.getID(), snipdao.getAllSnippetsDescriptors());
					logger.log("Successfully deleted" + input.getID());
				}
				else if(input.getStaleDateTime().compareTo(new Date()) <= 0) {
					ArrayList<String> idsToDelete = snipdao.getStaleSnippetIDs(staleTime);
					if (idsToDelete.size() > 0) {
					
						for (String id: idsToDelete) {
							snipdao.deleteSnippetNoPass(id);
							comdao.deleteCommentsBySnippetNoPass(id);
						}
						
						response = new RemoveStaleResponse(200, "Removed Stale Snippets", snipdao.getAllSnippetsDescriptors());
						logger.log("Successfully deleted Stale Snippets");
						
					} else {
						response.setErrorMessage("DAO Error");
						logger.log("Error Deleting Stale Snippets");
					}	
				}
				else{
					response.setErrorMessage("Invalid Input");
				}
			}else {
				return new RemoveStaleResponse(403, "Forbidden");
			}
			
		}catch(Exception e) {
			return new RemoveStaleResponse(400, "Bad Request");
		}
		
		return response;
	}

}