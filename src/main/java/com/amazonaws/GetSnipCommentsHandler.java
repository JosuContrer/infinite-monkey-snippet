package com.amazonaws;

import java.util.ArrayList;

import com.amazonaws.db.CommentDAO;
import com.amazonaws.http.comment.GetSnipCommentsRequest;
import com.amazonaws.http.comment.GetSnipCommentsResponse;
import com.amazonaws.model.Comment;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class GetSnipCommentsHandler implements RequestHandler<GetSnipCommentsRequest, GetSnipCommentsResponse>{
	
	LambdaLogger logger;
	
	@Override
	public GetSnipCommentsResponse handleRequest(GetSnipCommentsRequest input, Context context) {
		logger = context.getLogger();
		
		if (context != null) {
			context.getLogger();
		}
		
		GetSnipCommentsResponse response;
		
		try {
			CommentDAO comdao = new CommentDAO();
			ArrayList<Comment> comments = comdao.getCommentsBySnippet(input.snippetID);
			
			response = new GetSnipCommentsResponse(200, input.snippetID, comments);
		
		} catch (Exception e) {
			return new GetSnipCommentsResponse(400, input.snippetID);
		}
		
		return response;
	}

}
