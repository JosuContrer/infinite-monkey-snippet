package com.amazonaws.lambda.demo;

import static org.junit.Assert.*;

import org.junit.Test;

import com.amazonaws.GetSnippetHandler;
import com.amazonaws.UpdateInfoHandler;
import com.amazonaws.db.CommentDAO;
import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.snippet.GetRequest;
import com.amazonaws.http.snippet.GetResponse;
import com.amazonaws.http.snippet.UpdateInfoRequest;
import com.amazonaws.http.snippet.UpdateInfoResponse;
import com.amazonaws.model.Snippet;
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
	public void testUpdateSnipInfo() throws Exception {
		SnippetDAO snipdao = new SnippetDAO();
		Snippet snip = new Snippet(snipdao.getAllSnippets(), "password");
		snipdao.addSnippet(snip);

		String incoming = "{"
							+ "\"id\": \"" + snip.getID() + "\","
							+ "\"info\": \"test\","
							+ "\"lang\": \"\","
							+ "\"password\": \"password\""
						+ "}";
		int sc = 200;
		testUpdateInfo(incoming, sc);
		
		snipdao.deleteSnippet(snip.getID(), snip.getPassword());
		CommentDAO commdao = new CommentDAO();
		commdao.deleteCommentsBySnippet(snip, snip.getPassword());

	}
	
	@Test
	public void testWrongPW() throws Exception {
		SnippetDAO snipdao = new SnippetDAO();
		Snippet snip = new Snippet(snipdao.getAllSnippets(), "password");
		snipdao.addSnippet(snip);

		String incoming = "{"
							+ "\"id\": \"" + snip.getID() + "\","
							+ "\"info\": \"test\","
							+ "\"lang\": \"\","
							+ "\"password\": \"pasword\""
						+ "}";
		int sc = 405;
		testUpdateInfo(incoming, sc);
		
		snipdao.deleteSnippet(snip.getID(), snip.getPassword());
		CommentDAO commdao = new CommentDAO();
		commdao.deleteCommentsBySnippet(snip, snip.getPassword());

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
