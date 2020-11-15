package com.amazonaws.db;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.amazonaws.model.Comment;
import com.amazonaws.model.Snippet;

public class CommentDAO {
	java.sql.Connection conn;
	final static String table = "comments";
	
	public CommentDAO() throws Exception {
		conn = DBConnection.connect();
	}
	
	
	public static Comment SQLToComment(ResultSet result) throws Exception {
		String id = result.getString("id");
		String snippetID = result.getString("snippetID");
		long timestamp = result.getLong("timestamp");
		int regionStart = result.getInt("regionStart");
		int regionEnd = result.getInt("regionEnd");
		String text = result.getString("text");
		
		return new Comment(id, snippetID, timestamp, regionStart, regionEnd, text);
	}
	
	public Comment getComment(String id) throws Exception {
		Comment retCom = null;
		
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id=?;");
		ps.setString(1, id);
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retCom = SQLToComment(result);
		}
		
		result.close();
		ps.close();
		
		return retCom;
	}
	
	public ArrayList<Comment> getCommentsBySnippet(String snippetID) throws Exception {
		ArrayList<Comment> retList = new ArrayList<Comment>();
		
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE snippetID=?;");
		ps.setString(1, snippetID);
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retList.add(SQLToComment(result));
		}
		
		result.close();
		ps.close();
		
		return retList;
	}
	
	public boolean deleteComment(Snippet snip, String id, String password) throws Exception {	
		int numUpdated = 2;
		
		if(snip.isPassword(password)) {
			PreparedStatement ps = conn.prepareStatement("DELETE FROM " + table + " WHERE id=?;");
			ps.setString(1, id);
			
			numUpdated = ps.executeUpdate();
			ps.close();
		}else {
			return false;
		}
		
		return (numUpdated == 1);
	}
	
	public boolean deleteCommentsBySnippet(Snippet snip, String password) throws Exception {	
		int numUpdated = -1;
		
		if(snip.isPassword(password)) {
			PreparedStatement ps = conn.prepareStatement("DELETE FROM " + table + " WHERE snippetID=?;");
			ps.setString(1, snip.getID());
			
			numUpdated = ps.executeUpdate();
			ps.close();
		}else {
			return false;
		}
		
		return (numUpdated >= 1);
	}
	
	public boolean addComment(Comment com) throws Exception {
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id=?;");
		ps.setString(1, com.getID());
		
		ResultSet result = ps.executeQuery();
		
		if (result.next()) {
			throw new Exception("DB Error: Adding Comment w/ id=" + com.getID() + " when Comment already exists");
		}
		
		ps = conn.prepareStatement("INSERT INTO " + table + " (id,timestamp,snippetID,regionStart,regionEnd,text) values(?,?,?,?,?,?);");
		ps.setString(1, com.getID());
		ps.setLong(2, com.getTimestamp());
		ps.setString(3, com.getSnippetID());
		ps.setInt(4, com.getRegionStart());
		ps.setInt(5,  com.getRegionEnd());
		ps.setString(6, com.getText());
		
		ps.execute();
		
		result.close();
		ps.close();
		
		return true;
	}
}
