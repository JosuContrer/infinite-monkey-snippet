package com.amazonaws.http;

public class GetRequest {
	
	private String snippetId = null;
	
	public GetRequest() {}
	
	public GetRequest(String id) {
		this.snippetId = id;
	}
	
	public String getSnippetId() { return snippetId; }
	public void setSnippetId(String id) { this.snippetId = id; }
	
	public String toString() {
		return "GetRequest(" + snippetId + ")";
	}
}
