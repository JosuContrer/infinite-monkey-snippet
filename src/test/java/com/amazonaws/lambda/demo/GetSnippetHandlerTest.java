package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.GetSnippetHandler;
import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class GetSnippetHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}

	void testGet(String incoming, int outgoing, String snipString) { 
		GetSnippetHandler handler = new GetSnippetHandler();
		GetRequest req = new Gson().fromJson(incoming, GetRequest.class);
		GetResponse response = handler.handleRequest(req, createContext("getSnippet"));
		
		assertEquals(outgoing, response.getStatusCode());
		assertEquals(response.toString(), snipString);
	}
	
	@Test
	public void testGetSnippet() throws Exception {
		SnippetDAO snipdao = new SnippetDAO();
		Snippet snip = new Snippet(snipdao.getAllSnippets(), "password");
		snipdao.addSnippet(snip);
		
		String incoming = "{\"id\": \"" + snip.getID() + "\"}";
		int sc = 200;
		String snipString = "GetSnippet(" 
							+ snip.getID() + ","
							+ snip.getText() + ","
							+ snip.getInfo() + ","
							+ snip.getPassword() + ","
							+ snip.getLang() + ","
							+ snip.getTimestamp() + ")";
		testGet(incoming, sc, snipString);
		
		snipdao.deleteSnippet(snip.getID(), snip.getPassword());
		CommentDAO commdao = new CommentDAO();
		commdao.deleteCommentsBySnippet(snip, snip.getPassword());

	}
	
}
