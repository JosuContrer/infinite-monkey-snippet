package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.GetSnippetHandler;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
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
	public void testGetSnippet() {
		String incoming = "{\"id\": \"78vylcev\"}";
		int sc = 200;
		String snipString = "GetSnippet(78vylcev,,,,,1607107682460)";
		testGet(incoming, sc, snipString);

	}
	
}
