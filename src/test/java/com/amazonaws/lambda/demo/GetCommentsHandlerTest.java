package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.CreateCommentHandler;
import com.amazonaws.CreateSnippetHandler;
import com.amazonaws.GetSnipCommentsHandler;
import com.amazonaws.http.comment.CreateCommentRequest;
import com.amazonaws.http.comment.CreateCommentResponse;
import com.amazonaws.http.comment.GetSnipCommentsRequest;
import com.amazonaws.http.comment.GetSnipCommentsResponse;
import com.amazonaws.http.snippet.CreateRequest;
import com.amazonaws.http.snippet.CreateResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class GetCommentsHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testGetComments(String incoming, int outgoing, int numComments) {
		GetSnipCommentsHandler handler = new GetSnipCommentsHandler();
		GetSnipCommentsRequest req = new Gson().fromJson(incoming, GetSnipCommentsRequest.class);
		GetSnipCommentsResponse response = handler.handleRequest(req, createContext("getSnipComments"));
		
		assertEquals(response.getStatusCode(), outgoing);
		assertEquals(req.snippetID, response.getSnippetID());
		assertEquals(response.getComments().size(), numComments);
	}
	
	@Test
	public void testGetComments() {
		// create a snippet for testing
		CreateSnippetHandler handler = new CreateSnippetHandler();
		CreateRequest req = new Gson().fromJson("{\"password\": \"password\"}", CreateRequest.class);
		CreateResponse response = handler.handleRequest(req, createContext("createSnippet"));

		// create comments for testing
		String sampleComment = "{\"snippetID\": \"" + response.id + "\", \"text\": \"test\", \"regionStart\": \"1\", \"regionEnd\": \"1\"}";
		CreateCommentHandler handler2 = new CreateCommentHandler();
		CreateCommentRequest req2 = new Gson().fromJson(sampleComment, CreateCommentRequest.class);
		CreateCommentResponse response2 = handler2.handleRequest(req2, createContext("createComment"));
		
		String sampleComment2 = "{\"snippetID\": \"" + response.id + "\", \"text\": \"test\", \"regionStart\": \"1\", \"regionEnd\": \"1\"}";
		CreateCommentRequest req3 = new Gson().fromJson(sampleComment2, CreateCommentRequest.class);
		CreateCommentResponse response3 = handler2.handleRequest(req3, createContext("createComment"));
		
		String incoming = "{\"snippetID\": \"" + response.id + "\"}";
		int sc = 200;
		int numComments = 2;
		testGetComments(incoming, sc, numComments);
	}
	
}
