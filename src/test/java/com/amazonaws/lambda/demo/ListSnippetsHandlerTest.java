package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import java.util.ArrayList;

import org.junit.Test;

import com.amazonaws.ListSnippetsHandler;
import com.amazonaws.http.snippet.ListRequest;
import com.amazonaws.http.snippet.ListResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class ListSnippetsHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testList(String incoming, int outgoing, String errMes, String firstSnip) {
		ListSnippetsHandler handler = new ListSnippetsHandler();
		ListRequest req = new Gson().fromJson(incoming, ListRequest.class);
		ListResponse response = handler.handleRequest(req, createContext("listSnippets"));
		
		assertEquals(outgoing, response.getStatusCode());
		assertEquals(errMes, response.getErrorMessage());
		if(outgoing == 200)
			assertEquals(firstSnip, response.getSnippetList().get(0).getId());
	}
	
	@Test
	public void testListSnips() {
		String sample = "{\"adminPass\": \"admin\"}";
		int sc = 200;
		String errMes = "List Snippets";
		String firstSnip = "09mj01p9";
		
		testList(sample, sc, errMes, firstSnip);
	}
	
	@Test
	public void testWrongPW() {
		String sample = "{\"adminPass\": \"wrongPW\"}";
		int sc = 405;
		String errMes = "List snippets not allowed";
		String firstSnip = "09mj01p9";
		
		testList(sample, sc, errMes, firstSnip);
	}
	
}
