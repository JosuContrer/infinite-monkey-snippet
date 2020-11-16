package com.amazonaws.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;

public class Comment {
	
	String id;
	String snippetID;
	long timestamp;
	int regionStart;
	int regionEnd;
	String text;
	
	public Comment(ArrayList<Comment> DBComments, String snippetID, int regionStart, int regionEnd, String text) {
		this.id = generateNewID(DBComments);
		this.snippetID = snippetID;
		this.timestamp = (new Date()).getTime();
		this.regionStart = regionStart;
		this.regionEnd = regionEnd;
		this.text = text;
	}
	
	public Comment(String id, String snippetID, long timestamp, int regionStart, int regionEnd, String text) {
		this.id = id;
		this.snippetID = snippetID;
		this.timestamp = timestamp;
		this.regionStart = regionStart;
		this.regionEnd = regionEnd;
		this.text = text;
	}
	
	public String getID() {
		return this.id;
	}
	
	public String getSnippetID() {
		return this.snippetID;
	}
	
	public long getTimestamp() {
		return this.timestamp;
	}
	
	public int getRegionStart() {
		return this.regionStart;
	}
	
	public int getRegionEnd() {
		return this.regionEnd;
	}
	
	public String getText() {
		return this.text;
	}
	
	public void setID(String newID) {
		this.id = newID;
	}
	
	public void setSnippetID(String newID) {
		this.snippetID = newID;
	}
	
	public void setRegionStart(int x) {
		this.regionStart = x;
	}
	
	public void setRegionEnd(int y) {
		this.regionEnd = y;
	}
	
	public void setText(String text) {
		this.text = text;
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
	
	private String generateNewID(ArrayList<Comment> DBComments) {
		String newID = generateID();
		if (DBComments == null) {
			return newID;
		}
		
		int iter = 0;
		
		while (iter < DBComments.size()) {
			if (newID.equals(DBComments.get(iter).getID())) {
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
