package com.amazonaws.http;

public class DeleteSnippetResponse {
	/*
	 * The Status codes for this delete handler:
	 * 		200: Snippet deleted
	 * 		404: No Snippet found with the provided ID
	 * 		405: Could not delete Snippet
	 */
	public int statusCode;
	
	public DeleteSnippetResponse(int sc) {
		this.statusCode = sc;		
	}

}
