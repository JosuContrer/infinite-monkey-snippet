package com.amazonaws.http.snippet;

import java.io.Serializable;

public class ListRequest implements Serializable{

	private static final long serialVersionUID = 1L;
	public String aPass = null;
	
	public String getAdminPass() {
		return this.aPass;
	}
	
	public String toString() {
		return "ListSnippetsRequest( Admin Pass )";
	}
}
