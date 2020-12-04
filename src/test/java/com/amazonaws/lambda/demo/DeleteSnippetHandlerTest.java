package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.CreateSnippetHandler;
import com.amazonaws.DeleteSnippetHandler;
import com.amazonaws.GetSnippetHandler;
import com.amazonaws.http.snippet.CreateRequest;
import com.amazonaws.http.snippet.CreateResponse;
import com.amazonaws.http.snippet.DeleteSnippetRequest;
import com.amazonaws.http.snippet.DeleteSnippetResponse;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class DeleteSnippetHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testDelete(String incoming, int outgoing) {
		DeleteSnippetHandler handler = new DeleteSnippetHandler();
		DeleteSnippetRequest req = new Gson().fromJson(incoming, DeleteSnippetRequest.class);
		DeleteSnippetResponse response = handler.handleRequest(req, createContext("deleteSnippet"));
		
		assertEquals(outgoing, response.statusCode);
		
		GetSnippetHandler handler2 = new GetSnippetHandler();
		GetRequest req2 = new Gson().fromJson("{\"id\": \"" + req.id +"\"}", GetRequest.class);
		GetResponse response2 = handler2.handleRequest(req2, createContext("getSnippet"));
		
		assertEquals(response2.getStatusCode(), 400);
	}
	
	void testDeleteFail(String incoming, int outgoing) {
		DeleteSnippetHandler handler = new DeleteSnippetHandler();
		DeleteSnippetRequest req = new Gson().fromJson(incoming, DeleteSnippetRequest.class);
		DeleteSnippetResponse response = handler.handleRequest(req, createContext("deleteSnippet"));

		assertEquals(outgoing, response.statusCode);
	}
	
	@Test
	public void testDeleteSnippet() {
		CreateSnippetHandler handler = new CreateSnippetHandler();
		CreateRequest req = new Gson().fromJson("{\"password\": \"password\"}", CreateRequest.class);
		CreateResponse response = handler.handleRequest(req, createContext("createSnippet"));
		
		String sample = "{\"id\": \"" + response.id + "\", \"password\": \"password\"}";
		int sc = 200;
		testDelete(sample, sc);
	}
	
	@Test
	public void testDeleteWrongPW() {
		CreateSnippetHandler handler = new CreateSnippetHandler();
		CreateRequest req = new Gson().fromJson("{\"password\": \"password\"}", CreateRequest.class);
		CreateResponse response = handler.handleRequest(req, createContext("createSnippet"));
		
		String sample = "{\"id\": \"" + response.id + "\", \"password\": \"pasword\"}";
		int sc = 405;
		testDeleteFail(sample, sc);
		
		String sample2 = "{\"id\": \"" + response.id + "\", \"password\": \"password\"}";
		int sc2 = 200;
		testDelete(sample2, sc2);
	}
	
	@Test
	public void testDeleteWrongID() {
		String sample = "{\"id\": \".........\", \"password\": \"password\"}";
		int sc = 404;
		testDeleteFail(sample, sc);
	}
	
}
