package com.amazonaws.http.snippet;

import java.io.Serializable;

public class ListRequest implements Serializable{

	private static final long serialVersionUID = 1L;
	public String adminPass = null;
	
	public String getAdminPass() {
		return this.adminPass;
	}
	
	public String toString() {
		return "ListSnippetsRequest( Admin Pass )";
	}
}
