package com.amazonaws;

import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.comment.DeleteCommentRequest;
import com.amazonaws.http.comment.DeleteCommentResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class DeleteCommentHandler implements RequestHandler<DeleteCommentRequest, DeleteCommentResponse>{

	LambdaLogger logger;
	
	@Override
	public DeleteCommentResponse handleRequest(DeleteCommentRequest input, Context context) {
		if(context != null) {
			logger = context.getLogger();
		}
			
		DeleteCommentResponse response = new DeleteCommentResponse(400, "Unable to delete comment");
		
		try {
			SnippetDAO snipdao = new SnippetDAO();
			Snippet snip = snipdao.getSnippet(input.snippetId);
			
			CommentDAO comdao = new CommentDAO();
			comdao.deleteComment(snip, input.commentId, input.getPassword());
			response.setStatusCode(200);
			response.setStatusMessage("Comment deleted!");
			
		}catch(Exception e) {
			return new DeleteCommentResponse(400, "Comment not deleted");
		}
		return response;
	}
}
