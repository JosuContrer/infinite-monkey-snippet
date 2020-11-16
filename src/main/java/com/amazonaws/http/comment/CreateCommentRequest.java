package com.amazonaws.http.comment;

import java.io.Serializable;

import com.amazonaws.model.Comment;

public class CreateCommentRequest implements Serializable {
	
	public static final long serialVersionUID = 1L;
	
	public String snippetID;
	public String text;
	public int regionStart;
	public int regionEnd;
	
	public CreateCommentRequest() {}
	public CreateCommentRequest(String snippetID, String text, int regionStart, int regionEnd) {
		this.snippetID = snippetID;
		this.text = text;
		this.regionStart = regionStart;
		this.regionEnd = regionEnd;
	}

}
