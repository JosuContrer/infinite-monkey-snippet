package com.amazonaws;

import com.amazonaws.model.Comment;
import com.amazonaws.db.CommentDAO;
import com.amazonaws.http.CreateCommentRequest;
import com.amazonaws.http.CreateCommentResponse;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.Context;

public class CreateCommentHandler implements RequestHandler<CreateCommentRequest, CreateCommentResponse>{
	
	LambdaLogger logger;
	
	@Override
	public CreateCommentResponse handleRequest(CreateCommentRequest input, Context context) {
		
		logger = context.getLogger();
		
		if (context != null) {
			context.getLogger();
		}
		
		logger.log("-> Creating Comment ");
		
		CreateCommentResponse response;
		int statusCode = 200;
		
		try {
			
			CommentDAO commdao = new CommentDAO();
			Comment comment = new Comment(commdao.getAllComments());	
			// idk what the actual constructor for a comment is going to look
			// like so improvising for now.
			commdao.addComment(comment);
			response = new CreateCommentResponse(comment.getID(), statusCode);
			
		} catch (Exception e) {
			
			logger.log(e.getMessage());
			return new CreateCommentResponse("0", 404);
			
		}
		
		return response;
	}

}
