package com.amazonaws.http;

public class CreateCommentResponse {
	
	public String id;
	public int statusCode;
	
	public CreateCommentResponse(String id, int sc) {
		this.id = id;
		statusCode = sc;
	}

}
