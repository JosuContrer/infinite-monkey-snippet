package com.amazonaws.http.snippet;

import java.io.Serializable;

public class CreateRequest implements Serializable{

	public static final long serialVersionUID = 1L;
	public String password = null;
	
	public String getPass() { return password; }
	public void setPass(String password) { this.password = password; }
	
	public CreateRequest() {}
	
	public CreateRequest(String password) {
		this.password = password;
		
	}

	public String toString() {
		return "Create Snippet(" + password + ")";
	}

}
