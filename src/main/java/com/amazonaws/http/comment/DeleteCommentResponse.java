package com.amazonaws.http.comment;

public class DeleteCommentResponse {
	
	private int statusCode;
	private String statusMessage;
	
	public DeleteCommentResponse(int sc, String sm) {
		this.statusCode = sc;
		this.statusMessage = sm;
	}
	
	public int getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}
	public String getStatusMessage() {
		return statusMessage;
	}
	public void setStatusMessage(String statusMessage) {
		this.statusMessage = statusMessage;
	}

	public String toString() {
		return "DeleteComentResponse(" + this.statusCode + ", " + this.statusMessage + ")";
	}

}
