package com.amazonaws.http;

import java.io.Serializable;

public class UpdateInfoRequest implements Serializable{
	
	private static final long serialVersionUID = 1L;
	public String id;
	public String text;
	public int language;
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	
	public String getText() { return text; }
	public void setText(String text) { this.text = text; }
	
	public int getLanguage() { return language; }
	public void setLanguage(int language) { this.language = language; }

	public UpdateInfoRequest() {}
	public UpdateInfoRequest(String id, String text, int lang) {
		this.id = id;
		this.text = text;
		language = lang;
	}
	
	public String toString() {
		return "UpdateInfoRequest(" + id + ", " + text + ", " + language + ")";
	}
}
