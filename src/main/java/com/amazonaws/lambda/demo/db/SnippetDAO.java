package com.amazonaws.lambda.demo.db;

import java.sql.Blob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.amazonaws.lambda.demo.model.Snippet;

public class SnippetDAO {
	java.sql.Connection conn;
	final static String table = "snippets";
	
	public SnippetDAO() throws Exception {
		conn = DBConnection.connect();
	}
	
	public Snippet SQLToSnippet(ResultSet result) throws Exception {
		String id = result.getString("id");
		long timestamp = result.getLong("timestamp");
		String password = result.getString("password");
		String info = result.getString("info");
		int lang = result.getInt("lang");
		Blob textBlob = result.getBlob("text");
		String text = new String(textBlob.getBytes(1L, (int) textBlob.length()));
		
		return new Snippet(id, timestamp, password, info, text, lang);
	}
	
	public Blob snipTextToBlob(Snippet snip) throws Exception {
		Blob retBlob = conn.createBlob();
		retBlob.setBytes(1L, snip.getText().getBytes());
		
		return retBlob;
	}
	
	public Snippet getSnippet(String id) throws Exception {
		Snippet retSnip = null;
		
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id=?;");
		ps.setString(1, id);
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retSnip = SQLToSnippet(result);
		}
		
		result.close();
		ps.close();
		
		return retSnip;
	}
	
	public boolean updateSnippetInfo(Snippet snip) throws Exception {
		PreparedStatement ps = conn.prepareStatement("UPDATE " + table + " SET info=? WHERE id=?;");
		ps.setString(1, snip.getInfo());
		ps.setString(2, snip.getID());
		
		int numUpdated = ps.executeUpdate();
		ps.close();
		
		return (numUpdated == 1);
	}
	
	public boolean updateSnippetText(Snippet snip) throws Exception {
		PreparedStatement ps = conn.prepareStatement("UPDATE " + table + " SET info=? WHERE id=?;");
			
		ps.setBlob(1, snipTextToBlob(snip));
		ps.setString(2, snip.getID());
		
		int numUpdated = ps.executeUpdate();
		ps.close();
		
		return (numUpdated == 1);
	}
	
	public boolean addSnippet(Snippet snip) throws Exception {
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id=?;");
		ps.setString(1, snip.getID());
		
		ResultSet result = ps.executeQuery();
		
		if (result.next()) {
			throw new Exception("DB Error: Adding Snippet w/ id=" + snip.getID() + " when Snippet already exists");
		}
		
		ps = conn.prepareStatement("INSERT INTO " + table + " (id,timestamp,password,info,lang,text) values(?,?,?,?,?,?);");
		ps.setString(1, snip.getID());
		ps.setLong(2, snip.getTimestamp());
		ps.setString(3,  snip.getPassword());
		ps.setString(4, snip.getInfo());
		ps.setInt(5, snip.getLangAsInt());
		ps.setBlob(6, snipTextToBlob(snip));
		
		ps.execute();
		
		// not in og code -> if error might be with these closes
		result.close();
		ps.close();
		
		return true;
	}
	
	public ArrayList<Snippet> getAllSnippets() throws Exception {
		ArrayList<Snippet> retList = new ArrayList<Snippet>();

		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + ";");
		
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retList.add(SQLToSnippet(result));
		}
		
		result.close();
		ps.close();
		
		return retList;
	}
}
