package com.amazonaws.http.snippet;

import java.io.Serializable;

public class DeleteSnippetRequest implements Serializable{

	private static final long serialVersionUID = 1L;
	public String id;
	public String password;
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	
	public String toString() {
		return "DeleteSnippetRequest(" + id + ", " + password + ")";
	}
}
