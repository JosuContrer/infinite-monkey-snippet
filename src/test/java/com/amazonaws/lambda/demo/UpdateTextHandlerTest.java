package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.GetSnippetHandler;
import com.amazonaws.UpdateTextHandler;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.http.snippet.UpdateTextRequest;
import com.amazonaws.http.snippet.UpdateTextResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class UpdateTextHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testUpdateText(String incoming, int outgoing) {
		UpdateTextHandler handler = new UpdateTextHandler();
		UpdateTextRequest req = new Gson().fromJson(incoming, UpdateTextRequest.class);
		UpdateTextResponse response = handler.handleRequest(req, createContext("updateText"));
		
		assertEquals(response.statusCode, outgoing);
		
		if (response.statusCode == 200) {
		
			GetSnippetHandler handler2 = new GetSnippetHandler();
			GetRequest req2 = new Gson().fromJson("{\"id\": \"" + req.id +"\"}", GetRequest.class);
			GetResponse response2 = handler2.handleRequest(req2, createContext("getSnippet"));
	
			assertEquals(response2.getText(), req.getSnippetText());
		}
	}
	
	@Test
	public void testUpdateSniptText() {
		String incoming = "{"
							+ "\"id\": \"78vylcev\","
							+ "\"text\": \"test\""
						+ "}";
		int sc = 200;
		testUpdateText(incoming, sc);
	}
	
	@Test
	public void testWrongID() {
		String incoming = "{"
							+ "\"id\": \".........\","
							+ "\"text\": \"test\""
						+ "}";
		int sc = 404;
		testUpdateText(incoming, sc);
	}
	
}
