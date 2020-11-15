package com.amazonaws.http.comment;

import java.util.ArrayList;

import com.amazonaws.model.Comment;
import com.amazonaws.model.Snippet;

public class GetSnipCommentsResponse {
	
	private int statusCode;
	private String snippetID;
	private ArrayList<Comment> comments;
	
	public GetSnipCommentsResponse(int sc, String snippetID, ArrayList<Comment> comments) {
		this.statusCode = sc;
		this.snippetID = snippetID;
		this.comments = comments;
	}
	
	public GetSnipCommentsResponse(int sc, String i) {
		this.statusCode = sc;
		this.snippetID = i;
	}
	
	
	
	public String getSnippetID() { 
		return this.snippetID;	
	}
	public void setSnippetID(String id) {
		this.snippetID = id;
	}
	
	public ArrayList<Comment> getComments() {
		return this.comments;
	}
	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
	
	public String toString() {
		return "GetSnipComments(" + this.comments.size() + ")";
	}
	

}
