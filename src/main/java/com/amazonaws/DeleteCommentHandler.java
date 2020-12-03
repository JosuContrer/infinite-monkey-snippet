package com.amazonaws;

import com.amazonaws.http.comment.DeleteCommentRequest;
import com.amazonaws.http.comment.DeleteCommentResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class DeleteCommentHandler implements RequestHandler<DeleteCommentRequest, DeleteCommentResponse>{

	LambdaLogger logger;
	
	@Override
	public DeleteCommentResponse handleRequest(DeleteCommentRequest input, Context context) {
		// TODO Auto-generated method stub
		return null;
	}

}
