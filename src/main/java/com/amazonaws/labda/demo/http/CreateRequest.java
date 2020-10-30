package com.amazonaws.labda.demo.http;

public class CreateRequest {
	private String password = null;
	
	public CreateRequest(String pass) {
		this.password = pass;
		
	}
	
	public String getPass() { return password; }
	public void setPass(String pass) { password = pass; }
	
	public String toString() {
		return "Create Snippet";
	}

}
