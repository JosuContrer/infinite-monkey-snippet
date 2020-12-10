package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.DeleteCommentHandler;
import com.amazonaws.GetSnipCommentsHandler;
import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.comment.DeleteCommentRequest;
import com.amazonaws.http.comment.DeleteCommentResponse;
import com.amazonaws.http.comment.GetSnipCommentsRequest;
import com.amazonaws.http.comment.GetSnipCommentsResponse;
import com.amazonaws.model.Comment;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class DeleteCommentHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testDelete(String incoming, int outgoing, String errMes, int numComments) {
		DeleteCommentHandler handler = new DeleteCommentHandler();
		DeleteCommentRequest req = new Gson().fromJson(incoming, DeleteCommentRequest.class);
		DeleteCommentResponse response = handler.handleRequest(req, createContext("deleteComment"));
		
		assertEquals(outgoing, response.getStatusCode());
		assertEquals(errMes, response.getStatusMessage());
		
		GetSnipCommentsHandler handler2 = new GetSnipCommentsHandler();
		GetSnipCommentsRequest req2 = new Gson().fromJson("{\"id\": \"" + req.snippetID +"\"}", GetSnipCommentsRequest.class);
		GetSnipCommentsResponse response2 = handler2.handleRequest(req2, createContext("getComments"));
		
		assertEquals(numComments, response2.getComments().size());
	}
	
	@Test
	public void testDeleteComment() throws Exception {
		SnippetDAO snipdao = new SnippetDAO();
		Snippet snip = new Snippet(snipdao.getAllSnippets(), "password");
		snipdao.addSnippet(snip);

		CommentDAO commdao = new CommentDAO();
		Comment comment = new Comment(commdao.getAllComments(), snip.getID(), 1, 1, "test");
		commdao.addComment(comment);
		
		String incoming = "{"
							+ "\"snippetID\": \"" + snip.getID() + "\","
							+ "\"id\": \"" + comment.getID() + "\","
							+ "\"password\": \"" + snip.getPassword() + "\""
						+ "}";
		int sc = 200;
		String errMes = "Comment deleted!";
		int numComments = 0;
		testDelete(incoming, sc, errMes, numComments);
		
		snipdao.deleteSnippet(snip.getID(), snip.getPassword());
		commdao = new CommentDAO();
		commdao.deleteCommentsBySnippet(snip, snip.getPassword());
		
	}
	
}
