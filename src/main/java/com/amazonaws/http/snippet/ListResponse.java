package com.amazonaws.http.snippet;

import java.util.ArrayList;

import com.amazonaws.model.SnippetDescriptor;

public class ListResponse {

	private int statusCode;
	private String errorMessage;
	private ArrayList<SnippetDescriptor> snippetList;
	
	public ListResponse(int sc, String em, ArrayList<SnippetDescriptor> sl) {
		this.statusCode = sc;
		this.errorMessage = em;
		this.snippetList = sl;
	}
	
	public ListResponse(int sc, String em) {
		this.statusCode = sc;
		this.errorMessage = em;
	}
	
	public ListResponse(int sc) {
		this.statusCode = sc;
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
		return "ListSnippets(" + this.snippetList.size() + ")";
	}

}
