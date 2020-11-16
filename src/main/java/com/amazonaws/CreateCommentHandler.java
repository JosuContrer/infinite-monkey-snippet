package com.amazonaws;

import com.amazonaws.model.Comment;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.amazonaws.db.CommentDAO;
import com.amazonaws.http.comment.CreateCommentRequest;
import com.amazonaws.http.comment.CreateCommentResponse;
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

			Comment comment = new Comment(commdao.getAllComments(), input.snippetID, input.regionStart, input.regionEnd, input.text);	

			commdao.addComment(comment);
			
			response = new CreateCommentResponse(comment.getID(), statusCode);
			
		} catch (Exception e) {
			
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			logger.log(sw.toString());
			
			return new CreateCommentResponse("0", 404);
			
		}
		
		return response;
	}

}
