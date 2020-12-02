package com.amazonaws.model;

public class SnippetDescriptor {
	
	String id;
	long timestamp;
	
	public SnippetDescriptor(String id, long timestamp) {
		this.id = id;
		this.timestamp = timestamp;
	}
	
	public String getId() {
		return this.id;
	}
	
	public long getTimestamp() {
		return this.timestamp;
	}

}
