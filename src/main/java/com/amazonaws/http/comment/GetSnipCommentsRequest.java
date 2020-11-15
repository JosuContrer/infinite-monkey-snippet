package com.amazonaws.http.comment;
import java.io.Serializable;

public class GetSnipCommentsRequest implements Serializable {

	private static final long serialVersionUID = 1L;
	public String snippetID = null;
	
	public GetSnipCommentsRequest() {}
	
	public GetSnipCommentsRequest(String snippetID) {
		this.snippetID = snippetID;
	}
	
	public String toString() {
		return "GetSnipCommentsRequest(" + snippetID + ")";
	}
}
