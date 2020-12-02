package com.amazonaws.http.snippet;

import java.io.Serializable;

public class UpdateInfoRequest implements Serializable{
	
	private static final long serialVersionUID = 1L;
	public String id;
	public String info;
	public String lang;
	public String password;
	
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }
	
	public String getText() { return info; }
	public void setText(String text) { this.lang = text; }
	
	public String getLang() { return info; }
	public void setLang(String text) { this.lang = text; }
	
	public UpdateInfoRequest() {}
	public UpdateInfoRequest(String id, String text, String lang, String pw) {
		this.id = id;
		this.info = text;
		this.lang = lang;
		password = pw;
	}
	
	public String toString() {
		return "UpdateInfoRequest(" + id + ", " + info + ", " + lang + ")";
	}
}
