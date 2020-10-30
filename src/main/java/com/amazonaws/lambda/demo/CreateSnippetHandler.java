package com.amazonaws.lambda.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;

import com.amazonaws.lambda.demo.db.SnippetDAO;
import com.amazonaws.lambda.demo.model.Snippet;
import com.amazonaws.lambda.demo.model.Result;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.util.json.Jackson;
import com.fasterxml.jackson.databind.JsonNode;

public class CreateSnippetHandler implements RequestStreamHandler {

	LambdaLogger logger;
	
	// To handle client requests and respond 
	@Override
	public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
		logger = context.getLogger();
		if (context != null) { 
			context.getLogger();
		}
		
		// Load entire input into String since it is a JSON request
		StringBuilder incoming = new StringBuilder();
		try (BufferedReader br = new BufferedReader(new InputStreamReader(input))){
			String line = null;
			while((line = br.readLine()) != null) {
				incoming.append(line);
			}
		}
		
		logger.log("Past StringBuilder");
		
		// Parse to get only the body form the API Gateway
		JsonNode node = Jackson.fromJsonString(incoming.toString(), JsonNode.class);
		if (node.has("body")) {
			node = Jackson.fromJsonString(node.get("body").asText(), JsonNode.class);
		}
			
		// Processes the JSON password and creation of snippet 
		int statusCode = 200;
		
		// Processes the password TODO: check feasible password and no special characters
		String passParam = node.get("password").asText();
		
		try {
			
			SnippetDAO snipdao = new SnippetDAO();
			Snippet snip = null;
			
			logger.log("Past DAO");
			
			if (passParam.length() < 32) {
				snip = new Snippet(snipdao.getAllSnippets(), passParam);
			}
			else {
				statusCode = 400;
			}
			
			// TODO - probably breaks code
			//snipdao.addSnippet(snip);
			
			// Processes RESPONSE
			PrintWriter pw = new PrintWriter(output);
			
			// Create JSON response
			String response = Result.ResultJSON(statusCode, snip.getID());
			
			// Send Response
			//   Codes API: 200 (Snippet created), 400 (Invalid snippet)
			pw.print(response);
			pw.close();
		}
		catch (Exception e) {
			PrintWriter pw = new PrintWriter(output);
			
			logger.log("Error " + e.getMessage());
			
//			StringWriter errSW = new StringWriter();
//			PrintWriter errPW = new PrintWriter(errSW);
//			e.printStackTrace(errPW);
			
			String response = Result.ResultJSON(statusCode, Result.ErrorJSON(e.getMessage(), "bruh"));
			
			pw.print(response);
			pw.close();
		}
	}
}
