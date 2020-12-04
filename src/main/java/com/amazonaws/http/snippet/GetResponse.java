package com.amazonaws.http.snippet;

import com.amazonaws.model.Snippet;

public class GetResponse {
	
	private int statusCode;
	private String id;
	private String text;
	private String info;
	private String password; // TODO: Wait a second do we want to get this!!! maybe we have to change the REST API
	private String language;
	private long timestamp;
	
	public GetResponse(int sc, String i, String tx, String io, String pass, String lang, long ts) {
		this.statusCode = sc;
		this.id = i;
		this.text = tx;
		this.info = io;
		this.password = pass;
		this.language = lang;
		this.timestamp = ts;
	}
	
	public GetResponse(int sc, Snippet s) {
		this.statusCode = sc;
		this.id = s.getID();
		this.text = s.getText();
		this.info = s.getInfo();
		this.password = s.getPassword();
		this.language = s.getLang();
		this.timestamp = s.getTimestamp();
	}
	
	public GetResponse(int sc, String i) {
		this.statusCode = sc;
		this.id = i;
	}
	
	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}
	
	public String getId() { return id;	}
	public void setId(String id) {
		this.id = id;
	}
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	
	public String getInfo() {
		return info;
	}
	
	public void setInfo(String info) {
		this.info = info;
	}
	
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	
	public long getTimestamp() {
		return timestamp;
	}
	
	public void setTimestamp(int timestamp) {
		this.timestamp = timestamp;
	}
	
	public String toString() {
		return "GetSnippet(" + id + "," + text + "," + info + "," + password + "," + language + "," + timestamp + ")";
	}
	

}
