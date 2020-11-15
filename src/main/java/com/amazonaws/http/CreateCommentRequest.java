package com.amazonaws.http;

import java.io.Serializable;

public class CreateCommentRequest implements Serializable {
	
	public static final long serialVersionUID = 1L;
	public Comment comment;	// our API says the post request for Comment sends a 
							// Comment, so I figured the Request would hold that
							// Can change later as needed.
	public Comment getComment() { return comment; }
	public void setComment(Comment comment) { this.comment = comment; }
	
	public CreateCommentRequest() {}
	public CreateCommentRequest(Comment c) { comment = c; }

}
