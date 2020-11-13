package com.amazonaws.http;

import java.io.Serializable;

public class CreateRequest implements Serializable{

	private static final long serialVersionUID = 1L;
	private String password = null;
	
	public String getPass() { return password; }
	public void setPass(String pass) { password = pass; }
	
	public CreateRequest() {}
	
	public CreateRequest(String pass) {
		this.password = pass;
		
	}

	public String toString() {
		return "Create Snippet";
	}

}
