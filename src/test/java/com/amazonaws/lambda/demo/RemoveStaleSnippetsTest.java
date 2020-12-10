package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.GetSnippetHandler;
import com.amazonaws.RemoveStaleSnippets;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.http.snippet.RemoveStaleRequest;
import com.amazonaws.http.snippet.RemoveStaleResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class RemoveStaleSnippetsTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testRemove(String incoming, int outgoing, String errMes) {
		RemoveStaleSnippets handler = new RemoveStaleSnippets();
		RemoveStaleRequest req = new Gson().fromJson(incoming, RemoveStaleRequest.class);
		RemoveStaleResponse response = handler.handleRequest(req, createContext("removeStaleSnips"));
		
		assertEquals(outgoing, response.getStatusCode());
		assertEquals(errMes, response.getErrorMessage());

		GetSnippetHandler handler2 = new GetSnippetHandler();
		GetRequest req2 = new Gson().fromJson("{\"id\": \"testSnip\"}", GetRequest.class);
		GetResponse response2 = handler2.handleRequest(req2, createContext("getSnippet"));
		
		assertEquals(response2.getStatusCode(), 400);
	}
	
	@Test
	public void testRemoveStaleSnips() throws Exception {
		// create a snippet to delete
		Snippet testSnip = new Snippet("testSnip", 0, "", "", "", "");
		SnippetDAO snipdao = new SnippetDAO();
		snipdao.addSnippet(testSnip);
		
		String incoming = "{\"adminPass\": \"admin\", \"staleTime\": 1}";
		int sc = 200;
		String errMes = "Removed Stale Snippets";
		
		testRemove(incoming, sc, errMes);
		
	}
	
	@Test
	public void testNoStaleSnips() {
		String incoming = "{\"adminPass\": \"admin\", \"staleTime\": 1}";
		int sc = 400;
		String errMes = "DAO Error";
		
		testRemove(incoming, sc, errMes);
	}
	
	@Test
	public void testBadTimestamp() {
		String incoming = "{\"adminPass\": \"admin\", \"staleTime\": 9999999999999}";
		int sc = 400;
		String errMes = "Invalid date";
		
		testRemove(incoming, sc, errMes);
	}
	
	@Test
	public void testWrongPW() {
		String incoming = "{\"adminPass\": \"wrongPW\", \"staleTime\": 1}";
		int sc = 403;
		String errMes = "Forbidden";
		
		testRemove(incoming, sc, errMes);
	}
	
}
