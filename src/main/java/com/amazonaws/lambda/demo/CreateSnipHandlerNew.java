//package com.amazonaws.lambda.demo;
//
//import java.io.PrintWriter;
//import java.io.StringWriter;
//
//import com.amazonaws.labda.demo.http.CreateRequest;
//import com.amazonaws.labda.demo.http.CreateResponse;
//import com.amazonaws.lambda.demo.db.SnippetDAO;
//import com.amazonaws.lambda.demo.model.Result;
//import com.amazonaws.lambda.demo.model.Snippet;
//import com.amazonaws.services.lambda.runtime.Context;
//import com.amazonaws.services.lambda.runtime.LambdaLogger;
//import com.amazonaws.services.lambda.runtime.RequestHandler;
//import com.amazonaws.util.json.Jackson;
//import com.fasterxml.jackson.databind.JsonNode;
//
//public class CreateSnipHandlerNew implements RequestHandler<CreateRequest, CreateResponse> {
//	
//	LambdaLogger logger;
//	
//	
//	@Override
//	public CreateResponse handleRequest(CreateRequest input, Context context) {
//		logger = context.getLogger();
//		logger.log("Loading Java Lambda of CreateSnippet");
//		logger.log(input.toString());
//		
//		boolean fail = false;
//		String failMessage = "";
//		String snippetId = null;
//		
//		// Parse to get only the body form the API Gateway
//		JsonNode node = Jackson.fromJsonString(incoming.toString(), JsonNode.class);
//		if (node.has("body")) {
//			node = Jackson.fromJsonString(node.get("body").asText(), JsonNode.class);
//		}
//			
//		// Processes the JSON password and creation of snippet 
//		int statusCode = 200;
//		
//		// Processes the password TODO: check feasible password and no special characters
//		String passParam = node.get("password").asText();
//		
//		try {
//			
//			SnippetDAO snipdao = new SnippetDAO();
//			Snippet snip = null;
//			
//			if (passParam.length() < 32) {
//				snip = new Snippet(snipdao.getAllSnippets(), passParam);
//			}
//			else {
//				statusCode = 400;
//			}
//			
//			// TODO - probably breaks code
//			snipdao.addSnippet(snip);
//			
//			// Processes RESPONSE
//			PrintWriter pw = new PrintWriter(output);
//			
//			// Create JSON response
//			String response = Result.ResultJSON(statusCode, snip.getID());
//			
//			// Send Response
//			//   Codes API: 200 (Snippet created), 400 (Invalid snippet)
//			pw.print(response);
//			pw.close();
//		}
//		catch (Exception e) {
//			PrintWriter pw = new PrintWriter(output);
//			
//			StringWriter errSW = new StringWriter();
//			PrintWriter errPW = new PrintWriter(errSW);
//			e.printStackTrace(errPW);
//			
//			String response = Result.ResultJSON(statusCode, Result.ErrorJSON(e.getMessage(), errSW.toString()));
//			
//			pw.print(response);
//			pw.close();
//		}
//	}
//}
//
