package com.amazonaws.http;

import java.io.Serializable;

public class UpdateTextRequest implements Serializable{
	
	private static final long serialVersionUID = 1L;
	public String id;
	public String text;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSnippetText() {
		return text;
	}
	public void setSnippetText(String text) {
		this.text = text;
	}
	
	public UpdateTextRequest() {}
	
	public UpdateTextRequest(String id, String text) {
		this.id = id;
		this.text = text;
	}
	
	public String toString() {
		return "UpdateTextRequest(" + id + ", " + text + ")";
	}
}
