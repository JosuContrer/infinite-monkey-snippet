package com.amazonaws.http;
import java.io.Serializable;

public class GetRequest implements Serializable {

	private static final long serialVersionUID = 1L;
	public String id = null;
	
	public GetRequest() {}
	
	public GetRequest(String id) {
		this.id = id;
	}
	
	public String toString() {
		return "GetRequest(" + id + ")";
	}
}
