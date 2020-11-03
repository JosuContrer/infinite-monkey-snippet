package com.amazonaws.http;

import java.io.Serializable;

public class UpdateTextRequest implements Serializable{
	
	private static final long serialVersionUID = 1L;
	public String id;
	public String snippetText;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSnippetText() {
		return snippetText;
	}
	public void setSnippetText(String snippetText) {
		this.snippetText = snippetText;
	}
}
