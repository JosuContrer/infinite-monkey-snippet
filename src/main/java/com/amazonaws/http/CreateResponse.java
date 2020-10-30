package com.amazonaws.http;

public class CreateResponse {
	public String id;
	public int statusCode; //HTTP status code
	public String error;
	
	public CreateResponse(String i) {
		this.id = i;
	}
	
}
