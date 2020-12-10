package com.amazonaws.http.comment;

import java.io.Serializable;

public class DeleteCommentRequest implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public String snippetID;
	public String id;
	public String password;
	
	public String getSnippetId() {
		return snippetID;
	}
	public void setSnippetId(String snippetId) {
		this.snippetID = snippetId;
	}
	public String getCommentId() {
		return id;
	}
	public void setCommentId(String commentId) {
		this.id = commentId;
	}
	public String getPassword() {
		return password;
	}

	public String toString() {
		return "DeleteCommentRequest(" + this.snippetID + ", " + this.id + ")";
	}
}
