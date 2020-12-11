package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.CreateCommentHandler;
import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.comment.CreateCommentRequest;
import com.amazonaws.http.comment.CreateCommentResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class CreateCommentHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testCreate(String incoming, int outgoing) {
		CreateCommentHandler handler = new CreateCommentHandler();
		CreateCommentRequest req = new Gson().fromJson(incoming, CreateCommentRequest.class);
		CreateCommentResponse response = handler.handleRequest(req, createContext("createComment"));
		
		assertNotEquals(0, response.id);
		assertEquals(outgoing, response.statusCode);
	}
	
	@Test
	public void testCreateComment() throws Exception {
		SnippetDAO snipdao = new SnippetDAO();
		Snippet snip = new Snippet(snipdao.getAllSnippets(), "password");
		snipdao.addSnippet(snip);

		String sampleComment = "{\"snippetID\": \"" + snip.getID() + "\", \"text\": \"test\", \"regionStart\": \"1\", \"regionEnd\": \"1\"}";
		int expectedStatusCode = 200;
		testCreate(sampleComment, expectedStatusCode);
		
		snipdao.deleteSnippet(snip.getID(), snip.getPassword());
		CommentDAO commdao = new CommentDAO();
		commdao.deleteCommentsBySnippet(snip, snip.getPassword());

	}
	
	@Test
	public void testCreateFail() {
		String sampleComment = "{\"snippetID\": \".........\", \"text\": \"test\", \"regionStart\": \"1\", \"regionEnd\": \"1\"}";
		int expectedStatusCode = 404;
		testCreate(sampleComment, expectedStatusCode);
	}
}
