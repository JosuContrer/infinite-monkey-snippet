package com.amazonaws.http.snippet;

public class UpdateInfoResponse {

	public int statusCode;
	
	public UpdateInfoResponse(int sc) {
		statusCode = sc;
	}
	
	public void setStatusCode(int sc) { statusCode = sc; }
}
