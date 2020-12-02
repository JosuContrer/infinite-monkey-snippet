package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.CreateSnippetHandler;
import com.amazonaws.http.snippet.CreateRequest;
import com.amazonaws.http.snippet.CreateResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class CreateSnippetHandlerTest {
	
	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testCreate(String incoming) {
		CreateSnippetHandler handler = new CreateSnippetHandler();
		CreateRequest request = new Gson().fromJson(incoming, CreateRequest.class);
		CreateResponse response = handler.handleRequest(request, createContext("createSnippet"));
		
		assertNotNull(response.id);
		assertEquals(200, response.statusCode);
	}
	
	void testCreateFail(String incoming) {
		CreateSnippetHandler handler = new CreateSnippetHandler();
		CreateRequest request = new Gson().fromJson(incoming, CreateRequest.class);
		CreateResponse response = handler.handleRequest(request, createContext("createSnippet"));

		assertEquals(404, response.statusCode);
	}
	
	@Test
	public void testCreateSnippet() {
		String samplePW = "{\"password\": \"testPW\"}";
		testCreate(samplePW);
	}
	
	@Test
	public void testCreateNoPW() {
		String samplePW = "{\"password\": \"\"}";
		testCreate(samplePW);
	}
	
	@Test
	public void testCreatePWTooLong() {
		String samplePW = "{\"password\": \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"}";
		testCreateFail(samplePW);
	}
}

