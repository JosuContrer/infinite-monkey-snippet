package com.amazonaws.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;

public class Snippet {

	String id;
	long timestamp;
	String password;
	String info;
	String text;
	Language lang;
	
	public Snippet(ArrayList<Snippet> DBSnippets, String password) {
		this.id = generateNewID(DBSnippets);
		this.timestamp = (new Date()).getTime();
		this.password = password;
		this.info = "";
		this.text = "";
		this.lang = null;
	}
	
	public Snippet(String id, long timestamp, String password, String info, String text, int lang) {
		this.id = id;
		this.timestamp = timestamp;
		this.password = password;
		this.info = info;
		this.text = text;
		this.lang = Language.intToLang(lang);
	}
	
	public String getID() {
		return this.id;
	}
	
	public long getTimestamp() {
		return this.timestamp;
	}
	
	public String getPassword() {
		return this.password;
	}
	
	public boolean isPassword(String pass) {
		return this.password.equals(pass);
	}
	
	public String getInfo() {
		return this.info;
	}
	
	public String getText() {
		return this.text;
	}
	
	public void setInfo(String info) {
		this.info = info;
	}
	
	public void setText(String text) { // this might not be passed as String, depending on DB code should convert to String here
		this.text = text;
	}
	
	public Language getLang() {
		return this.lang;
	}
	
	public int getLangAsInt() {
		if (this.lang == null) {
			return -1;
		}
		else {
			return this.lang.langToInt();
		}
	}
	
	public void setLang(Language lang) {
		this.lang = lang;
	}
	
	public void setLang(int langInt) {
		this.lang = Language.intToLang(langInt);
	}
	
	private String generateID() {
		int minNum = 48; // 0
		int maxNum = 57; // 9
		int minLetter = 97; // a
		int maxLetter = 122; // z	

		String retString = "";
		char[] charArr = new char[36];
		
		int iter = 0;
		for (int num = minNum; num <= maxLetter; num++) {
			if (num <= maxNum || num >= minLetter) {
				charArr[iter] = (char) num;
				iter++;
			}
		}
		
		for (int i = 0; i < 8; i++) {
			retString += charArr[ThreadLocalRandom.current().nextInt(0, 36)];
		}
		
		return retString;
	}
	
	private String generateNewID(ArrayList<Snippet> DBSnippets) {
		String newID = generateID();
		if (DBSnippets == null) {
			return newID;
		}
		
		int iter = 0;
		
		while (iter < DBSnippets.size()) {
			if (newID.equals(DBSnippets.get(iter).getID())) {
				newID = generateID();
				iter = 0;
			}
			else {
				iter++;
			}
		}
		
		return newID;
	}
}
