package com.amazonaws.http;

public class CreateResponse {
	public String id;
	public int statusCode; //HTTP status code
	
	public CreateResponse(String i, int sc) {
		this.id = i;
		statusCode = sc;
	}
	
}
