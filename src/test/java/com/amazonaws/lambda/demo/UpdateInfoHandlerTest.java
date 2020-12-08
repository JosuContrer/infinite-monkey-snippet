package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.GetSnippetHandler;
import com.amazonaws.UpdateInfoHandler;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.http.snippet.UpdateInfoRequest;
import com.amazonaws.http.snippet.UpdateInfoResponse;
import com.amazonaws.services.lambda.runtime.Context;
import com.google.gson.Gson;

public class UpdateInfoHandlerTest {

	Context createContext(String apiCall) {
		TestContext ctx = new TestContext();
		ctx.setFunctionName(apiCall);
		return ctx;
	}
	
	void testUpdateInfo(String incoming, int outgoing) {
		UpdateInfoHandler handler = new UpdateInfoHandler();
		UpdateInfoRequest req = new Gson().fromJson(incoming, UpdateInfoRequest.class);
		UpdateInfoResponse response = handler.handleRequest(req, createContext("updateInfo"));
		
		assertEquals(response.statusCode, outgoing);
		
		if (response.statusCode == 200) {
		
			GetSnippetHandler handler2 = new GetSnippetHandler();
			GetRequest req2 = new Gson().fromJson("{\"id\": \"" + req.id +"\"}", GetRequest.class);
			GetResponse response2 = handler2.handleRequest(req2, createContext("getSnippet"));
	
			assertEquals(response2.getInfo(), req.getText());
		}
	}
	
	@Test
	public void testUpdateSnipInfo() {
		
		String incoming = "{"
							+ "\"id\": \"78vylcev\","
							+ "\"info\": \"test\","
							+ "\"lang\": \"\","
							+ "\"password\": \"\""
						+ "}";
		int sc = 200;
		testUpdateInfo(incoming, sc);
	}
	
	@Test
	public void testWrongPW() {
		
		String incoming = "{"
							+ "\"id\": \"78vylcev\","
							+ "\"info\": \"test\","
							+ "\"lang\": \"\","
							+ "\"password\": \"password\""
						+ "}";
		int sc = 405;
		testUpdateInfo(incoming, sc);
	}
	
	@Test
	public void testInvalidID() {
		
		String incoming = "{"
							+ "\"id\": \".........\","
							+ "\"info\": \"test\","
							+ "\"lang\": \"\","
							+ "\"password\": \"\""
						+ "}";
		int sc = 404;
		testUpdateInfo(incoming, sc);
	}
	
}
