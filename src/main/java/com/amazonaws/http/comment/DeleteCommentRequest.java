package com.amazonaws.http.comment;

import java.io.Serializable;

public class DeleteCommentRequest implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public String snippetId;
	public String commentId;
	public String password;
	
	public String getSnippetId() {
		return snippetId;
	}
	public void setSnippetId(String snippetId) {
		this.snippetId = snippetId;
	}
	public String getCommentId() {
		return commentId;
	}
	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}
	public String getPassword() {
		return password;
	}

	public String toString() {
		return "DeleteCommentRequest(" + this.snippetId + ", " + this.commentId + ")";
	}
}
