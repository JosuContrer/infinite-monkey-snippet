package com.amazonaws.http.snippet;

import java.io.Serializable;
import java.util.Date;

public class RemoveStaleRequest implements Serializable{

	private static final long serialVersionUID = 1L;
	public String adminPass = null;
	public long staleTime = 0;
	
	public String getaPass() {
		return adminPass;
	}
	
	public long getStaleUnixTime() {
		return staleTime;
	}
	
	public Date getStaleDateTime() {
		return new Date(this.staleTime);
	}
	
	public String toString() {
		return "RemoveStaleSnippets(" + this.getStaleDateTime() + ")";
	}
}
