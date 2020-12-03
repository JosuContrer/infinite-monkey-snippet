package com.amazonaws.http.snippet;

import java.util.ArrayList;
import com.amazonaws.model.SnippetDescriptor;

public class RemoveStaleResponse {
	
	private int statusCode = 0;
	private String errorMessage = null;
	private ArrayList<SnippetDescriptor> snippetList = null;

	public RemoveStaleResponse(int sc) {
		this.statusCode = sc;
	}
	
	public RemoveStaleResponse(int sc, String em) {
		this.statusCode = sc;
		this.errorMessage = em;
	}
	
	public RemoveStaleResponse(int sc, String em, ArrayList<SnippetDescriptor> sl) {
		this.statusCode = sc;
		this.errorMessage = em;
		this.setSnippetList(sl);
	}
	
	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	
	public ArrayList<SnippetDescriptor> getSnippetList() {
		return snippetList;
	}

	public void setSnippetList(ArrayList<SnippetDescriptor> snippetList) {
		this.snippetList = snippetList;
	}
	
	public String toString() {
		return "RemoveStaleResponse(" + this.statusCode + "," + this.errorMessage + ")";
	}
}